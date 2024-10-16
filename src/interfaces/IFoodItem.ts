interface IFoodItem {
    id: number;
    user_id: number;
    food_id: number;
    name: string;
    calories: number;
    portion: number;
    quantity: number;
    timestamp: string;
}

export default IFoodItem;
