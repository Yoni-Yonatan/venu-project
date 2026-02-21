import { Package, House, SquarePlus, User } from 'lucide-react';

import { motion } from 'framer-motion';

export function Navigation() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">LuxeMarket</span>
                    </a>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Discover</a>
                        <a href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">Sell Item</a>
                        <a href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</a>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <button className="px-4 py-2 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe md:hidden">
                <div className="flex justify-around items-center px-2 py-3">
                    <a href="/" className="flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors relative text-primary">
                        <House className="w-6 h-6 stroke-[2.5px]" />
                        <span className="text-[10px] font-medium">Home</span>
                        <motion.div
                            layoutId="nav-indicator"
                            className="absolute -top-3 w-1 h-1 bg-primary rounded-full"
                        />
                    </a>
                    <a href="/sell" className="flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors relative text-gray-400 hover:text-gray-600">
                        <SquarePlus className="w-6 h-6 stroke-[2px]" />
                        <span className="text-[10px] font-medium">Sell</span>
                    </a>
                    <a href="/profile" className="flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors relative text-gray-400 hover:text-gray-600">
                        <User className="w-6 h-6 stroke-[2px]" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </a>
                </div>
            </div>
        </>
    );
}
