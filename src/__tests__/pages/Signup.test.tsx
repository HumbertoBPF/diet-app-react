import { fakerEN_US as faker } from '@faker-js/faker';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signup } from 'api/endpoints';
import { AxiosError } from 'axios';
import SignUp from 'pages/SignUp';
import { Route } from 'react-router-dom';
import { mockUser } from 'utils/mocks';
import { renderWithProviders } from 'utils/tests';

const routes = (
    <>
        <Route path="/signup" element={<SignUp />} />
    </>
);

const user = mockUser();
const password = 'Str0ng-P@ssw0rd';

jest.mock('api/endpoints', () => ({
    signup: jest.fn(),
}));

it('should signup user', async () => {
    (signup as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            data: user,
        })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/signup'],
        });
    });

    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, user.email);

    const firstNameInput = screen.getByTestId('first-name-input');
    await userEvent.type(firstNameInput, user.first_name);

    const lastNameInput = screen.getByTestId('last-name-input');
    await userEvent.type(lastNameInput, user.last_name);

    const passwordInput = screen.getByTestId('password-input');
    await userEvent.type(passwordInput, password);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(signup).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledWith({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password,
    });

    const snackbar = screen.getByTestId('snackbar');
    expect(snackbar).toBeInTheDocument();
    expect(snackbar).toHaveTextContent('Account successfully created.');
});

describe('form validation', () => {
    it('should require an email address', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signup'],
            });
        });

        const firstNameInput = screen.getByTestId('first-name-input');
        await userEvent.type(firstNameInput, user.first_name);

        const lastNameInput = screen.getByTestId('last-name-input');
        await userEvent.type(lastNameInput, user.last_name);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const emailError = screen.getByTestId('email-error');
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent(
            'It must be a valid email address'
        );
    });

    it('should require a valid email address', async () => {
        const invalidEmail = faker.person.firstName();

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signup'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, invalidEmail);

        const firstNameInput = screen.getByTestId('first-name-input');
        await userEvent.type(firstNameInput, user.first_name);

        const lastNameInput = screen.getByTestId('last-name-input');
        await userEvent.type(lastNameInput, user.last_name);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const emailError = screen.getByTestId('email-error');
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent(
            'It must be a valid email address'
        );
    });

    it('should require a value for the first name', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signup'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, user.email);

        const lastNameInput = screen.getByTestId('last-name-input');
        await userEvent.type(lastNameInput, user.last_name);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const firstNameError = screen.getByTestId('first-name-error');
        expect(firstNameError).toBeInTheDocument();
        expect(firstNameError).toHaveTextContent('The first name is required');
    });

    it('should require a value for the last name', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signup'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, user.email);

        const firstNameInput = screen.getByTestId('first-name-input');
        await userEvent.type(firstNameInput, user.first_name);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const lastNameError = screen.getByTestId('last-name-error');
        expect(lastNameError).toBeInTheDocument();
        expect(lastNameError).toHaveTextContent('The last name is required');
    });

    it.each([
        ['p@ssw0rd'],
        ['P@SSW0RD'],
        ['P@assword'],
        ['pAssw0rd'],
        ['P@sw0rd'],
    ])('should validate the password', async (password) => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/signup'],
            });
        });

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, user.email);

        const firstNameInput = screen.getByTestId('first-name-input');
        await userEvent.type(firstNameInput, user.first_name);

        const lastNameInput = screen.getByTestId('last-name-input');
        await userEvent.type(lastNameInput, user.last_name);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const passwordError = screen.getByTestId('password-error');
        expect(passwordError).toBeInTheDocument();
        expect(passwordError).toHaveTextContent(
            'The password must have at least one digit, one lowercase letter, one uppercase letter, one non-alphanumeric character, and be at least eight characters long'
        );
    });
});

it('should display a snackbar when the signup endpoint returns an API error', async () => {
    (signup as jest.Mock).mockRejectedValue(new AxiosError('Generic error'));

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/signup'],
        });
    });

    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, user.email);

    const firstNameInput = screen.getByTestId('first-name-input');
    await userEvent.type(firstNameInput, user.first_name);

    const lastNameInput = screen.getByTestId('last-name-input');
    await userEvent.type(lastNameInput, user.last_name);

    const passwordInput = screen.getByTestId('password-input');
    await userEvent.type(passwordInput, password);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(signup).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledWith({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password,
    });

    const snackbar = screen.getByTestId('snackbar');
    expect(snackbar).toBeInTheDocument();
    expect(snackbar).toHaveTextContent('Error during account creation.');
});
