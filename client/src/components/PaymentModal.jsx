import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Loader2, Lock, X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, plan, onSuccess }) => {
    const [step, setStep] = useState('review'); // review, processing, success
    const [cardNumber, setCardNumber] = useState('');

    useEffect(() => {
        if (isOpen) setStep('review');
    }, [isOpen]);

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
                >
                    {step === 'review' && (
                        <>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-dark-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-lg">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Secure Checkout</h2>
                                    <p className="text-gray-400 text-sm">Powered by Linker Pay</p>
                                </div>
                            </div>

                            <div className="bg-dark-900 rounded-lg p-4 mb-6 border border-dark-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-white">{plan.name}</span>
                                    <span className="font-bold text-xl">${plan.price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-500">{plan.description}</p>
                            </div>

                            <form className="space-y-4 mb-6" onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Card Information</label>
                                    <div className="flex items-center bg-dark-700 rounded-lg px-3 border border-dark-600 focus-within:border-primary-500 transition-colors">
                                        <CreditCard size={18} className="text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="bg-transparent border-none text-white w-full py-2.5 focus:outline-none placeholder-gray-600"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                    <Lock size={16} /> Pay ${plan.price.toFixed(2)}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader2 size={48} className="text-primary-500 mb-4" />
                            </motion.div>
                            <h3 className="text-lg font-bold">Processing Payment...</h3>
                            <p className="text-gray-500">Please do not close this window.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle size={64} className="text-green-500 mb-4" />
                            </motion.div>
                            <h3 className="text-xl font-bold mb-1">Payment Successful!</h3>
                            <p className="text-gray-400">Your account has been upgraded.</p>
                        </div>
                    )}

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
