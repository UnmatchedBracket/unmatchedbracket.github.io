let config

try {
  config = JSON.parse(localStorage.nimiliseme)
} catch (e) {
  config = {}
}

function ifmissing(k, v) {
  if (config[k] === undefined) {
    config[k] = v
  }
}

ifmissing("wordset", 0)
ifmissing("auto", false)

function writeConf() {
  localStorage.nimiliseme = JSON.stringify(config)
}

const wordsets = ["core", "common", "uncommon", "obscure"]

function newspan(content, className) {
  let el = document.createElement("span")
  el.innerText = content
  if (className) {
    if (className.forEach) {
      className.forEach(n => {
        el.classList.add(n)
      })
    } else {
      el.classList.add(className)
    }
  }
  return el
}



let els = {};

["main", "question", "answers", "bottom", "next", "afterdef", "afterdefcontent", "afterpopup", "options"].forEach(n => {
  els[n] = document.getElementById(n)
})
let timer = null;

let types = [
  { // toki pona
    generic: function (w, c) {
      let el = newspan(w, c);
      if (w == "kijetesantakalu") {
        el.classList.add("kijetesantakalu")
      }
      return el
    },
    question: function (e, w) {
      e.appendChild(newspan(w, "tp"))
    },
    answers: function (e, ws, c) {
      ws.forEach(w => {
        let el = this.generic(w, ["answer", "tpAnswer"])
        if (w == c) {
          el.correct = true
        }
        el.onclick = onclick
        el.word = w
        e.appendChild(el)
      })
    },
    answercount: 8
  },
  { // sitelen pona
    generic: function (w) {
      if (w == "nimisin") w = "sin+nimi";
      let el = newspan(w, "toki");
      el.style.fontFeatureSettings = `"rand" ${Math.floor(Math.random()*5)+1}`
      return el
    },
    question: function (e, w) {
      e.appendChild(this.generic(w))
    },
    answers: function (e, ws, c) {
      ws.forEach(w => {
        let el = this.generic(w)
        el.classList.add("answer")
        el.classList.add("spAnswer")
        if (w == c) {
          el.correct = true
        }
        el.onclick = onclick
        el.word = w
        e.appendChild(el)
      })
    },
    answercount: 9
  },
  { // definition
    generic: function (w) {
      let el = newspan(window.tokidata[w].short, "def");
      return el
    },
    question: function (e, w) {
      e.appendChild(newspan(window.tokidata[w].short, "def"))
    },
    answers: function (e, ws, c) {
      ws.forEach(w => {
        let el = newspan(window.tokidata[w].short, ["def", "answer", "defAnswer"])
        if (w == c) {
          el.correct = true
        }
        el.onclick = onclick
        el.word = w
        e.appendChild(el)
      })
    },
    answercount: 4
  }
]

let state

function getAllowedKeys() {
  return Object.keys(window.tokidata).filter(x => (!window.tokidata[x].cat || wordsets.indexOf(window.tokidata[x].cat) <= config.wordset))
}

function newquestion() {
  els.question.innerHTML = ""
  els.answers.innerHTML = ""
  els.next.style.backgroundSize = "0% 1px"
  els.answers.classList.remove("answered")
  let fromType = Math.floor(Math.random()*3)
  let toType = Math.floor(Math.random() * 2)
  if (toType >= fromType) toType += 1
  let keys = getAllowedKeys()
  let correct = keys[Math.floor(Math.random()*keys.length)]
  let answers = [correct]
  let ohno = 0
  while (answers.length < types[toType].answercount) {
    let add = keys[Math.floor(Math.random()*keys.length)]
    if (answers.indexOf(add) == -1) {
      answers.push(add)
    }
    
    if (ohno++ > 10000) {
      throw "oh nooooooo"
    }
  }
  answers.sort(() => Math.random() - 0.5)
  types[fromType].question(els.question, correct)
  types[toType].answers(
    els.answers,
    answers,
    correct
  )
  els.next.innerText = "seme"
  els.afterdef.style.visibility = "hidden"
  
  state = {
    answered: false,
    word: correct,
    from: fromType,
    to: toType,
    answeredAt: null
  }
}

function onclick(el) {
  if (state.answered) return
  state.answered = true
  state.answeredAt = Date.now()
  state.correct = !!el.srcElement;
  els.answers.classList.add("answered")
  ;[...els.answers.children].forEach(e => {
    if (e.correct) {
      e.classList.add("answerCorrect")
    } else if (e == el.srcElement) {
      e.classList.add("answerWrong")
      state.correct = false;
    }
  })
  els.next.innerText = "tawa"
  els.afterdef.style.visibility = "visible"
  let adcontent = els.afterdefcontent
  adcontent.innerHTML = ""
  let missingType = 3 - state.to - state.from
  console.log(missingType)
  adcontent.appendChild(types[missingType].generic(state.word))
  // if (Math.max(state.to, state.from) < 2) {
  //   adcontent.innerText = window.tokidata[state.word].shortafter || window.tokidata[state.word].short
  //   adcontent.classList = "def"
  // } else if (Math.min(state.to, state.from) > 0) {
  //   adcontent.innerText = state.word
  //   adcontent.classList = "word"
  // } else  {
  //   adcontent.innerText = state.word
  //   adcontent.classList = tokiClassFor(state.word)
  // }
  els.afterpopup.innerText = `"${state.word}" on `
  els.afterpopup.appendChild(newspan("kijetesantakalu", "toki"))
  els.afterpopup.appendChild(newspan("nimi.li"))
}

function nextButtonClick() {
  if (state.answered) {
    newquestion()
  } else {
    onclick({})
  }
}

let baseAutoTime = 1000
setInterval(() => {
  let autoTime = state.correct ? baseAutoTime : baseAutoTime*2
  if (config.auto && state.answered) {
    if (Date.now() > state.answeredAt + autoTime) {
      newquestion()
    } else {
      let progress = (Date.now() - state.answeredAt) * 100 / autoTime
      els.next.style.backgroundSize = `${progress}% calc( var( --unit ) * .5 )`
    }
  }
}, 0)

function afterdefClick(el) {
  window.open("https://nimi.li/" + state.word)
}

function openOptions() {
  document.getElementById("opt-wordset").value = config.wordset
  document.getElementById("opt-autoa-dummy").checked = config.auto
  els.options.style.display = "block";
  options_updateWordset({value: config.wordset}, true)
  options_updateAutoadvance({checked: config.auto}, true)
}

function closeOptions() {
  els.options.style.display = "none";
}

let setCaptions = [
  "<span class='core'>core</span>",
  "<span class='core'>core</span>, <span class='common'>common</span>",
  "<span class='core'>core</span>, <span class='common'>common</span>, <span class='uncommon'>uncommon</span>"
]

function options_updateWordset(self, nowrite) {
  if (!nowrite) config.wordset = Number(self.value)
  let cap = document.getElementById("opt-wordset-caption")
  cap.classList = cap.innerHTML = setCaptions[self.value]
  if (!nowrite) writeConf()
}

function options_updateAutoadvance(self, nowrite) {
  console.log(self.checked, nowrite)
  config.auto = self.checked
  document.getElementById("opt-autoa").innerText = config.auto ? "tawa" : "ala"
  if (!nowrite) writeConf()
}

newquestion()

document.fonts.load("1em Pona").then(() => {
  document.getElementById("unloadedFont").remove()
})