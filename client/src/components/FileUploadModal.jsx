import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud, File, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import PaymentModal from './PaymentModal';

const FileUploadModal = ({ isOpen, onClose, categoryId, onUploadComplete }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Payment State
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [requiredCost, setRequiredCost] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': []
        }
    });

    const removeFile = (name) => {
        setFiles(files.filter(f => f.name !== name));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setError('');

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('categoryId', categoryId);

                try {
                    await api.post('/media/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } catch (err) {
                    if (err.response && err.response.status === 402) {
                        setRequiredCost(err.response.data.cost);
                        setPaymentOpen(true);
                        setUploading(false);
                        return; // Stop uploading
                    }
                    throw err;
                }
            }
            onUploadComplete();
            setFiles([]);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to upload some files. Please try again.');
        } finally {
            if (!paymentOpen) setUploading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setPaymentOpen(false);
        alert("Payment successful! You can now retry the upload.");
    };

    if (!isOpen) return null;

    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Upload Media</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={48} className={`mb-4 ${isDragActive ? 'text-primary-500' : 'text-gray-500'}`} />
                            {isDragActive ? (
                                <p className="text-primary-500 font-medium">Drop files here...</p>
                            ) : (
                                <div className="space-y-1">
                                    <p className="font-medium text-white">Drag & drop files here, or click to select</p>
                                    <p className="text-sm text-gray-500">Supports Images (JPG, PNG) and Videos (MP4)</p>
                                </div>
                            )}
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-6 flex-1 overflow-y-auto">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Files ({files.length})</h3>
                                <div className="space-y-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File size={16} className="text-primary-500 flex-shrink-0" />
                                                <span className="text-sm truncate text-gray-300">{file.name}</span>
                                                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                            <button onClick={() => removeFile(file.name)} className="text-gray-500 hover:text-red-400">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-dark-700">
                            <button onClick={onClose} className="btn-secondary" disabled={uploading}>Cancel</button>
                            <button
                                onClick={handleUpload}
                                className="btn-primary"
                                disabled={files.length === 0 || uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload Files'}
                            </button>
                        </div>

                    </motion.div>
                </div>
            </AnimatePresence>

            <PaymentModal
                isOpen={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                plan={{ name: 'One-Time Upload', price: requiredCost, description: 'Storage limit reached. Pay for this upload.' }}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default FileUploadModal;
