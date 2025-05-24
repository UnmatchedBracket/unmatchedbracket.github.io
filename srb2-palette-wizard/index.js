const canvas = document.getElementById("pastecanv");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

//handlers
document.addEventListener('paste', paste_auto, false);

let paldata = null

function status(t) {
  document.getElementById("status").innerText = t
}

//on paste
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
                    if (pastedImage.width != 16 || pastedImage.height != 16) {
                        status("Image is wrong size! Use a 16x16 image.");
                        return;
                    }
                    ctx.drawImage(pastedImage, 0, 0);
                    let palette = [];
                    ctx.willReadFrequently = true
                    for (let y = 0; y < 16; y++) {
                      for (let x = 0; x < 16; x++) {
                          let pixel = ctx.getImageData(x, y, 1, 1);
                          palette.push([...pixel.data.slice(0, 3)]);
                      }
                    }
                    constructPalette(palette)
                    paldata.forEach((subpal, ind) => {
                      if (ind > 5) return
                      let tmp = []
                      for (let x = 0; x < 16; x++) {
                        for (let y = 0; y < 16; y++) {
                          tmp = tmp.concat([...subpal[x*16+y], 255])
                        }
                      }
                      ctx.putImageData(
                        new ImageData(new Uint8ClampedArray(tmp), 16, 16),
                        (ind%3)*16, Math.floor(ind/3)*16
                      )
                    })
                };
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

function constructPalette (pal) {
  paldata = new Array(14)
  
  paldata[0] = pal
  
  // TODO - 1 - white pal
  paldata[1] = paldata[0].map(rgb => [
    Math.floor(Math.min(rgb[0]*.25 + 192, 255)),
    Math.floor(Math.min(rgb[1]*.25 + 192, 255)),
    Math.floor(Math.min(rgb[2]*.25 + 192, 255)),
  ])
  // TODO - 2 - white-blue pal
  paldata[2] = paldata[1].map(rgb => [
    Math.max(rgb[0] - 14, 0),
    Math.min(rgb[1] + 9, 255),
    Math.min(rgb[2] + 19, 255),
  ])
  // TODO - 3 - white-green pal
  paldata[3] = paldata[1].map(rgb => [
    Math.max(rgb[0] - 13, 0),
    Math.min(Math.floor(rgb[1] * 1.04), 255),
    Math.max(rgb[2] - 16, 0),
  ])
  // TODO - 4 - red pal
  paldata[4] = paldata[1].map(rgb => [rgb[0], 113, 113])
  // TODO - 5 - invert pal
  paldata[5] = paldata[0].map(rgb => [
    Math.floor(Math.min((255 - rgb[0])*.75, 255)),
    Math.floor(Math.min((255 - rgb[1])*.75, 255)),
    Math.floor(Math.min((255 - rgb[2])*.75, 255)),
  ])
  
  for (let i = 6; i < 14; i++) {
    paldata[i] = paldata[1]
  }
  
  document.getElementById("export").classList.remove("disabled")
}

let exportA = document.createElement("a");

function exportPal() {
  if (paldata) {
    // document.body.appendChild(a);
    // a.style = "display: none";
      var blob = new Blob(
        [new Uint8Array(paldata.flat(2))],
        {type: "octet/stream"}
      )
      let url = window.URL.createObjectURL(blob);
      exportA.href = url;
      exportA.download = "PALETTE.pal";
      exportA.click();
      window.URL.revokeObjectURL(url);
  }
}