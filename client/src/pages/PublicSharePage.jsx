import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, Grid, Image as ImageIcon, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicSharePage = () => {
    const { shareId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/share/${shareId}`);
                setData(res.data);
            } catch (err) {
                setError('Collection not found or has been deleted.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shareId]);

    if (loading) return (
        <div className="h-screen bg-dark-900 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="h-screen bg-dark-900 flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                <p className="text-gray-400">{error}</p>
            </div>
        </div>
    );

    const { category } = data;

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            {/* Header */}
            <div className="bg-dark-800/50 backdrop-blur-md border-b border-dark-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold mb-1">{category.name}</h1>
                        <p className="text-xs text-gray-400">By {category.ownerName} • {category.media.length} items</p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-3 py-1 bg-primary-500/10 text-primary-500 text-xs rounded-full border border-primary-500/20"
                    >
                        Read Only
                    </motion.div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {category.media.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>This collection is empty.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {category.media.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="break-inside-avoid relative group rounded-xl overflow-hidden bg-dark-800 mb-6"
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.url}
                                        controls
                                        className="w-full h-auto object-cover"
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <a
                                        href={item.url}
                                        download={item.name} // Note: Cross-origin might block automatic download attribute behavior without backend headers or proxy
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicSharePage;
