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

    (func $clear (param $p i32)
        (local $i i32)
        (loop $clearit
            local.get $p
            local.get $i
            i32.add
            i64.const 0
            i64.store
            local.get $i
            i32.const 8
            i32.add
            local.tee $i
            i32.const 256
            i32.lt_u
            br_if $clearit
        )
    )

    (func $writelaser (param $p i32) (param $i i32)
        local.get $p
        local.get $i
        i32.add
        i32.const 1
        i32.store8
    )

    (func (export "run") (result i32)
        (local $temp i32)
        (local $sourcep i32)
        (local $targetp i32)
        (local $i i32)
        (local $currentstate i32)
        (local $splitcount i32)
        i32.const 30000
        local.tee $sourcep
        call $clear
        i32.const 40000
        local.tee $targetp
        call $clear

        i32.const -1
        global.set $p
        i32.const -1
        local.set $i
        (loop $mainloop
            local.get $i
            i32.const 1
            i32.add
            local.set $i
            call $read
            local.tee $temp
            (block $nl (param i32)
                i32.const 10
                i32.ne
                br_if $nl
                local.get $sourcep
                local.get $targetp
                local.set $sourcep
                local.tee $targetp
                call $clear
                i32.const -1
                local.set $i
                br $mainloop
            )
            (block $null
                local.get $temp
                i32.const 0
                i32.ne
                br_if $null
                local.get $splitcount
                return
            )
            (block $S
                local.get $temp
                i32.const 0x53 ;; 'S'
                i32.ne
                br_if $S
                ;; start ray
                local.get $targetp
                local.get $i
                call $writelaser
                br $mainloop
            )
            local.get $sourcep
            local.get $i
            i32.add
            i32.load8_u
            ;; local.tee $currentstate
            i32.eqz
            br_if $mainloop
            (block $splitter
                local.get $temp
                i32.const 0x5e
                i32.ne
                br_if $splitter
                ;; split ray
                local.get $targetp
                local.get $i
                i32.const 1
                i32.sub
                call $writelaser
                local.get $targetp
                local.get $i
                i32.const 1
                i32.add
                call $writelaser
                local.get $splitcount
                i32.const 1
                i32.add
                local.set $splitcount
                br $mainloop
            )
            ;; continue ray
            local.get $targetp
            local.get $i
            call $writelaser
            br $mainloop
        )
        i32.const -5 ;; this should never happen
    )
)
