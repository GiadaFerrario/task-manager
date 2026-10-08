import type {Task} from "../../models/Task.ts";
import type {Status} from "../../models/Status.ts";
import type {Priority} from "../../models/Priority.ts";
import {Card, CardContent, Typography} from "@mui/material";
import ChipList from "../chips/ChipList.tsx";

type TaskCardProps = {
    task: Task;
    onClick?: () => void;
    onStatusChange?: (status: Status) => void;
    onPriorityChange?: (priority: Priority) => void;
};

export default function TaskCard(props: TaskCardProps) {

    return (
        <Card
            variant="outlined"
            onClick={props.onClick}
            sx={{
                borderRadius: 2,
                cursor: props.onClick ? "pointer" : "default",
                transition: "0.2s ease-in-out",
                "&:hover": {
                    boxShadow: 2,
                    transform: "translateY(-1px)",
                },
            }}>
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                >
                    {props.task.title}
                </Typography>
                <Typography variant="body2" sx={{marginBottom: "10px"}}>
                    {props.task.description}
                </Typography>
                <ChipList
                    categoryColor={props.task.categoryColor}
                    categoryName={props.task.categoryName}
                    status={props.task.status}
                    priority={props.task.priority}
                    onStatusChange={props.onStatusChange}
                    onPriorityChange={props.onPriorityChange}
                />
            </CardContent>
            {/*<CardActions sx={{ marginTop: "auto" }}>
                <CardButton size="small" sx={{color: logoGreen}} onClick={() => {
                    // TODO open a popup
                }}>More details</CardButton>
            </CardActions>*/}
        </Card>
    )
}