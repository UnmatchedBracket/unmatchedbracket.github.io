const row_els = []
const game_el = document.getElementById("game")
const cells_el = document.getElementById("cells")
const kb_el = document.getElementById("keyboard")
const key_els = {}
const key_judgements = {}
// valid_words and goal_words

// silence the linter
let anime = window.anime
let valid_words = window.valid_words
let goal_words = window.goal_words


function flipCell(cell, delay, properties) {
  let hasFlipped = false;
  let requiredProgress = 100 - ((250) / (500 + delay)) * 100;
  anime.set(cell, { rotateX: "0deg", translateX: 0 })
  var anim = anime({
    targets: cell,
    delay: delay,
    rotateY: [
      { value: "90deg", duration: 250, easing: 'easeInSine' },
      { value: "-90deg", duration: 0 },
      { value: "0deg", duration: 250, easing: 'easeOutSine' },
    ],
    duration: 500,
    update: function(anim) {
      if (anim.progress > requiredProgress && !hasFlipped) {
        hasFlipped = true
        if (properties.classSet) {
          cell.classList = "cell"
          cell.classList.add(properties.classSet);
          delete properties.classSet;
        }
        anime.set(cell, properties);
      }
    }
  })
  return anim
}

let status_el = document.getElementById("status")
function endgameStatus(_) { // text is now ignored
  status_el.style.transform = "perspective(50em)"
  kb_el.style.transform = "perspective(50em)"
  status_el.innerText = goal_info[state.target]?.short || "------"
  if (status_el.innerHTML == "------") {
    status_el.innerHTML = "whoops - no description!<br>see <a href='https://nimi.li/WORD'>nimi.li</a> instead.".replaceAll("WORD", state.target)
  }
  status_el.innerHTML = (
    `<div class="statustop">
      <span class="toki">WORD</span> WORD
    </div>
    DESC`
    .replaceAll("WORD", state.target)
    .replaceAll("DESC", status_el.innerHTML.replaceAll("; ", ";").replaceAll(";", ";<br>") /*.replaceAll(" ", "\xa0")*/ .replaceAll(",\xa0", ", "))
  )
  //anime.set(status_el, { filter: "drop-shadow(0px 0px 0px rgb(0, 0, 0))" })
  let flipTime = 400
  anime({
    delay: flipTime,
    duration: flipTime,
    targets: status_el,
    rotateY: [90, 0],
    opacity: [1, 1],
    //filter: "drop-shadow(0px 0px 7px rgb(0, 0, 0))",
    easing: "easeOutQuart",
  })
  anime({
    duration: flipTime,
    targets: kb_el,
    rotateY: [0, -90],
    easing: "easeInQuart",
  })
}

function shakeRow(row) {
  anime.set(row.children, { rotateX: 0, translateX: 0 })
  anime({
    direction: "alternate",
    loop: true,
    targets: row.children,
    translateX: [0, "6px", "-6px", "6px", "-6px", 0],
    easing: "easeOutInElastic",
    loop: 1,
    duration: 100
  })
}

function flipCellQuick(cell, properties, reverse = false) {
  anime.set(cell, { translateX: 0 })
  let hasFlipped = false;
  var anim = anime({
    targets: cell,
    rotateX: [
      { value: (reverse ? "-" : "") + "90deg", duration: 100, easing: 'easeInSine' },
      { value: (reverse ? "" : "-") + "90deg", duration: 0 },
      { value: "0deg", duration: 100, easing: 'easeOutSine' },
    ],
    duration: 200,
    update: function(anim) {
      if (anim.progress > 50 && !hasFlipped) {
        hasFlipped = true
        if (properties.classSet) {
          cell.classList = "cell"
          cell.classList.add(properties.classSet);
          delete properties.classSet;
        }
        if (properties.classFullSet) {
          cell.classList = properties.classFullSet
          delete properties.classFullSet;
        }
        anime.set(cell, properties);
      }
    }
  })
  return anim
}

function setKeyScore(key_name, score, delay = 0) {
  setTimeout(() => {
    if (key_judgements[key_name] < score) {
      flipCellQuick(key_els[key_name], { classFullSet: "key " + ["cell_wrong", "cell_misplaced", "cell_correct"][score] })
      key_judgements[key_name] = score
    }
  }, delay)
}

for (var i = 0; i < 5; i++) {
  var row = []
  var row_el = document.createElement("div")
  row_el.classList.add("row")
  for (var j = 0; j < 4; j++) {
    var el = document.createElement("div");
    el.classList.add("cell");
    el.style.transform = "perspective(3em)"
    el.innerText = " ";
    row_el.appendChild(el);
    row.push(el);
  }
  cells_el.appendChild(row_el)
  row_els.push(row_el)
}

var state;

if (localStorage.state) {
  state = JSON.parse(localStorage.state)
  state.active = true
  for (i = 0; i < state.history.length; i++) {
    var row = row_els[i]
    var text = state.history[i]
    var judgement = judge(text)
    var children = [...row.children]
    children.forEach((value, index) => {
      flipCell(value, (i / 2.65 + index) * 250, {
        classSet: ["cell_wrong", "cell_misplaced", "cell_correct"][judgement[index]],
        innerText: text[index]
      }
      )
      setKeyScore(text[index], judgement[index], (i / 2.65 + index) * 250 + 250)
    })
  }
} else {
  state = {
    target: goal_words[anime.random(0, goal_words.length - 1)],
    current: {
      index: 0,
      text: ""
    },
    history: [],
    active: true,
    finished: false,
  }
  localStorage.state = JSON.stringify(state)
}

function judge(guess) {
  var correct = state.target
  var rating = [0, 0, 0, 0]
  for (var i = 0; i < 4; i++) {
    if (guess[i] == correct[i]) {
      rating[i] = 2
    }
  }
  var tmp = ""
  for (var i = 0; i < 4; i++) {
    if (rating[i] == 0) {
      tmp += correct[i]
    }
  }
  for (var i = 0; i < 4; i++) {
    if (rating[i] != 2 && tmp.includes(guess[i])) {
      rating[i] = 1
      let loc = tmp.indexOf(guess[i])
      tmp = tmp.slice(0, loc) + tmp.slice(loc + 1)
    }
  }
  return rating
}

let WINTEXTS = [
  [""], // zero guesses can never happen
  ["wintexts todo"],
  ["wintexts todo"],
  ["wintexts todo"],
  ["wintexts todo"],
  ["wintexts todo"],
  ["wintexts todo"],
  // ["VERY LUCKY", "PURE LUCK", "LUCKY BREAK"],
  // ["SERENDIPITY", "LUCKY", "FORTUNATE GUESS"],
  // ["VERY GOOD", "SMART", "IMPRESSIVE", "CUNNING"],
  // ["GOOD JOB", "NICE", "WELL DONE", "ADEPT"],
  // ["OKAY", "GOOD", "DECENT", "ADEQUATE"],
  // ["CLOSE ONE", "PHEW", "BARELY MADE IT", "NEAR MISS", "JUST IN TIME"]
]


let valid_letters = "lsknpmwtjaeiou"

function onkey(key) {
  if (state.finished) {
    return key != "Backspace"
  }
  if (key.length == 1) {
    if (state.current.text.length < 4) {
      if (valid_letters.indexOf(key) != -1) {
        var cell = row_els[state.current.index].children[state.current.text.length]
        state.current.text += key
        flipCellQuick(cell, {
          innerText: key,
          classSet: "cell_content"
        })
      } else {
        shakeRow(kb_el)
      }
    }
  } else if (key == "Backspace") {
    if (state.current.text.length > 0) {
      state.current.text = state.current.text.slice(0, -1)
      var cell = row_els[state.current.index].children[state.current.text.length]
      flipCellQuick(cell, {
        innerText: " ",
        classSet: "cell",
      }, true)
    }
  } else if (key == "Enter") {
    if (state.active) {
      var row = row_els[state.current.index]
      if (state.current.text.length == 4 && (valid_words.includes(state.current.text) || goal_words.includes(state.current.text))) {
        if (state.history.includes(state.current.text)) {
          var other_row = row_els[state.history.indexOf(state.current.text)]
          shakeRow(other_row)
        } else {
          var judgement = judge(state.current.text)
          state.history.push(state.current.text)
          var children = [...row.children]
          state.active = false
          children.forEach((value, index) => {
            let anim = flipCell(value, index * 250, {
              classSet: ["cell_wrong", "cell_misplaced", "cell_correct"][judgement[index]]
            }
            )
            setKeyScore(state.current.text[index], judgement[index], index * 250 + 250)
            if (index == 3) {
              anim.finished.then(() => {
                state.active = true
                if (judgement == "2,2,2,2") {
                  //anime.set(children, { filter: "drop-shadow(0px 0px 15px #00000000)" })
                  anime({
                    targets: children,
                    rotateX: "360deg",
                    easing: "easeInOutSine",
                    duration: 750,
                    delay: anime.stagger(75),
                  })
                  let l = WINTEXTS[state.current.index]
                  endgameStatus(l[Math.floor(Math.random()*l.length)])
                } else if (state.finished) {
                  endgameStatus('ANSWER WAS "' + state.target + "'")
                }
              })
            }
          })
          state.current.text = ""
          state.current.index += 1
          if (state.current.index == 5 || judgement == "2,2,2,2") {
            state.finished = true
            if (judgement == "2,2,2,2") {
              row.style.position = "relative"
              row.style.zIndex = 99
            }
            localStorage.state = ""
          } else {
            localStorage.state = JSON.stringify(state)
          }

        }
      } else {
        shakeRow(row)
      }
    }
  } else {
    return true
  }
}

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey) { return }
  onkey(e.key) ? 0 : e.preventDefault();
});

// create keyboard
const KEYBOARD_ROWS = [
  // "jklmnpstw".split(""), // basic order
  // "mknlsptwj".split(""), // from mozilla common voice corpus
  // "plksmntwj".split(""), // from 4-letter word list
  "lsknpmwtj".split(""), // also from 4-letter word list
  "aeiou".split("")
]
const SPECIAL_SYMBOLS = {
  "Backspace": "ala",
  "Enter": "o pana"
}
KEYBOARD_ROWS[1].push("Backspace")
KEYBOARD_ROWS[1].push("Enter")
for (let y = 0; y < KEYBOARD_ROWS.length; y++) {
  var row_el = document.createElement("div")
  row_el.classList = "kb_row"
  let row_text = KEYBOARD_ROWS[y]
  for (let x = 0; x < row_text.length; x++) {
    let key_text = row_text[x]
    let display_text = key_text.length == 1 ? key_text : SPECIAL_SYMBOLS[key_text]
    var el = document.createElement("div");
    el.classList.add("key");
    el.innerText = display_text;
    if (display_text == " ") {
      el.classList.add("spacekey");
      el.innerText = "\xa0"
    }
    if (display_text.length > 1) {
      el.classList.add("widekey");
      el.classList.add("toki");
    }
    ((kname) => {
      el.onclick = () => {
        onkey(kname)
      }
    })(key_text)
    row_el.appendChild(el);
    key_els[key_text] = el
    key_judgements[key_text] = -1
  }
  kb_el.appendChild(row_el)
}