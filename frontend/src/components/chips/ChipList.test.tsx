import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import ChipList from './ChipList';

test('choosing another status calls onStatusChange', async () => {
    const onStatusChange = vi.fn();
    render(<ChipList status="TODO" onStatusChange={onStatusChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'To do' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Done' }));

    expect(onStatusChange).toHaveBeenCalledWith('DONE');
});

test('choosing the current status does nothing', async () => {
    const onStatusChange = vi.fn();
    render(<ChipList status="TODO" onStatusChange={onStatusChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'To do' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'To do' }));

    expect(onStatusChange).not.toHaveBeenCalled();
});