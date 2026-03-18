import { Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PendingVerification() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="text-emerald-500" size={40} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
                <p className="text-gray-500 mb-8">
                    Your account has been created. However, your ID/Business License is currently under review by our admin team.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <span className="text-sm text-gray-600">Our team will verify your submitted documents.</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <span className="text-sm text-gray-600">This process usually takes up to 24 hours.</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <span className="text-sm text-gray-600">You will be notified once your account is fully approved to start selling.</span>
                        </li>
                    </ul>
                </div>

                <Link
                    to="/"
                    className="inline-block w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg shadow-black/10"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
