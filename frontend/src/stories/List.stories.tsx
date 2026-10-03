import type { Meta, StoryObj } from "@storybook/react";
import CustomList from "../components/list/CustomList.tsx";
import type {Category} from "../models/Category.ts";
import type {Task} from "../models/Task.ts";
import CategoryCard from "../components/cards/CategoryCard.tsx";
import TaskCard from "../components/cards/TaskCard.tsx";

const meta: Meta<typeof CustomList> = {
    title: "Components/CustomList",
    component: CustomList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomList>;

const mockCategories: Category[] = [
    {
        id: 1,
        name: "Personal",
        description: "Things to do in my free time",
        color: "#ffcc80",
    },
    {
        id: 2,
        name: "Work",
        description: "Professional and office-related tasks",
        color: "#90caf9",
    },
];

const mockTasks: Task[] = [
    {
        id: 1,
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        priority: "HIGH",
        status: "TODO",
        categoryName: "Personal",
        categoryColor: "#ffcc80",
    },
    {
        id: 2,
        title: "Prepare meeting",
        description: "Slides and notes for Monday",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        categoryName: "Work",
        categoryColor: "#90caf9",
    },
];

export const CategoryList: Story = {
    render: () => (
        <CustomList
            items={mockCategories}
            renderItem={(category) => <CategoryCard category={category} />}
        />
    ),
};

export const TaskList: Story = {
    render: () => (
        <CustomList
            items={mockTasks}
            renderItem={(task) => <TaskCard task={task} />}
        />
    ),
};

export const Empty: Story = {
    render: () => <CustomList items={[]} renderItem={() => null} />,
};
