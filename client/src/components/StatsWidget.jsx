import { HardDrive, Folder, Image } from 'lucide-react';

const StatsWidget = ({ totalCategories, totalMedia, storageUsed }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 uppercase">
            <div className="card flex items-center gap-4 border-l-4 border-primary-500">
                <div className="p-3 bg-dark-700 rounded-lg text-primary-500">
                    <Folder size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Collections</p>
                    <h3 className="text-2xl font-bold">{totalCategories}</h3>
                </div>
            </div>

            <div className="card flex items-center gap-4 border-l-4 border-accent-500">
                <div className="p-3 bg-dark-700 rounded-lg text-accent-500">
                    <Image size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Total Media</p>
                    <h3 className="text-2xl font-bold">{totalMedia}</h3>
                </div>
            </div>

            <div className="card flex flex-col gap-4 border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-700 rounded-lg text-green-500">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Storage Used</p>
                        <h3 className="text-2xl font-bold">{storageUsed ? (storageUsed / 1024 / 1024).toFixed(2) : '0.00'} MB</h3>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-dark-700 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={`h-2.5 rounded-full ${(storageUsed / (1024 * 1024 * 1024)) > 0.9 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(100, (storageUsed / (1024 * 1024 * 1024)) * 100)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                    {((storageUsed / (1024 * 1024 * 1024)) * 100).toFixed(1)}% of 1GB Used
                </p>
            </div>
        </div>
    );
};

export default StatsWidget;
