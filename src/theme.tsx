import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
