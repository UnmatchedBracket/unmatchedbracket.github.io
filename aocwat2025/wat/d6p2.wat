(module
    (import "console" "log" (func $log32 (param i32)))
    (import "console" "log" (func $log64 (param i64)))
    (memory (export "inputmem") 4)
    (global $p (mut i32) (i32.const 0))
    (global $problemwidth (mut i32) (i32.const 0))
    (global $linecount (mut i32) (i32.const 0))
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
        ;; too far!
        global.get $p
        i32.const 1
        i32.sub
        global.set $p
        local.get $num
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
    (func $min (param $a i32) (param $b i32) (result i32)
        (block $aisbig
            local.get $a
            local.get $b
            i32.gt_u
            br_if $aisbig
            local.get $a
            return
        )
        local.get $b
    )
    (func $max (param $a i32) (param $b i32) (result i32)
        (block $aisbig
            local.get $a
            local.get $b
            i32.lt_u
            br_if $aisbig
            local.get $a
            return
        )
        local.get $b
    )

    (func $readdata
        (local $workp i32)
        (local $temp i64)
        (local $temp32 i32)
        (local $numcount i32)
        i32.const -1
        global.set $p
        i32.const 0
        global.set $problemwidth
        i32.const 30000
        local.set $workp
        (loop $readloop
            local.get $workp
            call $readdigit
            local.tee $temp32
            i32.store
            ;; local.get $temp32
            ;; call $log32
            local.get $workp
            i32.const 4
            i32.add
            local.set $workp
            local.get $numcount
            i32.const 1
            i32.add
            local.set $numcount
            call $peek
            local.tee $temp32
            (block $nl (param i32)
                i32.const 10
                i32.ne
                br_if $nl
                local.get $numcount
                global.get $problemwidth
                call $max
                global.set $problemwidth
                i32.const 0
                local.set $numcount
                global.get $linecount
                i32.const 1
                i32.add
                global.set $linecount
                br $readloop
            )
            local.get $temp32
            i32.const 0x30
            i32.ge_u
            local.get $temp32
            i32.const 0x20
            i32.eq
            i32.or
            ;; if it's not space, not \n, and less than 0x30, it's + or *
            br_if $readloop
        )
        ;; too far!
        ;; global.get $p
        ;; i32.const 1
        ;; i32.sub
        ;; global.set $p
    )

    (func (export "run") (result i64)
        (local $i i32)
        (local $j i32)
        (local $ismul i32)
        (local $temp i32)
        (local $currentnum i64)
        (local $onesum i64)
        (local $fullsum i64)
        call $readdata
        (loop $mathloop
            i32.const 0
            local.set $j
            i64.const 0
            local.set $currentnum
            (loop $innerloop
                ;; calculate pointer
                local.get $i
                local.get $j
                global.get $problemwidth
                i32.mul
                i32.add
                i32.const 4
                i32.mul
                i32.const 30000
                i32.add
                i32.load
                local.tee $temp
                ;; add to num
                (block $add (param i32)
                    i32.const -1
                    i32.eq
                    br_if $add
                    local.get $temp
                    i64.extend_i32_u
                    local.get $currentnum
                    i64.const 10
                    i64.mul
                    i64.add
                    local.set $currentnum
                )

                local.get $j
                i32.const 1
                i32.add
                local.tee $j
                global.get $linecount
                i32.lt_u
                br_if $innerloop
            )
            ;; local.get $currentnum
            ;; call $log64
            call $read
            local.tee $temp
            call $log32
            (block $process
                (block $nonzero
                    local.get $currentnum
                    i64.eqz
                    br_if $nonzero
                    (block $newsym
                        local.get $temp
                        i32.const 0x20 ;; ' '
                        i32.eq
                        br_if $newsym
                        local.get $temp
                        i32.const 0x2a ;; '*'
                        i32.eq
                        local.tee $ismul
                        local.get $currentnum
                        local.set $onesum
                        br $process
                    )
                    (block $math
                        local.get $currentnum
                        (block $add (param i64) (result i64)
                            local.get $ismul
                            br_if $add
                            local.get $onesum
                            i64.add
                            local.set $onesum
                            br $math
                        )
                        local.get $onesum
                        i64.mul
                        local.set $onesum
                    )
                    br $process
                )
                ;; zero; end of a number
                local.get $onesum
                local.get $fullsum
                i64.add
                local.set $fullsum
                i64.const 0
                local.set $onesum
                i32.const 0
                local.set $ismul
            )

            ;; local.get $i
            ;; call $log32
            ;; local.get $temp
            ;; call $log32
            local.get $onesum
            call $log64
            local.get $i
            i32.const 1
            i32.add
            local.tee $i
            global.get $problemwidth
            i32.lt_u
            br_if $mathloop
        )
        ;; anything leftover
        local.get $onesum
        local.get $fullsum
        i64.add
        ;; local.set $fullsum

        ;; local.get $fullsum
        ;; global.get $problemwidth
        ;; i64.extend_i32_u
    )
)