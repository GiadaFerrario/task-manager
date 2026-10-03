import type { Meta, StoryObj } from '@storybook/react';
import TaskCard from "../components/cards/TaskCard.tsx";


const meta: Meta<typeof TaskCard> = {
    title: 'Components/TaskCard',
    component: TaskCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
    args: {
        task: {
            id: 0,
            title: 'Task 1',
            description: 'Description of the task',
            categoryName: 'Home',
            priority: 'LOW',
            status: 'TODO'
        }
    },
};
