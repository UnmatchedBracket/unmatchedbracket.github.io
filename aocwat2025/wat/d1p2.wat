(module
    (import "console" "log" (func $log (param i32)))
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
    (func $readnum (result i32)
        (local $num i32)
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
                local.get $num
                i32.const 10
                i32.mul
                i32.add
                local.set $num
                br $readloop
            )
        )
        local.get $num
    )

    (func (export "run") (result i32)
        (local $wheelpos i32)
        (local $tickcount i32)
        (local $tickdir i32)
        (local $count i32)
        (local $temp i32)
        i32.const -1
        global.set $p
        i32.const 50
        local.set $wheelpos
        (block $main
            (loop $maini
                ;; get char; break if nul
                call $read
                local.tee $temp
                i32.eqz
                br_if $main
                ;; assume it's L or R; funny math to make it -1/1
                local.get $temp
                i32.const 79
                i32.sub
                i32.const 3
                i32.div_s
                local.set $tickdir
                ;; read click count and turn
                call $readnum
                local.set $tickcount
                (loop $tickloop
                    (block $tickblock
                        local.get $tickcount
                        i32.eqz
                        br_if $tickblock
                        local.get $tickdir
                        local.get $wheelpos
                        i32.add
                        i32.const 100 ;; posmod hack
                        i32.add
                        i32.const 100
                        i32.rem_u
                        local.set $wheelpos
                        local.get $tickcount
                        i32.const 1
                        i32.sub
                        local.set $tickcount
                        ;; up count
                        (block $up
                            local.get $wheelpos
                            i32.const 0
                            i32.ne
                            br_if $up
                            local.get $count
                            i32.const 1
                            i32.add
                            local.set $count
                        )
                        br $tickloop
                    )
                )
                ;; debug log
                local.get $wheelpos
                call $log
                br $maini
            )
        )
        local.get $count
    )
)