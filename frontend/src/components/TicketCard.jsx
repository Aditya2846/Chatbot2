import React, { useState } from "react";
import API from "../api/axios";

export default function TicketCard({ ticket, onUpdate }) {
    const [showDetails, setShowDetails] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const handleCancelTicket = async () => {
        try {
            setCanceling(true);
            const response = await API.post(
                `/tickets/${ticket._id}/cancel`,
                { reason: cancelReason }
            );

            if (response.data.success) {
                alert(response.data.message);
                setShowCancelModal(false);
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            console.error("Error cancelling ticket:", err);
            alert(err.response?.data?.message || "Failed to cancel ticket");
        } finally {
            setCanceling(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Booked":
            case "Confirmed":
                return "bg-green-100 text-green-800 border-green-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 border-red-300";
            case "Refunded":
                return "bg-blue-100 text-blue-800 border-blue-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const canCancel = () => {
        if (ticket.status === "Cancelled" || ticket.status === "Refunded") return false;

        const visitDate = new Date(ticket.date);
        const today = new Date();
        const daysDifference = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24));

        return daysDifference >= 2;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{ticket.ticketType}</h3>
                            <p className="text-blue-100 text-sm">{ticket.exhibition}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                {/* Ticket Body - Square-like Layout */}
                <div className="p-6">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-xs uppercase mb-2 font-semibold">Visit Date</p>
                            <p className="text-gray-900 font-bold text-lg">📅 {ticket.date}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-xs uppercase mb-2 font-semibold">Visitors</p>
                            <p className="text-gray-900 font-bold text-lg">👥 {ticket.visitors}</p>
                        </div>
                    </div>

                    {/* Price & Payment */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <p className="text-gray-600 text-xs uppercase mb-2 font-semibold">Total Price</p>
                            <p className="text-green-600 font-bold text-2xl">💵 ${ticket.price}</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-gray-600 text-xs uppercase mb-2 font-semibold">Payment Status</p>
                            <p className="text-blue-900 font-bold text-lg">{ticket.paymentStatus || "Paid"}</p>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="text-center mb-6">
                        <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                            {ticket.category}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            {showDetails ? "Hide Details ▲" : "View Details ▼"}
                        </button>

                        {canCancel() && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                            >
                                ❌ Cancel
                            </button>
                        )}
                    </div>

                    {/* Expandable Details */}
                    {showDetails && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Ticket ID:</span>
                                <span className="text-gray-900 font-mono text-xs">{ticket._id}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Name:</span>
                                <span className="text-gray-900 font-semibold">{ticket.name || "Guest"}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Email:</span>
                                <span className="text-gray-900">{ticket.email}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Booked on:</span>
                                <span className="text-gray-900 font-semibold">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            {ticket.cancelledAt && (
                                <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center border border-red-200">
                                    <span className="text-red-600 font-medium">Cancelled on:</span>
                                    <span className="text-red-700 font-bold">{new Date(ticket.cancelledAt).toLocaleDateString()}</span>
                                </div>
                            )}
                            {ticket.refundAmount > 0 && (
                                <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center border border-green-200">
                                    <span className="text-green-600 font-medium">Refund Amount:</span>
                                    <span className="text-green-700 font-bold text-lg">${ticket.refundAmount}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-red-600 p-6 text-white">
                            <h3 className="text-xl font-bold">Cancel Ticket</h3>
                            <p className="text-red-100 text-sm mt-1">Are you sure you want to cancel this booking?</p>
                        </div>

                        <div className="p-6">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Refund Policy:</strong><br />
                                    • Full refund (100%) if cancelled 7+ days before visit<br />
                                    • 50% refund if cancelled 2-6 days before visit<br />
                                    • No refund if cancelled less than 2 days before
                                </p>
                            </div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason for Cancellation (Optional)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-4"
                                rows="3"
                                placeholder="Please tell us why you're cancelling..."
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={canceling}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Keep Ticket
                                </button>
                                <button
                                    onClick={handleCancelTicket}
                                    disabled={canceling}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {canceling ? "Cancelling..." : "Confirm Cancellation"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
