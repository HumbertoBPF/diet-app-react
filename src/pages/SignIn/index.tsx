import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Grid2,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import axiosInstance from 'api/http';
import Snackbar from 'components/Snackbar';
import { setUser } from 'features/userSlice';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import Cookies from 'js-cookie';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [message, setMessage] = useState<ISnackbarMessage>({
        text: '',
        open: false,
        variant: 'success',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchUser = () => {
        axiosInstance()
            .get('/user')
            .then((response) => {
                const { data } = response;
                dispatch(setUser(data));
                navigate('/home');
            })
            .catch(() => {});
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        axiosInstance()
            .post('/login', {
                email,
                password,
            })
            .then((response) => {
                const { data } = response;
                const { token } = data;

                Cookies.set('token', token);
                fetchUser();
            })
            .catch(() => {
                setMessage({
                    text: 'Invalid credentials',
                    open: true,
                    variant: 'error',
                });
            });
    };

    return (
        <Grid2
            alignItems="center"
            container
            justifyContent="center"
            padding="16px"
        >
            <Grid2
                size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                }}
            >
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        label="Email"
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        variant="standard"
                        value={email}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setPasswordVisible(
                                                    !passwordVisible
                                                )
                                            }
                                            edge="end"
                                        >
                                            {passwordVisible ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ mt: '8px' }}
                        type={passwordVisible ? 'text' : 'password'}
                        variant="standard"
                        value={password}
                    />
                    <Button
                        sx={{ mt: '16px' }}
                        type="submit"
                        variant="contained"
                    >
                        Sign in
                    </Button>
                    <Link style={{ marginTop: '8px' }} to="/signup">
                        Create account
                    </Link>
                </Box>
            </Grid2>
            <Snackbar
                text={message.text}
                open={message.open}
                onClose={() => setMessage({ ...message, open: false })}
                variant={message.variant}
            />
        </Grid2>
    );
}

export default SignIn;
