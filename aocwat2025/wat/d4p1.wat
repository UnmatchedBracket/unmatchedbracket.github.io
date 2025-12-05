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

    (func $readdigit (result i32)
        (local $chr i32)
        call $read
        local.tee $chr
        (block $nondigit (param i32)
            i32.const 0x30
            i32.ge_u
            br_if $nondigit
            i32.const -1
            return
        )
        local.get $chr
        i32.const 0x30
        i32.sub
    )

    (func $loaddata
        (local $workp i32)
        (local $linestart i32)
        (local $temp i32)
        i32.const -1
        global.set $p
        i32.const 20000
        local.tee $workp
        local.set $linestart
        (loop $readloop
            call $read
            local.tee $temp
            (block $at (param i32)
                i32.const 64 ;; '@'
                i32.ne
                br_if $at
                local.get $workp
                i32.const 1
                i32.store8
                local.get $workp
                i32.const 1
                i32.add
                local.set $workp
                br $readloop
            )
            (block $dot
                local.get $temp
                i32.const 46 ;; '.'
                i32.ne
                br_if $dot
                local.get $workp
                i32.const 0
                i32.store8
                local.get $workp
                i32.const 1
                i32.add
                local.set $workp
                br $readloop
            )
            (block $nl
                local.get $temp
                i32.const 10 ;; '\n'
                i32.ne
                br_if $nl
                local.get $linestart
                i32.const 0x100
                i32.add
                local.tee $linestart
                local.set $workp
                br $readloop
            )
            ;; assume null, end loop
        )
    )

    (func (export "run") (result i32)
        ;; map is 137x137, 0x89 hex
        (local $temp i32)
        (local $x i32)
        (local $y i32)
        (local $movablecount i32)
        i32.const -1
        global.set $p
        i32.const 0
        local.tee $movablecount
        local.set $x
        call $loaddata
        (loop $xloop
            i32.const 0
            local.set $y
            (loop $yloop
                i32.const 20000 ;; data pointer start
                local.get $x
                i32.add
                local.get $y
                i32.const 0x100
                i32.mul
                i32.add
                local.tee $temp

                (block $istherebarrel (param i32)
                    ;; first make sure there's a barrel at all
                    i32.load8_u
                    i32.eqz
                    br_if $istherebarrel
                    ;; count surrounding
                    ;; memory is set up such that running off is always 0
                    i32.const 0
                    local.get $temp
                    i32.const -257
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const -256
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const -255
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const 257
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const 256
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const 255
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const -1
                    i32.add
                    i32.load8_u
                    i32.add
                    local.get $temp
                    i32.const 1
                    i32.add
                    i32.load8_u
                    i32.add
                    ;; we now hopefully have a number counting how many are surrounding
                    (block $check (param i32)
                        i32.const 4
                        i32.ge_u
                        br_if $check
                        local.get $movablecount
                        i32.const 1
                        i32.add
                        local.set $movablecount
                    )
                )


                local.get $y
                i32.const 1
                i32.add
                local.tee $y
                i32.const 137
                i32.lt_u
                br_if $yloop
            )
            local.get $x
            i32.const 1
            i32.add
            local.tee $x
            i32.const 137
            i32.lt_u
            br_if $xloop
        )
        local.get $movablecount
    )
)
