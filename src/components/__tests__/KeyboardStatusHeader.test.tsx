import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeyboardStatusHeader } from '../KeyboardStatusHeader';
import { createDefaultLockStateMap } from '@/utils/lockManager';

describe('KeyboardStatusHeader Component', () => {
  const lockMap = createDefaultLockStateMap();

  test('renders logo title and key status indicators', () => {
    render(<KeyboardStatusHeader lockStateMap={lockMap} />);

    expect(screen.getByText('LOCK GUARD')).toBeInTheDocument();
  });
});
