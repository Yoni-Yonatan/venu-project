import React, { useState } from 'react';
import { CameraCapture } from '../components/CameraCapture';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Upload, Store, User as UserIcon, AlertTriangle } from 'lucide-react';

export function Sell() {
    const { createProduct, user } = useStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'Phones', // Default
        condition: 'used_good' // Default
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Please Login</h2>
                    <button onClick={() => navigate('/login')} className="bg-black text-white px-6 py-2 rounded-lg">Login</button>
                </div>
            </div>
        );
    }

    const isStore = user.seller_type === 'store';

    // Logic: If Individual & Not New -> Camera Mandatory
    // If Store -> File Upload Allowed
    // If Individual & New -> Technically file upload could be allowed but usually we want to restrict "New" to stores or verified. 
    // For this requirement: "Official Store (New Items) -> Upload", "Verified Individual (Used Items) -> Camera".
    // We will assume Individuals sell Used items mostly. If they select 'New', we might still enforce camera or warn them. 
    // Let's enforce: Individual = Always Camera (High Trust). Store = Upload.

    const requiresCamera = !isStore;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCapture = (file: File) => {
        setImageFile(file);
        // Camera capture component handles preview internally usually, but we can set it here if needed or just trust the file
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return alert("Image is required!");

        setIsSubmitting(true);
        const data = new FormData();
        data.append('image', imageFile);
        data.append('seller_id', user.id.toString());
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof typeof formData]);
        });

        try {
            await createProduct(data);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Failed to create listing");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
                        <p className="text-gray-500">
                            Listing as <span className="font-semibold text-black">{isStore ? user.store_name : user.username}</span>
                            ({isStore ? 'Official Store' : 'Individual Seller'})
                        </p>
                    </div>
                    {isStore ? <Store className="text-blue-600" size={32} /> : <UserIcon className="text-gray-400" size={32} />}
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    {/* Stepper */}
                    <div className="flex items-center mb-8 text-sm font-medium text-gray-400">
                        <span className={`flex items-center gap-2 ${step === 1 ? 'text-black' : 'text-green-600'}`}>
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs border border-gray-200">1</span>
                            Details
                        </span>
                        <div className="w-12 h-px bg-gray-200 mx-4"></div>
                        <span className={`flex items-center gap-2 ${step === 2 ? 'text-black' : ''}`}>
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs border border-gray-200">2</span>
                            {requiresCamera ? 'Trust Capture' : 'Product Image'}
                        </span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" placeholder="e.g. iPhone 15 Pro" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB)</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" placeholder="0.00" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition">
                                        <option>Phones</option>
                                        <option>Laptops</option>
                                        <option>Audio</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {isStore && (
                                        <label className={`border rounded-lg py-3 text-center text-sm font-medium cursor-pointer transition ${formData.condition === 'new' ? 'bg-black text-white border-black' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <input type="radio" name="condition" value="new" checked={formData.condition === 'new'} onChange={handleChange} className="hidden" />
                                            Brand New
                                        </label>
                                    )}
                                    <label className={`border rounded-lg py-3 text-center text-sm font-medium cursor-pointer transition ${formData.condition === 'used_like_new' ? 'bg-black text-white border-black' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <input type="radio" name="condition" value="used_like_new" checked={formData.condition === 'used_like_new'} onChange={handleChange} className="hidden" />
                                        Like New
                                    </label>
                                    <label className={`border rounded-lg py-3 text-center text-sm font-medium cursor-pointer transition ${formData.condition === 'used_good' ? 'bg-black text-white border-black' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <input type="radio" name="condition" value="used_good" checked={formData.condition === 'used_good'} onChange={handleChange} className="hidden" />
                                        Used (Good)
                                    </label>
                                    <label className={`border rounded-lg py-3 text-center text-sm font-medium cursor-pointer transition ${formData.condition === 'used_fair' ? 'bg-black text-white border-black' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <input type="radio" name="condition" value="used_fair" checked={formData.condition === 'used_fair'} onChange={handleChange} className="hidden" />
                                        Used (Fair)
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" required />
                            </div>

                            <button type="button" onClick={() => setStep(2)} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition">
                                Next: Asset Upload
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {requiresCamera ? (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                        <AlertTriangle className="text-amber-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-sm">Trust & Safety Policy</h4>
                                            <p className="text-amber-800 text-xs mt-1">
                                                As an individual seller, you must take a <strong>live photo</strong> of the actual item.
                                                Gallery uploads are disabled to prevent scams.
                                            </p>
                                        </div>
                                    </div>
                                    <CameraCapture onCapture={handleCapture} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                        <Store className="text-blue-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm">Official Store Account</h4>
                                            <p className="text-blue-800 text-xs mt-1">
                                                You can upload high-quality product images from your device.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition relative">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-48 mx-auto object-contain" />
                                        ) : (
                                            <div className="text-gray-400">
                                                <Upload size={48} className="mx-auto mb-3" />
                                                <p className="font-medium">Click to Upload Image</p>
                                                <p className="text-xs mt-1">JPG, PNG supported</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
                                    Back
                                </button>
                                <button type="submit" disabled={isSubmitting || !imageFile} className={`flex-1 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${isSubmitting || !imageFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
                                    {isSubmitting ? 'Publishing...' : 'Publish Product'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
