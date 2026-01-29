import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, variant = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-sm p-6 shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary-500/10 text-primary-500'}`}>
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
                        <p className="text-gray-400 mb-6">{message}</p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 text-white px-4 py-2 rounded-lg font-medium transition-colors ${variant === 'danger'
                                        ? 'bg-red-600 hover:bg-red-500'
                                        : 'bg-primary-600 hover:bg-primary-500'
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
