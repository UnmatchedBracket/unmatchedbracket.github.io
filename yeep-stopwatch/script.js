let timer = document.getElementById("timer")

let startTime = Number(localStorage.startTime) || 0

document.getElementById("reset").onclick = () => {
  startTime = Date.now()
  localStorage.startTime = startTime
}

[...document.getElementsByClassName("add")].forEach(e => {
  e.onclick = () => {
    startTime += 1000 * Number(e.getAttribute("amount"))
    localStorage.startTime = startTime
  }
})

function lpad(s, d) {
  s = s.toString()
  while (s.length < d) {
    s = "0" + s
  }
  return s
}

function frame () {
  requestAnimationFrame(frame)
  
  let timeLeft = Math.max(0, startTime + 5*60*1000 - Date.now())
  let minutes = Math.floor(timeLeft/(60*1000))
  let seconds = Math.floor((timeLeft/1000)%60)
  let part = Math.floor((timeLeft/100)%10)
  timer.innerText = `${minutes}:${lpad(seconds, 2)}.${part}`
}

requestAnimationFrame(frame)