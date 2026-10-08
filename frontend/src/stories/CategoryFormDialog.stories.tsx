import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import CategoryFormDialog from "../components/forms/CategoryFormDialog.tsx";

const meta: Meta<typeof CategoryFormDialog> = {
    title: 'Components/CategoryFormDialog',
    component: CategoryFormDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        onClose: fn(),
        onSaved: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof CategoryFormDialog>;

export const Default: Story = {};

export const Editing: Story = {
    args: {
        category: { id: 1, name: 'Work', description: 'Office stuff', color: '#1976d2' },
        onDeleted: fn(),
    },
};
