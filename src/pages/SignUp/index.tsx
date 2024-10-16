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
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail, isValidPassword } from 'utils/validation';

function SignUp() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(new Map());
    const [message, setMessage] = useState<ISnackbarMessage>({
        text: '',
        open: false,
        variant: 'success',
    });

    const validateEmail = (value: string) => {
        const copyErrors = new Map(errors);

        if (isValidEmail(value)) {
            copyErrors.delete('email');
        } else {
            copyErrors.set('email', 'It must be a valid email address');
        }

        setErrors(copyErrors);
        setEmail(value);

        return copyErrors;
    };

    const validateFirstName = (value: string) => {
        const copyErrors = new Map(errors);

        if (value === '') {
            copyErrors.set('firstName', 'The first name is required');
        } else {
            copyErrors.delete('firstName');
        }

        setErrors(copyErrors);
        setFirstName(value);

        return copyErrors;
    };

    const validateLastName = (value: string) => {
        const copyErrors = new Map(errors);

        if (value === '') {
            copyErrors.set('lastName', 'The last name is required');
        } else {
            copyErrors.delete('lastName');
        }

        setErrors(copyErrors);
        setLastName(value);

        return copyErrors;
    };

    const validatePassword = (value: string) => {
        const copyErrors = new Map(errors);

        if (isValidPassword(value)) {
            copyErrors.delete('password');
        } else {
            copyErrors.set(
                'password',
                'The password must have at least one digit, one lowercase letter, one uppercase letter, and one non-alphanumeric character'
            );
        }

        setErrors(copyErrors);
        setPassword(value);

        return copyErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = new Map([
            ...validateEmail(email),
            ...validateFirstName(firstName),
            ...validateLastName(lastName),
            ...validatePassword(password),
        ]);

        setErrors(errors);

        if (errors.size > 0) {
            return;
        }

        axiosInstance()
            .post('/signup', {
                email,
                first_name: firstName,
                last_name: lastName,
                password,
            })
            .then(() => {
                setMessage({
                    text: 'Account successfully created.',
                    open: true,
                    variant: 'success',
                });
            })
            .catch(() => {
                setMessage({
                    text: 'Error during account creation.',
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
                        error={errors.has('email')}
                        helperText={errors.get('email')}
                        label="Email"
                        onBlur={(event) => validateEmail(event.target.value)}
                        onChange={(event) => validateEmail(event.target.value)}
                        type="email"
                        variant="standard"
                        value={email}
                    />
                    <TextField
                        fullWidth
                        error={errors.has('firstName')}
                        helperText={errors.get('firstName')}
                        label="First name"
                        onBlur={(event) =>
                            validateFirstName(event.target.value.trim())
                        }
                        onChange={(event) =>
                            validateFirstName(event.target.value.trim())
                        }
                        type="text"
                        sx={{ mt: '8px' }}
                        variant="standard"
                        value={firstName}
                    />
                    <TextField
                        fullWidth
                        error={errors.has('lastName')}
                        helperText={errors.get('lastName')}
                        label="Last name"
                        onBlur={(event) =>
                            validateLastName(event.target.value.trim())
                        }
                        onChange={(event) =>
                            validateLastName(event.target.value.trim())
                        }
                        type="text"
                        sx={{ mt: '8px' }}
                        variant="standard"
                        value={lastName}
                    />
                    <TextField
                        fullWidth
                        error={errors.has('password')}
                        helperText={errors.get('password')}
                        label="Password"
                        onBlur={(event) => validatePassword(event.target.value)}
                        onChange={(event) =>
                            validatePassword(event.target.value)
                        }
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
                        Sign Up
                    </Button>
                    <Link style={{ marginTop: '8px' }} to="/signin">
                        Do you have an account? Login
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

export default SignUp;
