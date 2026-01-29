import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Share2, Trash2, Link as LinkIcon } from 'lucide-react';
import api from '../utils/api';
import FileUploadModal from '../components/FileUploadModal';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const CollectionsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('Collection');
    const [shareId, setShareId] = useState('');

    const fetchMedia = async () => {
        try {
            const { data } = await api.get(`/media/${id}`);
            setMedia(data);
        } catch (error) {
            console.error(error);
            addToast('Failed to load media', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
        const fetchCategoryDetails = async () => {
            try {
                const { data } = await api.get('/categories');
                const cat = data.find(c => c._id === id);
                if (cat) {
                    setCategoryName(cat.name);
                    setShareId(cat.shareId);
                }
            } catch (e) { }
        }
        fetchCategoryDetails();
    }, [id]);

    const handleDelete = async (mediaId) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            await api.delete(`/media/${mediaId}`);
            setMedia(media.filter(m => m._id !== mediaId));
            addToast('Media deleted', 'success');
        } catch (error) {
            addToast('Failed to delete media', 'error');
        }
    };

    const copyShareLink = () => {
        const link = `${window.location.origin}/share/${shareId}`;
        navigator.clipboard.writeText(link);
        addToast('Public link copied to clipboard!', 'success');
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">{categoryName}</h1>
                        <p className="text-gray-400 text-sm">{media.length} items</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={copyShareLink}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <LinkIcon size={18} />
                        <span className="hidden sm:inline">Copy Link</span>
                    </button>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Upload size={18} />
                        <span>Upload Media</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square bg-dark-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-dark-700 rounded-xl bg-dark-800/20">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <Upload size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No media uploaded</h3>
                    <p className="text-gray-400 mb-6">Upload photos or videos to this collection.</p>
                    <button onClick={() => setIsUploadOpen(true)} className="btn-primary">
                        Upload Now
                    </button>
                </div>
            ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                    {media.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={item._id}
                            className="break-inside-avoid relative group rounded-xl overflow-hidden bg-dark-800 mb-6 cursor-pointer"
                        >
                            {item.type === 'video' ? (
                                <video src={item.url} className="w-full h-auto object-cover" />
                            ) : (
                                <img src={item.url} alt={item.name} className="w-full h-auto object-cover" />
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <FileUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                categoryId={id}
                onUploadComplete={() => {
                    fetchMedia();
                    addToast('Upload complete!', 'success');
                }}
            />
        </div>
    );
};

export default CollectionsPage;
