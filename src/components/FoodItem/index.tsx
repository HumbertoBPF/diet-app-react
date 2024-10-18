import { Delete } from '@mui/icons-material';
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import IFoodItem from 'interfaces/IFoodItem';
import { MouseEvent } from 'react';

interface FoodItemProps {
    foodItem: IFoodItem;
    onClick: (foodItem: IFoodItem) => void;
    onDelete: (foodItem: IFoodItem) => void;
}

function FoodItem({ foodItem, onClick, onDelete }: FoodItemProps) {
    const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onDelete(foodItem);
    };

    const nbKcals = (
        (foodItem.calories * foodItem.quantity) /
        foodItem.portion
    ).toFixed(0);

    return (
        <ListItem
            sx={{
                cursor: 'pointer',
                ':hover': {
                    background: '#f2f2f2',
                },
            }}
            onClick={() => onClick(foodItem)}
            secondaryAction={
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleDelete}
                    data-testid="delete-button"
                >
                    <Delete />
                </IconButton>
            }
            data-testid={`food-item-${foodItem.id}`}
        >
            <ListItemAvatar>
                <Avatar sx={{ p: '4px' }}>
                    <Typography
                        textAlign="center"
                        variant="caption"
                        data-testid="number-kcals"
                    >{`${nbKcals} kcals`}</Typography>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                sx={{ ml: '8px' }}
                primary={foodItem.name}
                secondary={`${foodItem.quantity} g`}
            />
        </ListItem>
    );
}

export default FoodItem;
