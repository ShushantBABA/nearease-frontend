import React, { useState, useEffect, useRef } from "react";
import { ArrowDownCircle, Loader2, MapPin, Search, Send } from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal"; 
import ServiceCard from "./components/ServiceCard";
import ServicePage from "./components/ServicePage";
import CheckoutPage from "./components/CheckoutPage"; 
import PreviewModal from "./components/PreviewModal";
import MyBookings from "./components/MyBookings"; 
import ProviderDashboard from "./components/ProviderDashboard";
import BecomeProvider from "./components/BecomeProvider";
import ProfileSettings from "./components/ProfileSettings";
import AdminPanel from "./components/AdminPanel";
import MyReviews from "./components/MyReviews";
import ViewProfile from './components/ViewProfile';
import ToastContainer from "./components/ToastContainer"; 
import GlobalAlert from "./components/GlobalAlert"; 
import AboutUs from "./components/AboutUs";
import Careers from "./components/Careers";
import TrustSafety from "./components/TrustSafety";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";

// API Services
import { PublicAPI } from "./services/publicApi";
import { UserAPI } from "./services/userApi";

// Local UI Assets
import { heroImages } from "./data/mockData"; 

export default function App() {
  const [mainCategories, setMainCategories] = useState([]); 
  const [subCategories, setSubCategories] = useState([]);   
  const [listings, setListings] = useState([]);             
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeMainCategory, setActiveMainCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState(null); 
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [authModalView, setAuthModalView] = useState(null); 
  const [user, setUser] = useState(null); 
  const [selectedModalListing, setSelectedModalListing] = useState(null);
  const [activePage, setActivePage] = useState("home"); 
  const [bookingService, setBookingService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // THE THEME ENGINE STATE
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  const mainContentRef = useRef(null);

  // Listen for GoBackButton custom event
  useEffect(() => {
    const handleNavigateHome = () => setActivePage("home");
    window.addEventListener("navigate-home", handleNavigateHome);
    return () => window.removeEventListener("navigate-home", handleNavigateHome);
  }, []);

  // --- DOM ROOT THEME ENGINE ---
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;

    if (theme === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Listener to automatically update if the user changes their computer settings
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (theme === "system") {
        const root = window.document.documentElement;
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem("nearEaseUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser); 
      if (parsedUser.token) {
        UserAPI.getMyDetails()
          .then((freshData) => {
            const updatedUser = { 
              ...parsedUser, 
              firstName: freshData.firstName,
              lastName: freshData.lastName,
              phone: freshData.phone,
              profileImage: freshData.imageUrl,
              roles: freshData.roles
            };
            setUser(updatedUser);
            localStorage.setItem("nearEaseUser", JSON.stringify(updatedUser));
          })
          .catch(err => console.error("Failed to fetch fresh user data", err));
      }
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await PublicAPI.getCategories();
      setMainCategories(Array.isArray(data) ? data : []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchSubCats = async () => {
      setActiveSubCategory(null);
      if (activeMainCategory === "All") {
        setSubCategories([]);
        return;
      }
      const data = await PublicAPI.getTypesByCategory(activeMainCategory);
      setSubCategories(Array.isArray(data) ? data : []);
    };
    fetchSubCats();
  }, [activeMainCategory]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoadingData(true);
      try {
        const data = await PublicAPI.getAllOfferings();
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]); 
      } finally {
        setIsLoadingData(false);
      }
    };

    if (activePage === "home") {
      fetchListings();
    }
  }, [activePage]); 

  const scrollToContent = () => {
    if (mainContentRef.current) {
      window.scrollTo({
        top: mainContentRef.current.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth"
      });
    }
  };

  const filteredListings = listings.filter((item) => {
    const itemName = item?.name || item?.serviceTypename || item?.serviceType?.name || ""; 
    const matchesSearch = itemName.toLowerCase().includes(search.toLowerCase());

    const itemLoc = item?.location || item?.provider?.address || "";
    const matchesLoc = itemLoc ? itemLoc.toLowerCase().includes(location.toLowerCase()) : true;
    
    let matchesCategory = true;
    
    if (activeMainCategory !== "All") {
      const itemSubCat = (item?.serviceTypename || item?.serviceType?.name || "").toLowerCase();
      const itemMainCat = (item?.categoryName || item?.serviceType?.category?.name || "").toLowerCase();
      const targetMainCat = activeMainCategory.toLowerCase();

      if (activeSubCategory) {
        matchesCategory = (itemSubCat === activeSubCategory.name.toLowerCase());
      } else {
        const validSubCatsForThisCategory = subCategories.map(s => (s.name || "").toLowerCase());
        matchesCategory = validSubCatsForThisCategory.includes(itemSubCat) || (itemMainCat === targetMainCat);
      }
    }
    
    return matchesSearch && matchesLoc && matchesCategory;
  });

  const handleLogout = () => { 
    setUser(null); 
    localStorage.removeItem("nearEaseUser"); 
    setIsDropdownOpen(false); 
    setActivePage("home"); 
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => prev === heroImages.length - 1 ? 0 : prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 relative transition-colors duration-300">
      
      {/* Global Alert Systems */}
      <ToastContainer />
      <GlobalAlert />

      <Navbar 
        activePage={activePage} setActivePage={setActivePage}
        user={user} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
        theme={theme} setTheme={setTheme}
        handleLogout={handleLogout} setAuthModalView={setAuthModalView}
      />

      {/* Main Content Area */}
      <div className="flex-grow">
        {activePage === "home" ? (
          <>
            <div className="bg-white dark:bg-gray-900 py-16 md:py-24 px-4 transition-colors duration-300 border-b border-gray-100 dark:border-gray-800 relative z-10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col text-left space-y-6 z-10">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    Find the best local <span className="text-indigo-600 dark:text-indigo-400">services</span> in your city.
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
                    Discover top-rated restaurants, doctors, mechanics, and more right in your neighborhood.
                  </p>
                  <div className="pt-4">
                    <button onClick={scrollToContent} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 cursor-pointer text-lg flex items-center gap-3 group w-fit">
                      Explore Services Now
                      <ArrowDownCircle size={22} className="text-indigo-200 group-hover:translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="relative h-[350px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
                  {heroImages.map((img, index) => (
                    <img key={index} src={img} alt={`Hero ${index}`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"}`} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 to-transparent z-20 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <main ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 dark:border-gray-800">
              
              <div className="mb-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white shrink-0">Choose an Experience</h3>

                   <div className="flex w-full lg:max-w-2xl bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 p-1.5 items-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center px-4 py-2 flex-1 border-r border-gray-200 dark:border-gray-700">
                        <MapPin size={18} className="text-gray-400 mr-2 shrink-0" />
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where? (e.g. Raipur)" className="w-full bg-transparent outline-none text-sm dark:text-white placeholder-gray-400" />
                      </div>
                      <div className="flex items-center px-4 py-2 flex-1">
                        <Search size={18} className="text-gray-400 mr-2 shrink-0" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="w-full bg-transparent outline-none text-sm dark:text-white placeholder-gray-400" />
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2.5 ml-1 transition cursor-pointer">
                        <Search size={18} />
                      </button>
                   </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  <button 
                    onClick={() => setActiveMainCategory("All")}
                    className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${activeMainCategory === "All" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
                  >
                    All Services
                  </button>
                  
                  {mainCategories.map((cat) => {
                    const catName = typeof cat === 'string' ? cat : cat?.name;
                    const catKey = typeof cat === 'string' ? cat : (cat?.id || cat?.name);
                    if (!catName) return null; 

                    return (
                      <button 
                        key={catKey} 
                        onClick={() => setActiveMainCategory(catName)} 
                        className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${activeMainCategory === catName ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
                      >
                        {catName} 
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeMainCategory !== "All" && subCategories.length > 0 && (
                <div className="mb-12 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Filter by Type</h4>
                  <div className="flex flex-wrap gap-3">
                    {subCategories.map((sub) => (
                      <button 
                        key={sub.id || sub.name} 
                        onClick={() => setActiveSubCategory(sub)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeSubCategory?.id === sub.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300"}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-8">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeMainCategory === "All" 
                      ? "Popular Services" 
                      : (activeSubCategory ? activeSubCategory.name : activeMainCategory)} 
                    </h3>
                  {isLoadingData && <Loader2 className="animate-spin text-indigo-600" size={20} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredListings.length > 0 ? (
                    filteredListings.map((item, i) => (
                      <ServiceCard 
                        key={item.id || i} 
                        item={item} 
                        onCardClick={(selectedItem) => {
                          setBookingService(selectedItem);
                          setActivePage("service-details");
                        }}
                        onPreviewClick={(selectedItem) => setSelectedModalListing(selectedItem)}
                      />
                    ))
                  ) : (
                    !isLoadingData && (
                      <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No services found for your search.</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </main>
          </>
        ) : activePage === "service-details" ? (
          <ServicePage 
             service={bookingService} 
             onBack={() => setActivePage("home")} 
             onProceedToCheckout={() => setActivePage("checkout")} 
             onLoginRedirect={() => setAuthModalView("login")} 
          />
        ) : activePage === "checkout" ? (
          <CheckoutPage 
             service={bookingService} 
             onBack={() => setActivePage("home")} 
             onComplete={() => setActivePage("bookings")} 
          />
        ) : activePage === "bookings" ? (
          <MyBookings />
        ) : activePage === "my-reviews" ? (
          <MyReviews />
        ) : activePage === "admin" ? (
          <AdminPanel />
        ) : activePage === "view-profile" ? (
          <ViewProfile user={user} setActivePage={setActivePage} />
        ) : activePage === "settings" ? (
          <ProfileSettings user={user} setUser={setUser} />
        ) : activePage === "apply-provider" ? (
          <BecomeProvider user={user} onBack={() => setActivePage("home")} />
        ) : activePage === "provider-dashboard" ? (
          <ProviderDashboard />
        ) : activePage === "add-service" ? (
          <ProviderDashboard defaultOpenAddService={true} />
        ) : activePage === "about-us" ? (
          <AboutUs onBack={() => setActivePage("home")} />
        ) : activePage === "careers" ? (
          <Careers onBack={() => setActivePage("home")} />
        ) : activePage === "trust-safety" ? (
          <TrustSafety onBack={() => setActivePage("home")} />
        ) : activePage === "terms" ? (
          <TermsOfService onBack={() => setActivePage("home")} />
        ) : activePage === "privacy" ? (
          <PrivacyPolicy onBack={() => setActivePage("home")} />
        ) : null}
      </div>

      {/* --- ENTERPRISE FOOTER (Smart Render) --- */}
      {["home", "apply-provider", "about-us", "careers", "trust-safety", "terms", "privacy"].includes(activePage) && (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto z-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Column 1: Brand & Socials */}
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
                <div className="flex gap-4 pt-2">
                  <a 
                      href="https://github.com/Singhashish-commits" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                  </a>
                  <a 
                      href="https://www.linkedin.com/in/ashish-kumar-449215349/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                  <a 
                      href="https://x.com/Ashish_SinghCs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                </div>
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

              {/* Column 3: Newsletter */}
              {/* <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Stay Updated</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get the latest news and provider discounts delivered to your inbox.</p>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 outline-none transition-all text-sm"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                    <Send size={16} />
                  </button>
                </div>
              </div> */}

              {/* Column 4: Dedicated Contact Us */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
                <div className="space-y-3">
                  {/* Person 1 */}
                  <a href="mailto:singhashish.cs@gmail.com" className="group flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 dark:bg-gray-800/50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50 cursor-pointer block">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                      <span className="font-black text-lg">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Ashish Kumar</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Founder</p>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">singhashish.cs@gmail.com</p>
                    </div>
                  </a>

                  {/* Person 2 */}
                  <a href="mailto:shushant19102000@gmail.com" className="group flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 dark:bg-gray-800/50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50 cursor-pointer block">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                      <span className="font-black text-lg">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Shushant</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Co-Founder</p>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">shushant19102000@gmail.com</p>
                    </div>
                  </a>
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
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={authModalView !== null} 
        view={authModalView} 
        onClose={() => setAuthModalView(null)} 
        onViewChange={setAuthModalView} 
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem("nearEaseUser", JSON.stringify(userData));
        }} 
      />
      
      <PreviewModal 
        listing={selectedModalListing} 
        onClose={() => setSelectedModalListing(null)} 
        onProceedToDetails={(item) => {
           setBookingService(item);
           setActivePage("service-details");
           setSelectedModalListing(null);
        }} 
      />
    </div>
  );
}