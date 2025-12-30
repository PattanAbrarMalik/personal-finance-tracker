export interface CreateCategoryData {
    name: string;
    color?: string;
    icon?: string;
}
export interface UpdateCategoryData {
    name?: string;
    color?: string;
    icon?: string;
}
/**
 * Get all categories for a user
 */
export declare const getCategories: (userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}[]>;
/**
 * Get a single category by ID
 */
export declare const getCategoryById: (categoryId: string, userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}>;
/**
 * Create a new category
 */
export declare const createCategory: (userId: string, data: CreateCategoryData) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}>;
/**
 * Update a category
 */
export declare const updateCategory: (categoryId: string, userId: string, data: UpdateCategoryData) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}>;
/**
 * Delete a category
 */
export declare const deleteCategory: (categoryId: string, userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}>;
//# sourceMappingURL=category.service.d.ts.map