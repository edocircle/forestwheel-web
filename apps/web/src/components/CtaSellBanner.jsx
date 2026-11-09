import { Link } from 'react-router-dom'

export default function CtaSellBanner() {
  return (
    <section className="py-24 px-8 bg-surface-container">
      <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-white p-12 md:p-20 text-center shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img alt="Classic Car Silhouette" className="w-full h-full object-cover opacity-10 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD09nI6BR0uYSskXRiJDv-ZhPxXJ-ov10HKWkjtJ3i_uaRJN1Aisg_-olU8V83rhZOuoKsMWLU8iXooSa6QqiWTSET8CJ5zQKbYc2nJt2BEi6XnkiFAjJ8tccziCtyrYuaqQm9RGkTohyxN0EteOf2CK8w48CDfJtLwda-nBJHkLWCehlSo-yRIB5tdvh_hV6FqGlfKNPHOXnAVzxBF67IIQVAbcGKVotK1BUqFzc0PwDj5ePDXN4rk0QFGPd8EcRurbS9lm98L58Jk"/>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-headline font-black text-5xl md:text-7xl mb-6 tracking-tighter uppercase text-on-surface">Time to Upgrade?</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mb-12 font-body">Get a premium market valuation for your car in under 24 hours. We buy high-performance and luxury vehicles directly.</p>
          <Link to="/sell" className="inline-block px-12 py-5 bg-[#F68E13] text-white font-black rounded-full text-xl uppercase tracking-widest shadow-xl shadow-[#F68E13]/30 hover:scale-105 transition-transform">
            Sell Your Car Today
          </Link>
        </div>
      </div>
    </section>
  )
}
