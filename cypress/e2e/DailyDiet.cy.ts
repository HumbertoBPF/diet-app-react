import { mockFood, mockFoodItem, mockUser } from '../../src/utils/mocks';

const user = mockUser();
const password = 'Str0ng-P@ssw0rd';
const foodItems = [mockFoodItem(), mockFoodItem(), mockFoodItem()];
const foods = [
    { ...mockFood(), calories: 150, portion: 100 },
    mockFood(),
    mockFood(),
];

beforeEach(() => {
    cy.intercept('POST', '/login', {
        body: {
            token: 'token',
        },
    });

    cy.intercept('GET', '/user', {
        body: user,
    });

    cy.intercept('GET', '/user/food?*', {
        body: foodItems,
    });
});

it('should list food items', () => {
    cy.login(user.email, password);

    cy.getByTestId('day-button').first().click();

    cy.getByTestId(`food-item-${foodItems[0].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[1].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[2].id}`).should('be.visible');
});

it('should delete food item', () => {
    cy.intercept('DELETE', `/user/food/${foodItems[0].id}`, {
        body: undefined,
    });

    cy.login(user.email, password);

    cy.getByTestId('day-button').first().click();

    cy.getByTestId(`food-item-${foodItems[0].id}`)
        .findByTestId('delete-button')
        .click();

    cy.getByTestId('confirm-button').click();

    cy.getByTestId(`food-item-${foodItems[0].id}`).should('not.exist');
    cy.getByTestId(`food-item-${foodItems[1].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[2].id}`).should('be.visible');
});

it('should create food item', () => {
    const newFoodItem = {
        ...mockFoodItem(),
        food_id: foods[0].id,
        name: foods[0].name,
        calories: foods[0].calories,
        portion: foods[0].portion,
        quantity: 300,
    };

    cy.intercept('POST', '/user/food', {
        body: newFoodItem,
    });

    cy.intercept('GET', '/food?*', {
        body: foods,
    });

    cy.login(user.email, password);

    cy.getByTestId('day-button').first().click();

    cy.getByTestId('add-entry-button').click();

    cy.getByTestId('food-autocomplete-input')
        .type(newFoodItem.name)
        .type('{downArrow}')
        .type('{enter}');

    cy.getByTestId('quantity-input').type(String(newFoodItem.quantity));

    cy.getByTestId('submit-button').click();

    cy.getByTestId(`food-item-${foodItems[0].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[1].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[2].id}`).should('be.visible');

    cy.getByTestId(`food-item-${newFoodItem.id}`).should('be.visible');
    cy.getByTestId(`food-item-${newFoodItem.id}`)
        .findByTestId('number-kcals')
        .should('include.text', '450');
    cy.getByTestId(`food-item-${newFoodItem.id}`).should(
        'include.text',
        newFoodItem.name
    );
    cy.getByTestId(`food-item-${newFoodItem.id}`).should(
        'include.text',
        `${newFoodItem.quantity} g`
    );
});

it('should update food item', () => {
    const updatedFoodItem = {
        ...foodItems[0],
        food_id: foods[0].id,
        name: foods[0].name,
        calories: foods[0].calories,
        portion: foods[0].portion,
        quantity: 300,
    };

    cy.intercept('PUT', `/user/food/${foodItems[0].id}`, {
        body: updatedFoodItem,
    });

    cy.intercept('GET', '/food?*', {
        body: foods,
    });

    cy.login(user.email, password);

    cy.getByTestId('day-button').first().click();

    cy.getByTestId(`food-item-${foodItems[0].id}`).click();

    cy.getByTestId('food-autocomplete-input')
        .clear()
        .type(updatedFoodItem.name)
        .type('{downArrow}')
        .type('{enter}');

    cy.getByTestId('quantity-input')
        .clear()
        .type(String(updatedFoodItem.quantity));

    cy.getByTestId('submit-button').click();

    cy.getByTestId(`food-item-${foodItems[0].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[0].id}`)
        .findByTestId('number-kcals')
        .should('include.text', '450');
    cy.getByTestId(`food-item-${foodItems[0].id}`).should(
        'include.text',
        updatedFoodItem.name
    );
    cy.getByTestId(`food-item-${foodItems[0].id}`).should(
        'include.text',
        `${updatedFoodItem.quantity} g`
    );

    cy.getByTestId(`food-item-${foodItems[1].id}`).should('be.visible');
    cy.getByTestId(`food-item-${foodItems[2].id}`).should('be.visible');
});
