(module
    (import "console" "log" (func $log32 (param i32)))
    (import "console" "log" (func $log64 (param i64)))
    (memory (export "inputmem") 1)
    (global $p (mut i32) (i32.const 0))
    (global $sum (mut i64) (i64.const 0))
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

    (func (export "run") (result i64)
        (local $temp i32)
        (local $workp i32) ;; pointer for temporary data
        (local $bankend i32)
        (local $workbankend i32) ;; this slides wheeee
        (local $i i32)
        (local $j i32)
        (local $max_n i32)
        (local $max_p i32)
        (local $final_num i64)
        i32.const -1
        global.set $p
        i64.const 0
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
            ;; process
            local.get $workp
            i32.const 1
            i32.sub
            local.tee $bankend
            i32.const 11
            i32.sub
            local.set $workbankend ;; right search bound
            i64.const 0
            local.set $final_num
            i32.const 60000
            local.set $workp ;; workp is now the left bound for the search
            (loop $processloop
                ;; general process:
                ;; - search the range for the highest
                ;;  (also earliest, but less important) digit
                ;; - add that digit to the final number
                ;; - set the range to from just after where you found the digit
                ;;  to one after where the end was before
                i32.const 0
                local.tee $max_n
                local.set $max_p
                local.get $workp
                local.set $i
                (loop $searchloop
                    local.get $i
                    i32.load8_u
                    local.tee $temp
                    (block $if (param i32)
                        local.get $max_n
                        i32.le_u
                        br_if $if
                        local.get $temp
                        local.set $max_n
                        local.get $i
                        local.set $max_p
                    )
                    local.get $i
                    i32.const 1
                    i32.add
                    local.tee $i
                    local.get $workbankend
                    i32.le_u
                    br_if $searchloop
                )
                local.get $final_num
                i64.const 10
                i64.mul
                local.get $max_n
                i64.extend_i32_u
                i64.add
                local.set $final_num
                ;; loop
                local.get $max_p
                i32.const 1
                i32.add
                local.set $workp
                local.get $workbankend
                i32.const 1
                i32.add
                local.tee $workbankend
                local.get $bankend
                i32.le_u
                br_if $processloop
            )
            ;;
            global.get $sum
            local.get $final_num
            i64.add
            global.set $sum
            local.get $final_num
            call $log64
            ;; big loop - very satisfying implementation
            call $peek
            br_if $mainloop
        )
        global.get $sum
    )
)
