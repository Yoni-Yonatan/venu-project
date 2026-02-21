import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 group mb-6">
                            <div className="bg-black text-white p-1.5 rounded-lg">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">TrustMarket</span>
                        </Link>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Ethiopia's safest peer-to-peer marketplace.
                            We verify sellers so you can buy with confidence.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition"><Instagram size={18} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Marketplace</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-black transition">Browse Items</Link></li>
                            <li><Link to="/sell" className="hover:text-black transition">Sell an Item</Link></li>
                            <li><Link to="/login" className="hover:text-black transition">Login / Register</Link></li>
                            <li><a href="#" className="hover:text-black transition">Safety Tips</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Legal & Support</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/terms" className="hover:text-black transition">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
                            <li><a href="#" className="hover:text-black transition">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} TrustMarket ET. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
                        <Link to="/terms" className="hover:text-gray-600">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
