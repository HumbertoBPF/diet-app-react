import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import axiosInstance from 'api/http';
import FoodItemDialog from 'components/FoodItemDialog';
import FoodItem from 'components/FoodItem';
import IFoodItem from 'interfaces/IFoodItem';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ConfirmDeletionDialog from 'components/ConfirmDeletionDialog';
import NutritionSummary from 'components/NutritionSummary';

function DailyDiet() {
    const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
    const [selectedFoodItem, setSelectedFoodItem] = useState<IFoodItem>();
    const [openEntryDialog, setOpenEntryDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const params = useParams();
    const { date } = params;

    console.log(date);

    useEffect(() => {
        const searchParams = new URLSearchParams();

        searchParams.set('timestamp', `${date}T00:00:00.000Z`);

        axiosInstance()
            .get(`/user/food?${searchParams}`)
            .then((response) => {
                const { data } = response;
                setFoodItems(data);
            })
            .catch(() => {});
    }, [date]);

    const handleClickAddButton = () => {
        setSelectedFoodItem(undefined);
        setOpenEntryDialog(true);
    };

    const handleSelectFoodItem = (foodItem: IFoodItem) => {
        setSelectedFoodItem(foodItem);
        setOpenEntryDialog(true);
    };

    const handleDeleteFoodItem = (foodItem: IFoodItem) => {
        setSelectedFoodItem(foodItem);
        setOpenDeleteDialog(true);
    };

    const handleSubmitEntryDialog = (foodItem: IFoodItem) => {
        const isNewEntry = foodItems.some(
            (existingFoodItem) => existingFoodItem.id === foodItem.id
        );

        if (isNewEntry) {
            setFoodItems(
                foodItems.map((existingFoodItem) => {
                    if (existingFoodItem.id === foodItem.id) {
                        return foodItem;
                    }

                    return existingFoodItem;
                })
            );
            return;
        }

        setFoodItems([...foodItems, foodItem]);
    };

    const handleCloseEntryDialog = () => {
        setSelectedFoodItem(undefined);
        setOpenEntryDialog(false);
    };

    const handleDelete = () => {
        axiosInstance()
            .delete(`/user/food/${selectedFoodItem?.id}`)
            .then(() => {
                setFoodItems(
                    foodItems.filter(
                        (foodItem) => foodItem.id !== selectedFoodItem?.id
                    )
                );
                setOpenDeleteDialog(false);
            })
            .catch(() => {});
    };

    const handleCloseDeleteDialog = () => {
        setSelectedFoodItem(undefined);
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <Button
                sx={{ my: '8px' }}
                onClick={handleClickAddButton}
                startIcon={<Add />}
                variant="contained"
            >
                New entry
            </Button>
            {foodItems.map((foodItem) => (
                <FoodItem
                    key={foodItem.id}
                    foodItem={foodItem}
                    onClick={() => handleSelectFoodItem(foodItem)}
                    onDelete={() => handleDeleteFoodItem(foodItem)}
                />
            ))}
            <NutritionSummary foodItems={foodItems} />
            <FoodItemDialog
                foodItem={selectedFoodItem}
                open={openEntryDialog}
                onClose={handleCloseEntryDialog}
                onSuccess={handleSubmitEntryDialog}
            />
            <ConfirmDeletionDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
            />
        </>
    );
}

export default DailyDiet;
