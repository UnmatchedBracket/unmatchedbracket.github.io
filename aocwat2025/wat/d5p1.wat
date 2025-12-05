(module
    (import "console" "log" (func $log32 (param i32)))
    (import "console" "log" (func $log64 (param i64)))
    (memory (export "inputmem") 1)
    (global $p (mut i32) (i32.const 0))
    (func $read (result i32)
        global.get $p
        i32.const 1
        i32.add
        global.set $p
        global.get $p
        i32.load8_u
    )
    (func $peek (result i32)
        global.get $p
        i32.const 1
        i32.add
        i32.load8_u
    )
    (func $readnum (result i64)
        (local $num i64)
        (local $temp i32)
        (loop $readloop
            (block $q
                call $read
                local.tee $temp
                i32.const 0x30
                i32.lt_u
                br_if $q
                local.get $temp
                i32.const 0x30
                i32.sub
                i64.extend_i32_u
                local.get $num
                i64.const 10
                i64.mul
                i64.add
                local.set $num
                br $readloop
            )
        )
        local.get $num
    )

    (func $readdata
        (local $workp i32)
        (local $temp i64)
        i32.const -1
        global.set $p
        i32.const 30000
        local.set $workp
        (loop $readloop
            local.get $workp
            call $readnum
            local.tee $temp
            i64.store
            local.get $temp
            call $log64
            local.get $workp
            i32.const 8
            i32.add
            local.set $workp
            ;; stop on \n
            call $peek
            i32.const 0x10
            i32.gt_u
            br_if $readloop
        )
        ;; get rid of the extra newline
        call $read 
        drop
    )

    (func (export "run") (result i32)
        (local $temp i64)
        (local $temp2 i64)
        (local $workp i32)
        (local $count i32)
        i32.const 0
        local.set $count
        call $readdata
        (loop $processloop
            call $readnum
            local.set $temp
            i32.const 30000
            local.set $workp
            (loop $checkloop
                (block $checkbreak
                    local.get $workp
                    i64.load
                    ;; is it zero? then we've hit the end of the range list
                    local.tee $temp2
                    i64.eqz
                    br_if $checkbreak
                    (block $check
                        ;; lower bound
                        local.get $temp
                        local.get $temp2
                        i64.lt_u
                        br_if $check
                        ;; upper bound
                        local.get $temp
                        local.get $workp
                        i32.const 8
                        i32.add
                        i64.load
                        i64.gt_u
                        br_if $check
                        ;; success!
                        local.get $count
                        i32.const 1
                        i32.add
                        local.set $count
                        br $checkbreak
                    )
                    local.get $workp
                    i32.const 16
                    i32.add
                    local.set $workp
                    br $checkloop
                )
            )
            call $peek
            i32.const 0x10
            i32.gt_u
            br_if $processloop
        )
        local.get $count
    )
)