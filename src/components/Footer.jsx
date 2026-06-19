import React, { useState } from 'react';

export default function Footer({ setActivePage }) {
  // State to track which email was copied to trigger the visual feedback
  const [copiedStates, setCopiedStates] = useState({ ashish: false, shushant: false });

  // Function to copy email and trigger the 2-second success animation
  const handleCopy = (email, person) => {
    navigator.clipboard.writeText(email);
    setCopiedStates(prev => ({ ...prev, [person]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [person]: false }));
    }, 2000);
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="400" rx="100" fill="url(#foot-grad)"/>
                <path d="M120 280V120L250 240V120" stroke="white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="280" cy="280" r="28" fill="#22D3EE"/>
                <defs>
                  <linearGradient id="foot-grad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5"/><stop offset="1" stopColor="#9333EA"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">NearEase</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed pr-4">
              Your premier platform for connecting with top-rated local professionals. Quality services, securely delivered.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company & Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li><button onClick={() => { window.scrollTo(0,0); setActivePage("about-us"); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">About Us</button></li>
              <li><button onClick={() => { window.scrollTo(0,0); setActivePage("careers"); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Careers at NearEase</button></li>
              <li><button onClick={() => { window.scrollTo(0,0); setActivePage("trust-safety"); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Trust & Safety</button></li>
              <li><button onClick={() => { window.scrollTo(0,0); setActivePage("terms"); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => { window.scrollTo(0,0); setActivePage("privacy"); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Column 3: The Interactive Contact Us */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Meet the Founders</h4>
            <div className="space-y-4">
              
              {/* Person 1: Ashish */}
              <div className="relative group/profile">
                
                {/* Contact Card with Click-to-Copy */}
                <div 
                  onClick={() => handleCopy('singhashish.cs@gmail.com', 'ashish')}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 dark:bg-gray-800/50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50 cursor-pointer w-full relative z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                    <span className="font-black text-lg">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover/profile:text-indigo-700 dark:group-hover/profile:text-indigo-300 transition-colors">Ashish Kumar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Founder</p>
                    
                    {/* Dynamic Email Status */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className={`text-xs font-semibold transition-colors ${copiedStates.ashish ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {copiedStates.ashish ? "Copied to clipboard!" : "singhashish.cs@gmail.com"}
                      </p>
                      {copiedStates.ashish ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 opacity-0 group-hover/profile:opacity-100 transition-opacity"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Popup */}
                <div className="absolute bottom-full left-0 w-72 pb-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5 relative scale-95 group-hover/profile:scale-100 transition-transform duration-300 origin-bottom">
                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 transform rotate-45"></div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://ui-avatars.com/api/?name=Ashish+Kumar&background=e0e7ff&color=4f46e5&size=100" alt="Ashish Kumar" className="w-12 h-12 rounded-full border border-indigo-100 dark:border-indigo-900 object-cover shadow-sm" />
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white leading-tight">Ashish Kumar</h5>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Founder & Developer</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 font-medium">
                      A passionate full-stack developer dedicated to building seamless, high-performance web applications and connecting local communities through technology.
                    </p>
                    
                    {/* Socials - NOW WITH BOUNCE ANIMATION */}
                    <div className="flex gap-3 relative z-50">
                      <a href="https://github.com/Singhashish-commits" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                      </a>
                      <a href="https://www.linkedin.com/in/ashish-kumar-449215349/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                      <a href="https://x.com/Ashish_SinghCs" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Person 2: Shushant */}
              <div className="relative group/profile">
                
                {/* Contact Card with Click-to-Copy */}
                <div 
                  onClick={() => handleCopy('shushant19102000@gmail.com', 'shushant')}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 dark:bg-gray-800/50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50 cursor-pointer w-full relative z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                    <span className="font-black text-lg">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover/profile:text-indigo-700 dark:group-hover/profile:text-indigo-300 transition-colors">Shushant</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Co-Founder</p>
                    
                    {/* Dynamic Email Status */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className={`text-xs font-semibold transition-colors ${copiedStates.shushant ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {copiedStates.shushant ? "Copied to clipboard!" : "shushant19102000@gmail.com"}
                      </p>
                      {copiedStates.shushant ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 opacity-0 group-hover/profile:opacity-100 transition-opacity"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-full left-0 w-72 pb-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5 relative scale-95 group-hover/profile:scale-100 transition-transform duration-300 origin-bottom">
                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 transform rotate-45"></div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://ui-avatars.com/api/?name=Shushant&background=e0e7ff&color=4f46e5&size=100" alt="Shushant" className="w-12 h-12 rounded-full border border-indigo-100 dark:border-indigo-900 object-cover shadow-sm" />
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white leading-tight">Shushant</h5>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Co-Founder</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 font-medium">
                      Currently an MCA student at NIT Raipur and a Manager at Deloitte GAI. Passionate about bringing robust full-stack architecture and IoT integration to NearEase.
                    </p>
                    
                    {/* Socials - NOW WITH BOUNCE ANIMATION */}
                    <div className="flex gap-3 relative z-50">
                      <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                      </a>
                      <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                      <a href="https://instagram.com/your-instagram" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} NearEase Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-900/30">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold text-green-700 dark:text-green-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}