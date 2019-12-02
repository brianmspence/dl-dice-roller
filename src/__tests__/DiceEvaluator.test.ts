import { DiceEvaluator } from '..'

declare global {
  namespace jest {
    // tslint:disable-next-line
    interface Matchers<R, T> {
      toBeWithinRange(a: number, b: number): R
    }
  }
}

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

test('Simple Math', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.qe('1+1')).toBe(2)
  expect(evaluator.qe('1-1')).toBe(0)
  expect(evaluator.qe('1*2')).toBe(2)
  expect(evaluator.qe('4/2')).toBe(2)
})

test('Simple Rolls', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.qe('0d0')).toBe(0)
  expect(evaluator.qe('1d0')).toBe(0)
  expect(evaluator.qe('0d1')).toBe(0)
  expect(evaluator.qe('1d1')).toBe(1)
  expect(evaluator.qe('2d1')).toBe(2)
  expect(evaluator.qe('1d4')).toBeWithinRange(1, 4)
  expect(evaluator.qe('1d6')).toBeWithinRange(1, 6)
  expect(evaluator.qe('1d8')).toBeWithinRange(1, 8)
  expect(evaluator.qe('1d10')).toBeWithinRange(1, 10)
  expect(evaluator.qe('1d12')).toBeWithinRange(1, 12)
  expect(evaluator.qe('1d20')).toBeWithinRange(1, 20)
  expect(evaluator.qe('1d100')).toBeWithinRange(1, 100)
  expect(evaluator.qe('2d6')).toBeWithinRange(2, 12)
  expect(evaluator.qe('3d6')).toBeWithinRange(3, 18)
})

test('Roll with math', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.qe('1d1+1')).toBe(2)
  expect(evaluator.qe('2d6*0')).toBe(0)
  expect(evaluator.qe('1d20+5')).toBeWithinRange(6, 25)
})

test('Advanced Roll Functions', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.qe('adv(1d20)')).toBeWithinRange(1, 20)
  expect(evaluator.qe('adv(1d20+5)')).toBeWithinRange(6, 25)
  expect(evaluator.qe('adv(1d20)+5')).toBeWithinRange(6, 25)
})

test('Roll constants', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.qe('int+1')).toBe(3)
  expect(evaluator.qe('1d20+int')).toBeWithinRange(3, 23)
  expect(evaluator.qe('int+prof', { prof: 3 })).toBe(5)
  expect(evaluator.qe('1d20+int+prof', { prof: 3 })).toBeWithinRange(6, 26)
})

test('Simple Result', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.eval('5').result).toBe(5)
})

test('Min Result', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.eval('5').min).toBe(5)
  expect(evaluator.eval('1d6').min).toBe(1)
  expect(evaluator.eval('3d6').min).toBe(3)
  expect(evaluator.eval('1d6 -3').min).toBe(-2)
  expect(evaluator.eval('1d20+5').min).toBe(6)
  expect(evaluator.eval('1d100').min).toBe(1)
})

test('Max Result', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.eval('5').max).toBe(5)
  expect(evaluator.eval('1d6').max).toBe(6)
  expect(evaluator.eval('3d6').max).toBe(18)
  expect(evaluator.eval('3d6 -3').max).toBe(15)
  expect(evaluator.eval('1d20+5').max).toBe(25)
  expect(evaluator.eval('2d100').max).toBe(200)
})

test('Dice Face Results', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.eval('5').dice.length).toBe(0)
  expect(evaluator.eval('1d6').dice[0]).toBeWithinRange(1, 6)
  expect(evaluator.eval('6d6').dice[5]).toBeWithinRange(1, 6)
})
