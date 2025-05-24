onmessage = async function (e) {
  console.log(e.data)
  let reader = e.data.stream().getReader()
  let queue = []
  let streamDone = false
  let i = 0
  let q0,q1,q2
  while (true) {
    if (queue.length < 1) {
      if (streamDone) {
        break
      } else {
        let r = await reader.read()
        streamDone = r.done
        //queue.splice(0, 0, ...r.value) // this causes errors for large buffers
        if (r.value) r.value.forEach(v => queue.push(v))
      }
    }
    q2 = q1
    q1 = q0
    q0 = queue.pop(0)
    if (!q2) {
      i++
      continue
    }
    if (
      (q1 == 119 || q1 == 87) &&
      (
        (
          (q0 == 117 || q0 == 85) &&
          (q2 == 117 || q2 == 85) // uU
        ) ||
        (
          (q0 == 111 || q0 == 79 || q0 == 48) &&
          (q2 == 111 || q2 == 79 || q2 == 48) // oO0
        )
      )
    ) {
      // furry detected
      postMessage(["furry", String.fromCharCode(q2, q1, q0), i-2])
    }
    //if (i % 1000 == 0) console.log(i)
    i++
  }
  postMessage(["done"])
}