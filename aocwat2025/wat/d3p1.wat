(module
    (import "console" "log" (func $log (param i32)))
    (memory (export "inputmem") 1)
    (global $p (mut i32) (i32.const 0))
    (global $sum (mut i32) (i32.const 0))
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

    (func (export "run") (result i32)
        (local $temp i32)
        (local $workp i32) ;; pointer for temporary data
        (local $bankend i32)
        (local $i i32)
        (local $j i32)
        (local $10 i32)
        (local $max i32)
        i32.const -1
        global.set $p
        i32.const 0
        global.set $sum

        (loop $mainloop
            i32.const 60000
            local.set $workp
            (loop $readloop
                (block $readblock
                    call $readdigit
                    local.tee $temp
                    i32.const -1
                    i32.eq
                    br_if $readblock
                    local.get $workp
                    local.get $temp
                    i32.store8
                    local.get $workp
                    i32.const 1
                    i32.add
                    local.set $workp
                    ;; local.get $temp
                    ;; call $log
                    br $readloop
                )
            )
            local.get $workp
            i32.const 1
            i32.sub
            local.set $bankend
            ;; try every combo
            i32.const 0
            local.set $max
            i32.const 60000
            local.set $i
            (loop $outerloop
                local.get $i
                i32.load8_u
                i32.const 10
                i32.mul
                local.set $10
                local.get $i
                i32.const 1
                i32.add
                local.set $j
                (loop $innerloop
                    local.get $10
                    local.get $j
                    i32.load8_u
                    i32.add
                    local.tee $temp
                    (block $if (param i32)
                        local.get $max
                        i32.le_u
                        br_if $if
                        local.get $temp
                        local.set $max
                    )
                    local.get $j
                    i32.const 1
                    i32.add
                    local.tee $j
                    local.get $bankend
                    i32.le_u
                    br_if $innerloop
                )
                local.get $i
                i32.const 1
                i32.add
                local.tee $i
                local.get $bankend
                i32.lt_u
                br_if $outerloop
            )
            global.get $sum
            local.get $max
            i32.add
            global.set $sum
            ;; big loop - very satisfying implementation
            call $peek
            br_if $mainloop
        )
        global.get $sum
    )
)
