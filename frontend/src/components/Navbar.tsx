import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, PlusCircle, User, LogOut, Menu, X, Store } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navbar() {
    const { user, logout } = useStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-gray-800 transition">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-primary">TrustMarket</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/sell" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            <PlusCircle size={18} />
                            Sell Item
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-50">
                                    {user.seller_type === 'store' ? <Store size={16} className="text-blue-600" /> : <User size={16} />}
                                    <span className="hidden sm:inline">{user.seller_type === 'store' ? user.store_name : user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 p-2">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">Login</Link>
                                <Link to="/register" className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl absolute w-full left-0 top-16">
                    <Link to="/sell" className="flex items-center gap-2 text-gray-900 font-medium p-2 bg-gray-50 rounded-lg">
                        <PlusCircle size={18} /> Sell Item
                    </Link>
                    <div className="border-t border-gray-100 pt-4">
                        {user ? (
                            <button onClick={handleLogout} className="w-full text-left text-red-600 font-medium p-2">Logout</button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" className="w-full text-center py-3 border border-gray-200 rounded-lg font-bold">Login</Link>
                                <Link to="/register" className="w-full text-center py-3 bg-black text-white rounded-lg font-bold">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
