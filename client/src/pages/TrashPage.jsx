import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertOctagon } from 'lucide-react';
import api from '../utils/api';
import ConfirmationModal from '../components/ConfirmationModal';

const TrashPage = () => {
    const [trashData, setTrashData] = useState({ categories: [], media: [] });
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        try {
            const { data } = await api.get('/trash');
            setTrashData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (type, id) => {
        try {
            await api.post('/trash/restore', { type, id });
            fetchTrash();
        } catch (error) {
            alert('Failed to restore');
        }
    };

    const handleDeleteForever = (type, id) => {
        setConfirmTitle("Permanently Delete?");
        setConfirmMessage("This item will be gone forever. This cannot be undone.");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/trash/${type}/${id}`);
                fetchTrash();
            } catch (error) {
                alert('Failed to delete');
            }
        });
        setConfirmOpen(true);
    }

    if (loading) return <div className="text-white">Loading trash...</div>;

    const isEmpty = trashData.categories.length === 0 && trashData.media.length === 0;

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Trash</h1>
            <p className="text-gray-400 mb-8">Items are permanently deleted after 30 days.</p>

            {isEmpty && (
                <div className="text-center py-20 text-gray-500 bg-dark-800/20 rounded-xl border border-dashed border-dark-700">
                    <Trash2 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Trash is empty</p>
                </div>
            )}

            {/* Deleted Categories */}
            {trashData.categories.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Deleted Collections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trashData.categories.map(cat => (
                            <div key={cat._id} className="card flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">{cat.name}</h3>
                                    <p className="text-xs text-gray-500">Deleted: {new Date(cat.deletedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRestore('category', cat._id)} className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg" title="Restore">
                                        <RotateCcw size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteForever('category', cat._id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg" title="Delete Forever">
                                        <AlertOctagon size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Deleted Media */}
            {trashData.media.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Deleted Media</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {trashData.media.map(item => (
                            <div key={item._id} className="group relative bg-dark-800 rounded-lg overflow-hidden">
                                {item.type === 'video' ? (
                                    <video src={item.url} className="w-full h-32 object-cover opacity-50" />
                                ) : (
                                    <img src={item.url} alt={item.name} className="w-full h-32 object-cover opacity-50" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity">
                                    <button onClick={() => handleRestore('media', item._id)} className="p-2 bg-green-500/20 text-green-500 rounded-full hover:bg-green-500 hover:text-white">
                                        <RotateCcw size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteForever('media', item._id)} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white">
                                        <AlertOctagon size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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

export default TrashPage;
