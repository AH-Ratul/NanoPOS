import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/instance';

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    createdAt: string;
}

export const useProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const response: any = await api.get('/products');
            return response.data;
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
            return api.post('/products', newProduct);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
            return api.patch(`/products/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
