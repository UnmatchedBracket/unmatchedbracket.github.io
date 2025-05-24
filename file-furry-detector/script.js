let fileEl = document.getElementById("file")
let outEl = document.getElementById("results")

if (!window.Worker) {
  outEl.innerText = "This project depends on Web Workers to not freeze your browser. How old is yours?"
}

let worker = new Worker("worker.js")

let msgs = ""
let msgsMD = ""
let furries = 0

let _cereal = document.createElement("div")
function cereal(t) {
  _cereal.innerText = t
  return _cereal.innerHTML
}

worker.onmessage = (e) => {
  console.log(e.data)
  switch (e.data[0]) {
    case "furry":
      msgs += "Furry detected at <code>0x" + cereal(e.data[2].toString(16)) + "</code>: <b>" + cereal(e.data[1]) + "</b><br>"
      if (furries != 0) {
        msgsMD += ", "
      }
      msgsMD += "**0x" + e.data[2].toString(16) + "**:\xa0*" + e.data[1] + "*"
      furries += 1
      outEl.innerHTML = msgs
      break
    case "done":
      msgs += "Done! " + cereal(furries) + " furries found."
      //if (fileEl.files[0].name == "A digital art wallpaper from DALL-E 2.png") {
        msgs += " <a href='javascript:copyMD()'>Copy results</a>"
      //}
      outEl.innerHTML = msgs
      break
  }
}


function go() {
  msgsMD = "**FURRY FILE DETECTOR RESULTS**\nFile: `" + fileEl.files[0].name + "`\nFurries: **FCOUNT**LOCATIONSHEADER"
  msgs = "Processing <code>" + cereal(fileEl.files[0].name) + "</code>:<br>"
  worker.postMessage(fileEl.files[0])
  outEl.innerHTML = msgs
  furries = 0
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .catch(err => console.error('Failed to copy text:', err));
  } else {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
}

function copyMD () {
  copyText(msgsMD.replace("FCOUNT", furries).replace("LOCATIONSHEADER", furries ? (furries > 1 ? "\nLocations:\n> " : "\nLocation:\n> ") : ""))
}