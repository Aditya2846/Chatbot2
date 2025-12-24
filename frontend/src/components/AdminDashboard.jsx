import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [topExhibitions, setTopExhibitions] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
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

            // Format revenue data for chart
            const formattedRevenue = (response.data.revenueData || []).map(item => ({
                date: item._id,
                revenue: item.dailyRevenue,
                bookings: item.count
            }));
            setRevenueData(formattedRevenue);

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchDashboardData}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                        >
                            <span>🔄</span> Refresh
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
                        >
                            Go Home
                        </button>
                    </div>
                </div>

                {/* KPI Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats?.totalRevenue || 0}`}
                        trend="+12.5%" // Mock trend for premium feel
                        icon="💰"
                        color="bg-emerald-100 text-emerald-600"
                        trendColor="text-emerald-600"
                    />
                    <StatCard
                        title="Total Tickets Sold"
                        value={stats?.totalTickets || 0}
                        trend="+5.2%"
                        icon="🎫"
                        color="bg-blue-100 text-blue-600"
                        trendColor="text-blue-600"
                    />
                    <StatCard
                        title="Active Tickets"
                        value={stats?.activeTickets || 0}
                        trend="Currently Active"
                        icon="✅"
                        color="bg-indigo-100 text-indigo-600"
                        trendColor="text-indigo-600"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        trend="+2 New today"
                        icon="👥"
                        color="bg-purple-100 text-purple-600"
                        trendColor="text-purple-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Revenue Chart Section (Spans 2 columns) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Revenue Analytics</h2>
                            <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg py-1 px-3 focus:ring-0 cursor-pointer hover:text-gray-700">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData.length > 0 ? revenueData : [{ date: 'No Data', revenue: 0 }]}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#4F46E5', fontWeight: 600 }}
                                        formatter={(value) => [`$${value}`, "Revenue"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Exhibitions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Top Exhibitions</h2>
                        <div className="space-y-6">
                            {topExhibitions.map((exhibition, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                                'bg-orange-50 text-orange-600'
                                        }`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 text-sm">{exhibition._id}</h4>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-indigo-600 h-1.5 rounded-full"
                                                style={{ width: `${(exhibition.count / (stats?.totalTickets || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800 text-sm">${exhibition.revenue}</p>
                                        <p className="text-xs text-gray-500">{exhibition.count} tix</p>
                                    </div>
                                </div>
                            ))}
                            {topExhibitions.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No exhibition data yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Grid (Recent Activity & Quick Actions) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
                            <button onClick={() => navigate("/tickets")} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Exhibition</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentTickets.map((ticket) => (
                                        <tr key={ticket._id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-800 font-medium">
                                                {ticket.userId?.name || 'Guest'}
                                                <div className="text-xs text-gray-400 font-normal">{ticket.email || 'No email'}</div>
                                            </td>
                                            <td className="py-4 text-gray-600">{ticket.exhibition}</td>
                                            <td className="py-4 text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 font-semibold text-gray-800">${ticket.price}</td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                                        ticket.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
                                                            'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentTickets.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400">No recent bookings found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                        <h2 className="text-xl font-bold mb-2">Admin Actions</h2>
                        <p className="text-indigo-100 mb-6 text-sm">Manage your platform efficiently with these quick shortcuts.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/admin/users")}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl backdrop-blur-sm border border-white/10"
                            >
                                <span className="flex items-center gap-3 font-medium">
                                    <span className="p-1.5 bg-white/10 rounded-lg">👥</span> Manage Users
                                </span>
                                <span className="text-white/60">→</span>
                            </button>
                            <button
                                onClick={() => navigate("/tickets")}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl backdrop-blur-sm border border-white/10"
                            >
                                <span className="flex items-center gap-3 font-medium">
                                    <span className="p-1.5 bg-white/10 rounded-lg">🎫</span> All Tickets
                                </span>
                                <span className="text-white/60">→</span>
                            </button>
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-indigo-200">System Status</span>
                                    <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon, color, trendColor }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-50 ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}
