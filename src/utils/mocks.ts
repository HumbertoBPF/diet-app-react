import { fakerEN_US as faker } from '@faker-js/faker';

export const mockUser = () => {
    return {
        id: 1,
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
    };
};

export const mockFood = () => {
    return {
        id: faker.number.int({ min: 1, max: 1000 }),
        name: faker.food.dish(),
        calories: faker.number.int({ min: 1, max: 500 }),
        portion: faker.number.int({ min: 1, max: 5 }) * 100,
    };
};

export const mockFoodItem = () => {
    return {
        id: faker.number.int({ min: 1, max: 1000 }),
        user_id: 1,
        food_id: faker.number.int({ min: 1, max: 1000 }),
        name: faker.food.dish(),
        calories: faker.number.int({ min: 1, max: 500 }),
        portion: faker.number.int({ min: 1, max: 5 }) * 100,
        quantity: faker.number.int({ min: 1, max: 10 }) * 50,
        timestamp: '2024-10-08T21:00:00-03:00',
    };
};
