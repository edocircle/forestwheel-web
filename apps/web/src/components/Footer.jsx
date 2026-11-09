import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-dim py-20 border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Forest Wheel Logo" className="h-14 w-auto" />
            <span className="text-xl font-bold text-[#F68E13] uppercase font-headline">Forest Wheel</span>
          </Link>
          <p className="text-outline text-sm leading-relaxed font-body">The premier destination for automotive connoisseurs seeking the world's most exceptional performance machines.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-on-surface font-bold font-headline uppercase tracking-wider text-xs">Showroom</h4>
          <nav className="flex flex-col gap-3 font-label">
            <Link className="text-outline text-sm hover:text-primary transition-colors" to="/inventory">Inventory</Link>
            <Link className="text-outline text-sm hover:text-primary transition-colors" to="/sell">Sell Your Car</Link>
            <Link className="text-outline text-sm hover:text-primary transition-colors" to="/about">About Us</Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="text-on-surface font-bold font-headline uppercase tracking-wider text-xs">Legal</h4>
          <nav className="flex flex-col gap-3 font-label">
            <Link className="text-outline text-sm hover:text-primary transition-colors" to="#">Privacy Policy</Link>
            <Link className="text-outline text-sm hover:text-primary transition-colors" to="#">Terms of Service</Link>
          </nav>
        </div>
        <div className="space-y-6">
          <h4 className="text-on-surface font-bold font-headline uppercase tracking-wider text-xs">Newsletter</h4>
          <div className="relative font-body">
            <input className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/60" placeholder="Join the inner circle" type="email" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 mt-20 pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-outline text-xs font-label">© 2024 Forest Wheel Automotive Forest Wheel</p>
      </div>
    </footer>
  )
}
