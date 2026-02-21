import React from 'react';
import { AlertTriangle, Handshake, Gavel } from 'lucide-react';

export function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg text-gray-600">
                        <p className="lead">
                            Welcome to <strong>TrustMarket</strong>. By accessing our platform, you agree to these Terms. TrustMarket is a Peer-to-Peer marketplace operating in Ethiopia.
                        </p>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <Handshake size={24} className="text-blue-600" />
                            1. Nature of the Platform
                        </h3>
                        <p>
                            TrustMarket is a venue that connects buyers and sellers. <strong>We are not a party to any transaction</strong> between users. We do not own, sell, or inspect the items (except for "Official Store" partners where specified).
                        </p>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <AlertTriangle size={24} className="text-amber-500" />
                            2. Payments & Safety
                        </h3>
                        <p>
                            <strong>Cash on Delivery (CoD) Only:</strong> Currently, TrustMarket does not process payments. All transactions are handled directly between users via Cash or Bank Transfer upon meeting.
                        </p>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                            <strong>Safety Warning:</strong> You agree to meet in safe, public locations (e.g., malls, cafes) during daylight hours. Do NOT transfer money before visually inspecting the item. TrustMarket is not liable for financial loss or physical harm.
                        </div>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <Gavel size={24} className="text-gray-800" />
                            3. User Conduct & Verification
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Prohibited Items:</strong> You may not sell illegal drugs, weapons, stolen goods, or counterfeit items.</li>
                            <li><strong>Identity Verification:</strong> To sell used items as an individual, you must verify your identity. Providing false documents will result in a permanent ban.</li>
                            <li><strong>Live Capture:</strong> You agree not to bypass our "Live Camera" feature using emulators or fake camera software.</li>
                        </ul>

                        <h3 className="text-gray-900 mt-8 mb-4">4. Disclaimers</h3>
                        <p>
                            The service is provided "AS IS". We make no warranties about the quality or safety of items sold by users. "Verified" status indicates that ID documents were submitted, but it is not a guarantee of a user's character.
                        </p>

                        <h3 className="text-gray-900 mt-8 mb-4">5. Governing Law</h3>
                        <p>
                            These Terms are governed by the laws of Ethiopia. Any disputes shall be resolved in the courts of Addis Ababa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
