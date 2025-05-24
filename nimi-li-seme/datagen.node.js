(async function () {
    let r = await fetch("https://api.linku.la/v1/words")
    let j = await r.json()
    let out = {}
    let outmini = {}
    Object.keys(j).forEach(k => {
        if (k == "unpa") return
        let dat = j[k]
        out[k] = {
            short: dat.translations.en.definition,
            cat: dat.usage_category
        }
        outmini[k] = out[k].short
        if (out[k].short.indexOf(k) != -1) {
            console.log(`warn: ${k} may need a shortafter: ${out[k].short}`)
        }
        if (dat.depricated) {
            console.log(`warn: ${k} depricated`)
        }
    })

    require("fs").writeFileSync("data.js", `// this file is generated\n\nwindow.tokidata = ${JSON.stringify(out)}`)
    require("fs").writeFileSync("datamini.js", `// this file is generated\n\nwindow.tokidata = ${JSON.stringify(outmini)}`)
})()