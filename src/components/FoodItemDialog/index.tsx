import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Typography } from '@mui/material';
import {
    ChangeEvent,
    FormEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import IFood from 'interfaces/IFood';
import { useParams } from 'react-router-dom';
import Snackbar from 'components/Snackbar';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import IFoodItem from 'interfaces/IFoodItem';
import { createFoodItem, getFoods, updateFoodItem } from 'api/endpoints';

interface AddFoodItemDialogProps {
    foodItem?: IFoodItem;
    open: boolean;
    onClose: () => void;
    onSuccess: (foodItem: IFoodItem) => void;
}

function FoodItemDialog({
    foodItem,
    open,
    onClose,
    onSuccess,
}: AddFoodItemDialogProps) {
    const [foods, setFoods] = useState<IFood[]>([]);
    const [foodSearch, setFoodSearch] = useState('');
    const [food, setFood] = useState<IFood | undefined>();
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState(new Map());

    const [message, setMessage] = useState<ISnackbarMessage>({
        text: '',
        open: false,
        variant: 'success',
    });

    const params = useParams();
    const { date } = params;

    const query = useRef<string>('');

    const dialogTitle = foodItem ? 'Update entry' : 'Add entry';
    const actionButtonText = foodItem ? 'Update' : 'Add';

    const fillForm = (foodItem?: IFoodItem) => {
        setFoodSearch(foodItem?.name ?? '');
        setFood(
            foodItem && {
                id: foodItem.food_id,
                name: foodItem.name,
                calories: foodItem.calories,
                portion: foodItem.portion,
            }
        );
        setQuantity(String(foodItem?.quantity ?? ''));
    };

    const clearForm = () => {
        setFoodSearch('');
        setFood(undefined);
        setQuantity('');
        setErrors(new Map());
    };

    useEffect(() => {
        if (open) {
            fillForm(foodItem);
            return;
        }

        clearForm();
    }, [open, foodItem]);

    const handleSelectFood = (
        event: SyntheticEvent<Element, Event>,
        value: string | IFood | null
    ) => {
        if (value !== null) {
            const food = foods.find((food) => food.id === (value as IFood).id);
            setFood(food);
            return;
        }

        setFood(undefined);
    };

    const filterFood = (
        event: SyntheticEvent<Element, Event>,
        value: string
    ) => {
        const searchParams = new URLSearchParams();

        searchParams.set('name', value);
        query.current = value;

        getFoods(searchParams)
            .then((response) => {
                const { data, request } = response;
                const { responseURL } = request;

                if (
                    responseURL ===
                    `${process.env.REACT_APP_HTTP_API_URL}/food?name=${query.current}`
                ) {
                    setFoods(data);
                }
            })
            .catch(() => {});

        setFoodSearch(value);
    };

    const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuantity(value.replace(/\D/, ''));
    };

    const validateForm = () => {
        const errors = new Map();

        if (food === undefined) {
            errors.set('food', 'This field is required');
        } else {
            errors.delete('food');
        }

        if (quantity) {
            errors.delete('quantity');
        } else {
            errors.set('quantity', 'This field is required');
        }

        return errors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = validateForm();

        setErrors(errors);

        if (errors.size > 0) {
            return;
        }

        if (foodItem === undefined) {
            createFoodItem({
                food_id: food!.id,
                quantity: Number(quantity),
                timestamp: `${date}T00:00:00.000Z`,
            })
                .then((response) => {
                    const { data } = response;

                    setMessage({
                        open: true,
                        variant: 'success',
                        text: 'Entry successfully created',
                    });

                    onSuccess(data);
                    onClose();
                })
                .catch(() => {
                    setMessage({
                        open: true,
                        variant: 'error',
                        text: 'An error occurred when creating entry',
                    });
                });
            return;
        }

        updateFoodItem(foodItem.id, {
            food_id: food!.id,
            quantity: Number(quantity),
            timestamp: foodItem.timestamp,
        })
            .then((response) => {
                const { data } = response;

                setMessage({
                    open: true,
                    variant: 'success',
                    text: 'Entry successfully updated',
                });

                onSuccess(data);
                onClose();
            })
            .catch(() => {
                setMessage({
                    open: true,
                    variant: 'error',
                    text: 'An error occurred when updating entry',
                });
            });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        filterOptions={(x) => x}
                        freeSolo
                        onChange={handleSelectFood}
                        onInputChange={filterFood}
                        options={foods.map((food) => ({
                            label: food.name,
                            ...food,
                        }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={errors.has('food')}
                                helperText={errors.get('food')}
                                label="Food"
                                variant="standard"
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        type: 'search',
                                    },
                                    htmlInput: {
                                        ...params.inputProps,
                                        'data-testid':
                                            'food-autocomplete-input',
                                    },
                                    formHelperText: {
                                        // @ts-expect-error error due to data-testid
                                        'data-testid':
                                            'food-autocomplete-error',
                                    },
                                }}
                            />
                        )}
                        value={foodSearch}
                        sx={{ mt: '4px' }}
                        data-testid="food-autocomplete"
                    />

                    {food && (
                        <Box mt="8px">
                            <Typography variant="body2">{food.name}</Typography>
                            <Typography variant="caption">
                                {food.calories} kcal / {food.portion} g
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        error={errors.has('quantity')}
                        helperText={errors.get('quantity')}
                        id="quantity"
                        name="quantity"
                        label="Quantity"
                        fullWidth
                        onChange={handleChangeQuantity}
                        sx={{ mt: '8px' }}
                        value={quantity}
                        variant="standard"
                        slotProps={{
                            htmlInput: {
                                'data-testid': 'quantity-input',
                            },
                            formHelperText: {
                                // @ts-expect-error error due to data-testid
                                'data-testid': 'quantity-error',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" data-testid="submit-button">
                        {actionButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                text={message.text}
                open={message.open}
                onClose={() => setMessage({ ...message, open: false })}
                variant={message.variant}
            />
        </>
    );
}

export default FoodItemDialog;
