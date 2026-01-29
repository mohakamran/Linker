import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import CategoryCard from '../components/CategoryCard';
import CreateCategoryModal from '../components/CreateCategoryModal';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const AllCollectionsPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Confirmation state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    // Rename state
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [categoryToRename, setCategoryToRename] = useState(null);
    const { addToast } = useToast();

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (name) => {
        try {
            const { data } = await api.post('/categories', { name });
            setCategories([data, ...categories]);
            addToast('Collection created successfully', 'success');
        } catch (error) {
            addToast('Failed to create collection', 'error');
        }
    };

    const handleDeleteRequest = (id) => {
        setConfirmTitle('Delete Collection?');
        setConfirmMessage('This action cannot be undone. All photos inside will be lost.');
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(prev => prev.filter(c => c._id !== id));
                addToast('Collection deleted', 'success');
            } catch (error) {
                addToast('Failed to delete collection', 'error');
            }
        });
        setConfirmOpen(true);
    };

    const handleRenameRequest = (category) => {
        setCategoryToRename(category);
        setIsRenameOpen(true);
    };

    const handleRenameSubmit = async (newName) => {
        try {
            const { data } = await api.put(`/categories/${categoryToRename._id}`, { name: newName });
            setCategories(categories.map(c => c._id === categoryToRename._id ? data : c));
            addToast('Collection renamed', 'success');
        } catch (error) {
            addToast('Failed to rename collection', 'error');
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Collections</h1>
                    <p className="text-gray-400">Manage all your photo albums</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Collection</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card h-48 animate-pulse bg-dark-800/50"></div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-dark-700 rounded-xl bg-dark-800/20">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No collections yet</h3>
                    <p className="text-gray-400 mb-6">Create your first collection to start sharing.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        Create Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                            onDelete={handleDeleteRequest}
                            onRename={handleRenameRequest}
                        />
                    ))}
                </div>
            )}

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

            <CreateCategoryModal
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                onCreate={handleRenameSubmit}
                initialName={categoryToRename?.name}
                isEdit={true}
            />

            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
                title={confirmTitle}
                message={confirmMessage}
            />
        </div>
    );
};

export default AllCollectionsPage;
