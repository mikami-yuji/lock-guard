import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LockCard } from '../LockCard';
import { LockKeyConfig } from '@/types';

describe('LockCard Component', () => {
  const mockConfig: LockKeyConfig = {
    id: 'NumLock',
    name: 'NumLock',
    description: 'テンキー数値入力を制御',
    isCurrentlyActive: true,
    mode: 'force_on',
    preventAccidentalPress: true,
    soundAlertEnabled: true,
  };

  const mockOnModeChange = jest.fn();
  const mockOnToggleActive = jest.fn();

  test('renders Lock key details correctly', () => {
    render(
      <LockCard
        config={mockConfig}
        onModeChange={mockOnModeChange}
        onToggleActive={mockOnToggleActive}
      />
    );

    expect(screen.getByText('NumLock')).toBeInTheDocument();
    expect(screen.getByText('テンキー数値入力を制御')).toBeInTheDocument();
    expect(screen.getAllByText('ON固定').length).toBeGreaterThan(0);
  });

  test('triggers callback when mode button clicked', () => {
    render(
      <LockCard
        config={mockConfig}
        onModeChange={mockOnModeChange}
        onToggleActive={mockOnToggleActive}
      />
    );

    const blockBtn = screen.getByText('遮断');
    fireEvent.click(blockBtn);
    expect(mockOnModeChange).toHaveBeenCalledWith('NumLock', 'blocked');
  });

  test('renders blocked badge when mode is blocked', () => {
    const blockedConfig: LockKeyConfig = {
      ...mockConfig,
      mode: 'blocked',
    };

    render(
      <LockCard
        config={blockedConfig}
        onModeChange={mockOnModeChange}
        onToggleActive={mockOnToggleActive}
      />
    );

    expect(screen.getByText('完全遮断')).toBeInTheDocument();
  });
});
