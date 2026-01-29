import { useToast } from '../context/ToastContext';
import { FolderOpen, Share2, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, onDelete, onRename }) => {
    const { addToast } = useToast();

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const link = `${window.location.origin}/share/${category.shareId}`;
        navigator.clipboard.writeText(link);
        addToast('Link copied to clipboard!', 'success');
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(category._id);
    };

    const handleRename = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRename(category);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            key={category._id}
        >
            <Link to={`/collections/${category._id}`} className="block h-full">
                <div className="card h-full flex flex-col justify-between group cursor-pointer hover:bg-dark-800 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-primary-500/10 text-primary-500 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                            <FolderOpen size={24} />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleCopyLink}
                                className="p-2 hover:bg-dark-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Copy Link"
                            >
                                <Share2 size={16} />
                            </button>
                            <button
                                onClick={handleRename}
                                className="p-2 hover:bg-dark-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Rename"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                            {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;
