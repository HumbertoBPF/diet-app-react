import { mockUser } from '../../src/utils/mocks';

const user = mockUser();
const password = 'Str0ng-P@ssw0rd';

it('should log in user', () => {
    cy.intercept('POST', '/login', {
        body: {
            token: 'token',
        },
    });

    cy.intercept('GET', '/user', {
        body: user,
    });

    cy.visit('/signin');

    cy.getByTestId('email-input').type(user.email);
    cy.getByTestId('password-input').type(password);

    cy.getByTestId('submit-button').click();

    cy.url().should('include', '/home');
});
