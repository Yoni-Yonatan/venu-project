import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Store, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

type SellerType = 'individual' | 'store';

export function RegisterSeller() {
    const { register } = useStore();
    const navigate = useNavigate();

    const [sellerType, setSellerType] = useState<SellerType>('individual');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [storeName, setStoreName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const passwordStrength = (pw: string) => {
        if (pw.length === 0) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strength = passwordStrength(password);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][strength];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!documentFile) {
            setError('Please upload the required verification document.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('seller_type', sellerType);
            if (sellerType === 'store' && storeName) {
                formData.append('store_name', storeName);
            }
            if (phone) {
                formData.append('phone', phone);
            }
            formData.append('document', documentFile);

            await register(formData);
            navigate('/pending-verification');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 pb-16 px-4">
            <div className="w-full max-w-md">
                {/* Logo + Heading */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-600/20">
                        <Store size={24} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Seller Account</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Join Venu Market and start selling today
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* Account Type Toggle */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSellerType('individual')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${sellerType === 'individual'
                                    ? 'border-black bg-black text-white shadow-md'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <User size={16} />
                                Individual
                            </button>
                            <button
                                type="button"
                                onClick={() => setSellerType('store')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${sellerType === 'store'
                                    ? 'border-black bg-black text-white shadow-md'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <Store size={16} />
                                Store
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="yourname"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>

                        {/* Store Name (only for store type) */}
                        {sellerType === 'store' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input
                                    type="text"
                                    required
                                    value={storeName}
                                    onChange={e => setStoreName(e.target.value)}
                                    placeholder="My Awesome Store"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>

                        {/* Phone (optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+251 9..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>

                        {/* Document Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {sellerType === 'individual' ? 'ID Card (National ID or Kebele ID)' : 'Business License'}
                            </label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 50 * 1024 * 1024) {
                                            setError('File size must be less than 50MB');
                                            setDocumentFile(null);
                                            e.target.value = ''; // Reset input
                                            return;
                                        }
                                        setDocumentFile(file);
                                        setError('');
                                    }
                                }}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Accepts PDF or images (max 50MB).</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{ backgroundColor: i <= strength ? strengthColor : '#e5e7eb' }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {confirmPassword && password === confirmPassword && (
                                    <CheckCircle2 size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                                )}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Terms note */}
                        <p className="text-xs text-gray-400 text-center">
                            By registering, you agree to our{' '}
                            <Link to="/terms" className="text-gray-700 underline hover:text-black">Terms of Service</Link> and{' '}
                            <Link to="/privacy" className="text-gray-700 underline hover:text-black">Privacy Policy</Link>.
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                </div>

                {/* Return */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    <Link to="/register" className="font-semibold text-gray-600 hover:text-black hover:underline">
                        &larr; Back to Role Selection
                    </Link>
                </p>
            </div>
        </div>
    );
}
