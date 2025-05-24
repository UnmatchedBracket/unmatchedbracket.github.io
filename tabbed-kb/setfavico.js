key = document.getElementById("key").innerText.at(0)

canv = document.createElement("canvas")
canv.width = 32
canv.height = 32

ctx = canv.getContext("2d")
ctx.font = 'normal bold 30px Poppins';
ctx.textAlign = 'center';

ctx.fillText(key, 16, 22);

let link = document.createElement('link');
link.rel = 'icon';
document.head.appendChild(link);
link.href = canv.toDataURL();