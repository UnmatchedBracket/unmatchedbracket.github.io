/** @type {HTMLDivElement}*/
let ext

function update() {
    let neededWidth = document.body.parentElement.scrollLeft || document.body.scrollLeft
    neededWidth += document.body.clientWidth*2;
    neededWidth *= 1.2;
    if (document.body.scrollWidth < neededWidth) {
        ext.style.width = `${neededWidth}px`
    }
}

function resetscroll() {
    document.body.parentElement.scrollTo(0, 0)
}

window.onload = () => {
    ext = document.getElementById("ext")
    window.onscroll = update
    window.onresize = update
    let as = document.getElementById("antiautoscroll")
    as.scrollIntoView()
    as.autofocus = true
    resetscroll()
    document.body.style.overflow = "auto"
    document.body.style.padding = "0"
}
resetscroll()

// window.onbeforeunload = resetscroll