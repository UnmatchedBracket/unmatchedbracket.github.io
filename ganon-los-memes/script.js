const cont = document.getElementById("cont");
const canvas = document.getElementById("canv");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
let zombieInput = document.getElementById("zombie")
let escapeInput = document.getElementById("escape")
let varwidthInput = document.getElementById("varwidth")

function render(zombie, escape) {
  if (varwidthInput.checked) {
    let maxTextWidth = Math.max(
      ctx.measureText(zombie).width,
      ctx.measureText(escape).width
    )
    canvas.width = maxTextWidth + 146
  } else {
    canvas.width = 727
  }
  cont.style.width = canvas.width + "px"
  ctx.clearRect(0, 0, 727, 226)
  ctx.font = "72pt Furore";
  
  ctx.textAlign = "left";
  ctx.fillStyle = '#f2001d';
  ctx.fillText(zombie, 41.673, 102.968);
  
  ctx.textAlign = "right";
  ctx.fillStyle = '#0026ff';
  ctx.fillText(escape, 690.367-727+canvas.width, 175.194);
}

render("ZOMBIE", "ESCAPE")

function input() {
  render(zombieInput.value, escapeInput.value)
}

document.fonts.onloadingdone = input


let exportButton = document.getElementById("export")
exportButton.addEventListener("click", () => {
  let link = document.createElement("a")
  link.href = canvas.toDataURL('image/png')
  link.download = "ze_meme.png"
  link.click()
})
/* */



/**/