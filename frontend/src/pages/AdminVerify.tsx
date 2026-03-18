import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface VerificationRequest {
    id: number;
    user_id: number;
    username: string;
    email: string;
    id_image_url: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export function AdminVerify() {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/verifications?status=Pending`);
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to load verification requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await axios.patch(`${API_URL}/admin/verify/${id}`, {
                status: action === 'approve' ? 'Approved' : 'Rejected',
                reviewed_by: 1,
            });
            setRequests(requests.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
        } catch (error) {
            alert('Action failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="text-black" size={32} />
                    <h1 className="text-3xl font-bold text-gray-900">Admin Verification</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold">Pending Requests</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending verification requests.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map(req => (
                                <div key={req.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{req.username}</h3>
                                            <p className="text-sm text-gray-500">{req.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <div className="mb-6 max-w-lg">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Submitted Document (ID or Business License)</p>
                                        <div className="bg-gray-100 rounded-lg aspect-auto overflow-hidden border border-gray-200">
                                            {req.id_image_url.toLowerCase().endsWith('.pdf') ? (
                                                <div className="p-8 text-center text-gray-500">
                                                    <p className="mb-4">This document is a PDF.</p>
                                                    <a href={req.id_image_url} target="_blank" rel="noreferrer" className="text-blue-500 underline">View PDF</a>
                                                </div>
                                            ) : (
                                                <a href={req.id_image_url} target="_blank" rel="noreferrer">
                                                    <img src={req.id_image_url} alt="Submitted Document" className="w-full h-auto max-h-96 object-contain bg-white" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {req.status === 'Pending' && (
                                        <div className="flex gap-4">
                                            <button onClick={() => handleAction(req.id, 'approve')} className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
                                                <Check size={18} /> Approve
                                            </button>
                                            <button onClick={() => handleAction(req.id, 'reject')} className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2">
                                                <X size={18} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
