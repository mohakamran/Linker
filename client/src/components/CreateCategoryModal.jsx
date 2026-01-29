import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateCategoryModal = ({ isOpen, onClose, onCreate, initialName = '', isEdit = false }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset name when opening or changing mode
    // We use a key or effect in parent usually, or effect here
    // Let's use effect
    React.useEffect(() => {
        if (isOpen) setName(initialName);
    }, [isOpen, initialName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onCreate(name);
        setLoading(false);
        setName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{isEdit ? 'Rename Collection' : 'New Collection'}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Collection Name
                            </label>
                            <input
                                type="text"
                                autoFocus
                                required
                                className="input-field"
                                placeholder="e.g. Wedding Shoot 2024"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? 'Saving...' : (isEdit ? 'Rename' : 'Create Collection')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateCategoryModal;
