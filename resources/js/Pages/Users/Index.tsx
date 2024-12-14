import React from 'react';
import { Head } from '@inertiajs/react';

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
    return (
        <>
            <Head title="Users" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Phone Number</th>
                            <th className="py-2 px-4 border-b">Identification Number</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.phone_number}</td>
                                <td className="py-2 px-4 border-b">{user.identification_number}</td>
                                <td className="py-2 px-4 border-b">{user.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}