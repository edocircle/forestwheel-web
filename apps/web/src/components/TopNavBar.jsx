import { Link, NavLink } from 'react-router-dom'

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 max-w-full border-b border-outline-variant/20">
      <Link to="/" className="flex items-center gap-2">
        <img src="/assets/logo.png" alt="Forest Wheel Logo" className="h-10 w-auto" />
        <span className="text-2xl font-black tracking-tighter text-[#F68E13] uppercase font-headline">Forest Wheel</span>
      </Link>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-10">
        <NavLink 
          to="/inventory"
          className={({ isActive }) => 
            isActive 
              ? "text-[#F68E13] font-bold border-b-2 border-[#F68E13] pb-1 transition-colors duration-300 font-label" 
              : "text-on-surface font-medium transition-colors duration-300 hover:text-[#F68E13] pb-1 font-label"
          }
        >
          Inventory
        </NavLink>
        <Link className="text-on-surface hover:text-[#F68E13] transition-colors duration-300 font-medium font-label" to="/sell">Sell Your Car</Link>
        <Link className="text-on-surface hover:text-[#F68E13] transition-colors duration-300 font-medium font-label" to="/about">About Us</Link>
      </div>
      <Link to="/sell" className="primary-gradient text-white px-6 py-2.5 rounded-lg font-bold hover:scale-95 transition-all duration-200 font-label inline-block">
        Contact Us
      </Link>
    </nav>
  )
}
