declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select DOM element by data-cy attribute.
         * @example cy.dataCy('greeting')
         */
        getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
        login(email: string, password: string);
        findByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
}
