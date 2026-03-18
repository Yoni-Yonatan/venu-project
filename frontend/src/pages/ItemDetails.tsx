import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, ArrowLeft, Store } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';

export function ItemDetails() {
    const { id } = useParams();
    const { products, fetchProducts, openChat } = useStore();
    const [item, setItem] = useState<Product | null>(null);

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);

    useEffect(() => {
        if (products.length > 0 && id) {
            const found = products.find(l => l.id === parseInt(id));
            if (found) setItem(found);
        }
    }, [products, id]);

    if (!item) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-white pb-20 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back to Browse
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-[4/3] relative">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-contain mix-blend-multiply p-8" />

                        {item.is_live_captured && (
                            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full flex items-center gap-2">
                                <ShieldCheck size={18} className="text-accent" />
                                <span className="font-semibold text-sm">Live Photo Verified</span>
                            </div>
                        )}

                        {item.seller_type === 'store' && (
                            <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                Official Store Item
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <span className="text-secondary text-sm font-bold uppercase tracking-widest">{item.category} • {item.condition.replace('_', ' ')}</span>
                        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">{item.title}</h1>
                        <div className="text-3xl font-bold text-gray-900 mb-8">
                            {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.price)}
                        </div>

                        {/* Seller Box */}
                        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <Link to={`/seller/${item.seller_id}`} className="flex items-center gap-3 group">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${item.seller_type === 'store' ? 'bg-blue-600' : 'bg-gray-900'}`}>
                                        {item.seller_type === 'store' ? <Store size={20} /> : (item.seller_name?.[0] || 'S')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:underline">{item.seller_name}</p>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            {item.seller_type === 'store' ? (
                                                <span className="text-blue-600 font-medium">Official Retailer</span>
                                            ) : (
                                                <>Trust Score: <span className="text-black font-bold">{item.seller_trust_score || 0}%</span></>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                {item.seller_verified && (
                                    <ShieldCheck className="text-emerald-500 h-8 w-8" />
                                )}
                            </div>

                            <button
                                onClick={() => openChat(item)}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} />
                                Start chatting
                            </button>

                            {item.seller_type === 'individual' && item.condition !== 'new' && (
                                <div className="mt-4 p-3 bg-amber-50 rounded-lg flex gap-3 border border-amber-100">
                                    <div className="text-amber-500 mt-0.5">⚠️</div>
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        <strong>Safety Warning:</strong> This is a used item sold by an individual.
                                        Meet in a safe public place. Thoroughly inspect the device before payment.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-lg text-gray-500">
                            <h3 className="text-gray-900 font-bold mb-2">Description</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
