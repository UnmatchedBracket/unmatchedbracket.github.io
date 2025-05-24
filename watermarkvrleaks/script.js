const canvas = document.getElementById("canv");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

document.addEventListener('paste', paste_auto, false);

console.log("yooooo")

let currentImage = null

function im(src) {
  let im = new Image()
  im.crossOrigin = "anonymous"
  im.src = src
  return im
}

let watermarks = {
  "bracket-light": im("https://cdn.glitch.global/2c8b9abf-799e-4a59-8c4c-7cbba3081d37/VRSneakPeeksWatermarkWhite.png?v=1741819177537"),
  "bracket-dark": im("https://cdn.glitch.global/2c8b9abf-799e-4a59-8c4c-7cbba3081d37/VRSneakPeeksWatermarkBlack.png?v=1741840066895"),
  "chill-filled": im("https://cdn.glitch.global/2c8b9abf-799e-4a59-8c4c-7cbba3081d37/IMG_2783-removebg-preview.png?v=1741850653292"),
  "unkn-repeat": im("https://cdn.glitch.global/2c8b9abf-799e-4a59-8c4c-7cbba3081d37/VRSneekPeek.png?v=1741851050403")
}
/*let waterimg = new Image()
waterimg.onload = ()=>{
  console.log("Watermark loaded")
  watermark = waterimg;
}// handleImage(watermark) }
waterimg.src = ""*/

function scaleBase() {
  return (
    Math.sqrt(currentImage.width*currentImage.height)
    /
    Math.sqrt(watermarks[settings.mark].width*watermarks[settings.mark].height)
  )
}

function handleImage(im) {
  currentImage = im
  canvas.width = im.width
  canvas.height = im.height
  /*ctx.save()
  ctx.rotate(Math.PI/4)
  ctx.drawImage(im, 0, 0)
  ctx.restore()*/
  settings.x = im.width / 2
  settings.y = im.height / 2
}

function drawImAt(im, x, y, scale=1, angle=0, alpha=1) {
  ctx.save()
  //ctx.translate()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.drawImage(im, -im.width/2, -im.height/2)
  ctx.restore()
}

setInterval(() => {
  let t = +new Date/1000
  //console.log(t)
  let x = settings.x//(Math.cos(t)+1)*currentImage.width*.8
  let y = settings.y//(Math.sin(t)+1)*currentImage.height*.8
  let s = settings.s*scaleBase()//(Math.sin(t*2.54)+1.5)/2.5
  let a = settings.a//(Math.cos(t*3.54))
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(currentImage, 0, 0)
  drawImAt(watermarks[settings.mark], x, y, s, a, settings.alpha)
}, 50)

// controls
let settings = {
  x: 0,
  y: 0,
  s: 1,
  a: 0,
  alpha: 0.5,
  mark: "bracket-light"
}

let scaleSlider = document.getElementById("scale")
let scaleNum = document.getElementById("scalenum")
scaleSlider.addEventListener("input", () => {
  let scale = Math.pow(3, scaleSlider.value)
  scaleNum.innerText = `x${scale.toFixed(3)}`
  settings.s = scale
})

let angleSlider = document.getElementById("angle")
let angleNum = document.getElementById("anglenum")
angleSlider.addEventListener("input", () => {
  let angle = angleSlider.value * Math.PI / 180
  angleNum.innerText = Number(angleSlider.value).toFixed(1)
  settings.a = angle
})

let alphaSlider = document.getElementById("alpha")
let alphaNum = document.getElementById("alphanum")
alphaSlider.addEventListener("input", () => {
  let alpha = alphaSlider.value
  alphaNum.innerText = Math.round(alpha*100)
  settings.alpha = alpha
})

let markDropdown = document.getElementById("mark")
markDropdown.addEventListener("input", (e) => {
  settings.mark = markDropdown.value
})

function getCanvasClickPos(event) {
  const rect = canvas.getBoundingClientRect(); // Get canvas position and size
  const scaleX = canvas.width / rect.width;   // Horizontal scaling factor
  const scaleY = canvas.height / rect.height; // Vertical scaling factor

  // Adjust for scaling and translation
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  return { x, y };
}

canvas.addEventListener("mousedown", (e) => {
    let pos = getCanvasClickPos(e)
    settings.x = pos.x
    settings.y = pos.y
})

let exportButton = document.getElementById("export")
exportButton.addEventListener("click", () => {
  let link = document.createElement("a")
  link.href = canvas.toDataURL('image/png')
  link.download = "watermarked.png"
  link.click()
})

//on pngleste
function paste_auto(e) {
    if (e.clipboardData) {
        var items = e.clipboardData.items;
        if (!items) return;

        var is_image = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();
                var URLObj = window.URL || window.webkitURL;
                var source = URLObj.createObjectURL(blob);
                var pastedImage = new Image();
                pastedImage.onload = function() {
                    handleImage(pastedImage)
                };
                pastedImage.crossOrigin = "anonymous"
                pastedImage.src = source;
                e.preventDefault();
                status("\xa0")
                return
            }
        }
        // nothing worked, no image avaliable
        status("That's not an image.")
    }
};

document.getElementById("fpicker").addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // The Image object is now loaded and ready to use
        handleImage(img)
      };
      img.crossOrigin = "anonymous"
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});