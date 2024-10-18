import { render, screen, within } from '@testing-library/react';
import NutritionSummary from 'components/NutritionSummary';
import { mockFoodItem } from 'utils/mocks';

const foodItems = [
    {
        ...mockFoodItem(),
        calories: 50,
        quantity: 100,
        portion: 100,
    },
    {
        ...mockFoodItem(),
        calories: 100,
        quantity: 150,
        portion: 200,
    },
    {
        ...mockFoodItem(),
        calories: 150,
        quantity: 200,
        portion: 150,
    },
];

it('should display nutritional summary', async () => {
    render(<NutritionSummary foodItems={foodItems} />);

    const totalKCals = screen.getByTestId('total-kcals');
    expect(totalKCals).toBeInTheDocument();
    expect(totalKCals).toHaveTextContent('Total kilocalories: 325 kcals');

    const progressKCals = screen.getByTestId('progress-kcals');
    expect(
        within(progressKCals).getByTestId('linear-progress-percentage')
    ).toHaveTextContent('14%');
});
