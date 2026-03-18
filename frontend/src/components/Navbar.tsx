import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    MessageSquare,
    Tag,
    LayoutGrid,
    Camera,
    QrCode,
    ChevronDown,
    Apple,
    Play
} from 'lucide-react';
import { useStore } from '../store/useStore';

const LANGUAGES = [
    { code: 'EN', label: 'English - EN', flag: '🇺🇸' },
    { code: 'AM', label: 'አማርኛ - AM', flag: '🇪🇹' },
    { code: 'FR', label: 'Français - FR', flag: '🇫🇷' },
    { code: 'AR', label: 'العربية - AR', flag: '🇸🇦' },
];

export function Navbar() {
    const { user, logout } = useStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('EN');
    const [langOpen, setLangOpen] = useState(false);
    const [imageSearchOpen, setImageSearchOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const closeTimeout = useRef<number | null>(null);
    const closeTimeoutLang = useRef<number | null>(null);
    const closeTimeoutQr = useRef<number | null>(null);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Typing Animation Logic
    const [placeholder, setPlaceholder] = useState("");
    const [productIndex, setProductIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    const products = [
        "iphone 13 pro max",
        "dji pocket 3 osmo",
        "airpods pro 2nd gen",
        "macbook air m3",
        "playstation 5 slim",
        "sony wh-1000xm5",
        "nintendo switch oled",
        "canon eos r6 mark ii",
        "ipad air m2",
        "dyson v15 detect",
        "samsung galaxy s24 ultra",
        "mechanical keyboard custom",
        "gaming mouse wireless",
        "portable power station"
    ];

    useEffect(() => {
        const currentProduct = products[productIndex];
        let timeout: any;

        if (isTyping) {
            if (placeholder.length < currentProduct.length) {
                timeout = setTimeout(() => {
                    setPlaceholder(currentProduct.slice(0, placeholder.length + 1));
                }, 100);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 2000);
            }
        } else {
            if (placeholder.length > 0) {
                timeout = setTimeout(() => {
                    setPlaceholder(placeholder.slice(0, placeholder.length - 1));
                }, 50);
            } else {
                setProductIndex((prev) => (prev + 1) % products.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [placeholder, productIndex, isTyping]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };



    const handleImageSearchHover = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
        setImageSearchOpen(true);
    };

    const handleImageSearchLeave = () => {
        closeTimeout.current = window.setTimeout(() => {
            setImageSearchOpen(false);
        }, 300);
    };

    const handleLangHover = () => {
        if (closeTimeoutLang.current) {
            clearTimeout(closeTimeoutLang.current);
            closeTimeoutLang.current = null;
        }
        setLangOpen(true);
    };

    const handleLangLeave = () => {
        closeTimeoutLang.current = window.setTimeout(() => {
            setLangOpen(false);
        }, 300);
    };

    const handleQrHover = () => {
        if (closeTimeoutQr.current) {
            clearTimeout(closeTimeoutQr.current);
            closeTimeoutQr.current = null;
        }
        setQrOpen(true);
    };

    const handleQrLeave = () => {
        closeTimeoutQr.current = window.setTimeout(() => {
            setQrOpen(false);
        }, 300);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            console.log('Image dropped:', file.name);
            setImageSearchOpen(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Searching by image:", file.name);
            // Implement image search logic here
        }
    };

    const navItems = [
        { label: 'Browse', path: '/', icon: LayoutGrid },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Inbox', path: '/inbox', icon: MessageSquare },
        { label: 'Buying', path: '/buying', icon: ShoppingBag },
        { label: 'Selling', path: '/selling', icon: Tag },
    ];

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 absolute top-0 z-50">
            <nav className="max-w-[1600px] mx-auto bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-[2rem]">
                <div className="flex items-center justify-between h-20 px-6 lg:px-8 gap-4">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="text-white bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={28} fill="currentColor" strokeWidth={1} />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tighter text-black hidden xl:block">
                            Venu<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Center: Wide Search Bar */}
                    <div className="flex-1 flex justify-center min-w-[200px] max-w-[650px] mx-4 lg:mx-6">
                        <div className="relative w-full hidden md:block group">
                            {/* Search bar pill container */}
                            <div className="flex items-center bg-white border-2 border-primary/20 hover:border-primary focus-within:border-primary rounded-full transition-all shadow-sm group-hover:shadow-md h-11 pr-1">
                                <div className="flex-1 relative h-full flex items-center">
                                    <input
                                        type="text"
                                        placeholder={placeholder}
                                        className="w-full h-full bg-transparent border-none py-0 px-5 text-[14px] focus:ring-0 text-black placeholder:text-gray-400 font-medium transition-all"
                                    />
                                    {isTyping && placeholder.length < products[productIndex].length && (
                                        <span className="absolute left-[calc(1.25rem+placeholder.length*8px)] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary animate-pulse ml-0.5" />
                                    )}
                                </div>

                                <div className="flex items-center h-full gap-1">
                                    {/* Camera button — inside the pill */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div
                                        className="relative shrink-0"
                                        onMouseEnter={handleImageSearchHover}
                                        onMouseLeave={handleImageSearchLeave}
                                    >
                                        <button
                                            className={`p-2 rounded-full transition-all active:scale-90 ${imageSearchOpen
                                                ? 'text-primary bg-primary/10'
                                                : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                                }`}
                                            title="Search by image"
                                        >
                                            <Camera size={20} className="stroke-[2px]" />
                                        </button>

                                        {/* Search by image panel */}
                                        <div
                                            className={`absolute top-[calc(100%+8px)] right-0 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-5 transition-all duration-200 origin-top-right ${imageSearchOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                                                }`}
                                        >
                                            {/* Arrow */}
                                            <div className="absolute -top-[7px] right-3 w-3.5 h-3.5 bg-white border-l border-t border-gray-200 rotate-45" />

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[16px] font-bold text-gray-900">Search by image</span>
                                                <button
                                                    onClick={() => setImageSearchOpen(false)}
                                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
                                                Find what you love with better prices on Venu by using an image search
                                            </p>

                                            {/* Drag zone */}
                                            <div
                                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={handleDrop}
                                                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-1">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                                <span className="text-[14px] font-medium text-gray-600">Drag an image here</span>
                                                <span className="text-[12px] text-gray-400">or</span>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="mt-1 bg-black text-white text-[13px] font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
                                                >
                                                    Upload a photo
                                                </button>
                                            </div>

                                            <p className="text-[12px] text-gray-400 mt-4 text-center">
                                                *For a quick search hit{' '}
                                                <kbd className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-sans text-[11px] font-semibold text-gray-600">CTRL+V</kbd>
                                                {' '}to paste
                                            </p>
                                        </div>
                                    </div>

                                    <button className="bg-[#191919] text-white h-[38px] px-6 rounded-full hover:bg-black transition-all active:scale-95 flex items-center justify-center shadow-md">
                                        <Search size={18} className="stroke-[3px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 xl:gap-6 shrink-0 text-black">
                        {/* Download App (QR) — with dropdown */}
                        <div
                            className="hidden xl:flex flex-col items-center justify-center cursor-pointer relative group"
                            onMouseEnter={handleQrHover}
                            onMouseLeave={handleQrLeave}
                        >
                            <QrCode size={28} strokeWidth={1.5} className={`transition-transform duration-200 ${qrOpen ? '-translate-y-0.5 text-primary' : 'group-hover:-translate-y-0.5'}`} />

                            {/* QR Dropdown Panel */}
                            <div className={`absolute top-[calc(100%+15px)] -left-48 w-[380px] bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 p-6 transition-all duration-300 origin-top-right ${qrOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {/* Arrow */}
                                <div className="absolute -top-[7px] left-[200px] w-3.5 h-3.5 bg-white border-l border-t border-gray-100 rotate-45" />

                                <div className="flex items-center gap-6">
                                    {/* QR Code Placeholder */}
                                    <div className="shrink-0 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <div className="w-32 h-32 bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden relative group">
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://venu.market"
                                                alt="QR Code"
                                                className="w-28 h-28 mix-blend-multiply"
                                            />
                                            {/* App Logo overlay in center of QR (optional for premium feel) */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-md">
                                                    <div className="w-full h-full bg-primary rounded-md" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-[18px] font-bold text-gray-900 mb-1 leading-tight">Download the Venu app</h4>
                                        <p className="text-[13px] text-gray-500 mb-5">Scan the QR code to download and start shopping on the go!</p>

                                        <div className="flex flex-col gap-2.5">
                                            <button className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] group/btn">
                                                <Apple size={20} className="fill-white" />
                                                <div className="text-left">
                                                    <div className="text-[10px] uppercase font-medium leading-none opacity-60">Download on the</div>
                                                    <div className="text-[15px] font-bold leading-none">App Store</div>
                                                </div>
                                            </button>

                                            <button className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] group/btn">
                                                <Play size={18} className="fill-white" />
                                                <div className="text-left">
                                                    <div className="text-[10px] uppercase font-medium leading-none opacity-60">Get it on</div>
                                                    <div className="text-[15px] font-bold leading-none">Google Play</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Language/Country Dropdown */}
                        <div
                            className="hidden lg:flex items-center gap-1 cursor-pointer relative"
                            onMouseEnter={handleLangHover}
                            onMouseLeave={handleLangLeave}
                        >
                            {/* Trigger: just code + chevron, no flag */}
                            <span className="text-[13px] font-bold tracking-wide">{selectedLang}</span>
                            <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 text-gray-500 ${langOpen ? 'rotate-180' : ''}`}
                            />

                            {/* Dropdown panel — flush below navbar */}
                            <div
                                className={`absolute top-[calc(100%+18px)] right-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-200 origin-top ${langOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                            >
                                {/* Arrow */}
                                <div className="absolute -top-[7px] right-4 w-3.5 h-3.5 bg-white border-l border-t border-gray-200 rotate-45" />

                                <div className="px-4 pt-4 pb-2">
                                    <p className="text-[13px] font-semibold text-gray-700 mb-3">Change language</p>
                                    <div className="flex flex-col gap-0.5">
                                        {LANGUAGES.map((lang) => (
                                            <label
                                                key={lang.code}
                                                className="flex items-center gap-3 py-2.5 px-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group"
                                                onClick={() => {
                                                    setSelectedLang(lang.code);
                                                    setLangOpen(false);
                                                }}
                                            >
                                                <span className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${selectedLang === lang.code
                                                    ? 'border-primary'
                                                    : 'border-gray-300 group-hover:border-gray-400'
                                                    }`}>
                                                    {selectedLang === lang.code && (
                                                        <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                                                    )}
                                                </span>
                                                <span className="text-base leading-none">{lang.flag}</span>
                                                <span className="text-[13px] font-medium text-gray-700">{lang.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 mx-4" />
                                <div className="flex items-center gap-1.5 px-4 py-3">
                                    <span className="text-base">🛒</span>
                                    <span className="text-[13px] text-gray-500">You are shopping on</span>
                                    <span className="text-[13px] font-semibold text-gray-800">Venu.com</span>
                                </div>
                                <div className="px-4 pb-4">
                                    <button className="text-[13px] text-primary font-medium hover:underline">
                                        Change country/region.
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account / Sign In */}
                        {user ? (
                            <Link to="/profile" className="hidden xl:flex items-center gap-2 hover:text-primary transition-colors group">
                                <User size={30} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] text-gray-500 font-medium leading-none">Welcome back,</span>
                                    <span className="text-[13px] font-bold leading-tight truncate max-w-[90px]">{user.username}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/login" className="hidden lg:flex items-center gap-2 hover:text-primary transition-colors group">
                                <User size={30} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] text-gray-500 font-medium leading-[1]">Welcome</span>
                                    <span className="text-[13px] font-bold leading-tight">Sign in / Register</span>
                                </div>
                            </Link>
                        )}

                        {/* Cart/Bag */}
                        <Link to="/cart" className="hidden lg:flex items-center gap-1.5 hover:text-primary transition-colors group relative">
                            <div className="relative">
                                <ShoppingBag size={30} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                                    0
                                </span>
                            </div>
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex lg:hidden items-center gap-2">
                            <button className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                                <Search size={22} strokeWidth={2} />
                            </button>
                            <Link to="/cart" className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors relative">
                                <ShoppingBag size={22} strokeWidth={2} />
                                <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </Link>
                            <button className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Expansion */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 p-6 space-y-4 shadow-inner">
                        <div className="flex flex-col gap-2 font-bold text-gray-800 text-base">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon size={20} className="text-gray-500" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-2">
                            {user ? (
                                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition-colors">
                                    <LogOut size={22} /> Logout
                                </button>
                            ) : (
                                <Link to="/login" className="block w-full text-center py-4 border-2 border-primary text-primary rounded-2xl font-bold active:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}
