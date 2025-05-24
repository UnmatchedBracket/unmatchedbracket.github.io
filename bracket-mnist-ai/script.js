let drawCanv = document.getElementById("draw")
let drawCtx = drawCanv.getContext("2d")
let dispCanv = document.getElementById("disp")
let dispCtx = dispCanv.getContext("2d")
circle(drawCtx, 0, 0, 1000, "black")

let cortex = window.mllib.cortexfromjson(window.cortexData)
window.c = cortex

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function draw(e) {
  console.log(e)
  let x = e.offsetX
  let y = e.offsetY
  if (e.which == 1) {
    circle(drawCtx, x, y, 8, "white")
  } else if (e.which == 3) {
    circle(drawCtx, x, y, 20, "black")
  }
  updateDisp()
}

drawCanv.onmousedown = draw

drawCanv.onmousemove = draw

drawCanv.oncontextmenu = (e) => e.preventDefault()

dispCtx.mozImageSmoothingEnabled = true; // For Firefox
dispCtx.webkitImageSmoothingEnabled = true; // For Safari/Chrome
dispCtx.msImageSmoothingEnabled = true; // For IE
dispCtx.imageSmoothingEnabled = true; // Standard property
dispCtx.imageSmoothingQuality = "high";
//dispCtx.scale(0.1, 0.1)

let outEl = document.getElementById("num")

function updateDisp() {
  dispCtx.drawImage(drawCanv, 0, 0, 28, 28)
  let dat = dispCtx.getImageData(0, 0, 28, 28).data.filter((_, i) => i % 4 == 0)
  let datTranspose = dat.map((_, i) => dat[Math.floor(i/28) + (i%28)*28])
  cortex.inputs = datTranspose
  let out = cortex.process()
  let guess = out.indexOf(Math.max(...out))
  outEl.innerText = guess
}
updateDisp()