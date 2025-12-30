import { SavingsGoal } from '@prisma/client';
export interface CreateSavingsGoalData {
    name: string;
    description?: string;
    targetAmount: number;
    category?: string;
    icon?: string;
    color?: string;
    deadline?: Date;
    priority?: string;
}
export interface UpdateSavingsGoalData extends Partial<CreateSavingsGoalData> {
}
export declare const savingsGoalService: {
    getGoalsByUserId(userId: string): Promise<SavingsGoal[]>;
    getGoalById(id: string): Promise<SavingsGoal | null>;
    createGoal(userId: string, data: CreateSavingsGoalData): Promise<SavingsGoal>;
    updateGoal(id: string, data: UpdateSavingsGoalData): Promise<SavingsGoal>;
    deleteGoal(id: string): Promise<SavingsGoal>;
    addAmountToGoal(id: string, amount: number): Promise<SavingsGoal>;
    getUserSavingsStats(userId: string): Promise<{
        totalGoals: number;
        completedGoals: number;
        totalTargetAmount: number;
        totalCurrentAmount: number;
        progressPercentage: number;
        averageProgressPercentage: number;
    }>;
};
//# sourceMappingURL=savingsGoal.service.d.ts.map