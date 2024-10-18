import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getFoods } from 'api/endpoints';
import FoodItemDialog from 'components/FoodItemDialog';
import { mockFood, mockFoodItem } from 'utils/mocks';

const food = mockFood();
const foodItem = mockFoodItem();

jest.mock('api/endpoints', () => ({
    getFoods: jest.fn(),
}));

describe('FoodItemDialog when adding a food item entry', () => {
    it('should display an empty form', async () => {
        const onClose = jest.fn();
        const onSuccess = jest.fn();

        await act(async () => {
            render(
                <FoodItemDialog open onClose={onClose} onSuccess={onSuccess} />
            );
        });

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );
        expect(foodAutocompleteInput).toHaveValue('');

        const quantityInput = screen.getByTestId('quantity-input');
        expect(quantityInput).toHaveValue('');
    });

    describe('form validation', () => {
        it('should require a food', async () => {
            const onClose = jest.fn();
            const onSuccess = jest.fn();

            await act(async () => {
                render(
                    <FoodItemDialog
                        open
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                );
            });

            const quantityInput = screen.getByTestId('quantity-input');
            await userEvent.type(quantityInput, '150');

            const submitButton = screen.getByTestId('submit-button');
            await userEvent.click(submitButton);

            const foodAutocompleteError = screen.getByTestId(
                'food-autocomplete-error'
            );
            expect(foodAutocompleteError).toBeInTheDocument();
            expect(foodAutocompleteError).toHaveTextContent(
                'This field is required'
            );
        });

        it('should require a quantity value', async () => {
            const onClose = jest.fn();
            const onSuccess = jest.fn();

            (getFoods as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    data: [food],
                    request: {
                        responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                    },
                })
            );

            await act(async () => {
                render(
                    <FoodItemDialog
                        open
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                );
            });

            const foodAutocompleteInput = screen.getByTestId(
                'food-autocomplete-input'
            );

            await userEvent.clear(foodAutocompleteInput);
            await userEvent.type(foodAutocompleteInput, food.name);
            await userEvent.keyboard('[ArrowDown]');
            await userEvent.keyboard('[Enter]');

            const submitButton = screen.getByTestId('submit-button');
            await userEvent.click(submitButton);

            const quantityError = screen.getByTestId('quantity-error');
            expect(quantityError).toBeInTheDocument();
            expect(quantityError).toHaveTextContent('This field is required');
        });
    });
});

describe('FoodItemDialog when updating a food item entry', () => {
    beforeEach(() => {
        (getFoods as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: [food],
                request: {
                    responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                },
            })
        );
    });

    it('should fill form with data of the selected food item', async () => {
        const onClose = jest.fn();
        const onSuccess = jest.fn();

        await act(async () => {
            render(
                <FoodItemDialog
                    foodItem={foodItem}
                    open
                    onClose={onClose}
                    onSuccess={onSuccess}
                />
            );
        });

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );
        expect(foodAutocompleteInput).toHaveValue(foodItem.name);

        const quantityInput = screen.getByTestId('quantity-input');
        expect(quantityInput).toHaveValue(String(foodItem.quantity));
    });

    describe('form validation', () => {
        it('should require a food', async () => {
            const onClose = jest.fn();
            const onSuccess = jest.fn();

            await act(async () => {
                render(
                    <FoodItemDialog
                        foodItem={foodItem}
                        open
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                );
            });

            const foodAutocompleteInput = screen.getByTestId(
                'food-autocomplete-input'
            );
            await userEvent.clear(foodAutocompleteInput);

            const quantityInput = screen.getByTestId('quantity-input');
            await userEvent.type(quantityInput, '150');

            const submitButton = screen.getByTestId('submit-button');
            await userEvent.click(submitButton);

            const foodAutocompleteError = screen.getByTestId(
                'food-autocomplete-error'
            );
            expect(foodAutocompleteError).toBeInTheDocument();
            expect(foodAutocompleteError).toHaveTextContent(
                'This field is required'
            );
        });

        it('should require a quantity value', async () => {
            const onClose = jest.fn();
            const onSuccess = jest.fn();

            (getFoods as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    data: [food],
                    request: {
                        responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                    },
                })
            );

            await act(async () => {
                render(
                    <FoodItemDialog
                        foodItem={foodItem}
                        open
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                );
            });

            const foodAutocompleteInput = screen.getByTestId(
                'food-autocomplete-input'
            );

            await userEvent.clear(foodAutocompleteInput);
            await userEvent.type(foodAutocompleteInput, food.name);
            await userEvent.keyboard('[ArrowDown]');
            await userEvent.keyboard('[Enter]');

            const quantityInput = screen.getByTestId('quantity-input');
            await userEvent.clear(quantityInput);

            const submitButton = screen.getByTestId('submit-button');
            await userEvent.click(submitButton);

            const quantityError = screen.getByTestId('quantity-error');
            expect(quantityError).toBeInTheDocument();
            expect(quantityError).toHaveTextContent('This field is required');
        });
    });
});
