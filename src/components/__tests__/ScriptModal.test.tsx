import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScriptModal } from '../ScriptModal';
import { createDefaultLockStateMap } from '@/utils/lockManager';

describe('ScriptModal Component', () => {
  const lockMap = createDefaultLockStateMap();
  const mockOnClose = jest.fn();

  beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-blob');
    URL.revokeObjectURL = jest.fn();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <ScriptModal isOpen={false} onClose={mockOnClose} lockStateMap={lockMap} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders modal and supports tab switching to guide tab', () => {
    render(<ScriptModal isOpen={true} onClose={mockOnClose} lockStateMap={lockMap} />);

    expect(screen.getByText('PC適用スクリプト ＆ 使い方ガイド')).toBeInTheDocument();

    const guideTab = screen.getByText(/使い方 ＆ スタートアップ登録ガイド/);
    fireEvent.click(guideTab);
    expect(screen.getByText('基本の使い方（3ステップ）')).toBeInTheDocument();
    expect(screen.getByText('PC起動時に自動で動かす（スタートアップ登録）')).toBeInTheDocument();
  });

  test('supports copy and download script buttons', async () => {
    render(<ScriptModal isOpen={true} onClose={mockOnClose} lockStateMap={lockMap} />);

    const copyBtn = screen.getByText('コードコピー');
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText('コピー完了')).toBeInTheDocument();
    });

    const downloadBtn = screen.getByText('保存 (.ahk)');
    fireEvent.click(downloadBtn);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  test('calls onClose when close button clicked', () => {
    render(<ScriptModal isOpen={true} onClose={mockOnClose} lockStateMap={lockMap} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
