import type {Task} from "../../models/Task.ts";
import {Card, CardContent, Typography} from "@mui/material";
import ChipList from "../chips/ChipList.tsx";

export default function TaskCard(props: {task: Task}) {

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
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
                <ChipList categoryColor={props.task.categoryColor} categoryName={props.task.categoryName} status={props.task.status} priority={props.task.priority}/>
            </CardContent>
            {/*<CardActions sx={{ marginTop: "auto" }}>
                <CardButton size="small" sx={{color: logoGreen}} onClick={() => {
                    // TODO open a popup
                }}>More details</CardButton>
            </CardActions>*/}
        </Card>
    )
}