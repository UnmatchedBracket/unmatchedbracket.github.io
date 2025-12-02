let fileid = new URLSearchParams(window.location.search).get("f")
if (!fileid) {
    document.body.innerHTML = "no file parameter"
}
try {
    let r = await fetch(fileid)
    if (r.ok) {
        let data = await r.text()
        let el
        document.body.innerHTML = ""
        document.body.appendChild(el = document.createElement("a"))
        el.innerText = "(back)"
        el.href = ".."
        document.body.appendChild(el = document.createElement("h1"))
        el.innerText = "Source file: " + fileid
        document.body.appendChild(el = document.createElement("pre"))
        el.innerText = data
    } else {
        document.body.innerText = "error for " + fileid + ": HTTP " + r.status
    }
} catch (e) {
    document.body.innerText = "error: " + e
}