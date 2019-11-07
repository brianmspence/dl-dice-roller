import { all, create, randomInt } from 'mathjs';

function roll(num: number, sides: number) {
  const rolls = [];
  for (let i = 0; i < num; i++) {
    const r = randomInt(1, sides + 1);
    rolls.push(r);
  }
  return rolls.reduce((a, b) => a + b, 0);
}

function adv(args: any, math: any, scope: any) {
  const a = args[0].compile().evaluate(scope);
  const b = args[0].compile().evaluate(scope);
  return math.max(a, b);
}

adv.rawArgs = true;

// const tests = [
//   '1d20+5',
//   '1d100',
//   '1d8+2d4+5',
//   '6+6',
//   '4d9*2',
//   '4d4+int+prof',
//   'adv(1d20+5)',
//   'adv(1d20)-2'
//   ]

// tests.forEach(t =>{
//   console.log(t)
//   console.log('result: '+ calc(t))
//   console.log('---')
// })

export class DiceEvaluator {
  private math: any;

  constructor() {
    this.math = create(all, {});
    this.math.import({
      adv,
      int: 5,
      prof: 3,
      roll,
    });
  }

  public eval(exp: string) {
    const eq = exp.replace(/(\d+)d(\d+)/g, 'roll($1,$2)');
    return this.math.evaluate(eq);
  }
}
