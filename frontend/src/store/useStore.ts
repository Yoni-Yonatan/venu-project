import { create } from 'zustand';
import axios from 'axios';

// Uses Vite proxy in dev (/api → http://localhost:5000)
// In production, set VITE_API_URL in .env.local
const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

export interface User {
    id: number;
    username: string;
    email: string;
    is_id_verified: boolean;
    trust_score: number;
    seller_type: 'individual' | 'store';
    store_name?: string;
    avatar_url?: string;
    role?: string;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category_name: string;
    category?: string;
    image_url: string;
    condition: 'new' | 'used_like_new' | 'used_good' | 'used_fair';
    is_live_captured: boolean;
    username: string;
    seller_name?: string;
    store_name?: string;
    seller_type: 'individual' | 'store';
    seller_trust_score?: number;
    seller_verified?: boolean;
    seller_id: number;
    negotiable?: boolean;
    city?: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    seller_type: 'individual' | 'store';
    store_name?: string;
    phone?: string;
}

interface StoreState {
    user: User | null;
    products: Product[];
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData | FormData) => Promise<void>;
    fetchProducts: (filters?: Record<string, string>) => Promise<void>;
    createProduct: (formData: FormData) => Promise<void>;
    logout: () => void;

    isChatOpen: boolean;
    activeChatProduct: Product | null;
    openChat: (product: Product) => void;
    closeChat: () => void;
}

export const useStore = create<StoreState>((set) => ({
    user: null,
    products: [],
    isLoading: false,
    isChatOpen: false,
    activeChatProduct: null,

    login: async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        set({ user: res.data.user });
        localStorage.setItem('token', res.data.token);
    },

    register: async (data) => {
        const isFormData = data instanceof FormData;
        const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
        const res = await axios.post(`${API_URL}/auth/register`, data, { headers });
        set({ user: res.data.user });
        localStorage.setItem('token', res.data.token);
    },

    fetchProducts: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/products`, { params: filters });
            // API returns { total, products }
            const data = res.data;
            set({ products: Array.isArray(data) ? data : data.products ?? [] });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            set({ products: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    createProduct: async (formData) => {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    },

    logout: () => {
        set({ user: null });
        localStorage.removeItem('token');
    },

    openChat: (product) => set({ isChatOpen: true, activeChatProduct: product }),
    closeChat: () => set({ isChatOpen: false, activeChatProduct: null }),
}));
