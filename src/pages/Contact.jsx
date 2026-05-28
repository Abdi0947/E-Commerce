export default function Contact({ navigate }) {
  return (
    <main className="max-w-[1000px] mx-auto py-16 px-6 animate-fade-in">
      {/* Back button */}
      <button
        className="flex items-center gap-2 text-sm font-medium text-primary bg-transparent border-none cursor-pointer mb-8 transition-all hover:gap-3 hover:text-primary-dark"
        onClick={() => navigate("home")}
      >
        ← Back to Shop
      </button>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-[1.5px] border-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-slide-up delay-100">
        
        {/* Left Side: Logo and Name */}
        <div className="md:w-5/12 bg-gradient-to-br from-primary to-primary-dark p-10 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">NINA <span className="text-primary-light">Mart</span></h1>
          <p className="text-indigo-100 text-[15px] max-w-[250px] leading-relaxed">
            Your one-stop destination for premium tech, gadgets, and electronics.
          </p>
        </div>

        {/* Right Side: Contact Information */}
        <div className="md:w-7/12 p-10 flex flex-col justify-center bg-slate-50">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Get in Touch</h2>
          <p className="text-slate-500 mb-8 text-[15px]">We'd love to hear from you. Reach out to us for any inquiries or support.</p>
          
          <div className="flex flex-col gap-6">
            
            {/* Contact Item */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.43 3.44 2 2 0 0 1 3.4 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">Phone</h3>
                <p className="text-slate-600 text-sm mb-1">+251 911 234 567</p>
                <p className="text-slate-400 text-xs">Mon-Fri from 8am to 5pm</p>
              </div>
            </div>

            {/* Contact Item */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">Email</h3>
                <p className="text-slate-600 text-sm mb-1">support@ninamart.com</p>
                <p className="text-slate-400 text-xs">We typically reply within 24 hours</p>
              </div>
            </div>

            {/* Contact Item */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">Office</h3>
                <p className="text-slate-600 text-sm mb-1">Bole Road, Building 4A, Floor 3</p>
                <p className="text-slate-400 text-xs">Addis Ababa, Ethiopia</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
