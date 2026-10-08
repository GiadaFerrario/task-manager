import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import CategoryFormDialog from './CategoryFormDialog';
import { createCategory } from '../../api/categoryService';

// Mock api
vi.mock('../../api/categoryService');

beforeEach(() => vi.resetAllMocks());

test('Save is disabled until a name is typed', async () => {
    render(<CategoryFormDialog open onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/name/i), 'Work');

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
});

test('sends the trimmed name and reports the saved category', async () => {
    const saved = { id: 1, name: 'Work', color: '#1976d2' };
    vi.mocked(createCategory).mockResolvedValue(saved);
    const onSaved = vi.fn();
    render(<CategoryFormDialog open onClose={vi.fn()} onSaved={onSaved} />);

    await userEvent.type(screen.getByLabelText(/name/i), '  Work  ');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(createCategory).toHaveBeenCalledWith(expect.objectContaining({ name: 'Work' }));
    expect(onSaved).toHaveBeenCalledWith(saved);
});

test('shows the error of the server', async () => {
    vi.mocked(createCategory).mockRejectedValue(new Error('boom'));
    render(<CategoryFormDialog open onClose={vi.fn()} onSaved={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Work');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
});