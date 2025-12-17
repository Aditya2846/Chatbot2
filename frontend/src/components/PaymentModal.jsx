import React, { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }) {
    const [method, setMethod] = useState('upi'); // 'upi' or 'card'
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            onSuccess();
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 p-6 text-white text-center">
                    <h3 className="text-xl font-bold">Complete Payment</h3>
                    <p className="text-gray-400 text-sm mt-1">Total Amount</p>
                    <p className="text-3xl font-bold mt-1">${amount}</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${method === 'upi' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setMethod('upi')}
                    >
                        UPI / QR
                    </button>
                    <button
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${method === 'card' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setMethod('card')}
                    >
                        Card Payment
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {method === 'upi' ? (
                        <div className="text-center space-y-4">
                            <p className="text-sm text-gray-600">Scan QR to pay via any UPI App</p>
                            <div className="flex justify-center">
                                {/* Dynamic QR for UPI */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=7671874804@axl&pn=MuseumUser&am=${amount}&cu=INR`}
                                    alt="Payment QR"
                                    className="w-48 h-48 border rounded-lg p-2 shadow-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-400">UPI ID: <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded select-all">7671874804@axl</span></p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">CVV</label>
                                    <input type="password" placeholder="123" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Cardholder Name</label>
                                <input type="text" placeholder="John Doe" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    <button
                        disabled={processing}
                        onClick={handlePayment}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            `Pay $${amount}`
                        )}
                    </button>

                    <button onClick={onClose} className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm font-medium">
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
}
