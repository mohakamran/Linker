import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import PaymentModal from '../components/PaymentModal';
import { Save, Trash2, User, Lock, CreditCard, Star, Zap } from 'lucide-react';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // UI States
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [message, setMessage] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setMessage(''), 3000);
    }

    const handleDeleteAccount = () => {
        alert("Account deletion logic would go here (requires backend endpoint DELETE /auth/account)");
        logout();
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        alert(`Successfully subscribed to ${selectedPlan.name}!`);
        // Here we would call backend to update user.isPremium = true or user.storageLimit += 5GB
    };

    const plans = [
        { name: 'Starter', price: 0, description: '1GB Storage Limit', features: ['1GB Storage', 'Basic Support'], current: true },
        { name: 'Pro Creator', price: 9.99, description: '5GB Cloud Storage', features: ['5GB Storage', 'Priority Support', 'No Per-File Fees'], recommended: true },
        { name: 'Pay-As-You-Go', price: 0.25, description: 'Per Upload after limit', features: ['Unlimited Potential', 'Pay only for what you use'], type: 'usage' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings & Billing</h1>

            {/* Plans Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="text-yellow-500" size={24} /> Subscription Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`card relative flex flex-col ${plan.recommended ? 'border-primary-500/50 bg-primary-500/5' : ''}`}>
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    RECOMMENDED
                                </div>
                            )}
                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                            <div className="text-2xl font-bold mb-2">
                                ${plan.price}<span className="text-sm text-gray-400 font-normal">{plan.type === 'usage' ? '/img' : '/mo'}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                            <ul className="space-y-2 mb-6 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="text-sm flex items-center gap-2">
                                        <Zap size={14} className="text-green-500" /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !plan.current && plan.type !== 'usage' && handlePlanSelect(plan)}
                                disabled={plan.current || plan.type === 'usage'}
                                className={`w-full py-2 rounded-lg font-medium transition-colors ${plan.current || plan.type === 'usage'
                                        ? 'bg-dark-700 text-gray-400 cursor-default'
                                        : plan.recommended ? 'btn-primary' : 'btn-secondary'
                                    }`}
                            >
                                {plan.current ? 'Current Plan' : plan.type === 'usage' ? 'Enabled on Limit' : 'Upgrade'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="card h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary-500/10 text-primary-500 rounded-full">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Profile Details</h2>
                            <p className="text-sm text-gray-400">Update personal info</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        {message && (
                            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg text-sm border border-green-500/20">
                                {message}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="input-field opacity-50 cursor-not-allowed"
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary flex items-center gap-2">
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="card h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-accent-500/10 text-accent-500 rounded-full">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Password</h2>
                            <p className="text-sm text-gray-400">Secure your account</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn-secondary flex items-center gap-2">
                                <Save size={18} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
                        <p className="text-sm text-gray-400">Irreversible account actions</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-white">Delete Account</p>
                        <p className="text-xs text-gray-500">Permanently remove your account and all data.</p>
                    </div>
                    <button
                        onClick={() => setConfirmOpen(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm font-bold"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="This will permanently delete your account and all data. There is no going back."
            />

            <PaymentModal
                isOpen={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                plan={selectedPlan || { name: '', price: 0 }}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default SettingsPage;
