import {useState} from "react";
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from "@mui/material";
import type {Task} from "../../models/Task.ts";
import type {Category} from "../../models/Category.ts";
import {Priority, PRIORITY_LABELS} from "../../models/Priority.ts";
import {Status, STATUS_LABELS} from "../../models/Status.ts";
import {updateTask} from "../../api/taskService.ts";
import {getErrorMessage} from "../../api/getErrorMessage.ts";

type TaskDetailDialogProps = {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSaved: (task: Task) => void;
};

/** Shows a task and lets the user change its description, status, priority and category. */
export default function TaskDetailDialog({task, categories, onClose, onSaved}: TaskDetailDialogProps) {
    const [description, setDescription] = useState(task.description ?? "");
    const [status, setStatus] = useState<Status>(task.status);
    const [priority, setPriority] = useState<Priority | "">(task.priority ?? "");
    const [categoryId, setCategoryId] = useState<number | "">(task.categoryId ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changed =
        description.trim() !== (task.description ?? "") ||
        status !== task.status ||
        priority !== (task.priority ?? "") ||
        categoryId !== (task.categoryId ?? "");

    const handleClose = () => {
        if (!saving) onClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        try {
            // PUT replaces the whole task, so the unchanged fields are sent back as they are
            const updated = await updateTask(task.id, {
                title: task.title,
                description: description.trim() || undefined,
                status,
                priority: priority || undefined,
                categoryId: categoryId === "" ? undefined : categoryId,
            });
            onSaved(updated);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open onClose={handleClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Description"
                            multiline
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                        >
                            {Object.values(Status).map((s) => (
                                <MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority | "")}
                        >
                            <MenuItem value="">None</MenuItem>
                            {Object.values(Priority).map((p) => (
                                <MenuItem key={p} value={p}>{PRIORITY_LABELS[p]}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Close</Button>
                    <Button type="submit" variant="contained" disabled={saving || !changed}>
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
