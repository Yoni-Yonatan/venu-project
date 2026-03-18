import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown, Filter } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

export function Home() {
    const { products, fetchProducts, isLoading } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        fetchProducts(selectedCategory ? { category: selectedCategory.toLowerCase().replace(/\s+/g, '-') } : {});
    }, [fetchProducts, selectedCategory]);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section (Restored) */}
            <div
                className="relative bg-white border-b border-gray-100 py-48 px-4 mb-4 overflow-hidden -mt-28"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.24)), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 tracking-tight">
                        The Safest Place to Buy Used Tech.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-800 mb-8 font-medium">
                        Verified sellers. Verified devices. No scams.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition shadow-xl shadow-black/30 text-lg">
                            Browse Marketplace
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Minimalist Controls */}
                <div className="sticky top-16 bg-white/90 backdrop-blur z-30 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-50">

                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
                        {['All', 'Phones', 'Laptops', 'Audio', 'Accessories'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${(selectedCategory === cat || (cat === 'All' && !selectedCategory))
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort/Filter Dropdowns (Clean) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition">
                            <Filter size={16} /> Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition ml-auto sm:ml-0">
                            Newest <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Listings Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCategory ? `${selectedCategory}` : 'Fresh Drops'}
                        </h2>
                        <span className="text-sm text-gray-500">{products.length} Items</span>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-50 rounded-2xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
