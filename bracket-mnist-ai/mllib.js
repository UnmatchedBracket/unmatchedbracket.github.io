function randint(a, b) {
    return Math.floor(Math.random() * (b-a)) + a
}

class Cortex {
    /** @type {number[]} */
    inputs = [];

    /** @type {MLNode[]} */
    nodes = [];

    /** @type {number} */
    inputcount = 0;
    /** @type {number} */
    outputcount = 0;

    constructor (inputcount, outputcount, noinitnodes) {
        this.inputcount = inputcount
        this.outputcount = outputcount
        this.inputs = [...Array(inputcount)].map(_ => 0)
        if (!noinitnodes) {
            let inpnodes = [...Array(inputcount).keys()].map(x => new InputNode(this, x))
            let outnodes = [...Array(outputcount).keys()].map(x => new SigmoidNode(this, x+inputcount))
            this.nodes = [...inpnodes, ...outnodes]
        }
    }

    process () {
        this.nodes.map(node => node.reset())

        let outstart = this.nodes.length - this.outputcount
        return [...Array(this.outputcount).keys()].map(i => this.nodes[outstart + i].output());
    }

    testProcess () {
        console.log(this.inputs.map(x => x.toFixed(3)).join(", "))
        console.log(" ".repeat(Math.floor(this.inputcount*3.5)) + "v")
        console.log(this.process().map(x => x.toFixed(3)).join(", "))
    }

    testProcessShort () {
        console.log(
            this.inputs.map(x => x.toFixed(2)).join(", "),
            ">",
            this.process().map(x => x.toFixed(2)).join(", ")
        )
    }

    tojson () {
        return {
            nodes: this.nodes.map(node => node.tojson()),
            inputcount: this.inputcount,
            outputcount: this.outputcount
        }
    }

    copy () {
        return cortexfromjson(this.tojson())
    }

    confuse() {
        let confusions = 1 + Math.random() * Math.ceil(this.nodes.length / 5)
        for (let i = 0; i < confusions; i++) {
            if (Math.random() < 0.9) { // node confusion
                this.nodes[randint(this.inputcount, this.nodes.length)].confuse()
            } else if (Math.random() < 0.6 || this.nodes.length <= (this.inputcount + this.outputcount)) { // new node
                let ind = randint(this.inputcount, this.nodes.length-this.outputcount)
                let node = new SigmoidNode(this, ind)
                this.nodes.forEach(node => node.accountForNew?.(ind))
                this.nodes.splice(ind, 0, node)
            } else { // delete node
                let ind = randint(this.inputcount, this.nodes.length-this.outputcount)
                this.nodes.forEach(node => node.accountForDeleted?.(ind))
                this.nodes.splice(ind, 1)
            }
        }
    }
}

function nodefromjson(cortex, json) {
    switch (json.type) {
        case "sigmoid":
            let node = new SigmoidNode(cortex, json.index)
            node.weights = json.weights
            node.midpoint = json.midpoint
            return node
        case "input":
            return new InputNode(cortex, json.index)
    }
}

function cortexfromjson(json) {
    let cortex = new Cortex(
        json.inputcount, json.outputcount, true
    )
    cortex.nodes = json.nodes.map(x => nodefromjson(cortex, x))
    return cortex
}

class MLNode {
    /** @type {Cortex} */
    cortex = null;

    constructor (cortex) {
        this.cortex = cortex;
    }

    #cache = null;

    /**
     * Get the output of this node.
     * @returns {number}
     */
    output () {
        if (this.#cache == null) {
            this.#cache = this.calc()
        }
        return this.#cache;
    }

    calc () {
        return 1;
    }

    reset () {
        this.#cache = null;
    }

    tojson () {
        throw Error("`tojson` not implemented for this node type")
    }
}

class InputNode extends MLNode {
    /** @type {number} */
    index = 0;

    constructor (cortex, index) {
        super(cortex);
        this.index = index;
    }

    calc () {
        return this.cortex.inputs[this.index] || 0;
    }

    tojson () {
        return {
            type: "input",
            index: this.index
        }
    }
}

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function randn_bm(std, mean) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) * std + mean;
}

class SigmoidNode extends MLNode {
    /** @type {number} */
    index = 0;
    /** @type {number} */
    midpoint = 0;
    /** @type {number[]} */
    weights = [];

    constructor (cortex, index) {
        super(cortex);
        this.index = index;
        this.weights = [...Array(index)].map(_ => Math.random() - 0.5)
        this.midpoint = Math.random() - 0.5
    }

    calc () {
        let weight = (
            this.cortex.nodes.slice(0, this.index)
            .map((node, ind) => node.output() * this.weights[ind])
            .reduce((x,y) => x+y, 0)
        );
        // if (this.index != this.cortex.nodes.indexOf(this)) {
        //     globalThis.issue = this
        //     throw Error("node has incorrect index in cortex")
        // }
        // if (this.index != this.weights.length) {
        //     globalThis.issue = this
        //     throw Error(`node ${this.index} has incorrect weights amount ${this.weights.length}`)
        // }
        return sigmoid(weight - this.midpoint);
    }

    tojson () {
        return {
            type: "sigmoid",
            index: this.index,
            weights: [...this.weights],
            midpoint: this.midpoint
        }
    }

    confuse() {
        if (Math.random() > 0.5) {
            this.weights = this.weights.map(w => {
                if (Math.random() > 0.95) {
                    return randn_bm(0.3, w*0.95)
                }
            })
        } else {
            this.midpoint = randn_bm(0.6, this.midpoint*0.9)
        }
    }

    accountForNew(ind) {
        if (this.index >= ind) {
            this.weights.splice(ind, 0, 0)
            this.index += 1
        }
    }

    accountForDeleted(ind) {
        if (this.index > ind) {
            this.weights.splice(ind, 1)
            this.index -= 1
        }
    }
}

class Pool {
    /** @type {Cortex[]} */
    cortexes = []

    /** @type {number} */
    cortexcount = 0

    constructor (inputcount, outputcount, cortexcount) {
        this.cortexcount = cortexcount
        this.cortexes = [...Array(cortexcount)].map(x => new Cortex(inputcount, outputcount))
    }

    /**
     * @callback Poolfitness
     * @param {Cortex} cortex The cortex to test
     * @returns {number}
     */

    /** @type {Poolfitness} */
    fitness = () => {throw new Error("no fitness function specified - set the .fitness property of the Pool");}

    /** @type {number} */
    iterations = 0

    /** @type {number} */
    keepPortion = 0.4

    tick () {
        this.cortexes.forEach(x => {
            if (x.tmp_fitness_time) {
                x.tmp_fitness_time--
                return x.tmp_fitness
            } else {
                x.tmp_fitness_time = 3
                x.tmp_fitness = this.fitness(x)
            }
        })
        this.cortexes.sort((a,b) => b.tmp_fitness - a.tmp_fitness)
        this.cortexes = this.cortexes.slice(0, Math.ceil(this.cortexcount * this.keepPortion))
        let i = 0
        for (; this.cortexes.length < this.cortexcount; i++) {
            let newCortex = this.cortexes[i].copy()
            newCortex.confuse()
            this.cortexes.push(newCortex)
        }
        this.iterations++
    }

    tojson () {
        return {
            cortexes: this.cortexes.map(x => x.tojson()),
            cortexcount: this.cortexcount,
            iterations: this.iterations,
            keepPortion: this.keepPortion
        }
    }
}

/** @param {Pool} json */
function poolfromjson(json) {
    let pool = new Pool(0, 0, 0)
    pool.cortexcount = json.cortexcount
    pool.iterations = json.iterations
    pool.keepPortion = json.keepPortion
    pool.cortexes = json.cortexes.map(x => cortexfromjson(x))
    return pool
}

let pool = new Pool(2, 1, 100)

/** @type {Poolfitness} */
pool.fitness = function (c) {
    let score = 0, score2=0
    for (i=0; i < 4; i++) {
        c.inputs = [
            (i >= 2) ? 1 : 0,
            (i % 2) ? 1 : 0
        ]
        let correctOutput = Math.abs(c.inputs[0] - c.inputs[1])
        let out = c.process()
        score = Math.max(score, Math.abs(out[0] - correctOutput))
        score2 += Math.abs(out[0] - correctOutput)/4
    }
    return -(score + score2) / 2
}

/*
w = 100
h = 100
ppm = `P3\n${w} ${h}\n255\n`
for (y=0; y<100;y++) {
    for (x=0; x<100;x++) {
        c.inputs = [x/33-1, y/33-1]
        b = Math.floor(c.process()[0]*255.99)
        console.log(c.inputs)
        ppm += `${b}\n${b}\n${b}\n`
    }
}
require("fs").writeFileSync("c.ppm", ppm)
*/

window.mllib = {
    Cortex, InputNode, SigmoidNode, Pool,
    cortexfromjson, poolfromjson
}