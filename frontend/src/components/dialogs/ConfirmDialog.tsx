import {useState} from "react";
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {getErrorMessage} from "../../api/getErrorMessage.ts";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    /** Should throw when the action fails: the error is shown in the dialog and the dialog stays open. */
    onConfirm: () => Promise<void>;
    onCancel: () => void;
};

export default function ConfirmDialog({open, title, message, confirmLabel = "Delete", onConfirm, onCancel}: ConfirmDialogProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCancel = () => {
        if (busy) return;
        setError(null);
        onCancel();
    };

    const handleConfirm = async () => {
        setBusy(true);
        setError(null);
        try {
            await onConfirm();
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} disabled={busy}>Cancel</Button>
                <Button color="error" variant="contained" onClick={handleConfirm} disabled={busy}>
                    {busy ? "Working..." : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
