import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    createFoodItem,
    deleteFoodItem,
    getFoodItems,
    getFoods,
    updateFoodItem,
} from 'api/endpoints';
import { AxiosError } from 'axios';
import DailyDiet from 'pages/DailyDiet';
import { Route } from 'react-router-dom';
import { mockFood, mockFoodItem } from 'utils/mocks';
import { renderWithProviders } from 'utils/tests';

const food = mockFood();
const foodItems = [mockFoodItem(), mockFoodItem(), mockFoodItem()];

const date = '2024-10-08';

const routes = (
    <>
        <Route path="/diet/:date" element={<DailyDiet />} />
    </>
);

jest.mock('api/endpoints', () => ({
    getFoods: jest.fn(),
    getFoodItems: jest.fn(),
    deleteFoodItem: jest.fn(),
    createFoodItem: jest.fn(),
    updateFoodItem: jest.fn(),
}));

describe('reading food items', () => {
    it('should display list of food items', async () => {
        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const searchParams = new URLSearchParams();

        searchParams.set('timestamp', `${date}T00:00:00.000Z`);

        expect(getFoodItems).toHaveBeenCalledTimes(1);
        expect(getFoodItems).toHaveBeenCalledWith(searchParams);

        const foodItem0 = screen.getByTestId(`food-item-${foodItems[0].id}`);
        expect(foodItem0).toBeInTheDocument();

        const foodItem1 = screen.getByTestId(`food-item-${foodItems[1].id}`);
        expect(foodItem1).toBeInTheDocument();

        const foodItem2 = screen.getByTestId(`food-item-${foodItems[2].id}`);
        expect(foodItem2).toBeInTheDocument();
    });

    it('should communicate API error', async () => {
        (getFoodItems as jest.Mock).mockRejectedValue(new AxiosError());

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const searchParams = new URLSearchParams();

        searchParams.set('timestamp', `${date}T00:00:00.000Z`);

        expect(getFoodItems).toHaveBeenCalledTimes(1);
        expect(getFoodItems).toHaveBeenCalledWith(searchParams);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent(
            'An error occurred when getting the entries'
        );
    });
});

describe('deleting food items', () => {
    it('should delete a food item', async () => {
        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (deleteFoodItem as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: undefined,
            })
        );

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const foodItemToDelete = screen.getByTestId(
            `food-item-${foodItems[0].id}`
        );
        const deleteButton =
            within(foodItemToDelete).getByTestId('delete-button');
        await userEvent.click(deleteButton);

        const confirmButton = screen.getByTestId('confirm-button');
        await userEvent.click(confirmButton);

        expect(deleteFoodItem).toHaveBeenCalledTimes(1);
        expect(deleteFoodItem).toHaveBeenCalledWith(foodItems[0].id);

        const foodItem0 = screen.queryByTestId(`food-item-${foodItems[0].id}`);
        expect(foodItem0).not.toBeInTheDocument();
    });

    it('should communicate API error', async () => {
        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (deleteFoodItem as jest.Mock).mockRejectedValue(new AxiosError());

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const foodItemToDelete = screen.getByTestId(
            `food-item-${foodItems[0].id}`
        );
        const deleteButton =
            within(foodItemToDelete).getByTestId('delete-button');
        await userEvent.click(deleteButton);

        const confirmButton = screen.getByTestId('confirm-button');
        await userEvent.click(confirmButton);

        expect(deleteFoodItem).toHaveBeenCalledTimes(1);
        expect(deleteFoodItem).toHaveBeenCalledWith(foodItems[0].id);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent(
            'An error occurred when deleting the entry'
        );
    });
});

describe('creating food items', () => {
    it('should create a food item', async () => {
        const newFoodItem = {
            ...mockFoodItem(),
            food_id: food.id,
            name: food.name,
            calories: food.calories,
            portion: food.portion,
            quantity: 150,
        };

        (getFoods as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: [food],
                request: {
                    responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                },
            })
        );

        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (createFoodItem as jest.Mock).mockImplementation(() =>
            Promise.resolve({ data: newFoodItem })
        );

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const addEntryButton = screen.getByTestId('add-entry-button');
        await userEvent.click(addEntryButton);

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );

        await userEvent.type(foodAutocompleteInput, food.name);
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[Enter]');

        const quantityInput = screen.getByTestId('quantity-input');
        await userEvent.type(quantityInput, '150');

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(createFoodItem).toHaveBeenCalledTimes(1);
        expect(createFoodItem).toHaveBeenCalledWith({
            food_id: food.id,
            quantity: 150,
            timestamp: `${date}T00:00:00.000Z`,
        });

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Entry successfully created');

        const foodItem0 = screen.getByTestId(`food-item-${foodItems[0].id}`);
        expect(foodItem0).toBeInTheDocument();

        const foodItem1 = screen.getByTestId(`food-item-${foodItems[1].id}`);
        expect(foodItem1).toBeInTheDocument();

        const foodItem2 = screen.getByTestId(`food-item-${foodItems[2].id}`);
        expect(foodItem2).toBeInTheDocument();

        const foodItem3 = screen.getByTestId(`food-item-${newFoodItem.id}`);
        expect(foodItem3).toBeInTheDocument();
    });

    it('should communicate an API error', async () => {
        (getFoods as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: [food],
                request: {
                    responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                },
            })
        );

        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (createFoodItem as jest.Mock).mockRejectedValue(new AxiosError());

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const addEntryButton = screen.getByTestId('add-entry-button');
        await userEvent.click(addEntryButton);

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );

        await userEvent.type(foodAutocompleteInput, food.name);
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[Enter]');

        const quantityInput = screen.getByTestId('quantity-input');
        await userEvent.type(quantityInput, '150');

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(createFoodItem).toHaveBeenCalledTimes(1);
        expect(createFoodItem).toHaveBeenCalledWith({
            food_id: food.id,
            quantity: 150,
            timestamp: `${date}T00:00:00.000Z`,
        });

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent(
            'An error occurred when creating entry'
        );
    });
});

describe('updating food items', () => {
    it('should update a food item', async () => {
        const updatedFoodItem = {
            ...foodItems[0],
            food_id: food.id,
            name: food.name,
            calories: food.calories,
            portion: food.portion,
            quantity: 150,
        };

        (getFoods as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: [food],
                request: {
                    responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                },
            })
        );

        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (updateFoodItem as jest.Mock).mockImplementation(() =>
            Promise.resolve({ data: updatedFoodItem })
        );

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const foodItemToUpdate = screen.getByTestId(
            `food-item-${foodItems[0].id}`
        );
        await userEvent.click(
            within(foodItemToUpdate).getByTestId('number-kcals')
        );

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );

        await userEvent.clear(foodAutocompleteInput);
        await userEvent.type(foodAutocompleteInput, food.name);
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[Enter]');

        const quantityInput = screen.getByTestId('quantity-input');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '150');

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(updateFoodItem).toHaveBeenCalledTimes(1);
        expect(updateFoodItem).toHaveBeenCalledWith(foodItems[0].id, {
            food_id: food.id,
            quantity: 150,
            timestamp: foodItems[0].timestamp,
        });

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Entry successfully updated');

        const foodItem0 = screen.getByTestId(`food-item-${foodItems[0].id}`);
        expect(foodItem0).toBeInTheDocument();

        const foodItem1 = screen.getByTestId(`food-item-${foodItems[1].id}`);
        expect(foodItem1).toBeInTheDocument();

        const foodItem2 = screen.getByTestId(`food-item-${foodItems[2].id}`);
        expect(foodItem2).toBeInTheDocument();
    });

    it('should communicate an API error', async () => {
        (getFoods as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: [food],
                request: {
                    responseURL: `${process.env.REACT_APP_HTTP_API_URL}/food?name=${food.name}`,
                },
            })
        );

        (getFoodItems as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: foodItems,
            })
        );

        (updateFoodItem as jest.Mock).mockRejectedValue(new AxiosError());

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: [`/diet/${date}`],
            });
        });

        const foodItemToUpdate = screen.getByTestId(
            `food-item-${foodItems[0].id}`
        );
        await userEvent.click(
            within(foodItemToUpdate).getByTestId('number-kcals')
        );

        const foodAutocompleteInput = screen.getByTestId(
            'food-autocomplete-input'
        );

        await userEvent.clear(foodAutocompleteInput);
        await userEvent.type(foodAutocompleteInput, food.name);
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[Enter]');

        const quantityInput = screen.getByTestId('quantity-input');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '150');

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(updateFoodItem).toHaveBeenCalledTimes(1);
        expect(updateFoodItem).toHaveBeenCalledWith(foodItems[0].id, {
            food_id: food.id,
            quantity: 150,
            timestamp: foodItems[0].timestamp,
        });

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent(
            'An error occurred when updating entry'
        );
    });
});
