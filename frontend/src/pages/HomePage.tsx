import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import type {SvgIconComponent} from "@mui/icons-material";
import {getTasks} from "../api/taskService.ts";
import {getCategories} from "../api/categoryService.ts";
import type {Task} from "../models/Task.ts";
import {Status, STATUS_LABELS} from "../models/Status.ts";

type SummaryCardProps = {
    title: string;
    icon: SvgIconComponent;
    count: number | null;
    singular: string;
    plural: string;
    to: string;
    addLabel: string;
    children?: React.ReactNode;
};

const STATUS_COLORS: Record<Status, string> = {
    [Status.TODO]: "error.main",
    [Status.IN_PROGRESS]: "warning.main",
    [Status.DONE]: "success.main",
};

function StatusBreakdown({tasks}: {tasks: Task[]}) {
    if (tasks.length === 0) return null;
    return (
        <Box>
            <Box sx={{display: "flex", height: 8, borderRadius: 4, overflow: "hidden", bgcolor: "action.hover"}}>
                {Object.values(Status).map((status) => (
                    <Box
                        key={status}
                        sx={{width: `${(tasks.filter((t) => t.status === status).length / tasks.length) * 100}%`, bgcolor: STATUS_COLORS[status]}}
                    />
                ))}
            </Box>
            <Stack direction="row" spacing={2} sx={{mt: 1}} useFlexGap flexWrap="wrap">
                {Object.values(Status).map((status) => (
                    <Stack key={status} direction="row" spacing={0.75} alignItems="center">
                        <Box sx={{width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLORS[status]}}/>
                        <Typography variant="caption" color="text.secondary">
                            {STATUS_LABELS[status]} {tasks.filter((t) => t.status === status).length}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

function SummaryCard({title, icon: Icon, count, singular, plural, to, addLabel, children}: SummaryCardProps) {
    return (
        <Card sx={{flex: 1, borderRadius: 4}}>
            <CardContent sx={{p: 3}}>
                <Stack spacing={2.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={(theme) => ({
                                width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center",
                                color: "primary.main",
                                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            })}
                        >
                            <Icon/>
                        </Box>
                        <Typography variant="h6">{title}</Typography>
                    </Stack>
                    <Box>
                        <Typography variant="h2" fontWeight={700} lineHeight={1}>{count ?? "–"}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                            {count === 1 ? singular : plural}
                        </Typography>
                    </Box>
                    {children}
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" component={Link} to={to}>View all</Button>
                        <Button variant="outlined" component={Link} to={`${to}?new=1`}>{addLabel}</Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function HomePage() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [categoryCount, setCategoryCount] = useState<number | null>(null);

    // a failed request just leaves the counter as "–": the pages show the actual error
    useEffect(() => {
        getTasks().then(setTasks).catch(() => undefined);
        getCategories().then((categories) => setCategoryCount(categories.length)).catch(() => undefined);
    }, []);

    return (
        <Box>
            <Typography variant="h3" gutterBottom>
                Task Manager
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 4}}>
                Organize your day with tasks and categories.
            </Typography>
            <Stack direction={{xs: "column", sm: "row"}} spacing={3}>
                <SummaryCard title="Tasks" icon={TaskAltIcon} count={tasks?.length ?? null} singular="task" plural="tasks" to="/tasks" addLabel="+ New task">
                    {tasks && <StatusBreakdown tasks={tasks}/>}
                </SummaryCard>
                <SummaryCard title="Categories" icon={LabelOutlinedIcon} count={categoryCount} singular="category" plural="categories" to="/categories" addLabel="+ New category"/>
            </Stack>
        </Box>
    );
}
