
import React, { useState, useMemo, useRef } from 'react';
import { FullInstitutionData, InstitutionAdmin, RolePermissions, InstructorVerificationRequest } from '../types';
import SearchIcon from './icons/SearchIcon';
import UploadIcon from './icons/UploadIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import InviteAdminModal from './InviteAdminModal';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface InstitutionLearnersViewProps {
    institutionData: FullInstitutionData;
    setInstitutionData: React.Dispatch<React.SetStateAction<FullInstitutionData>>;
}

const InstitutionLearnersView: React.FC<InstitutionLearnersViewProps> = ({ institutionData, setInstitutionData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);

    const [rolePermissions, setRolePermissions] = useState<RolePermissions>(institutionData.rolePermissions);
    const [verifications, setVerifications] = useState<InstructorVerificationRequest[]>(institutionData.instructorVerifications);


    const filteredLearners = useMemo(() => {
        return institutionData.learners.filter(learner =>
            learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            learner.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [institutionData.learners, searchTerm]);
    
    const filteredAdmins = useMemo(() => {
        return institutionData.admins.filter(admin =>
            admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [institutionData.admins, searchTerm]);

    const handleBulkImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            setImportMessage({ type: 'success', text: `Successfully imported from ${file.name}.` });
        } else {
            setImportMessage({ type: 'error', text: 'Invalid file type. Please upload a CSV.' });
        }
        setTimeout(() => setImportMessage(null), 5000);
        if (event.target) event.target.value = '';
    };
    
    const handleInviteAdmin = (newAdmin: { name: string; email: string; role: 'Admin' | 'Billing Manager'; }) => {
        const adminToAdd: InstitutionAdmin = {
            id: `admin-${Date.now()}`,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role,
            lastLogin: 'Pending Invitation',
        };
        setInstitutionData(prevData => ({
            ...prevData,
            admins: [...prevData.admins, adminToAdd],
        }));
        setInviteModalOpen(false);
    };

    const handlePermissionChange = (role: string, permission: keyof RolePermissions[string]) => {
        const updatedPermissions = {
            ...rolePermissions,
            [role]: {
                ...rolePermissions[role],
                [permission]: !rolePermissions[role][permission],
            },
        };
        setRolePermissions(updatedPermissions);
        // Persist change to main state
        setInstitutionData(prev => ({ ...prev, rolePermissions: updatedPermissions }));
    };

    const handleVerificationAction = (id: string, action: 'approve' | 'deny') => {
        console.log(`${action} instructor ${id}`);
        const updatedVerifications = verifications.filter(v => v.id !== id);
        setVerifications(updatedVerifications);
        // Persist change to main state
        setInstitutionData(prev => ({ ...prev, instructorVerifications: updatedVerifications }));
    };

    return (
        <>
            <div className="animate-fade-in space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">Admin & Team Controls</h1>
                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Manage administrators, learners, and permissions.</p>
                </div>
                
                {importMessage && (
                    <div className={`p-4 rounded-lg text-sm ${
                        importMessage.type === 'success' 
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                    }`}>
                        {importMessage.text}
                    </div>
                )}

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-crimson"
                    />
                </div>
                
                {/* Role Permissions Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif">Role Permissions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium uppercase">Role</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase">Edit Profile</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase">Manage Courses</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase">View Analytics</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase">Manage Team</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Object.entries(rolePermissions).map(([role, permissions]) => (
                                    <tr key={role}>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">{role}</td>
                                        {Object.keys(permissions).map((permission) => (
                                            <td key={permission} className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded text-crimson focus:ring-crimson"
                                                    checked={permissions[permission as keyof typeof permissions]}
                                                    onChange={() => handlePermissionChange(role, permission as keyof typeof permissions)}
                                                    disabled={role === 'Owner'}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Instructor Verification */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif">Instructor Verification Queue</h2>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {verifications.map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{req.name}</p>
                                            <p className="text-sm text-gray-500">{req.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Submitted: {req.submittedDate}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleVerificationAction(req.id, 'deny')} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                                <XCircleIcon className="w-6 h-6" />
                                            </button>
                                            <button onClick={() => handleVerificationAction(req.id, 'approve')} className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-green-500">
                                                <CheckCircleIcon className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {verifications.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No pending verifications.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Admins Section (Existing) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif">Administrators</h2>
                        <button onClick={() => setInviteModalOpen(true)} className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800">
                            <UserGroupIcon className="w-5 h-5 mr-2" /> Invite Admin
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Last Login</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAdmins.map(admin => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-semibold bg-crimson/10 text-crimson rounded-full dark:bg-crimson/20 dark:text-red-200">{admin.role}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Learners Section (Existing) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif">Learners</h2>
                        <div className="flex items-center space-x-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                            <button onClick={handleBulkImportClick} className="flex items-center px-4 py-2 font-semibold text-crimson bg-crimson/10 rounded-lg hover:bg-crimson/20 dark:bg-crimson/20 dark:text-red-300 dark:hover:bg-crimson/30">
                                <UploadIcon className="w-5 h-5 mr-2" /> Bulk Import
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredLearners.map(learner => (
                                    <tr key={learner.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{learner.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{learner.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3 dark:bg-gray-700"><div className="bg-crimson h-2 rounded-full" style={{ width: `${learner.progress}%` }}></div></div>
                                                <span>{learner.progress}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <InviteAdminModal 
                isOpen={isInviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                onInvite={handleInviteAdmin}
            />
        </>
    );
};

export default InstitutionLearnersView;
