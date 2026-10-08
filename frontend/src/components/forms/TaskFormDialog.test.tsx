import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import TaskFormDialog from "./TaskFormDialog.tsx";
import {createTask} from "../../api/taskService.ts";
import type {Task} from "../../models/Task.ts";

// Mock API
vi.mock('../../api/taskService');

const categories = [
    { id: 1, name: 'Work', color: '#1976d2' },
    { id: 2, name: 'Home', color: '#43a047' },
];

beforeEach(() => vi.resetAllMocks());

function renderDialog(overrides = {}) {
    const props = { open: true, categories, onClose: vi.fn(), onSaved: vi.fn(), ...overrides };
    render(<TaskFormDialog {...props} />);
    return props;
}

test('Save is disabled until a name is typed', async () => {
    renderDialog();
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/title/i), 'Write report');

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
});

test('an empty title left save disabled', async () => {
    renderDialog();
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/title/i), ' ');

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
});

test('creation of a task with only title', async () => {
    const saved: Task = { id: 1, title: 'Wash bike', status: 'TODO'};
    vi.mocked(createTask).mockResolvedValue(saved);
    const props = renderDialog();

    await userEvent.type(screen.getByLabelText(/title/i), 'Wash bike');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(createTask).toHaveBeenCalledWith(expect.objectContaining({ title: 'Wash bike' }));
    expect(props.onSaved).toHaveBeenCalledWith(saved);
});

test('send the chosen priority', async () => {
    const saved: Task = { id: 1, title: 'Wash bike', status: 'TODO', priority: 'HIGH'};
    vi.mocked(createTask).mockResolvedValue(saved);
    const props = renderDialog();

    await userEvent.type(screen.getByLabelText(/title/i), 'Wash bike');
    await userEvent.click(screen.getByRole('combobox', { name: /priority/i }));   // opens the menu
    await userEvent.click(screen.getByRole('option', { name: 'High' }));          // choice
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));          // send

    expect(createTask).toHaveBeenCalledWith(expect.objectContaining({ title: 'Wash bike', priority: 'HIGH' }));
    expect(props.onSaved).toHaveBeenCalledWith(saved);
});

test('shows the error of the server', async () => {
    vi.mocked(createTask).mockRejectedValue(new Error('boom'));
    renderDialog();

    await userEvent.type(screen.getByLabelText(/title/i), 'Work');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
});

test('Cancel closes the dialog without saving', async () => {
    const props = renderDialog();

    await userEvent.type(screen.getByLabelText(/title/i), 'Wash bike');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(createTask).not.toHaveBeenCalled();
    expect(props.onSaved).not.toHaveBeenCalled();
});