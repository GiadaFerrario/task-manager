import { Box } from "@mui/material";
import React from "react";

type CustomListProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    gap?: number;
};

export default function CustomList<T>({
                                           items,
                                           renderItem,
                                           gap = 2,
                                       }: CustomListProps<T>) {
    if (!items || items.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    py: 3,
                    fontStyle: "italic",
                }}
            >
                No items to display
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={gap} sx={{width: "33vw"}}>
            {items.map((item, index) => (
                <Box key={index}>{renderItem(item, index)}</Box>
            ))}
        </Box>
    );
}
