import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import PaymentModal from "./PaymentModal";

const BOT = "Bot";
const USER = "You";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: BOT, text: "Welcome to the Museum Booking Bot! Ask me anything about art or type 'book' to get tickets." }
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState({ step: 0, data: {} });
  const [isTyping, setIsTyping] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const messagesEndRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    // Only scroll if a new message was actually added
    if (messages.length > prevMessagesLength.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const pushBot = (text) => setMessages(prev => [...prev, { sender: BOT, text }]);
  const pushUser = (text) => setMessages(prev => [...prev, { sender: USER, text }]);

  const reset = () => {
    setContext({ step: 0, data: {} });
    setCurrentBooking(null);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    pushUser(text);
    setInput("");

    // --- Booking State Machine ---
    if (context.step > 0 || text.toLowerCase().includes("book")) {
      handleBookingFlow(text);
      return;
    }

    // --- AI Chat Flow ---
    setIsTyping(true);
    try {
      const res = await API.post("/chat", { message: text });
      pushBot(res.data.reply);
    } catch (err) {
      console.error(err);
      pushBot("I'm having trouble connecting to the museum archives. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookingFlow = (text) => {
    const newData = { ...context.data };

    if (context.step === 0) {
      // Start booking
      pushBot("Great! What type of ticket? (e.g., General Admission, Special Exhibition)");
      setContext({ step: 1, data: {} });
      return;
    }

    if (context.step === 1) {
      newData.ticketType = text;
      pushBot("Which exhibition would you like to see? (e.g., Main Collection, Modern Art)");
      setContext({ step: 2, data: newData });
      return;
    }

    if (context.step === 2) {
      newData.exhibition = text;
      const today = new Date().toISOString().split('T')[0];
      pushBot(`Enter the date of your visit (YYYY-MM-DD). Today is ${today}`);
      setContext({ step: 3, data: newData });
      return;
    }

    if (context.step === 3) {
      newData.date = text;
      pushBot("How many visitors?");
      setContext({ step: 4, data: newData });
      return;
    }

    if (context.step === 4) {
      const v = parseInt(text) || 1;
      newData.visitors = v;
      pushBot("Which category? (e.g., Adult, Child, Student)");
      setContext({ step: 5, data: newData });
      return;
    }

    if (context.step === 5) {
      newData.category = text;
      pushBot("Please enter your email address to receive the ticket.");
      setContext({ step: 5.5, data: newData });
      return;
    }

    if (context.step === 5.5) {
      newData.email = text;

      const basePrice = newData.ticketType.toLowerCase().includes("special") ? 25 : 15;
      newData.price = basePrice * (newData.visitors || 1);

      pushBot(`Booking summary:\nTicket: ${newData.ticketType}\nExhibition: ${newData.exhibition}\nDate: ${newData.date}\nVisitors: ${newData.visitors}\nCategory: ${newData.category}\nEmail: ${newData.email}\nTotal Price: $${newData.price}\n\nType 'confirm' to proceed to payment.`);

      setContext({ step: 6, data: newData });
      return;
    }

    if (context.step === 6) {
      if (text.toLowerCase() === "confirm") {
        setCurrentBooking(newData);
        setShowPayment(true);
        pushBot("Opening secure payment gateway...");
      } else if (text.toLowerCase() === "cancel") {
        pushBot("Booking cancelled.");
        reset();
      } else {
        pushBot("Type 'confirm' to pay or 'cancel' to abort.");
      }
      return;
    }
  };

  const onPaymentSuccess = async () => {
    try {
      const payload = { ...currentBooking, paymentStatus: 'Paid' };
      console.log("💳 Payment successful, saving ticket to database...");

      const response = await API.post("/tickets", payload);

      if (response.data.success) {
        console.log("✅ Ticket saved successfully:", response.data.ticket);
        pushBot("Payment Successful! ✅ Your ticket has been booked and emailed to you.");
        reset();
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error("❌ Booking error:", err);

      let errorMessage = "Payment succeeded but booking failed to save.";

      // Handle specific error types from backend
      if (err.response?.data) {
        const { error, message, details } = err.response.data;

        if (error === "DB_CONNECTION_ERROR" || error === "SERVICE_UNAVAILABLE") {
          errorMessage = "⚠️ Payment received but our database is temporarily unavailable. Your booking will be processed shortly. Please save this confirmation and contact support with your payment details if you don't receive your ticket within 24 hours.";
          console.error("🔴 DATABASE CONNECTION ERROR - Ticket not saved!");
        } else if (error === "VALIDATION_ERROR") {
          errorMessage = `Payment received but there was an issue with your booking details: ${message}. Please contact support immediately with your payment confirmation.`;
        } else {
          errorMessage = `Payment received but booking encountered an error: ${message}. Please contact support with your payment details.`;
        }

        if (details) {
          console.error("Error details:", details);
        }
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "⚠️ Payment received but we couldn't reach our servers. Your booking will be processed when connection is restored. Please save this confirmation and contact support if you don't receive your ticket within 24 hours.";
      }

      pushBot(errorMessage);
      pushBot("📧 Support: Please email us with your payment details and booking information.");

      // Don't reset context so user can see their booking details
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[600px] w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-bold">Museum AI Assistant</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === USER ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${m.sender === USER
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
              >
                <strong className={`block text-xs mb-1 opacity-70 ${m.sender === USER ? 'text-blue-100' : 'text-gray-500'}`}>
                  {m.sender}
                </strong>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm text-sm italic">
                typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about art or type 'book'..."
            />
            <button
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-50"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={currentBooking?.price || 0}
        onSuccess={onPaymentSuccess}
      />
    </>
  );
}
