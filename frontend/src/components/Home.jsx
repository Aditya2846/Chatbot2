import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=2670&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Welcome to the National Museum
          </h1>
          <p className="text-2xl mb-8 text-gray-200">
            Explore centuries of art, culture, and history
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/chatbot")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              🎫 Book Ticket Now
            </button>
            <button
              onClick={() => navigate("/exhibitions")}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105"
            >
              🏛️ View Exhibitions
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Visit Us?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "World-Class Exhibits", desc: "Over 100,000 artifacts from every corner of the globe.", icon: "🌍", img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80" },
              { title: "Interactive Tours", desc: "Augmented reality guides and immersive audio tours.", icon: "🎧", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80" },
              { title: "Smart Booking", desc: "Skip the line with our AI-powered instant ticketing bot.", icon: "🤖", img: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="h-48 overflow-hidden">
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8 text-center relative">
                  <div className="w-16 h-16 bg-blue-600 text-3xl flex items-center justify-center rounded-full text-white absolute -top-8 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 mt-6 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Exhibitions Section */}
      <section id="exhibitions" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">What's On</span>
              <h2 className="text-4xl font-bold mt-2 text-gray-900">Current & Upcoming</h2>
            </div>
            <Link to="/exhibitions" className="hidden md:inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View All <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl relative group h-[400px] cursor-pointer">
              <img src="/modern_art_revolution.png" alt="Modern Art" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-wide">
                  Now Open • {new Date().toLocaleDateString()}
                </span>
                <h3 className="text-3xl font-bold text-white mb-2">Modern Art Revolution</h3>
                <p className="text-gray-200 text-lg">A journey through 20th century abstract expressionism.</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl relative group h-[400px] cursor-pointer">
              <img src="/ancient_egypt_pharaohs.png" alt="Ancient Egyptian" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-wide">
                  Coming Soon • {new Date(Date.now() + 86400000 * 7).toLocaleDateString()}
                </span>
                <h3 className="text-3xl font-bold text-white mb-2">Ancient Egypt: The Pharaohs</h3>
                <p className="text-gray-200 text-lg">Uncover the mysteries of the pyramids and the Nile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Museum Gallery</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore highlights from our permanent collection, featuring rare artifacts and masterpieces from around the world.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-4">
              <img className="h-64 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80" alt="Classical Painting" />
              <img className="h-48 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80" alt="Ancient Sculpture" />
            </div>
            <div className="space-y-4 pt-12">
              <img className="h-48 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80" alt="Museum Interior" />
              <img className="h-64 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80" alt="Classical Art" />
            </div>
            <div className="space-y-4">
              <img className="h-64 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="/modern_art_revolution.png" alt="Modern Art" />
              <img className="h-48 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="/world_cultures.png" alt="World Cultures Art" />
            </div>
            <div className="space-y-4 pt-8">
              <img className="h-48 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="/photography_through_time.png" alt="Photography" />
              <img className="h-64 w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300" src="/renaissance_masters.png" alt="Renaissance Art" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
