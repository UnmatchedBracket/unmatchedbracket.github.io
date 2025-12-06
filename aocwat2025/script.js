let wabt = window.wabt = await WabtModule()

let imports = {
    console: {
        log: console.log
    }
  }

async function wat2instance(wat) {
    let bin = wabt.parseWat("wat.wat", wat).toBinary({}).buffer

    return (await WebAssembly.instantiate(bin, imports)).instance;
}

window.onload = () => {
    [...document.getElementsByTagName("wasm")].forEach(async e => {
        let day = e.getAttribute("day")
        let part = e.getAttribute("part")
        // let wasm = await wat2instance(await (await fetch(`wat/d${day}p${part}.wat`)).arrayBuffer())
        // let input = await (await fetch(`input/d${day}.txt`)).arrayBuffer()
        let wasm, input

        let waturl = `wat/d${day}p${part}.wat`
        
        let el, outerel, output
        e.appendChild(outerel = document.createElement("h3"))
        outerel.innerHTML = `Day <glow>${day}</glow>, Part <glow>${part}</glow> (`
        outerel.appendChild(el = document.createElement("button"))
        let currentlyRunning = false
        el.onclick = () => {
            if (currentlyRunning) return
            (async () => {
                output.classList.remove("em")
                if (!wasm) {
                    output.innerHTML = `<i>loading wat...</i>`
                    wasm = await wat2instance(await (await fetch(waturl)).text())
                }
                if (!input && wasm.exports.inputmem) {
                    output.innerHTML = `<i>loading input file...</i>`
                    input = await (await fetch(`input/d${day}.txt`)).arrayBuffer()
                    new Uint8Array(wasm.exports.inputmem.buffer).set(new Uint8Array(input))
                }
                output.innerHTML = `<i>running...</i>`
                await new Promise(r => setTimeout(r, 1)); // this allows the browser to show 'running...' at all
                output.innerText = wasm.exports.run()
                output.classList.add("em")
            })().finally(() => currentlyRunning = false)
        }
        el.innerText = "Run"
        outerel.appendChild(el = document.createElement("span"))
        el.innerText = ", "
        outerel.appendChild(el = document.createElement("a"))
        el.innerText = "Source"
        el.href = "viewer?f=" + waturl
        outerel.appendChild(el = document.createElement("span"))
        el.innerText = ")"
        e.appendChild(output = document.createElement("pre"))
        output.innerHTML = `<i>output goes here</i>`
    })
}