import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileSelector } from '../ProfileSelector';
import { getDefaultProfiles } from '@/utils/lockManager';

describe('ProfileSelector Component', () => {
  const profiles = getDefaultProfiles();
  const mockOnSelectProfile = jest.fn();

  test('renders all profile items', () => {
    render(
      <ProfileSelector
        profiles={profiles}
        activeProfileId="default"
        onSelectProfile={mockOnSelectProfile}
      />
    );

    expect(screen.getByText('標準ガードプロファイル')).toBeInTheDocument();
    expect(screen.getByText('ゲーミングモード')).toBeInTheDocument();
    expect(screen.getByText('文書作成・タイピング集中モード')).toBeInTheDocument();
  });

  test('triggers callback on profile click', () => {
    render(
      <ProfileSelector
        profiles={profiles}
        activeProfileId="default"
        onSelectProfile={mockOnSelectProfile}
      />
    );

    const gamingProfile = screen.getByText('ゲーミングモード');
    fireEvent.click(gamingProfile);
    expect(mockOnSelectProfile).toHaveBeenCalledWith(profiles[1]);
  });
});
