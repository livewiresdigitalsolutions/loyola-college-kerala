export default function ContactMap() {
  return (
    <div className="w-full relative h-[400px] sm:h-[500px] overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15781.993096185854!2d76.9038237!3d8.5492419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b8df2fa2cd53%3A0xeabda17bed7b3b33!2sLoyola%20College%20of%20Social%20Sciences!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Loyola College Map"
        className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
      ></iframe>
      
      {/* Optional: We can keep a small floating info card if you still want it on top of the iframe, 
          but usually the native Google Map pins are preferred. Add it back here if needed. */}
    </div>
  )
}
