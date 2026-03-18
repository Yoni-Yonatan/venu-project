import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, Store, MapPin, Calendar, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export function SellerProfile() {
    const { id } = useParams();
    const [seller, setSeller] = useState<any>(null);
    const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/${id}`);
                setSeller({ ...res.data, id });
                setSellerProducts(res.data.products ?? []);
            } catch (error) {
                console.error('Failed to load seller profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading Profile...</div>;
    if (!seller) return <div className="min-h-screen pt-24 text-center">Seller not found</div>;

    const isStore = seller.seller_type === 'store';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                            {isStore ? <Store size={40} /> : seller.username[0].toUpperCase()}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                                {isStore ? seller.store_name : seller.username}
                                {seller.is_id_verified && <ShieldCheck className="text-emerald-500" />}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1"><MapPin size={14} /> Addis Ababa, ET</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {seller.joined_date || '2024'}</span>
                                <span className="flex items-center gap-1 text-black font-semibold">
                                    <Star size={14} className="fill-black" /> {seller.trust_score}% Trust Score
                                </span>
                            </div>

                            <div className="mt-4 inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700 uppercase tracking-wide">
                                {isStore ? 'Official Verified Store' : 'Verified Individual Seller'}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
                                start chating
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listings */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-6">Active Listings ({sellerProducts.length})</h2>
                {sellerProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
                        No active listings found.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sellerProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
