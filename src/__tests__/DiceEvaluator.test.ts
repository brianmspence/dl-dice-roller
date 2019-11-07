import { DiceEvaluator } from '../index';

test('Dice Evaluatore', () => {
  const evaluator = new DiceEvaluator();
  expect(evaluator.eval('1+1')).toBe(2);
});
