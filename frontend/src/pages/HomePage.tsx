import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import type {SvgIconComponent} from "@mui/icons-material";
import {getTasks} from "../api/taskService.ts";
import {getCategories} from "../api/categoryService.ts";

type SummaryCardProps = {
    title: string;
    icon: SvgIconComponent;
    count: number | null;
    singular: string;
    plural: string;
    to: string;
    addLabel: string;
};

function SummaryCard({title, icon: Icon, count, singular, plural, to, addLabel}: SummaryCardProps) {
    return (
        <Card variant="outlined" sx={{flex: 1, borderRadius: 3}}>
            <CardContent sx={{p: 3}}>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon color="primary"/>
                        <Typography variant="h6" fontWeight={600}>{title}</Typography>
                    </Stack>
                    <Box>
                        <Typography variant="h3" fontWeight={600} lineHeight={1}>{count ?? "–"}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {count === 1 ? singular : plural}
                        </Typography>
                    </Box>
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
    const [taskCount, setTaskCount] = useState<number | null>(null);
    const [categoryCount, setCategoryCount] = useState<number | null>(null);

    // a failed request just leaves the counter as "–": the pages show the actual error
    useEffect(() => {
        getTasks().then((tasks) => setTaskCount(tasks.length)).catch(() => undefined);
        getCategories().then((categories) => setCategoryCount(categories.length)).catch(() => undefined);
    }, []);

    return (
        <Box sx={{maxWidth: 720, mx: "auto", pt: 6}}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
                Task Manager
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 4}}>
                Organize your work with tasks and categories.
            </Typography>
            <Stack direction={{xs: "column", sm: "row"}} spacing={3}>
                <SummaryCard title="Tasks" icon={TaskAltIcon} count={taskCount} singular="task" plural="tasks" to="/tasks" addLabel="+ New task"/>
                <SummaryCard title="Categories" icon={LabelOutlinedIcon} count={categoryCount} singular="category" plural="categories" to="/categories" addLabel="+ New category"/>
            </Stack>
        </Box>
    );
}
