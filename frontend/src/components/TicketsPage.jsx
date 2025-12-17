import React from "react";
import TicketList from "./TicketList";

export default function TicketsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🎫 My Tickets</h1>
                    <p className="text-gray-600">View and manage your museum ticket bookings</p>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl">
                    <TicketList />
                </div>
            </div>
        </div>
    );
}
