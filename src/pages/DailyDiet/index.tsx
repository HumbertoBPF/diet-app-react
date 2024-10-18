import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import FoodItemDialog from 'components/FoodItemDialog';
import FoodItem from 'components/FoodItem';
import IFoodItem from 'interfaces/IFoodItem';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ConfirmDeletionDialog from 'components/ConfirmDeletionDialog';
import NutritionSummary from 'components/NutritionSummary';
import { deleteFoodItem, getFoodItems } from 'api/endpoints';
import Snackbar from 'components/Snackbar';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';

function DailyDiet() {
    const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
    const [selectedFoodItem, setSelectedFoodItem] = useState<IFoodItem>();
    const [openEntryDialog, setOpenEntryDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [message, setMessage] = useState<ISnackbarMessage>({
        text: '',
        open: false,
        variant: 'success',
    });

    const params = useParams();
    const { date } = params;

    useEffect(() => {
        const searchParams = new URLSearchParams();

        searchParams.set('timestamp', `${date}T00:00:00.000Z`);

        getFoodItems(searchParams)
            .then((response) => {
                const { data } = response;
                setFoodItems(data);
            })
            .catch(() => {
                setMessage({
                    text: 'An error occurred when getting the entries',
                    open: true,
                    variant: 'error',
                });
            });
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
        deleteFoodItem(selectedFoodItem?.id)
            .then(() => {
                setFoodItems(
                    foodItems.filter(
                        (foodItem) => foodItem.id !== selectedFoodItem?.id
                    )
                );
                setOpenDeleteDialog(false);
            })
            .catch(() => {
                setMessage({
                    text: 'An error occurred when deleting the entry',
                    open: true,
                    variant: 'error',
                });
            });
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
                data-testid="add-entry-button"
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
            <Snackbar
                text={message.text}
                open={message.open}
                onClose={() => setMessage({ ...message, open: false })}
                variant={message.variant}
            />
        </>
    );
}

export default DailyDiet;
