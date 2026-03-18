import { Shield, Lock, Eye } from 'lucide-react';

export function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg text-gray-600">
                        <p className="lead">
                            At <strong>Venu Market</strong> ("we", "our", or "us"), we prioritize your trust. This Privacy Policy outlines how we collect, use, and protect your information when you use our Peer-to-Peer marketplace in Ethiopia.
                        </p>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <Eye size={24} className="text-blue-600" />
                            1. Information We Collect
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, phone number, and password.</li>
                            <li><strong>Identity Verification Data:</strong> Government-issued ID cards (Kebele ID, Passport, or Driving License) and selfie photos. This is mandatory for "Verified Individual" sellers to build trust.</li>
                            <li><strong>Listing Data:</strong> Photos, descriptions, and pricing of items you sell.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our platform.</li>
                        </ul>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <Lock size={24} className="text-emerald-600" />
                            2. How We Use Your Information
                        </h3>
                        <p>We use your data solely to operate and improve Venu Market:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Verification Service:</strong> To verify your identity and award you the "Verified Seller" badge, reducing scams.</li>
                            <li><strong>Marketplace Operations:</strong> To display your listings and facilitate failed/successful transaction records.</li>
                            <li><strong>Safety:</strong> To detect and prevent fraud, spam, and illegal activities.</li>
                        </ul>

                        <h3 className="flex items-center gap-2 text-gray-900 mt-8 mb-4">
                            <Shield size={24} className="text-gray-800" />
                            3. Data Protection & Sharing
                        </h3>
                        <p>
                            We do <strong>not</strong> sell your personal data to third parties. We only share information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Legal Requirements:</strong> If required by Ethiopian law enforcement or regulatory authorities.</li>
                            <li><strong>Service Providers:</strong> Secure third-party services that help us run our app (e.g., cloud hosting), bound by strict confidentiality.</li>
                        </ul>

                        <h3 className="text-gray-900 mt-8 mb-4">4. Camera & Location</h3>
                        <p>
                            For individual sellers listing "Used" items, we require real-time access to your camera to capture "Live Photos". This ensures that the item is physically in your possession at the time of listing. We may ask for location permission to deter fraud.
                        </p>

                        <h3 className="text-gray-900 mt-8 mb-4">5. Contact Us</h3>
                        <p>
                            If you have questions about this policy, please contact us at <a href="mailto:privacy@venumarket.et" className="text-blue-600 underline">privacy@venumarket.et</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
