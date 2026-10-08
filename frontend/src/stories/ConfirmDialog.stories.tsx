import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import ConfirmDialog from "../components/dialogs/ConfirmDialog.tsx";

const meta: Meta<typeof ConfirmDialog> = {
    title: 'Components/ConfirmDialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        title: 'Delete task',
        message: 'Delete "Write report"? This cannot be undone.',
        onConfirm: fn(() => Promise.resolve()),
        onCancel: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {};

export const Failing: Story = {
    args: { onConfirm: () => Promise.reject(new Error('boom')) },
};
