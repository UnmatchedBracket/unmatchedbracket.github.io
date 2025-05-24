let baseChance = 2097150/2097152

function go() {
  
  let fileSize = document.getElementById("size").value * document.getElementById("unit").value
  
  let chance = Math.max(0, 1-(Math.pow(baseChance, fileSize-2)))
  
  let text = (chance*100).toFixed(2) + "%"
  
  if (text == "0.00%" && fileSize > 2) {
    text = "near-0%"
  } else if (text == "100.00%") {
    text = "near-100%"
  }
  
  document.getElementById("chance").innerText = text
}

go()