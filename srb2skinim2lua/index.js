const palette = [
    [255, 255, 255], [246, 246, 246], [237, 237, 237], [228, 228, 228], [218, 218, 218], [209, 209, 209], [200, 200, 200], [191, 191, 191], [183, 183, 183], [175, 175, 175], [167, 167, 167], [159, 159, 159], [151, 151, 151], [143, 143, 143], [135, 135, 135], [127, 127, 127], [119, 119, 119], [111, 111, 111], [103, 103, 103], [95, 95, 95], [87, 87, 87], [79, 79, 79], [71, 71, 71], [63, 63, 63], [55, 55, 55], [47, 47, 47], [39, 39, 39], [31, 31, 31], [23, 23, 23], [15, 15, 15], [7, 7, 7], [0, 0, 0],
    [255, 127, 127], [255, 95, 95], [255, 63, 63], [255, 0, 0], [239, 0, 0], [223, 0, 0], [207, 0, 0], [191, 0, 0], [175, 0, 0], [159, 0, 0], [143, 0, 0], [127, 0, 0], [111, 0, 0], [95, 0, 0], [71, 0, 0], [55, 0, 0], [255, 219, 192], [255, 203, 151], [255, 185, 117], [255, 168, 85], [255, 151, 54], [255, 134, 25], [255, 117, 0], [236, 105, 0], [221, 94, 0], [208, 88, 0], [196, 79, 0], [181, 68, 0], [159, 56, 0], [138, 41, 0], [129, 32, 0], [121, 24, 0],
    [235, 219, 87], [215, 187, 67], [195, 155, 47], [175, 123, 31], [155, 91, 19], [135, 67, 7], [117, 41, 0], [85, 0, 0], [255, 255, 79], [255, 255, 0], [227, 217, 15], [201, 187, 14], [170, 155, 11], [136, 120, 9], [112, 96, 7], [90, 73, 5], [255, 255, 207], [255, 255, 175], [255, 255, 143], [255, 255, 115], [235, 222, 129], [208, 194, 128], [183, 169, 119], [150, 131, 93], [222, 255, 168], [199, 228, 148], [173, 200, 128], [149, 173, 107], [124, 146, 88], [100, 119, 68], [74, 90, 48], [50, 63, 29],
    [119, 255, 79], [112, 240, 75], [105, 224, 70], [97, 208, 65], [90, 192, 60], [82, 176, 55], [75, 160, 50], [67, 144, 45], [60, 128, 40], [53, 112, 35], [45, 96, 30], [38, 80, 25], [30, 64, 20], [23, 48, 15], [15, 32, 10], [7, 15, 4], [0, 255, 0], [0, 223, 0], [0, 191, 0], [0, 159, 0], [0, 127, 0], [0, 95, 0], [0, 63, 0], [0, 45, 0], [183, 251, 231], [102, 247, 203], [21, 242, 176], [11, 210, 151], [3, 177, 128], [2, 147, 107], [2, 115, 84], [1, 86, 63], [206, 250, 255], [166, 241, 255], [117, 231, 255], [87, 213, 255], [79, 199, 255], [71, 185, 255], [55, 165, 255], [32, 138, 225], [24, 111, 182], [21, 83, 134], [14, 53, 86], [7, 30, 48], [116, 209, 201], [66, 179, 179], [23, 136, 136], [0, 95, 95], [231, 231, 255], [198, 198, 255], [173, 173, 255], [140, 140, 255], [115, 115, 255], [82, 82, 255], [49, 49, 255], [24, 24, 255], [0, 0, 255], [0, 0, 223], [0, 0, 196], [0, 0, 172], [0, 0, 149], [0, 0, 128], [0, 0, 102], [0, 0, 82], [216, 183, 255], [199, 153, 255], [173, 106, 255], [152, 68, 255], [127, 22, 255], [107, 0, 238], [91, 0, 201], [72, 0, 159], [51, 0, 113], [36, 0, 81], [151, 151, 213], [119, 119, 187], [84, 84, 167], [65, 65, 131], [46, 46, 92], [33, 34, 78], [255, 202, 255], [255, 170, 255], [255, 138, 255], [255, 106, 255], [255, 74, 255], [255, 0, 255], [221, 0, 221], [191, 0, 191], [162, 0, 162], [121, 0, 121], [85, 0, 85], [53, 0, 53], [197, 232, 0], [167, 202, 4], [140, 168, 11], [108, 124, 18], [207, 127, 207], [183, 111, 183], [159, 95, 159], [135, 79, 135], [111, 63, 111], [87, 47, 87], [64, 32, 64], [43, 21, 43], [255, 196, 224], [255, 153, 192], [245, 112, 165], [221, 87, 140], [199, 61, 116], [177, 52, 102], [157, 47, 91], [133, 39, 77], [255, 230, 219], [255, 191, 191], [255, 159, 159], [225, 133, 133], [204, 113, 113], [194, 99, 99], [181, 83, 83], [167, 63, 63], [255, 207, 179], [255, 193, 158], [255, 183, 139], [247, 171, 123], [239, 163, 115], [227, 151, 103], [215, 139, 91], [207, 131, 83], [191, 123, 75], [179, 115, 71], [171, 111, 67], [163, 107, 63], [155, 99, 59], [143, 95, 55], [135, 87, 51], [127, 83, 47], [119, 79, 43], [107, 71, 39], [95, 67, 35], [83, 63, 31], [75, 55, 27], [63, 47, 23], [51, 43, 19], [43, 35, 15], [191, 167, 143], [175, 152, 128], [159, 137, 113], [146, 125, 101], [134, 114, 90], [126, 106, 82], [117, 98, 74], [109, 90, 66], [101, 83, 59], [93, 75, 51], [87, 69, 45], [75, 60, 35], [255, 231, 246], [0, 0, 63], [0, 0, 32], [0, 255, 255]
]

const templateLua = `freeslot("SKINCOLOR_(SAFENAME)")
skincolors[SKINCOLOR_(SAFENAME)] = {
	name = (NAME),
	ramp = {(RAMP)},
	invcolor = SKINCOLOR_(SAFEINV),
	invshade = (INVSHADE),
	chatcolor = V_(CHATCOLOR)MAP,
	accessible = true
}`

function colorDist(color1, color2) {
    return Math.hypot(color1[0] - color2[0], color1[1] - color2[1], color1[2] - color2[2])
}

function closestPaletteId(color) {
    let closest = {
        id: -1,
        dist: 9999
    }
    palette.forEach((pcolor, pid) => {
        let dist = colorDist(pcolor, color)
        if (dist < closest.dist) {
            closest.id = pid
            closest.dist = dist
        }
    })
    return closest.id
}

let currentRamp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

/** @param {string} name */
function scrubName(name) {
    return name.toUpperCase().replaceAll(/[^A-Za-z0-9_\- ]/g, "").replaceAll(/[ -]/g, "_")
}

function updateLua() {
    let lua = templateLua

    let palname = document.getElementById("palname").value
    let invcolor = document.getElementById("invcolor").value
    let invshade = document.getElementById("invshade").value
    let chatcolor = document.getElementById("chatcolor").value

    lua = lua.replaceAll("(SAFENAME)", scrubName(palname))
    lua = lua.replace("(NAME)", JSON.stringify(palname))
    lua = lua.replace("(RAMP)", JSON.stringify(currentRamp).slice(1, -1))
    lua = lua.replace("(SAFEINV)", scrubName(invcolor))
    lua = lua.replace("(INVSHADE)", Math.min(Math.max(0, Math.floor(invshade)), 15) || 0)
    lua = lua.replace("(CHATCOLOR)", chatcolor)

    document.getElementById("lua").value = lua
}
updateLua()

function validateShadeInput(input) {
    let current = input.value
    let correct = Math.min(Math.max(0, Math.floor(current)), 15) || 0
    if (correct != current) {
        input.value = correct
        window.event.preventDefault()
    }
}

const canvas = document.getElementById("pastecanv");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

//handlers
document.addEventListener('paste', paste_auto, false);

//on paste
function paste_auto(e) {
    if (e.clipboardData) {
        var items = e.clipboardData.items;
        if (!items) return;

        var is_image = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();
                var URLObj = window.URL || window.webkitURL;
                var source = URLObj.createObjectURL(blob);
                var pastedImage = new Image();
                pastedImage.onload = function() {
                    if (pastedImage.width < 291 || pastedImage.height < 209) {
                        alert("image is too small, may not work! try opening the full resolution version");
                        //return;
                    }
                    let xshift = 0
                    let boxwidth = 99
                    let yshift = 0
                    if (pastedImage.width == 576) {
                      xshift = 462 - 183 - 1
                      yshift = 293 - 154 - 1
                      boxwidth = 108
                    }
                    ctx.drawImage(pastedImage, -xshift, -yshift);
                    let palAreaData = ctx.getImageData(
                      183, 154,
                      boxwidth, 18
                    )
                    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                    ctx.fillRect(0, 0, 999, 999);
                    //ctx.putImageData(
                    ctx.putImageData(palAreaData, 183, 154);
                    let newRamp = [];
                    let x = 184;
                    for (let y = 155; y < 171; y++) {
                        let pixel = ctx.getImageData(x, y, 1, 1);
                        newRamp.push(closestPaletteId(pixel.data.slice(0, 3)));
                    }
                    currentRamp = newRamp
                    updateLua();
                };
                pastedImage.src = source;
                e.preventDefault();
                return
            }
        }
    }
};