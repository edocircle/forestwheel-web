export default function WhyForestWheel() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16 text-center">
          <h2 className="font-headline font-black text-5xl tracking-tight mb-4 text-on-surface">Why the Forest Wheel?</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">We don't just sell cars; we curate high-performance lifestyles with radical transparency and expert precision.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1 */}
          <div className="md:col-span-8 bg-surface-container-low border border-outline-variant/30 p-10 rounded-2xl flex flex-col justify-between group hover:bg-white hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-14 h-14 bg-[#F68E13]/10 rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#F68E13] text-3xl">verified</span>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-4 text-on-surface">Verified 300-Point Inspections</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">Every vehicle undergoes a rigorous mechanical and aesthetic audit by our factory-trained technicians. No bolt is left unturned.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Gold Standard Quality</span>
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform text-[#F68E13]">arrow_right_alt</span>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="md:col-span-4 bg-[#F68E13] p-10 rounded-2xl flex flex-col justify-between text-white shadow-lg shadow-[#F68E13]/20">
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-4">Transparent Pricing</h3>
              <p className="font-body opacity-90">No hidden fees. No dealership markups. The price you see is the final price of excellence.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="md:col-span-4 bg-surface-container-low border border-outline-variant/30 p-10 rounded-2xl hover:bg-white hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-surface-variant rounded-xl flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-on-surface text-3xl">play_circle</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4 text-on-surface">YouTube Reviews</h3>
            <p className="text-on-surface-variant font-body">Deep-dive video walkthroughs for every vehicle in our inventory.</p>
          </div>
          {/* Feature 4 */}
          <div className="md:col-span-8 bg-surface-container-high p-10 rounded-2xl relative overflow-hidden group">
            <img alt="Luxury interior" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrFxdfB2wgDMIkGH6_b7a3B8vlr-3y4MLV6srfiEKgBkIOgZB_xOE9z9ksYlt9jaQfo5sdZ4QHEr7AwfkDi6l1ZFtWAo1ue97Ovv07GpluorBlC2ZB4x0waRpifRDDD-NvziWT116O4obPL60buBYN9Z1M-3sj_5XP372MeWL8aZelf2m9F9uW1vmF10xtE7WP8yIHm4RCvZNLqMRpixL82f_7DGV59Kj4yyOg4iqOUPvrtmWOTjFlkavRJppB9EbInxRYYM7jjTux" />
            <div className="relative z-10">
              <h3 className="text-3xl font-headline font-bold mb-4 text-on-surface">Concierge Experience</h3>
              <p className="text-on-surface-variant text-lg max-w-md">Private viewings and enclosed nationwide delivery. We manage the logistics; you enjoy the drive.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
