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

export class DiceEvaluator {
  private math: MathJsStatic
  private dice: number[]

  constructor(scope?: object) {
    this.dice = []
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
    const eq = exp.replace(/(\d+)d(\d+)/g, 'roll($1,$2)')
    const result = this.math.evaluate(eq, scope)

    const minEq = exp.replace(/(\d+)d(\d+)/g, '$1')
    const min = this.math.evaluate(minEq, scope)

    const maxEq = exp.replace(/(\d+)d(\d+)/g, '($1*$2)')
    const max = this.math.evaluate(maxEq, scope)

    const dice: number[] = this.dice.slice()

    return {
      dice,
      max,
      min,
      result,
    }
  }

  public qe(exp: string, scope: object = {}) {
    return this.eval(exp, scope).result
  }

  private roll = (num: number, sides: number) => {
    if (num < 1 || sides < 1) {
      return 0
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
