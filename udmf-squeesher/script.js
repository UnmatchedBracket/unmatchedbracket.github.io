// thank your random russian person
// https://github.com/PROPHESSOR/udmfMapProcessor/blob/master/lib/udmf2json.js#L14-L66
function udmf2json(inp) {
    const file = '[\n' +
        inp
            .replace(/(\/\/).+?\n/g, '')                                                // Remove comments
            .replace(/=/g, ': ')                                                        // = -> :
            .replace(/;/g, ',')                                                         // ; -> ,
            .replace(/(linedef|sidedef|vertex|sector|thing)\s*\n*{/g, '["$1", {')       // XXX{ -> ["XXX", {]
            .replace(/}/g, '}], ')                                                      // } -> }], 
            .replace(/\n(.+?):/g, '"$1":')                                              // v1: -> "v1":
            .replace(/,(\s*\n*\s*})/g, '$1')                                            // Remove last "," (attributes)
            .replace(/,\s*$/, '')                                                       // Remove last "," (file)
            .replace(/ /g, '')                                                          // Remove all spaces
            .replace(/namespace:"(.+?)";?/g, '["namespace", "$1"]')
        + '\n]';
    
    // console.log(file)

    return eval(file);
}

function json2udmf(inp) {
    let out = '';

    for (const block of inp) {
        if (block[0] == "namespace") {
          out += `namespace=${JSON.stringify(block[1])};`
          continue
        }
        out += `${block[0]}`;
        if (typeof block[2] === 'number') out += ` // #${block[2]}\n`;
        out += '{';
      
        Object.keys(block[1]).forEach((key, i, all) => {
            let value = block[1][key];
            if (typeof value === 'string') value = `"${value}"`;
            if (key === 'x' || key === 'y') {
              let fixed = value.toFixed(3)
              let nonfixed = value.toString()
              value = (fixed.length < nonfixed.length) ? fixed : nonfixed
            };

            out += `${key}=${value}`;
            if (i != all.length - 1) {
              out += ";"
            }
        })

        out += '}';
    }

    return out + "\n";
}

function byte (n) {
  if (n < 2000) {
    return `${n}B`
  } else if (n < 2000000) {
    return `${(n/1000).toFixed(1)}KB`
  } else {
    return `${(n/1000000).toFixed(1)}MB`
  }
}


let inEl = document.getElementById("source")
let outEl = document.getElementById("results")
let pctEl = document.getElementById("reduction")
let last = ""
function go() {
  pctEl.innerText = "..."
  let squeeshed
  try {
    squeeshed = json2udmf(udmf2json(inEl.value))
    outEl.innerText = squeeshed + "\n"
    last = squeeshed
  } catch (error) {
    outEl.innerText = "whoopsy i crashed"
    return
  }
  pctEl.innerText = ((1-(squeeshed.length / inEl.value.length))*100).toFixed(2) + "% / " + byte(inEl.value.length - squeeshed.length)
}

let copier = document.getElementById("copier")
function copy() {
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  copier.value = last
  copier.select();
  document.execCommand('copy');

  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}

inEl.value = 'namespace = "srb2";\nthing\n{\nx = -448.0;\ny = -320.0;\nangle = 45;\ntype = 1;\n}\n\nthing\n{\nx = 128.0;\ny = 64.0;\nangle = 270;\ntype = 100;\n}\n\nvertex\n{\nx = -832.0;\ny = 320.0;\n}\n\nvertex\n{\nx = -128.0;\ny = 320.0;\n}\n\nvertex\n{\nx = 704.0;\ny = 320.0;\n}\n\nvertex\n{\nx = 704.0;\ny = 128.0;\n}\n\nvertex\n{\nx = 704.0;\ny = -128.0;\n}\n\nvertex\n{\nx = 64.0;\ny = -360.72727;\n}\n\nvertex\n{\nx = -704.0;\ny = -640.0;\n}\n\nvertex\n{\nx = -763.73333;\ny = -192.0;\n}\n\nvertex\n{\nx = -28.7845;\ny = -31.76406;\n}\n\nlinedef\n{\nv1 = 0;\nv2 = 1;\nsidefront = 0;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 2;\nv2 = 3;\nsidefront = 1;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 4;\nv2 = 5;\nsidefront = 2;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 6;\nv2 = 7;\nsidefront = 3;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 1;\nv2 = 8;\nsidefront = 4;\nsideback = 5;\ntwosided = true;\n}\n\nlinedef\n{\nv1 = 1;\nv2 = 2;\nsidefront = 6;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 5;\nv2 = 6;\nsidefront = 7;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 8;\nv2 = 5;\nsidefront = 8;\nsideback = 9;\ntwosided = true;\n}\n\nlinedef\n{\nv1 = 7;\nv2 = 8;\nsidefront = 10;\nsideback = 11;\ntwosided = true;\n}\n\nlinedef\n{\nv1 = 8;\nv2 = 3;\nsidefront = 12;\nsideback = 13;\ntwosided = true;\n}\n\nlinedef\n{\nv1 = 7;\nv2 = 0;\nsidefront = 14;\nblocking = true;\n}\n\nlinedef\n{\nv1 = 3;\nv2 = 4;\nsidefront = 15;\nblocking = true;\n}\n\nsidedef\n{\nsector = 1;\ntexturemiddle = "GFZROCK";\n}\n\nsidedef\n{\nsector = 0;\ntexturemiddle = "GFZROCK";\n}\n\nsidedef\n{\nsector = 3;\ntexturemiddle = "GFZROCK";\n}\n\nsidedef\n{\nsector = 2;\ntexturemiddle = "GFZROCK";\n}\n\nsidedef\n{\nsector = 1;\n}\n\nsidedef\n{\nsector = 0;\n}\n\nsidedef\n{\nsector = 0;\ntexturemiddle = "GFZROCK";\noffsetx_mid = 704.0;\n}\n\nsidedef\n{\nsector = 2;\ntexturemiddle = "GFZROCK";\noffsetx_mid = 681.0;\n}\n\nsidedef\n{\nsector = 2;\n}\n\nsidedef\n{\nsector = 3;\n}\n\nsidedef\n{\nsector = 2;\n}\n\nsidedef\n{\nsector = 1;\n}\n\nsidedef\n{\nsector = 3;\n}\n\nsidedef\n{\nsector = 0;\n}\n\nsidedef\n{\nsector = 1;\ntexturemiddle = "GFZROCK";\noffsetx_mid = 67.0;\n}\n\nsidedef\n{\nsector = 3;\ntexturemiddle = "GFZROCK";\noffsetx_mid = 64.0;\n}\n\nsector\n{\nheightfloor = 0;\nheightceiling = 128;\ntexturefloor = "GFZFLR01";\ntextureceiling = "F_SKY1";\nlightlevel = 192;\n}\n\nsector\n{\nheightfloor = 0;\nheightceiling = 128;\ntexturefloor = "GFZFLR01";\ntextureceiling = "F_SKY1";\nlightlevel = 192;\n}\n\nsector\n{\nheightfloor = 0;\nheightceiling = 128;\ntexturefloor = "GFZFLR01";\ntextureceiling = "F_SKY1";\nlightlevel = 192;\n}\n\nsector\n{\nheightfloor = 0;\nheightceiling = 128;\ntexturefloor = "GFZFLR01";\ntextureceiling = "F_SKY1";\nlightlevel = 192;\n}\n\n'
// inEl.value = 'namespace = "srb2";\nthing\n{\nx = -448.0;\ny = -320.0;\nangle = 45;\ntype = 1;\n}\n'
go()