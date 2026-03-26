import React, { useState, useEffect } from 'react';
import { permissionService, Permission } from '../../services/roleService';

interface PermissionListProps {
    selectedPermissionIds: number[];
    onChange: (ids: number[]) => void;
    readOnly?: boolean;
}

const PermissionList: React.FC<PermissionListProps> = ({
    selectedPermissionIds,
    onChange,
    readOnly = false
}) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await permissionService.getAllPermissions();
                setPermissions(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, []);

    const togglePermission = (id: number) => {
        if (readOnly) return;
        if (selectedPermissionIds.includes(id)) {
            onChange(selectedPermissionIds.filter(pid => pid !== id));
        } else {
            onChange([...selectedPermissionIds, id]);
        }
    };

    const groupedPermissions = permissions.reduce((acc, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {} as Record<string, Permission[]>);

    if (loading) return <div>Loading permissions...</div>;

    return (
        <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {module}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {modulePermissions.map(p => (
                            <label key={p.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPermissionIds.includes(p.id)}
                                    onChange={() => togglePermission(p.id)}
                                    disabled={readOnly}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.permissionName}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PermissionList;
