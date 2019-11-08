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
  expect(evaluator.eval('1+1')).toBe(2)
  expect(evaluator.eval('1-1')).toBe(0)
  expect(evaluator.eval('1*2')).toBe(2)
  expect(evaluator.eval('4/2')).toBe(2)
})

test('Simple Rolls', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.eval('0d0')).toBe(0)
  expect(evaluator.eval('1d0')).toBe(0)
  expect(evaluator.eval('0d1')).toBe(0)
  expect(evaluator.eval('1d1')).toBe(1)
  expect(evaluator.eval('2d1')).toBe(2)
  expect(evaluator.eval('1d4')).toBeWithinRange(1, 4)
  expect(evaluator.eval('1d6')).toBeWithinRange(1, 6)
  expect(evaluator.eval('1d8')).toBeWithinRange(1, 8)
  expect(evaluator.eval('1d10')).toBeWithinRange(1, 10)
  expect(evaluator.eval('1d12')).toBeWithinRange(1, 12)
  expect(evaluator.eval('1d20')).toBeWithinRange(1, 20)
  expect(evaluator.eval('1d100')).toBeWithinRange(1, 100)
  expect(evaluator.eval('2d6')).toBeWithinRange(2, 12)
  expect(evaluator.eval('3d6')).toBeWithinRange(3, 18)
})

test('Roll with math', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.eval('1d1+1')).toBe(2)
  expect(evaluator.eval('2d6*0')).toBe(0)
  expect(evaluator.eval('1d20+5')).toBeWithinRange(6, 25)
})

test('Advanced Roll Functions', () => {
  const evaluator = new DiceEvaluator()
  expect(evaluator.eval('adv(1d20)')).toBeWithinRange(1, 20)
  expect(evaluator.eval('adv(1d20+5)')).toBeWithinRange(6, 25)
  expect(evaluator.eval('adv(1d20)+5')).toBeWithinRange(6, 25)
})

test('Roll constants', () => {
  const evaluator = new DiceEvaluator({ int: 2 })
  expect(evaluator.eval('int+1')).toBe(3)
  expect(evaluator.eval('1d20+int')).toBeWithinRange(3, 23)
  expect(evaluator.eval('int+prof', { prof: 3 })).toBe(5)
  expect(evaluator.eval('1d20+int+prof', { prof: 3 })).toBeWithinRange(6, 26)
})
