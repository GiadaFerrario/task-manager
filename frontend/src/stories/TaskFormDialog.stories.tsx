import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import TaskFormDialog from "../components/forms/TaskFormDialog.tsx";

const meta: Meta<typeof TaskFormDialog> = {
    title: 'Components/TaskFormDialog',
    component: TaskFormDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        onClose: fn(),
        onSaved: fn(),
        categories: [
            { id: 1, name: 'Work', color: '#1976d2' },
            { id: 2, name: 'Home', color: '#43a047' },
        ],
    },
};

export default meta;
type Story = StoryObj<typeof TaskFormDialog>;

export const Default: Story = {};

export const WithoutCategories: Story = {
    args: { categories: [] },
};
