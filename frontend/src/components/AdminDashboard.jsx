import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [topExhibitions, setTopExhibitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await API.get("/admin/dashboard/stats");

            setStats(response.data.stats);
            setRecentTickets(response.data.recentTickets);
            setTopExhibitions(response.data.topExhibitions);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            if (err.response?.status === 403) {
                alert("Access denied. Admin privileges required.");
                navigate("/");
            }
        } finally {
            setLoading(false);
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
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">👑</span>
                        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600">Museum ticketing system overview and analytics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon="👥"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Tickets"
                        value={stats?.totalTickets || 0}
                        icon="🎫"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Active Tickets"
                        value={stats?.activeTickets || 0}
                        icon="✅"
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats?.totalRevenue || 0}`}
                        icon="💰"
                        color="bg-yellow-500"
                    />
                </div>

                {/* Revenue Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 font-semibold">Net Revenue</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">${stats?.netRevenue || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">After refunds</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 font-semibold">Avg Ticket Price</h3>
                            <span className="text-2xl">🎟️</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">${stats?.averageTicketPrice || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Per ticket</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 font-semibold">Total Refunded</h3>
                            <span className="text-2xl">💸</span>
                        </div>
                        <p className="text-3xl font-bold text-red-600">${stats?.totalRefunded || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Cancelled tickets</p>
                    </div>
                </div>

                {/* Top Exhibitions & Recent Tickets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Exhibitions */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">🏛️ Top Exhibitions</h2>
                        <div className="space-y-3">
                            {topExhibitions.map((exhibition, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{exhibition._id}</p>
                                            <p className="text-sm text-gray-500">{exhibition.count} tickets sold</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">${exhibition.revenue}</span>
                                </div>
                            ))}
                            {topExhibitions.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No exhibitions data</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Tickets */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Bookings</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {recentTickets.map((ticket) => (
                                <div key={ticket._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800">{ticket.ticketType}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{ticket.userId?.name || 'Guest'} • {ticket.exhibition}</p>
                                    <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {recentTickets.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No recent tickets</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        👥 Manage Users
                    </button>
                    <button
                        onClick={() => navigate("/tickets")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        🎫 View All Tickets
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        🔄 Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-semibold text-sm uppercase">{title}</h3>
                <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );
}
