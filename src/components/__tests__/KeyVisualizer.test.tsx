import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeyVisualizer } from '../KeyVisualizer';
import { createDefaultLockStateMap } from '@/utils/lockManager';

describe('KeyVisualizer Component', () => {
  const lockMap = createDefaultLockStateMap();

  test('renders KeyVisualizer title and keyboard capture text', () => {
    render(<KeyVisualizer lockStateMap={lockMap} />);

    expect(screen.getByText('キー入力リアルタイムガード')).toBeInTheDocument();
    expect(screen.getByText('直近に検知した物理キー:')).toBeInTheDocument();
  });

  test('captures keydown event and updates last pressed key', () => {
    render(<KeyVisualizer lockStateMap={lockMap} />);

    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });
    expect(screen.getByText('a (KeyA)')).toBeInTheDocument();
  });

  test('evaluates key guard when CapsLock is pressed', () => {
    render(<KeyVisualizer lockStateMap={lockMap} />);

    fireEvent.keyDown(window, { key: 'CapsLock', code: 'CapsLock' });
    expect(screen.getByText(/CapsLock \(CapsLock\)/)).toBeInTheDocument();
    expect(screen.getByText(/無効化されています/)).toBeInTheDocument();
  });
});
