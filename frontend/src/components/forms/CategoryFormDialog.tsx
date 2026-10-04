import {useState} from "react";
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography,
} from "@mui/material";
import type {Category} from "../../models/Category.ts";
import {createCategory} from "../../api/categoryService.ts";
import {getErrorMessage} from "../../api/getErrorMessage.ts";
import {CATEGORY_COLORS} from "../../theme/categoryColors.ts";
import ColorPicker from "./ColorPicker.tsx";

type CategoryFormDialogProps = {
    open: boolean;
    onClose: () => void;
    onSaved: (category: Category) => void;
};

export default function CategoryFormDialog({open, onClose, onSaved}: CategoryFormDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setDescription("");
        setColor(CATEGORY_COLORS[0]);
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
            const created = await createCategory({
                name: name.trim(),
                description: description.trim() || undefined,
                color,
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
                <DialogTitle>New category</DialogTitle>
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
                    <Button onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={saving || !name.trim()}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
