import { fakerEN_US as faker } from '@faker-js/faker';
import { mockUser } from '../../src/utils/mocks';

const email = faker.internet.email();
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const password = 'Str0ng-P@ssw0rd';

const user = mockUser();

it('should sign up user', () => {
    cy.intercept('POST', '/signup', {
        statusCode: 201,
        body: user,
    });

    cy.visit('/signup');

    cy.getByTestId('email-input').type(email);
    cy.getByTestId('first-name-input').type(firstName);
    cy.getByTestId('last-name-input').type(lastName);
    cy.getByTestId('password-input').type(password);

    cy.getByTestId('submit-button').click();

    cy.getByTestId('snackbar').should(
        'have.text',
        'Account successfully created.'
    );
});
