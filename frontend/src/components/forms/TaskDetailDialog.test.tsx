import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import TaskDetailDialog from './TaskDetailDialog';
import type { Task } from '../../models/Task';
import { deleteTask, updateTask } from "../../api/taskService.ts";

vi.mock('../../api/taskService');

const categories = [
    { id: 1, name: 'Work', color: '#1976d2' },
    { id: 2, name: 'Home', color: '#43a047' },
];

const task: Task = {
    id: 7,
    title: 'Write report',
    description: 'Draft',
    status: 'TODO',
    priority: 'HIGH',
    categoryId: 1,
    categoryName: 'Work',
    categoryColor: '#1976d2',
};

beforeEach(() => vi.resetAllMocks());

function renderDialog(overrides = {}) {
    const props = { task, categories, onClose: vi.fn(), onSaved: vi.fn(), onDeleted: vi.fn(), ...overrides };
    render(<TaskDetailDialog {...props} />);
    return props;
}

test('shows the current values of the task', () => {
    renderDialog();

    expect(screen.getByRole('heading', { name: 'Write report' })).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toHaveValue('Draft');
    expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('To do');
    expect(screen.getByRole('combobox', { name: /priority/i })).toHaveTextContent('High');
    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent('Work');
});

test('Save changes is disabled until something changes', async () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/description/i), ' - reviewed');

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
});

test('Changing status to DONE the right status is sent', async () => {
    const saved: Task = { ...task, status: 'DONE' };   // what the server answers
    vi.mocked(updateTask).mockResolvedValue(saved);
    const props = renderDialog();

    await userEvent.click(screen.getByRole('combobox', { name: /status/i }));   // opens the menu
    await userEvent.click(screen.getByRole('option', { name: 'Done' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateTask).toHaveBeenCalledWith(task.id, expect.objectContaining({ title: 'Write report', status: 'DONE', priority: 'HIGH' }));
    expect(props.onSaved).toHaveBeenCalledWith(saved);
});

test('saves a changed description', async () => {
    const saved: Task = { ...task, description: 'Draft - reviewed' };
    vi.mocked(updateTask).mockResolvedValue(saved);
    const props = renderDialog();

    await userEvent.type(screen.getByLabelText(/description/i), ' - reviewed');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateTask).toHaveBeenCalledWith(task.id, expect.objectContaining({ description: 'Draft - reviewed' }));
    expect(props.onSaved).toHaveBeenCalledWith(saved);
});

test('choosing None as priority sends no priority', async () => {
    vi.mocked(updateTask).mockResolvedValue({ ...task, priority: null });
    renderDialog();

    await userEvent.click(screen.getByRole('combobox', { name: /priority/i }));
    await userEvent.click(screen.getByRole('option', { name: 'None' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    // calls[0] = [id, payload]
    expect(vi.mocked(updateTask).mock.calls[0][1].priority).toBeUndefined();
});

test('choosing None as category sends no category', async () => {
    vi.mocked(updateTask).mockResolvedValue({ ...task, categoryId: null });
    renderDialog();

    await userEvent.click(screen.getByRole('combobox', { name: /category/i }));
    await userEvent.click(screen.getByRole('option', { name: 'None' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(vi.mocked(updateTask).mock.calls[0][1].categoryId).toBeUndefined();
});

test('shows the error of the server when saving fails', async () => {
    vi.mocked(updateTask).mockRejectedValue(new Error('boom'));
    const props = renderDialog();

    await userEvent.type(screen.getByLabelText(/description/i), ' - reviewed');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(props.onSaved).not.toHaveBeenCalled();
});

test('Close calls onClose without saving', async () => {
    const props = renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(updateTask).not.toHaveBeenCalled();
});

test('deletes the task after the confirmation', async () => {
    vi.mocked(deleteTask).mockResolvedValue(undefined);
    const props = renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const confirmation = screen.getByRole('dialog', { name: 'Delete task' });
    expect(confirmation).toHaveTextContent('Delete "Write report"? This cannot be undone.');
    expect(deleteTask).not.toHaveBeenCalled();   // nothing happens until the user confirms

    await userEvent.click(within(confirmation).getByRole('button', { name: 'Delete' }));

    expect(deleteTask).toHaveBeenCalledWith(task.id);
    expect(props.onDeleted).toHaveBeenCalledWith(task.id);
});

test('cancelling the confirmation keeps the task', async () => {
    const props = renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const confirmation = screen.getByRole('dialog', { name: 'Delete task' });
    await userEvent.click(within(confirmation).getByRole('button', { name: 'Cancel' }));

    expect(deleteTask).not.toHaveBeenCalled();
    expect(props.onDeleted).not.toHaveBeenCalled();
});

test('shows an error in the confirmation when the deletion fails', async () => {
    vi.mocked(deleteTask).mockRejectedValue(new Error('boom'));
    const props = renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const confirmation = screen.getByRole('dialog', { name: 'Delete task' });
    await userEvent.click(within(confirmation).getByRole('button', { name: 'Delete' }));

    expect(await within(confirmation).findByRole('alert')).toBeInTheDocument();
    expect(props.onDeleted).not.toHaveBeenCalled();
});
