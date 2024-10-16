import { Typography } from '@mui/material';
import LabeledLinearProgress from 'components/LabeledLinearProgress';
import IFoodItem from 'interfaces/IFoodItem';

interface NutritionSummaryProps {
    foodItems: IFoodItem[];
}

function NutritionSummary({ foodItems }: NutritionSummaryProps) {
    const totalKCals = foodItems
        .map((foodItem) => foodItem.calories)
        .reduce((sum, value) => sum + value, 0);
    return (
        <>
            <Typography variant="body1">Nutrition Information</Typography>
            <Typography sx={{ mt: '8px' }} variant="body2">
                Total kilocalories: {totalKCals} kcals
            </Typography>
            <LabeledLinearProgress value={(totalKCals / 2400) * 100} />
        </>
    );
}

export default NutritionSummary;
