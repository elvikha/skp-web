import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
    name: string;
    email: string;
    phone_number: string;
    identification_number: string;
    status: string;
}

interface UsersProps {
    users: User[];
}

export default function Users({ users }: UsersProps) {
    const getStatus = (status: string) => {
        switch (status) {
            case '1':
                return 'Mahasiswa';
            case '2':
                return 'Dosen';
            case '3':
                return 'Admin';
            default:
                return 'Mahaasiswa';
        }
    }
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Pengguna Terdaftar
                </h2>
            }
        >
            <Head title="Users" />
            <div className="container mx-auto p-4">
                <table className="w-full mt-4 border">
                    <thead className='border bg-slate-700 text-white'>
                        <tr>
                            <th className="text-center p-2">Nama</th>
                            <th className="text-center p-2">Email</th>
                            <th className="text-center p-2">No. Telepon</th>
                            <th className="text-center p-2">NIM</th>
                            <th className="text-center p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="text-center p-2">{user.name}</td>
                                <td className="text-center p-2">{user.email}</td>
                                <td className="text-center p-2">{user.phone_number}</td>
                                <td className="text-center p-2">{user.identification_number}</td>
                                <td className="text-center p-2">{getStatus(user.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}