import { Alert, Snackbar as MuiSnackbar } from '@mui/material';

interface SnackbarProps {
    text: string;
    open: boolean;
    onClose: () => void;
    variant: 'success' | 'error';
}

function Snackbar({ text, open, onClose, variant = 'success' }: SnackbarProps) {
    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            data-testid="snackbar"
        >
            <Alert
                onClose={onClose}
                severity={variant}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {text}
            </Alert>
        </MuiSnackbar>
    );
}

export default Snackbar;
