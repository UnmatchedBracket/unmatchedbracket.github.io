(async function () {

let main = document.getElementById("main")
let cells = []

// let bingoData = {
//   normal: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
//   free: ["AA", "BB", "CC", "DD"]
// }

let success = false
let and = (a,b) => a && b

function checkSuccess() {
  success = false
  cells.forEach(c => {
    c.classList.remove("success")
  })
  function subcheck(f) {
    let l = data.checked.filter(f)
    if (l.reduce(and)) {
      success = true
      cells.forEach((c, i) => {
        if (f(null, i)) {
          c.classList.add("success")
        }
      })
    }
  }
  for (let i=0; i < 5; i++) {
    subcheck((_, ind) => Math.floor(ind / 5) == i)
    subcheck((_, ind) => ind % 5 == i)
  }
  subcheck((_, ind) => ind % 5 == Math.floor(ind / 5))
  subcheck((_, ind) => ind % 5 == (4 - Math.floor(ind / 5)))
}


function write () {
  checkSuccess()
  if (success) {
    //main.classList.add("success")
  } else {
    main.classList.remove("success")
  }
  localStorage.PRBingo = JSON.stringify(data)
}

let data
if (localStorage.PRBingo) {
  data = JSON.parse(localStorage.PRBingo)
} else {
  let bingoData = {
    normal: [],
    free: []
  }
  let r = await fetch("./bingo.txt")
  let txt = await r.text()
  txt.split("\n").forEach(l => {
    let target = bingoData.normal
    if (l.startsWith("[FREE SPACE]")) {
      l = l.slice(12)
      target = bingoData.free
    }
    if (l.trim().length > 0) {
      target.push(l.trim())
    }
  })
  let spaces = []
  for (let i = 0; i < 24; i++) {
    let ind = Math.floor(Math.random() * bingoData.normal.length)
    //let ind = Math.floor(Math.random() * (24-i))
    spaces.push(bingoData.normal[ind] || "-")
    bingoData.normal.splice(ind, 1)
  }
  spaces.splice(12, 0, bingoData.free[Math.floor(Math.random() * bingoData.free.length)])
  data = {
    checked: [...Array(25)].map(_ => false),
    spaces
  }
  write()
}
  
for (let i=0; i < 25; i++) {
  let cell = document.createElement("div")
  cell.classList.add("cell")
  main.appendChild(cell)
  cell.onclick = () => {
    if (cell.classList.contains("got")) {
      cell.classList.remove("got")
      data.checked[i] = false
      write()
    } else {
      cell.classList.add("got")
      data.checked[i] = true
      write()
      console.log(i)
    }
  }
  cell.innerText = data.spaces[i] || "?"
  if (data.checked[i]) {
    cell.classList.add("got")
  }
  cells.push(cell)
}

let reset = document.createElement("button")
reset.classList.add("button")
reset.innerText = "Reset"
reset.onclick = () => {
  localStorage.PRBingo = ""
  location.reload()
}
main.appendChild(reset)
write()

})()