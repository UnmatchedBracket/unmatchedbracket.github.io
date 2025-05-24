let quotes = [
  "THE MEMES WILL BE BACK",
  "GANON LOS MEMES",
  "ZE3 RELEASING SOON",
  "JISK IS WATCHING",
  "I THINK THE ZOMBIE ESCAPED",
  "HOW TO ZOMBIE",
  "JISK SMELLS",
  "SRBZ: NEVER RELEASING",
  "I FORGOR",
  "SHE RE ON MY VOID",
  "OOPS! ALL ZOMBIES",
  "HUMANO ESCAPE"
]

let title = document.createElement("h1")
title.innerText = quotes[Math.floor(Math.random()*quotes.length)]
document.body.append(title)