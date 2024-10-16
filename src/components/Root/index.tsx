import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Outlet, useNavigate } from 'react-router-dom';
import { Logout, PermIdentity } from '@mui/icons-material';
import { useEffect } from 'react';
import axiosInstance from 'api/http';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { clearUser, setUser } from 'features/userSlice';
import Cookies from 'js-cookie';
import { useAppSelector } from 'hooks/useAppSelector';
import { Container } from '@mui/material';

function Root() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);

    const auth = user.email !== '';

    useEffect(() => {
        const auth = Cookies.get('token');

        if (auth) {
            axiosInstance()
                .get('/user')
                .then((response) => {
                    const { data } = response;
                    dispatch(setUser(data));
                })
                .catch(() => {});
        }
    }, [auth, dispatch]);

    const handleAccessAccount = () => {
        navigate('/signin');
    };

    const handleLogout = () => {
        Cookies.remove('token');
        dispatch(clearUser());
        navigate('/signin');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Health Manager
                    </Typography>
                    {auth ? (
                        <IconButton
                            size="large"
                            aria-label="logout"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleLogout}
                            color="inherit"
                        >
                            <Logout />
                        </IconButton>
                    ) : (
                        <IconButton
                            size="large"
                            aria-label="login"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleAccessAccount}
                            color="inherit"
                        >
                            <PermIdentity />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </Box>
    );
}

export default Root;
