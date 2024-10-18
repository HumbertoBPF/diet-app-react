import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUser, signin } from 'api/endpoints';
import { AxiosError } from 'axios';
import SignIn from 'pages/SignIn';
import { Route } from 'react-router-dom';
import { mockUser } from 'utils/mocks';
import { renderWithProviders } from 'utils/tests';

const routes = (
    <>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<h1 data-testid="home-page">Home</h1>} />
    </>
);

const user = mockUser();

const password = 'Str0ng-P@ssw0rd';

jest.mock('api/endpoints', () => ({
    signin: jest.fn(),
    getUser: jest.fn(),
}));

it('should log in user', async () => {
    (signin as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            data: {
                email: user.email,
                password,
            },
        })
    );

    (getUser as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: user })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/signin'],
        });
    });

    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, user.email);

    const passwordInput = screen.getByTestId('password-input');
    await userEvent.type(passwordInput, password);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(signin).toHaveBeenCalledTimes(1);
    expect(signin).toHaveBeenCalledWith({
        email: user.email,
        password,
    });

    expect(getUser).toHaveBeenCalledTimes(1);

    const snackbar = screen.getByTestId('home-page');
    expect(snackbar).toBeInTheDocument();
});

describe('error handling', () => {
    it('should display invalid credentials error', async () => {
        (signin as jest.Mock).mockRejectedValue(new AxiosError());

        (getUser as jest.Mock).mockImplementation(() =>
            Promise.resolve({ data: user })
        );

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signin'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, user.email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signin).toHaveBeenCalledTimes(1);
        expect(signin).toHaveBeenCalledWith({
            email: user.email,
            password,
        });

        expect(getUser).toHaveBeenCalledTimes(0);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Invalid credentials');
    });

    it('should display error when the endpoint /user returns an error', async () => {
        (signin as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: user,
            })
        );

        (getUser as jest.Mock).mockRejectedValue(new AxiosError());

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signin'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, user.email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signin).toHaveBeenCalledTimes(1);
        expect(signin).toHaveBeenCalledWith({
            email: user.email,
            password,
        });

        expect(getUser).toHaveBeenCalledTimes(1);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Error when fetching user data');
    });
});
