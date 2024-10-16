import './App.css';
import { createBrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Root from './components/Root';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import DailyDiet from 'pages/DailyDiet';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/signin',
                element: <SignIn />,
            },
            {
                path: '/signup',
                element: <SignUp />,
            },
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/diet/:date',
                element: <DailyDiet />,
            },
        ],
    },
]);

export default router;
