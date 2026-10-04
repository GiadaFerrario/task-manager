import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Alert, Box, Button, CircularProgress, Typography} from "@mui/material";
import type {Task} from "../models/Task.ts";
import type {Category} from "../models/Category.ts";
import {getTasks} from "../api/taskService.ts";
import {getCategories} from "../api/categoryService.ts";
import {getErrorMessage} from "../api/getErrorMessage.ts";
import TaskCard from "../components/cards/TaskCard.tsx";
import CustomList from "../components/list/CustomList.tsx";
import TaskFormDialog from "../components/forms/TaskFormDialog.tsx";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const dialogOpen = searchParams.get("new") === "1";

    useEffect(() => {
        Promise.all([getTasks(), getCategories()])
            .then(([loadedTasks, loadedCategories]) => {
                setTasks(loadedTasks);
                setCategories(loadedCategories);
            })
            .catch((e) => setError(getErrorMessage(e, "Unable to load tasks")))
            .finally(() => setLoading(false));
    }, []);

    const openDialog = () => setSearchParams({new: "1"});
    const closeDialog = () => setSearchParams({});

    const handleSaved = (task: Task) => {
        setTasks((current) => [...current, task]);
        closeDialog();
    };

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} sx={{width: "33vw"}}>
                <Typography variant="h5">Tasks</Typography>
                <Button variant="contained" onClick={openDialog}>Add Task</Button>
            </Box>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {loading
                ? <CircularProgress/>
                : <CustomList items={tasks} renderItem={(task) => <TaskCard task={task}/>}/>}
            <TaskFormDialog open={dialogOpen} categories={categories} onClose={closeDialog} onSaved={handleSaved}/>
        </>
    );
}
