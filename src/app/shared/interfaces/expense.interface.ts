export interface Expense {
    id?: string;
    user_id?: string;
    name: string;
    amount: number;
    category: string;
    date: Date;
    icon?: string;
    iconColor?: string;
    created_at?: Date;
}
