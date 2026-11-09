import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-start overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Hero Car"
          className="w-full h-full object-cover"
          data-alt="Sleek black high-performance sports car parked in a dark, moody concrete garage with dramatic orange accent lighting reflecting on the metallic paint"
          src="https://res.cloudinary.com/demqmcqky/image/upload/v1777651460/1_erase_kl3exm.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
      </div>
      <div className="relative z-10 px-8 md:px-20 max-w-4xl">
        <h1 className="font-headline font-black text-6xl md:text-8xl leading-none tracking-tighter text-on-surface mb-6">
          Find Your <span className="text-[#F68E13]">Perfect</span> Ride
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl mb-10 font-body leading-relaxed">
          Your Journey Begins at Forest Wheel. Experience the curation of high-velocity engineering and timeless design.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/inventory" className="px-8 py-4 bg-[#F68E13] text-white text-center font-bold rounded-xl text-lg hover:scale-105 transition-transform shadow-lg shadow-[#F68E13]/20 font-label">
            Browse Inventory
          </Link>
          <Link to="/sell" className="px-8 py-4 border border-outline-variant bg-white/60 backdrop-blur-md text-on-surface text-center font-bold rounded-xl text-lg hover:bg-white transition-colors font-label inline-block">
            Sell Your Car
          </Link>
        </div>
      </div>
    </section>
  )
}
