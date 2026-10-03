import type { Meta, StoryObj } from '@storybook/react';
import CategoryCard from "../components/cards/CategoryCard.tsx";


const meta: Meta<typeof CategoryCard> = {
    title: 'Components/CategoryCard',
    component: CategoryCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryCard>;

export const Default: Story = {
    args: {
        category: {
            id: 0,
            name: 'Category 1',
            description: 'Description of the category'
        }
    },
};

export const WithColor: Story = {
    args: {
        category: {
            id: 0,
            name: 'Category 1',
            description: 'Description of the category',
            color: '#1231fd'
        }
    },
};
