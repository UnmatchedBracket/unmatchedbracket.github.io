let output = document.getElementById("out")
let timer = null;

function newspan(content, className) {
  let el = document.createElement("span")
  el.innerText = content
  if (className) {
    if (className.forEach) {
      className.forEach(n => el.classList.add(n))
    } else {
      el.classList.add(className)
    }
  }
  return el
}

function go() {
  if (!window.tokidata) {
    clearTimeout(timer)
    timer = setTimeout(go, 100)
  }
  clearTimeout(timer)
  let matcher = /([a-zA-Z]+)([^a-zA-Z]*)/g
  let past = {}
  let inp = document.getElementById("inp").value
  let repeat = document.getElementById("repeat").checked
  output.innerHTML = ""
  while (true) {
    let match = matcher.exec(inp)
    if (!match) break
    console.log(match)
    let word = match[1]
    let def = window.tokidata[word]
    if (past[word] && !repeat) {
      output.appendChild(newspan(word + "\u200c", ["toki", "fade"]))
      output.appendChild(newspan(match[2].trimStart()))
    } else if (def) {
      let el = document.createElement("div")
      past[word] = true
      el.classList.add("tokiline")
      el.appendChild(newspan(word, "toki"))
      el.appendChild(newspan(word + " "))
      el.appendChild(newspan(def, "desc"))
      //el.innerText = match[0]
      output.appendChild(el)
      if (match[2]) {
        let el = document.createTextNode(match[2] + " ")
        output.appendChild(el)
      }
    } else {
      output.appendChild(newspan(match[0], "fade"))
    }
  }
}

go()

document.fonts.load("1em Pona").then(() => {
  document.getElementById("unloadedFont").remove()
})