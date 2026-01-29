import { useState, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import CreateCategoryModal from '../components/CreateCategoryModal';
import ConfirmationModal from '../components/ConfirmationModal';
import StatsWidget from '../components/StatsWidget';
import CategoryCard from '../components/CategoryCard';
import { useToast } from '../context/ToastContext';

const DashboardPage = () => {
    const [stats, setStats] = useState({ categories: [], totalCategories: 0, totalMedia: 0, storageUsed: 0 });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    // Rename state
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [categoryToRename, setCategoryToRename] = useState(null);

    const handleCreate = async (name) => {
        try {
            const { data } = await api.post('/categories', { name });
            fetchStats();
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
                fetchStats();
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
            await api.put(`/categories/${categoryToRename._id}`, { name: newName });
            fetchStats();
            addToast('Collection renamed', 'success');
        } catch (error) {
            addToast('Failed to rename collection', 'error');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [catRes, statsRes] = await Promise.all([
                api.get('/categories'),
                api.get('/user/stats')
            ]);

            setStats({
                categories: catRes.data,
                totalCategories: statsRes.data.totalCategories,
                totalMedia: statsRes.data.totalMedia,
                storageUsed: statsRes.data.storageUsed
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Overview of your creative space.</p>

            <StatsWidget
                totalCategories={stats.totalCategories}
                totalMedia={stats.totalMedia}
                storageUsed={stats.storageUsed}
            />

            <div className="flex justify-between items-end mb-4 mt-12">
                <h2 className="text-xl font-bold text-white">Recent Collections</h2>
                <Link to="/collections" className="text-primary-500 hover:text-white flex items-center gap-1 text-sm transition-colors">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            {/* Show only top 4 recent */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.categories.slice(0, 4).map(cat => (
                    <CategoryCard
                        key={cat._id}
                        category={cat}
                        onDelete={handleDeleteRequest}
                        onRename={handleRenameRequest}
                    />
                ))}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="card flex flex-col items-center justify-center border-dashed border-dark-600 bg-transparent hover:bg-dark-800 transition-colors h-full min-h-[200px]"
                >
                    <div className="p-3 bg-dark-700 rounded-full mb-3 text-primary-500">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-gray-400 group-hover:text-white">New Collection</span>
                </button>
            </div>

            {/* Create Modal */}
            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

            {/* Rename Modal */}
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

export default DashboardPage;
