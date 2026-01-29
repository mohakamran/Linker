import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import api from '../utils/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            // Mock API call for now since backend logic is stubbed
            // await api.post('/auth/forgot-password', { email });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            setStatus('success');
            setMessage(`If an account exists for ${email}, we have sent password reset instructions.`);
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Login
                </Link>

                <div className="card text-center">
                    <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Forgot Password?</h2>
                    <p className="text-gray-400 mb-6 text-sm">No worries, we'll send you reset instructions.</p>

                    {status === 'success' ? (
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-lg mb-4 text-sm border border-green-500/20">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {status === 'error' && (
                                <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4">
                                    {message}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full btn-primary disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
