(module
    (import "console" "log" (func $log (param i64)))
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

    (func $get_magnitude (param $n i64) (result i64)
        (local $mag i64)
        ;; basically just divide by 10 a bunch
        ;; and count the number of times it takes to reduce it to 0
        (loop $magloop
            local.get $mag
            i64.const 1
            i64.add
            local.set $mag
            local.get $n
            i64.const 10
            i64.div_u
            local.tee $n
            i64.const 0
            i64.ne
            br_if $magloop
        )
        local.get $mag
    )

    (func $get10ofmag (param $n i64) (result i64)
        ;; basically 10^(n-1)
        (local $result i64)
        i64.const 1
        local.set $result
        (loop $10loop
            (block $10block
                local.get $n
                i64.const 1
                i64.sub
                local.tee $n
                i64.eqz
                br_if $10block
                local.get $result
                i64.const 10
                i64.mul
                local.set $result
                br $10loop
            )
        )
        local.get $result
    )

    (func $detect_repeats (param $n i64) (param $mag i64) (result i32)
        ;; used to avoid matching [222 222] AND [22 22 22] AND [2 2 2 2 2 2]
        ;; returns true if it's repeating
        (local $i i64)
        (local $j i64)
        (local $truncn i64)
        (local $temp i64)
        (local $100 i64)
        i64.const 2
        local.set $i
        (loop $loop
            (block $if
                local.get $mag
                local.get $i
                i64.rem_u
                i64.const 0
                i64.ne
                br_if $if
                ;; chop off extra digits
                local.get $n
                local.get $mag
                local.get $i
                i64.div_u
                i64.const 1
                i64.add
                call $get10ofmag
                local.tee $100
                i64.rem_u
                local.set $truncn
                ;; repeat number
                i64.const 0
                local.tee $j
                local.set $temp
                (loop $makenumber
                    local.get $temp
                    local.get $100
                    i64.mul
                    local.get $truncn
                    i64.add
                    local.set $temp

                    local.get $j
                    i64.const 1
                    i64.add
                    local.tee $j
                    local.get $i
                    i64.lt_u
                    br_if $makenumber
                )
                ;; if i just repeated part of the number and got the same number,
                ;; it's a repeating number
                (block $q
                    local.get $temp
                    local.get $n
                    i64.ne
                    br_if $q
                    i32.const 1
                    return
                )
            )
            local.get $i
            i64.const 1
            i64.add
            local.tee $i
            local.get $mag
            i64.le_u
            br_if $loop
        )
        i32.const 0
    )

    (func $check_repeats (param $low i64) (param $high i64) (param $mag i64) (param $repeats i64)
        ;; vars named for magnitude 2
        (local $10 i64) ;; the power of 10 that fits in the magnitude
        (local $100 i64) ;; 10x more
        (local $i i64)
        (local $j i64)
        (local $temp i64)
        ;; log time
        ;; local.get $low call $log
        ;; local.get $high call $log
        ;; local.get $mag call $log
        ;; local.get $repeats call $log
        ;; i64.const -2 call $log
        ;; set up vars
        local.get $mag
        call $get10ofmag
        local.tee $10
        i64.const 10
        i64.mul
        local.set $100
        ;; loop tiiiime - from 10 to 99 or equivalents
        local.get $10
        local.set $i
        (loop $checkloop
            (block $if
                ;; make the repeat number - TODO $repeats
                i64.const 0
                local.tee $j
                local.set $temp
                (loop $makenumber
                    local.get $temp
                    local.get $100
                    i64.mul
                    local.get $i
                    i64.add
                    local.set $temp

                    local.get $j
                    i64.const 1
                    i64.add
                    local.tee $j
                    local.get $repeats
                    i64.lt_u
                    br_if $makenumber
                )
                ;; check it
                local.get $temp
                local.get $low
                i64.ge_u
                local.get $temp
                local.get $high
                i64.le_u
                i32.mul ;; using as an "and"; 1×1=1, all other combos=0
                i32.eqz ;; not; now only 1×1 is 0 and won't trip the branch
                br_if $if
                ;; repeating check
                local.get $i
                local.get $mag
                call $detect_repeats
                br_if $if
                ;; yeeee sum
                global.get $sum
                local.get $temp
                i64.add
                global.set $sum
                local.get $temp
                call $log
            )
            ;; up $i and break if it's past the 99 equivalent
            local.get $i
            i64.const 1
            i64.add
            local.tee $i
            local.get $100
            i64.lt_u
            br_if $checkloop
        )
    )

    (func $factorize (param $low i64) (param $high i64) (param $mag i64)
        ;; for part 2 - finds all valid divisors and calls on them
        (local $i i64)
        i64.const 2
        local.set $i
        (loop $loop
            (block $if
                local.get $mag
                local.get $i
                i64.rem_u
                i64.const 0
                i64.ne
                br_if $if
                local.get $low
                local.get $high
                local.get $mag
                local.get $i
                i64.div_u
                local.get $i
                call $check_repeats
            )
            local.get $i
            i64.const 1
            i64.add
            local.tee $i
            local.get $mag
            i64.le_u
            br_if $loop
        )
    )

    (func $process_range (param $low i64) (param $high i64)
        (local $lowmag i64)
        (local $highmag i64)
        (local $i i64)
        ;; set up vars
        ;; tbh i probably don't need $lowmag but idc
        local.get $low
        call $get_magnitude
        local.tee $lowmag
        local.set $i
        local.get $high
        call $get_magnitude
        local.set $highmag
        ;; simple loop through all magnitudes in the range
        (loop $loop
            (block $if
                ;; don't even try if it's ≤1
                local.get $i
                i64.const 1
                i64.le_u
                br_if $if
                local.get $low
                local.get $high
                local.get $i
                call $factorize
            )
            local.get $i
            i64.const 1
            i64.add
            local.tee $i
            local.get $highmag
            i64.le_u
            br_if $loop
        )
        i64.const -1
        call $log
    )

    (func (export "run") (result i64)
        (local $temp1 i64)
        (local $temp2 i64)
        i32.const -1
        global.set $p
        i64.const 0
        global.set $sum
        (loop $mainloop
            (block $mainblock
                ;; stop if null or newline
                call $peek
                i32.const 0x30
                i32.lt_u
                br_if $mainblock
                ;; read numbers
                call $readnum
                call $readnum
                call $process_range
                br $mainloop
            )    
        )
        global.get $sum
    )
)