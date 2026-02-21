import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../store/useStore';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const isNew = product.condition === 'new';

    return (
        <Link to={`/item/${product.id}`} className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-gray-100 flex flex-col h-full">
            {/* Image Area */}
            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                />

                {/* Minimalist Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isNew && (
                        <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-600/20 backdrop-blur-md">
                            OFFICIAL STORE
                        </div>
                    )}
                    {product.seller_verified && !isNew && (
                        <div className="bg-emerald-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 backdrop-blur-md flex items-center gap-1">
                            <ShieldCheck size={12} /> VERIFIED
                        </div>
                    )}
                </div>

                {product.is_live_captured && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                        LIVE PHOTO
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                    {isNew ? (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">WARRANTY</span>
                    ) : (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.condition === 'used_like_new' ? 'LIKE NEW' : 'USED'}</span>
                    )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-black line-clamp-2">
                    {product.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Sold by {product.seller_name}</p>
                        <div className="text-xl font-extrabold text-gray-900">
                            {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(product.price)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
