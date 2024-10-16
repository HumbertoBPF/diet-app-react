interface ISnackbarMessage {
    text: string;
    open: boolean;
    variant: 'success' | 'error';
}

export default ISnackbarMessage;
