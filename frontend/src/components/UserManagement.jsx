import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserTickets, setShowUserTickets] = useState(false);
    const [userTickets, setUserTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get("/admin/users");
            setUsers(response.data.users);
        } catch (err) {
            console.error("Error fetching users:", err);
            alert("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleViewUserTickets = async (user) => {
        try {
            const response = await API.get(`/admin/users/${user._id}/tickets`);
            setUserTickets(response.data.tickets);
            setSelectedUser(user);
            setShowUserTickets(true);
        } catch (err) {
            console.error("Error fetching user tickets:", err);
            alert("Failed to fetch user tickets");
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;

        try {
            await API.put(`/admin/users/${userId}/role`, { role: newRole });
            alert("User role updated successfully");
            fetchUsers();
        } catch (err) {
            console.error("Error updating role:", err);
            alert("Failed to update user role");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Delete user "${userName}" and all their tickets? This action cannot be undone.`)) return;

        try {
            await API.delete(`/admin/users/${userId}`);
            alert("User deleted successfully");
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                            <span>👥</span> User Management
                        </h1>
                        <p className="text-gray-600 mt-1">{users.length} registered users</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">User</th>
                                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                                    <th className="px-6 py-4 text-left font-semibold">Tickets</th>
                                    <th className="px-6 py-4 text-left font-semibold">Total Spent</th>
                                    <th className="px-6 py-4 text-left font-semibold">Joined</th>
                                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role === 'admin' ? '👑 Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewUserTickets(user)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                {user.ticketCount} tickets →
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">${user.totalSpent}</td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {user.role === 'user' ? (
                                                    <button
                                                        onClick={() => handleChangeRole(user._id, 'admin')}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                        title="Promote to Admin"
                                                    >
                                                        👑
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleChangeRole(user._id, 'user')}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                        title="Demote to User"
                                                    >
                                                        ↓
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                    title="Delete User"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Tickets Modal */}
            {showUserTickets && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedUser?.name}'s Tickets</h3>
                                    <p className="text-purple-100">{userTickets.length} total bookings</p>
                                </div>
                                <button
                                    onClick={() => setShowUserTickets(false)}
                                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            {userTickets.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No tickets booked yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {userTickets.map((ticket) => (
                                        <div key={ticket._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{ticket.ticketType}</h4>
                                                    <p className="text-sm text-gray-600">{ticket.exhibition}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Date:</span>
                                                    <p className="font-semibold">{ticket.date}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Visitors:</span>
                                                    <p className="font-semibold">{ticket.visitors}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Price:</span>
                                                    <p className="font-semibold text-green-600">${ticket.price}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Booked:</span>
                                                    <p className="font-semibold">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
