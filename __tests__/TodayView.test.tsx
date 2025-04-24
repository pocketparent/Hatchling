// __tests__/TodayView.test.tsx
import React from 'react';
import renderer from 'react-test-renderer';
import TodayView from '../src/screens/TodayView';

test('TodayView renders without crashing', () => {
  const tree = renderer.create(<TodayView />).toJSON();
  expect(tree).toBeTruthy();
});
