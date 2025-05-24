
let KBSIZE = 9
// let KBMAP = [
//   ["!", "V", "H", "~", "1", "Z", "6", "J", "E"],
//   ["k", "-", "a", "0", "7", "c", "L", "I", "r"],
//   ["y", "@", "B", "x", "f", "j", "o", "8", "b"],
//   ["s", ";", "A", "G", "e", "n", '"', "O", "l"],
//   ["P", "W", ",", "w", "m", "z", "del", "K", "d"],
//   ["D", "/", "S", "C", "N", "3", "X", " ", "M"],
//   ["Y", "p", "#", "u", "'", "5", "(", ".", "t"],
//   [")", "&", "U", "h", "g", "2", "q", "9", "v"],
//   ["T", "i", "F", "*", ":", "R", "Q", "4", "?"]
// ]
let KBMAP = [
  ['Y', 'C', 'W', 'H', 'X', 'Q', "'", ';', 'del'],
  ['T', 'E', 'R', 'O', 'S', 'P', ':', '"', ','],
  ['U', 'I', 'N', 'V', 'G', '3', ')', '.', '/'],
  ['F', 'L', 'A', 'M', '2', '5', '9', 'p', 'q'],
  ['Z', 'B', 'K', '1', '-', '8', 'g', 's', 'x'],
  ['J', 'D', '0', '4', '7', 'm', 'v', 'o', 'h'],
  ['@', '~', '(', '6', 'k', 'a', 'n', 'r', 'w'],
  ['!', '*', '?', 'd', 'b', 'l', 'i', 'e', 'c'],
  [' ', '#', '&', 'j', 'z', 'f', 'u', 't', 'y']
]
let KBSHORTCUTS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8"],
  ["/", ".", ",", "m", "n", "b", "v", "c", "x"]
]
let KBSHORTCUTIDS = KBSHORTCUTS.map(row => {
  return row.map(key => {
    if ("qwertyuiopasdfghjklzxcvbnm".indexOf(key) != -1) {
      return "Key" + key.toUpperCase()
    } else if ("1234567890".indexOf(key) != -1) {
      return "Digit" + key
    } else  {
      return {
        ",": "Comma",
        ".": "Period",
        "/": "Slash",
        "`": "Backquote"
      }[key]
    }
  })
}).flat()


// assemble buttons
let kb_parent = document.getElementById("kb")
let table = document.createElement("table")
let cells = {}

function setText(cell, text) {
  let textEl = document.createElement("div")
  textEl.innerText = text
  textEl.classList.add("celltext")
  cell.appendChild(textEl)
}

for (let rown = 0; rown <= KBSIZE; rown++) {
  let row = document.createElement("tr")
  for (let coln = 0; coln < KBSIZE; coln++) {
    let cell = document.createElement("td")
    
    if (rown < KBSIZE) {
      cell.classList.add("key")
      cells[`k-${rown}-${coln}`] = cell
      setText(cell, KBMAP[rown][coln])
    } else {
      cell.classList.add("button")
      cells[`btn-c${coln}`] = cell
      cell.button_side = 0
      cell.button_ind = coln
      setText(cell, KBSHORTCUTS[0][coln])
    }
    row.appendChild(cell)
  }
  
  if (rown < KBSIZE) {
    let cell = document.createElement("td")

    setText(cell, KBSHORTCUTS[1][rown])
    cell.classList.add("button")
    cells[`btn-r${rown}`] = cell
    cell.button_side = 1
    cell.button_ind = rown
    row.appendChild(cell)
  }
  
  table.appendChild(row)
}
kb_parent.appendChild(table)



// make them do stuff
let pressedmap = [
  Array(KBSIZE).fill(false),
  Array(KBSIZE).fill(false)
]
let textbox = document.getElementById("textbox")

function type(r, c) {
  if (KBMAP[r][c] == "del") {
    textbox.value = textbox.value.slice(0, textbox.value.length-1)
  } else {
    textbox.value += KBMAP[r][c]
  }
}

function setPressed(side, index, pressed) {
  if (pressedmap[side][index] == pressed) {return}
  pressedmap[side][index] = pressed
  if (pressed) {
    for (let i = 0; i <= KBSIZE; i++) {
      if (pressedmap[1-side][i]) {
        // intersection! type it
        if (side) {
          type(index, i)
        } else {
          type(i, index)
        }
      }
    }
  }
  
  // key effects
  cells[`btn-${side ? 'r' : 'c'}${index}`].classList[pressed ? "add" : "remove"]("pressed")
  doKeyEffects()
}

function doKeyEffects() {
  for (let rown = 0; rown < KBSIZE; rown++) {
    let row = document.createElement("tr")
    for (let coln = 0; coln < KBSIZE; coln++) {
      let key = cells[`k-${rown}-${coln}`]
      let heat = pressedmap[0][coln] + pressedmap[1][rown]
      switch (heat) {
        default:
          key.classList.remove("heated")
          key.classList.remove("pressed")
          break;
        case 1:
          key.classList.add("heated")
          key.classList.remove("pressed")
          break;
        case 2:
          key.classList.remove("heated")
          key.classList.add("pressed")
          break;
      }
    }
  }
}


function assignEvents(cell, side, index) {
  cell.onmousedown = (e) => {
    setPressed(side, index, true)
  }
  cell.onmouseup = (e) => {
    setPressed(side, index, false)
  }
  cell.onmouseleave = (e) => {
    setPressed(side, index, false)
  }
  cell.onmouseenter = (e) => {
    if (e.which == 1) {
      setPressed(side, index, true)
    }
  }
}

for (let i = 0; i < KBSIZE; i++) {
  assignEvents(cells[`btn-c${i}`], 0, i)
  assignEvents(cells[`btn-r${i}`], 1, i)
}

function keyHandler(e, dir) {
  let ind = KBSHORTCUTIDS.indexOf(e.code)
  if (ind > -1) {
    setPressed(
      Math.floor(ind/9),
      ind%9,
      dir
    )
  }
}

window.addEventListener("keydown", (e) => {
  keyHandler(e, true)
})

window.addEventListener("keyup", (e) => {
  keyHandler(e, false)
})

function wz(x, y) {
  return [x+y, x-y]
}

function touchHandler(e) {
  console.log(e)
  // console.log(e.touches[0]?.clientX, e.touches[0]?.target)
  // e.preventDefault()
  let shouldbepressed = [
    Array(KBSIZE).fill(false),
    Array(KBSIZE).fill(false)
  ]
  let gridbox = table.getBoundingClientRect()
  let mid = gridbox.left + gridbox.width/2
  let top = gridbox.top + gridbox.height/3
  let bottom = gridbox.bottom + gridbox.height/3
  ;[...e.touches].forEach(t => {
    if (t.clientY < top) return;
    if (t.clientY > bottom) return;
    let side = (t.clientX > mid) * 1
    let closest = null
    let closeDist = 9999999999
    let coord = wz(t.clientX, t.clientY)[side]
    let tmp = {}
    for (let i = 0; i < KBSIZE; i++) {
      let button = cells[`btn-${side ? 'r' : 'c'}${i}`]
      let box = button.getBoundingClientRect()
      let btnCoord = wz(box.left + box.width/2, box.top + box.height/2)[side]
      tmp[i] = btnCoord
      let diff = Math.abs(coord - btnCoord)
      if (diff < closeDist) {
        closest = i
        closeDist = diff
      }
    }
    if (closeDist < Math.abs(tmp[0]-tmp[1]))
      shouldbepressed[side][closest] = true
    
    
    
    // let el = t.target
    // let el = document.elementFromPoint(t.clientX, t.clientY)
    // for (let i = 0; i < 3 && el && !el.classList.contains("button"); i++) {
    //   el = el.parentElement
    // }
    // if (el && el.classList.contains("button")) {
    //   shouldbepressed[el.button_side][el.button_ind] = true
    // }
  })
  console.log(JSON.stringify(shouldbepressed))
  shouldbepressed.forEach((l, side) => {
    l.forEach((state, ind) => {
      setPressed(side, ind, state)
    })
  })
}
window.addEventListener("touchstart", touchHandler, {passive: false})
window.addEventListener("touchend", touchHandler, {passive: false})
window.addEventListener("touchmove", touchHandler, {passive: false})
window.addEventListener("touchcancel", touchHandler, {passive: false})


// timer lmao
let timerEl = document.getElementById("timer")
let startTime = Date.now()/1000
let lastType = Date.now()/1000
let lastContent = ""
setInterval(() => {
  let now = Date.now()/1000
  if (textbox.value == "") {
    startTime = now
    lastType = now
  }
  if (lastContent != textbox.value) {
    lastType = now
    lastContent = textbox.value
  }
  let time = (now - startTime)
  if (now - lastType > 2.5) {
    time = (lastType - startTime)
  }
  timerEl.value = time.toFixed(2)
}, 0)