import React, { useEffect, useState } from "react";
import API from "../api/axios";
import TicketCard from "./TicketCard";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/tickets");
      setTickets(response.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      if (err.response?.status === 401) {
        setError("Please log in to view your tickets");
      } else {
        setError("Failed to load tickets. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Error</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎫</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Tickets Yet</h3>
        <p className="text-gray-500">Start by booking your first museum visit!</p>
      </div>
    );
  }

  // Get user info to show admin badge if applicable
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Tickets</h2>
          <p className="text-gray-600">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
            {user.role === "admin" && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                👑 ADMIN - Viewing All Tickets
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} onUpdate={fetchTickets} />
        ))}
      </div>
    </div>
  );
}
