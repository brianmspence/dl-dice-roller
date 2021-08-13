import { all, create, MathJsStatic, randomInt } from 'mathjs'

function adv(args: any, math: any, scope: any) {
  const a = args[0].compile().evaluate(scope)
  const b = args[0].compile().evaluate(scope)
  return math.max(a, b)
}

function dis(args: any, math: any, scope: any) {
  const a = args[0].compile().evaluate(scope)
  const b = args[0].compile().evaluate(scope)
  return math.min(a, b)
}

dis.rawArgs = true
adv.rawArgs = true

const NUM_D_SIDES_REGEX = /(\d+\.?\d*)d(\d+\.?\d*)/g

export class DiceEvaluator {
  private math: MathJsStatic
  private dice: number[]
  private isMin: boolean
  private isMax: boolean

  constructor(scope?: object) {
    this.dice = []
    this.isMax = false
    this.isMin = false
    this.math = create(all, {}) as MathJsStatic
    this.math.import(
      {
        ...scope,
        adv,
        dis,
        roll: this.roll,
      },
      {},
    )
  }

  public eval(exp: string, scope: object = {}) {
    this.dice = []
    this.isMin = false
    this.isMax = false

    const readyExp = exp.replace(NUM_D_SIDES_REGEX, 'roll($1,$2)')
    const p = this.math.parse(readyExp)

    // This evaluates each roll seperately and keeps track of the results
    // Note: prettier having issues with optional chaining  '?.'
    // prettier-ignore
    const tp = p.transform((n: any) => {
      if (n.isFunctionNode) {
        if (n.name === 'roll') {
          const args = n.args?.map((v: any) => {
            return v.compile().evaluate(scope)
          })
          if(args) {
            const numDice = args[0]
            const numSides = args[1]
            const rolls: number[] = []
            if(numDice === 0) {
              const roll = this.math.evaluate('roll(0, ' + numSides + ')')
              rolls.push(roll as number)
            } else {
              for (let index = 0; index < numDice; index++) {
                const roll = this.math.evaluate('roll(1, ' + numSides + ')')
                rolls.push(roll as number)
              }
            }
            const x = rolls.join('+')
            return this.math.parse(x)
          }
        }
      }
      if (n.isSymbolNode) {
        const x = n.compile().evaluate(scope)
        if (typeof x === 'number') {
          return this.math.parse(x + '')
        }
      }
      return n
    })

    const rolledEquation = tp.toString()

    const result = tp.compile().evaluate(scope)

    this.isMin = true
    const min = this.math.evaluate(readyExp, scope)
    this.isMin = false

    this.isMax = true
    const max = this.math.evaluate(readyExp, scope)
    this.isMax = false

    const dice: number[] = this.dice.slice()

    return {
      dice,
      max,
      min,
      result,
      rolledEquation,
    }
  }

  public qe(exp: string, scope: object = {}) {
    return this.eval(exp, scope).result
  }

  private roll = (num: number, sides: number) => {
    if (num < 1 || sides < 1) {
      this.dice.push(0)
      return 0
    }

    if (this.isMin) {
      return num
    }

    if (this.isMax) {
      return num * sides
    }

    const rolls = []
    for (let i = 0; i < num; i++) {
      const r = randomInt(1, sides + 1)
      this.dice.push(r)
      rolls.push(r)
    }

    return rolls.reduce((a, b) => a + b, 0)
  }
}
