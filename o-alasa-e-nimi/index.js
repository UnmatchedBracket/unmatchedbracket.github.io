function dailyIndex() {
  var startTime = 1667520000000
  var today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  return (today.getTime() - startTime) / (1000 * 60 * 60 * 24)
}

const buttons = {
  "cont": document.getElementById("continue"),
  "daily": document.getElementById("daily"),
  "random": document.getElementById("random"),
}

if (localStorage.state) {
  buttons.cont.style.display = ""
}

buttons.cont.onclick = () => {
  location = "game.html"
}

buttons.daily.onclick = () => {
  localStorage.state = JSON.stringify({
    target: goal_words[dailyIndex() % goal_words.length],
    current: {
      index: 0,
      text: ""
    },
    history: [],
    active: true,
    finished: false,
  })
  location = "game.html"
}

buttons.random.onclick = () => {
  localStorage.state = ""
  location = "game.html"
}

document.getElementById("dailyreset").innerText = "daily word resets at " + new Date(1667520000000).toLocaleTimeString() + " your time"