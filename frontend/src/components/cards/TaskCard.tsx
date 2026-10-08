import type {Task} from "../../models/Task.ts";
import type {Status} from "../../models/Status.ts";
import {Status as StatusValue} from "../../models/Status.ts";
import type {Priority} from "../../models/Priority.ts";
import {Box, Card, CardContent, Typography} from "@mui/material";
import ChipList from "../chips/ChipList.tsx";

type TaskCardProps = {
    task: Task;
    onClick?: () => void;
    onStatusChange?: (status: Status) => void;
    onPriorityChange?: (priority: Priority) => void;
};

export default function TaskCard(props: TaskCardProps) {
    const done = props.task.status === StatusValue.DONE;

    return (
        <Card
            onClick={props.onClick}
            sx={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
                cursor: props.onClick ? "pointer" : "default",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": props.onClick ? {
                    boxShadow: "0 8px 24px rgba(27, 24, 48, 0.12)",
                    transform: "translateY(-2px)",
                } : undefined,
            }}>
            <Box
                aria-hidden
                sx={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: 4,
                    bgcolor: props.task.categoryColor || "divider",
                }}
            />
            <CardContent sx={{pl: 3, opacity: done ? 0.7 : 1}}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color={done ? "text.secondary" : "text.primary"}
                    sx={{textDecoration: done ? "line-through" : "none"}}
                >
                    {props.task.title}
                </Typography>
                {props.task.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {props.task.description}
                    </Typography>
                )}
                <Box sx={{mt: 1.5}}>
                    <ChipList
                        categoryColor={props.task.categoryColor}
                        categoryName={props.task.categoryName}
                        status={props.task.status}
                        priority={props.task.priority}
                        onStatusChange={props.onStatusChange}
                        onPriorityChange={props.onPriorityChange}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}
