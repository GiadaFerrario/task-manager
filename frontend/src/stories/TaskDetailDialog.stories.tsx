import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import TaskDetailDialog from "../components/forms/TaskDetailDialog.tsx";

const meta: Meta<typeof TaskDetailDialog> = {
    title: 'Components/TaskDetailDialog',
    component: TaskDetailDialog,
    tags: ['autodocs'],
    args: {
        onClose: fn(),
        onSaved: fn(),
        onDeleted: fn(),
        categories: [
            { id: 1, name: 'Work', color: '#1976d2' },
            { id: 2, name: 'Home', color: '#43a047' },
        ],
        task: {
            id: 1,
            title: 'Write report',
            description: 'Quarterly numbers for the team',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            categoryId: 1,
            categoryName: 'Work',
            categoryColor: '#1976d2',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TaskDetailDialog>;

export const Default: Story = {};

export const WithoutPriorityAndCategory: Story = {
    args: {
        task: { id: 2, title: 'Buy groceries', status: 'TODO' },
    },
};
