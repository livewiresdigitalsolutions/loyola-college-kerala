import React from 'react';

export default function SubscribeSection() {
  return (
    <section className="bg-[#124b33] py-20 w-full relative font-sans">
      <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
        <h4 className="text-[#00FF66] text-xs md:text-sm font-bold tracking-widest uppercase mb-4">
          Stay Connected
        </h4>
        <h2 className="text-white text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          Subscribe to Loyola Digest
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-10 leading-relaxed font-light">
          Get the latest academic discoveries, campus life updates, and alumni achievements delivered straight to your inbox every month.
        </p>
        
        <form className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:border-[#00FF66] transition-all"
            required
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto whitespace-nowrap bg-[#F4F7F5] hover:bg-white text-[#124b33] font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-white/50 text-xs mt-6">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>

      {/* Thin bright green line at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF66]"></div>
    </section>
  )
}
