import { canPassPaperA, paperAStatusAfterModule1 } from '../score';

test('fails if module 1 score is 24 even with perfect module 2', () => {
  expect(canPassPaperA(24, 5)).toBe(false);
});

test('requires a perfect module 2 when module 1 score is 25', () => {
  expect(canPassPaperA(25, 5)).toBe(true);
  expect(canPassPaperA(25, 4)).toBe(false);
});

test('module 1 result is pending if score allows a pass with module 2', () => {
  expect(paperAStatusAfterModule1(25)).toBeNull();
});

test('module 1 result fails when pass is impossible', () => {
  expect(paperAStatusAfterModule1(24)).toBe(false);
});

test('module 1 result passes when already above pass mark', () => {
  expect(paperAStatusAfterModule1(30)).toBe(true);
});
