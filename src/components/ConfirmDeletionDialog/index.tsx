import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

interface ConfirmDeletionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function ConfirmDeletionDialog({
    open,
    onClose,
    onConfirm,
}: ConfirmDeletionDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Deletion warning</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You are about to delete an entry. This is an irreversible
                    action. Would you like to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} data-testid="cancel-button">
                    Cancel
                </Button>
                <Button onClick={onConfirm} data-testid="confirm-button">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeletionDialog;
