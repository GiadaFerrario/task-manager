import {useState} from "react";
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography,
} from "@mui/material";
import type {Category} from "../../models/Category.ts";
import {createCategory, deleteCategory, updateCategory} from "../../api/categoryService.ts";
import {getErrorMessage} from "../../api/getErrorMessage.ts";
import {CATEGORY_COLORS} from "../../theme/categoryColors.ts";
import ColorPicker from "./ColorPicker.tsx";
import ConfirmDialog from "../dialogs/ConfirmDialog.tsx";

type CategoryFormDialogProps = {
    open: boolean;
    /** When set the dialog edits this category (and can delete it); otherwise it creates a new one. */
    category?: Category;
    onClose: () => void;
    onSaved: (category: Category) => void;
    onDeleted?: (id: number) => void;
};

export default function CategoryFormDialog({open, category, onClose, onSaved, onDeleted}: CategoryFormDialogProps) {
    const [name, setName] = useState(category?.name ?? "");
    const [description, setDescription] = useState(category?.description ?? "");
    const [color, setColor] = useState<string>(category?.color ?? CATEGORY_COLORS[0]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const reset = () => {
        setName(category?.name ?? "");
        setDescription(category?.description ?? "");
        setColor(category?.color ?? CATEGORY_COLORS[0]);
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
            const payload = {
                name: name.trim(),
                description: description.trim() || undefined,
                color,
            };
            const saved = category
                ? await updateCategory(category.id, payload)
                : await createCategory(payload);
            reset();
            onSaved(saved);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!category) return;
        await deleteCategory(category.id);
        onDeleted?.(category.id);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{category ? "Edit category" : "New category"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Name"
                            required
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            multiline
                            minRows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">Color</Typography>
                            <ColorPicker colors={CATEGORY_COLORS} value={color} onChange={setColor}/>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {category && onDeleted && (
                        <Button color="error" onClick={() => setConfirmingDelete(true)} disabled={saving} sx={{mr: "auto"}}>
                            Delete
                        </Button>
                    )}
                    <Button onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={saving || !name.trim()}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
            {category && (
                <ConfirmDialog
                    open={confirmingDelete}
                    title="Delete category"
                    message={`Delete "${category.name}"? Its tasks are kept, without a category.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmingDelete(false)}
                />
            )}
        </Dialog>
    );
}
