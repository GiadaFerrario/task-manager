import type { Meta, StoryObj } from '@storybook/react';
import ChipList from "../components/chips/ChipList.tsx";


const meta: Meta<typeof ChipList> = {
    title: 'Components/ChipList',
    component: ChipList,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChipList>;

export const Default: Story = {
    args: {
        categoryName: 'Home',
        categoryColor: '#1565c0',
        priority: 'LOW',
        status: 'TODO'
    },
};
