import { Box, Typography } from '@mui/material';
import LabeledLinearProgress from 'components/LabeledLinearProgress';
import IFoodItem from 'interfaces/IFoodItem';

interface NutritionSummaryProps {
    foodItems: IFoodItem[];
}

function NutritionSummary({ foodItems }: NutritionSummaryProps) {
    const totalKCals = foodItems
        .map((foodItem) =>
            Number(
                (
                    (foodItem.calories * foodItem.quantity) /
                    foodItem.portion
                ).toFixed(0)
            )
        )
        .reduce((sum, value) => sum + value, 0);

    return (
        <>
            <Typography variant="body1">Nutrition Information</Typography>
            <Typography
                sx={{ mt: '8px' }}
                variant="body2"
                data-testid="total-kcals"
            >
                Total kilocalories: {totalKCals} kcals
            </Typography>
            <Box data-testid="progress-kcals">
                <LabeledLinearProgress value={(totalKCals / 2400) * 100} />
            </Box>
        </>
    );
}

export default NutritionSummary;
