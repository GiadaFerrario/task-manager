import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
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
            <Box sx={{textAlign: "center", color: "text.secondary", py: 8}}>
                <InboxOutlinedIcon sx={{fontSize: 48, opacity: 0.5}} />
                <Typography variant="body1">No items to display</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{display: "grid", gap, gridTemplateColumns: {xs: "1fr", md: "repeat(2, 1fr)"}}}>
            {items.map((item, index) => (
                <Box key={index}>{renderItem(item, index)}</Box>
            ))}
        </Box>
    );
}
