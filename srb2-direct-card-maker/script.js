const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

let tintCache = {}

function tintImage(cacheName, img, red, green, blue) {
    var w = img.width;
    var h = img.height;

    if (w == 0 || h == 0) {
        console.log("ohno too smol")
        return img;
    }

    let cacheColorName = red + "-" + green + "-" + blue
    if (tintCache[cacheName]?.color == cacheColorName) {
        return tintCache[cacheName].canv
    }

    let tmpcanvas = document.createElement("canvas");
    tmpcanvas.width = w;
    tmpcanvas.height = h;

    let tmpctx = tmpcanvas.getContext("2d");
    tmpctx.drawImage(img, 0, 0);
    let pixels = tmpctx.getImageData(0, 0, w, h).data;

    let buff = document.createElement("canvas");
    buff.width = img.width;
    buff.height = img.height;

    let btx = buff.getContext("2d");
    btx.drawImage(img, 0, 0); // this saves having to copy alpha
    let bimdata = btx.getImageData(0, 0, w, h);
    let brawdat = bimdata.data;

    for (
        var i = 0, len = pixels.length;
        i < len;
        i += 4
    ) {
        brawdat[i] = red;
        brawdat[i + 1] = green;
        brawdat[i + 2] = blue;
        //brawdat[i+3] = 255;
    }

    btx.putImageData(bimdata, 0, 0);

    tintCache[cacheName] = {
        color: cacheColorName,
        canv: buff
    }

    return buff;
}

function getRGBOfPicker(name) {
    hex = document.getElementById(name).value
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

function getIm(name) {
    let img = new Image();
    img.src = name;
    return img
}

borderim = getIm("border.png")

let textEl = document.getElementById("name")
let outEl = document.getElementById("out")

let textFilterTemplate = "drop-shadow(0px 0px 3px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR) drop-shadow(0px 0px 0px COLOR)"

function draw() {
    requestAnimationFrame(draw);

    let scrollTime = Math.floor(Date.now() / 1000 * 72)

    ctx.fillStyle = document.getElementById("bg").value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        tintImage("border", borderim, ...getRGBOfPicker("border2")),
        0, scrollTime % 72 - 72
    );
    ctx.drawImage(
        tintImage("border", borderim, ...getRGBOfPicker("border1")),
        0, -(scrollTime % 72)
    );

    
}

draw();

function updateOut() {
    outEl.innerHTML =
`outer border: ${document.getElementById("border1").value}
inner border: ${document.getElementById("border2").value}
background:   ${document.getElementById("bg").value}
text:         ${document.getElementById("textinner").value}
text outline: ${document.getElementById("textouter").value}`
}

updateOut()

function updateName() {
    textEl.style.color = document.getElementById("textinner").value;
    let outerColor = document.getElementById("textouter").value
    textEl.style.filter = textFilterTemplate.replaceAll("COLOR", outerColor)
    textEl.innerText = document.getElementById("nameInp").value;
}

updateName()