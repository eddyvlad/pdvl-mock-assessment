import { canPassPaperA } from '../score';

test('fails if module 1 score is 24 even with perfect module 2', () => {
  expect(canPassPaperA(24, 5)).toBe(false);
});

test('requires a perfect module 2 when module 1 score is 25', () => {
  expect(canPassPaperA(25, 5)).toBe(true);
  expect(canPassPaperA(25, 4)).toBe(false);
});
