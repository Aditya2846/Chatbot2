import React from "react";
import { Link } from "react-router-dom";

export default function Exhibitions() {
    const exhibitions = [
        {
            title: "Modern Art Revolution",
            description: "A journey through 20th century abstract expressionism featuring works from Pollock, Rothko, and de Kooning.",
            image: "/modern_art_revolution.png",
            status: "Now Open",
            statusColor: "bg-green-500",
            date: new Date().toLocaleDateString(),
            category: "Contemporary Art"
        },
        {
            title: "Ancient Egypt: The Pharaohs",
            description: "Uncover the mysteries of the pyramids and the Nile with rare artifacts from the tombs of ancient kings.",
            image: "/ancient_egypt_pharaohs.png",
            status: "Coming Soon",
            statusColor: "bg-orange-500",
            date: new Date(Date.now() + 86400000 * 7).toLocaleDateString(),
            category: "Ancient History"
        },
        {
            title: "Renaissance Masters",
            description: "Experience the golden age of art with masterpieces from Leonardo, Michelangelo, and Raphael.",
            image: "/renaissance_masters.png",
            status: "Now Open",
            statusColor: "bg-green-500",
            date: new Date().toLocaleDateString(),
            category: "Classical Art"
        },
        {
            title: "Digital Futures",
            description: "Explore the intersection of technology and art in this immersive digital exhibition.",
            image: "/digital_futures.png",
            status: "Opening Next Month",
            statusColor: "bg-blue-500",
            date: new Date(Date.now() + 86400000 * 30).toLocaleDateString(),
            category: "Digital Art"
        },
        {
            title: "World Cultures",
            description: "A celebration of global heritage featuring artifacts from Asia, Africa, and the Americas.",
            image: "/world_cultures.png",
            status: "Now Open",
            statusColor: "bg-green-500",
            date: new Date().toLocaleDateString(),
            category: "Cultural Heritage"
        },
        {
            title: "Photography Through Time",
            description: "From daguerreotypes to digital: the evolution of photography over 180 years.",
            image: "/photography_through_time.png",
            status: "Now Open",
            statusColor: "bg-green-500",
            date: new Date().toLocaleDateString(),
            category: "Photography"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=2000&q=80&fit=crop")' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Exhibitions</h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
                        Discover world-class collections spanning centuries of art, culture, and history
                    </p>
                </div>
            </section>

            {/* Exhibitions Grid */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exhibitions.map((exhibition, idx) => (
                        <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={exhibition.image}
                                    alt={exhibition.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`${exhibition.statusColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg`}>
                                        {exhibition.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">
                                    {exhibition.category}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-900">{exhibition.title}</h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">{exhibition.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-500">
                                        <span className="font-semibold">Opens:</span> {exhibition.date}
                                    </div>
                                    <Link
                                        to="/chatbot"
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                                    >
                                        Book Now <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Visit?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Book your tickets now and experience the wonder of our world-class exhibitions
                    </p>
                    <Link
                        to="/chatbot"
                        className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                        Book Tickets Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
