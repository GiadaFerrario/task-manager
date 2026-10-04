import {useState} from "react";
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from "@mui/material";
import type {Task} from "../../models/Task.ts";
import type {Category} from "../../models/Category.ts";
import {Priority} from "../../models/Priority.ts";
import {createTask} from "../../api/taskService.ts";
import {getErrorMessage} from "../../api/getErrorMessage.ts";

type TaskFormDialogProps = {
    open: boolean;
    categories: Category[];
    onClose: () => void;
    onSaved: (task: Task) => void;
};

const PRIORITY_LABELS: Record<Priority, string> = {
    [Priority.LOW]: "Low",
    [Priority.MEDIUM]: "Medium",
    [Priority.HIGH]: "High",
};

export default function TaskFormDialog({open, categories, onClose, onSaved}: TaskFormDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority | "">("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setTitle("");
        setDescription("");
        setPriority("");
        setCategoryId("");
        setError(null);
    };

    const handleClose = () => {
        if (saving) return;
        reset();
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const created = await createTask({
                title: title.trim(),
                description: description.trim() || undefined,
                priority: priority || undefined,
                categoryId: categoryId === "" ? undefined : categoryId,
            });
            reset();
            onSaved(created);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>New task</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Title"
                            required
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            multiline
                            minRows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                    <Button onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={saving || !title.trim()}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
