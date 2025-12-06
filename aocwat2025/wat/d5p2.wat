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
        ;; add -1 at the end
        local.get $workp
        i64.const -1
        i64.store
    )

    (func $min (param $a i64) (param $b i64) (result i64)
        (block $aisbig
            local.get $a
            local.get $b
            i64.gt_u
            br_if $aisbig
            local.get $a
            return
        )
        local.get $b
    )

    (func $max (param $a i64) (param $b i64) (result i64)
        (block $aisbig
            local.get $a
            local.get $b
            i64.lt_u
            br_if $aisbig
            local.get $a
            return
        )
        local.get $b
    )

    (func (export "run") (result i64)
        (local $outer_start i64)
        (local $outer_end i64)
        (local $inner_start i64)
        (local $inner_end i64)
        (local $workp_outer i32)
        (local $workp_inner i32)
        (local $count i64)
        call $readdata
        i32.const 30000
        local.set $workp_outer
        (loop $combineloop
            local.get $workp_outer
            i64.load
            local.set $outer_start
            local.get $workp_outer
            i32.const 8
            i32.add
            i64.load
            local.set $outer_end
            i32.const 30000
            local.set $workp_inner
            (loop $innerloop
                (block $skip
                    local.get $workp_outer
                    local.get $workp_inner
                    i32.eq
                    br_if $skip
                    local.get $workp_inner
                    i64.load
                    local.tee $inner_start
                    i64.const 0
                    i64.eq
                    br_if $skip
                    local.get $workp_inner
                    i32.const 8
                    i32.add
                    i64.load
                    local.set $inner_end
                    ;; checks
                    local.get $outer_start
                    local.get $inner_start
                    i64.ge_u
                    local.get $outer_start
                    local.get $inner_end
                    i64.le_u
                    i32.and
                    local.get $outer_end
                    local.get $inner_start
                    i64.ge_u
                    local.get $outer_end
                    local.get $inner_end
                    i64.le_u
                    i32.and
                    i32.or
                    i32.eqz
                    br_if $skip
                    ;; something's in something
                    local.get $workp_outer
                    local.get $inner_start
                    local.get $outer_start
                    call $min
                    i64.store
                    local.get $workp_outer
                    i32.const 8
                    i32.add
                    local.get $inner_end
                    local.get $outer_end
                    call $max
                    i64.store
                    ;; erase the other one
                    local.get $workp_inner
                    i64.const 0
                    i64.store
                    local.get $workp_inner
                    i32.const 8
                    i32.add
                    i64.const 0
                    i64.store
                    ;; log
                    local.get $workp_outer
                    call $log32
                    local.get $workp_inner
                    call $log32
                    i32.const -1
                    call $log32
                    ;; instantly jump
                    br $combineloop
                )
                local.get $workp_inner
                i32.const 16
                i32.add
                local.tee $workp_inner
                i64.load
                i64.const -1
                i64.ne
                br_if $innerloop
            )
            local.get $workp_outer
            i32.const 16
            i32.add
            local.tee $workp_outer
            i64.load
            i64.const -1
            i64.ne
            br_if $combineloop
        )
        i32.const 30000
        local.set $workp_outer
        (loop $finalloop
            local.get $workp_outer
            i64.load
            local.set $outer_start
            local.get $workp_outer
            i32.const 8
            i32.add
            i64.load
            local.set $outer_end
            (block $notzero
                local.get $outer_start
                i64.eqz
                br_if $notzero
                local.get $outer_end
                local.get $outer_start
                i64.sub
                i64.const 1
                i64.add
                local.get $count
                i64.add
                local.set $count
            )
            local.get $workp_outer
            i32.const 16
            i32.add
            local.tee $workp_outer
            i64.load
            i64.const -1
            i64.ne
            br_if $finalloop
        )
        local.get $count
    )
)