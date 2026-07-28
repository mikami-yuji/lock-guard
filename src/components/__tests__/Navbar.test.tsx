import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '../Navbar';

// next/navigation の usePathname モック
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar Component', () => {
  test('renders logo title and navigation links', () => {
    render(<Navbar />);

    expect(screen.getByText('Lock Guard')).toBeInTheDocument();
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('プロファイル管理')).toBeInTheDocument();
    expect(screen.getByText('OS統合スクリプト')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
  });
});
