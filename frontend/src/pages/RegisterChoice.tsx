import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Store } from 'lucide-react';

export function RegisterChoice() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20 pb-20 px-4">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-2xl mb-6 shadow-xl">
                    <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Join Venu Market</h1>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                    How would you like to use our platform today?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
                {/* Buyer Card */}
                <button
                    onClick={() => navigate('/register-buyer')}
                    className="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-black shadow-sm hover:shadow-2xl transition-all duration-300 text-left flex flex-col h-full transform hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShoppingCart size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Buyer</h2>
                    <p className="text-gray-500 mb-8 flex-1">
                        Looking for great deals? Sign up to browse verified listings, save your favorite items, and chat securely with sellers.
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                        Create Buyer Account &rarr;
                    </div>
                </button>

                {/* Seller Card */}
                <button
                    onClick={() => navigate('/register-seller')}
                    className="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-black shadow-sm hover:shadow-2xl transition-all duration-300 text-left flex flex-col h-full transform hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Store size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Seller</h2>
                    <p className="text-gray-500 mb-8 flex-1">
                        Want to reach thousands of buyers? Sign up to list your items, build your trust score, and manage your sales.
                    </p>
                    <div className="inline-flex items-center text-emerald-600 font-bold group-hover:gap-2 transition-all">
                        Create Seller Account &rarr;
                    </div>
                </button>
            </div>

            <p className="text-center mt-12 text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-black hover:underline">
                    Log in here
                </Link>
            </p>
        </div>
    );
}
