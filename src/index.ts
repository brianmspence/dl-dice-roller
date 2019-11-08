import { all, create, MathJsStatic, randomInt } from 'mathjs'

function roll(num: number, sides: number) {
  if (num < 1 || sides < 1) {
    return 0
  }

  const rolls = []
  for (let i = 0; i < num; i++) {
    const r = randomInt(1, sides + 1)
    rolls.push(r)
  }
  return rolls.reduce((a, b) => a + b, 0)
}

function adv(args: any, math: any, scope: any) {
  const a = args[0].compile().evaluate(scope)
  const b = args[0].compile().evaluate(scope)
  return math.max(a, b)
}

adv.rawArgs = true

export class DiceEvaluator {
  private math: MathJsStatic

  constructor(scope?: object) {
    this.math = create(all, {}) as MathJsStatic
    this.math.import(
      {
        ...scope,
        adv,
        roll,
      },
      {},
    )
  }

  public eval(exp: string, scope: object = {}) {
    const eq = exp.replace(/(\d+)d(\d+)/g, 'roll($1,$2)')
    return this.math.evaluate(eq, scope)
  }
}
