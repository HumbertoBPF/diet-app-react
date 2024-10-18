import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodItem from 'components/FoodItem';
import { mockFoodItem } from 'utils/mocks';

const foodItem = {
    ...mockFoodItem(),
    calories: 100,
    portion: 30,
    quantity: 70,
};

it('should display food item', () => {
    const onClick = jest.fn();
    const onDelete = jest.fn();

    render(
        <FoodItem foodItem={foodItem} onClick={onClick} onDelete={onDelete} />
    );

    const numberKCals = screen.getByTestId('number-kcals');
    expect(numberKCals).toBeInTheDocument();
    expect(numberKCals).toHaveTextContent('233 kcals');

    const foodItemName = screen.getByText(foodItem.name);
    expect(foodItemName).toBeInTheDocument();

    const foodItemQuantity = screen.getByText(`${foodItem.quantity} g`);
    expect(foodItemQuantity).toBeInTheDocument();
});

it('should call onDelete when clicking on the delete button', async () => {
    const onClick = jest.fn();
    const onDelete = jest.fn();

    render(
        <FoodItem foodItem={foodItem} onClick={onClick} onDelete={onDelete} />
    );

    const deleteButton = screen.getByTestId('delete-button');
    await userEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(foodItem);
});

it('should call onDelete when clicking on the delete button', async () => {
    const onClick = jest.fn();
    const onDelete = jest.fn();

    render(
        <FoodItem foodItem={foodItem} onClick={onClick} onDelete={onDelete} />
    );

    const numberKCals = screen.getByTestId('number-kcals');
    await userEvent.click(numberKCals);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(foodItem);
});
