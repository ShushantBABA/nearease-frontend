import React, { useState } from "react";
import { 
  Menu, UserCircle, LogOut, Moon, Sun, Monitor,
  User, Edit, LayoutDashboard, 
  PlusCircle, Star, Calendar, Briefcase, Shield, ChevronDown
} from "lucide-react"; 

export default function Navbar({ 
  setActivePage, activePage, user, 
  isDropdownOpen, setIsDropdownOpen, 
  theme, setTheme, // <-- Updated props!
  handleLogout, setAuthModalView 
}) {

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // --- RESTORED ROLE CHECKER ---
  const checkRole = (roleType) => {
    if (!user) return false;
    const targetRole = roleType.toUpperCase(); 
    const targetRoleFull = `ROLE_${targetRole}`; 
    let userRoles = [];

    if (typeof user.role === 'string') userRoles.push(user.role.toUpperCase());
    if (Array.isArray(user.roles)) {
      user.roles.forEach(r => {
        if (typeof r === 'string') userRoles.push(r.toUpperCase());
        if (typeof r === 'object' && r !== null) {
          if (r.name) userRoles.push(String(r.name).toUpperCase());
          if (r.authority) userRoles.push(String(r.authority).toUpperCase());
        }
      });
    }
    if (Array.isArray(user.authorities)) {
      user.authorities.forEach(auth => {
        if (typeof auth === 'string') userRoles.push(auth.toUpperCase());
        if (typeof auth === 'object' && auth !== null) {
          if (auth.authority) userRoles.push(String(auth.authority).toUpperCase());
        }
      });
    }
    return userRoles.includes(targetRole) || userRoles.includes(targetRoleFull);
  };

  const isProvider = checkRole('PROVIDER');
  const isAdmin = checkRole('ADMIN');

  // --- DYNAMIC ACTIVE STYLE GENERATOR ---
 const getNavStyle = (pageName, baseColor) => {
    const isActive = activePage === pageName;

    const colorMap = {
      indigo: { 
        active: "bg-indigo-600 text-white shadow-md shadow-indigo-500/25", 
        hover: "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400" 
      },
      emerald: { 
        active: "bg-emerald-600 text-white shadow-md shadow-emerald-500/25", 
        hover: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400" 
      },
      amber: { 
        active: "bg-amber-500 text-white shadow-md shadow-amber-500/25", 
        hover: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400" 
      },
      rose: { 
        active: "bg-rose-600 text-white shadow-md shadow-rose-500/25", 
        hover: "hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400" 
      },
      blue: { 
        active: "bg-blue-600 text-white shadow-md shadow-blue-500/25", 
        hover: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400" 
      },
      purple: { 
        active: "bg-purple-600 text-white shadow-md shadow-purple-500/25", 
        hover: "hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400" 
      }
    };

    const colors = colorMap[baseColor] || colorMap.indigo;

    return `flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
      isActive 
        ? colors.active 
        : `text-gray-600 dark:text-gray-300 ${colors.hover}`
    }`;
  };

  return (
    // The wrapper creates the padding at the top so the navbar floats
    <div className="pt-2 sm:px-6 lg:px-8 sticky top-0 z-50">
      {/* The Floating Glassmorphic Island */}
      <nav className="max-w-7xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 dark:shadow-black/20 rounded-2xl h-[72px] flex justify-between items-center px-4 sm:px-6 transition-colors duration-300">
        
        {/* Left Side: Premium Modern Logo */}
        <div onClick={() => setActivePage("home")} className="flex items-center gap-3 cursor-pointer shrink-0 group">
          <div className="w-10 h-10 transform group-hover:scale-105 group-hover:-rotate-6 transition-all duration-300 drop-shadow-md">
            {/* INLINE SVG LOGO */}
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="400" rx="100" fill="url(#nav-grad)"/>
              <path d="M120 280V120L250 240V120" stroke="white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="280" cy="280" r="28" fill="#22D3EE"/>
              <defs>
                <linearGradient id="nav-grad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5"/>
                  <stop offset="1" stopColor="#9333EA"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
            NearEase
          </h1>
        </div>

        {/* CENTER SPACE: Role-Specific Menus */}
        {user && (
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {isAdmin ? (
              <button onClick={() => setActivePage("admin")} className={getNavStyle("admin", "rose")}>
                <Shield size={18} /> Admin Panel
              </button>
            ) : isProvider ? (
              <>
                <button onClick={() => setActivePage("provider-dashboard")} className={getNavStyle("provider-dashboard", "indigo")}>
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button onClick={() => setActivePage("add-service")} className={getNavStyle("add-service", "emerald")}>
                  <PlusCircle size={18} /> Add Service
                </button>
                <button onClick={() => setActivePage("my-reviews")} className={getNavStyle("my-reviews", "amber")}>
                  <Star size={18} /> My Reviews
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setActivePage("bookings")} className={getNavStyle("bookings", "blue")}>
                  <Calendar size={18} /> My Bookings
                </button>
                <button onClick={() => setActivePage("apply-provider")} className={getNavStyle("apply-provider", "purple")}>
                  <Briefcase size={18} /> Become a Provider
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Right Side: Theme Engine & Auth */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          
          {/* THE NEW THEME ENGINE MENU */}
          <div className="relative hidden md:block">
            <button 
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              onBlur={() => setTimeout(() => setIsThemeMenuOpen(false), 200)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
            >
              {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 animate-in fade-in zoom-in-95 origin-top-right">
                
                {/* THE FIX: Changed onClick to onMouseDown and manually close menu */}
                <button 
                  onMouseDown={() => { setTheme('light'); setIsThemeMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${theme === 'light' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <Sun size={16} /> Light
                </button>
                
                <button 
                  onMouseDown={() => { setTheme('dark'); setIsThemeMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${theme === 'dark' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <Moon size={16} /> Dark
                </button>
                
                <button 
                  onMouseDown={() => { setTheme('system'); setIsThemeMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${theme === 'system' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <Monitor size={16} /> System
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          {/* Smooth Auth Area */}
          <div className="hidden md:flex items-center min-w-[140px] justify-end">
            {user ? (
              <div className="relative animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  {user?.profileImage || user?.profilePictureImageUrl ? (
                    <img src={user.profileImage || user.profilePictureImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-900" />
                  ) : (
                    <UserCircle size={28} className="text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span className="font-bold text-gray-800 dark:text-gray-200 pr-1">
                    Hi, {user?.firstName || user?.username || user?.user?.firstName || "User"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </div>
                
                {/* Clean Dropdown with only 3 specific items */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2 origin-top-right animate-in zoom-in-95 fade-in duration-200">
                    <button onClick={() => { setActivePage("view-profile"); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                      <User size={18} /> View Profile
                    </button>
                    <button onClick={() => { setActivePage("settings"); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                      <Edit size={18} /> Edit Profile
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-4"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
                <button onClick={() => setAuthModalView("login")} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-bold transition cursor-pointer px-3">Login</button>
                <button onClick={() => setAuthModalView("signup")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer transform hover:-translate-y-0.5">Sign Up</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu action */}
        <div className="md:hidden flex items-center gap-3 shrink-0 ml-auto">
          <button 
            onClick={() => {
               // Check what the screen actually looks like right now
               const isCurrentlyDark = document.documentElement.classList.contains('dark');
               setTheme(isCurrentlyDark ? 'light' : 'dark');
            }} 
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-pointer"
          >
            {document.documentElement.classList.contains('dark') ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="text-gray-600 dark:text-gray-300 cursor-pointer p-1"><Menu size={28} /></button>
        </div>
      </nav>
    </div>
  );
}