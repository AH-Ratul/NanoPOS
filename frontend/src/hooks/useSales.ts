import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/instance';
import type { Product } from './useProducts';

export interface SaleItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Sale {
    id: string;
    totalAmount: number;
    createdAt: string;
    saleItems: SaleItem[];
}

export const useSales = () => {
    return useQuery<Sale[]>({
        queryKey: ['sales'],
        queryFn: async () => {
            const response: any = await api.get('/sales');
            return response.data;
        },
    });
};

export const useCreateSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (saleData: { items: { productId: string; quantity: number }[] }) => {
            return api.post('/sales', saleData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] }); 
        },
    });
};
