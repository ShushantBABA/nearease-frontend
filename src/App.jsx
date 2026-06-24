import React, { useState, useEffect, useRef } from "react";
import { ArrowDownCircle, Loader2, MapPin, Search, Send, Star, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";

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
import Footer from './components/Footer';

// API Services
import { PublicAPI } from "./services/publicApi";
import { UserAPI } from "./services/userApi";

// Local UI Assets
import { heroImages } from "./data/mockData"; 

export default function App() {
  // ==========================================
  // --- LOGIC SECTION (STRICTLY UNTOUCHED) ---
  // ==========================================
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

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleNavigateHome = () => setActivePage("home");
    window.addEventListener("navigate-home", handleNavigateHome);
    return () => window.removeEventListener("navigate-home", handleNavigateHome);
  }, []);

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
        top: mainContentRef.current.getBoundingClientRect().top + window.pageYOffset - 100, 
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 relative transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-clip">
      
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
            {/* THE FIX 2: Replaced static px-4 with px-4 sm:px-6 lg:px-8 to perfectly flush align with Main Content below */}
            <div className="relative bg-white dark:bg-gray-900 overflow-hidden pb-32 md:pt-15 md:pb-40 px-4 sm:px-6 lg:px-8 transition-colors duration-300 z-10 border-b border-gray-100 dark:border-gray-800/50">
              
              {/* Background Mesh Gradients */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                 {/* Modern Architectural Grid (Visible only in Light Mode) */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] dark:opacity-0"></div>

                 {/* Glowing Orbs (Tuned for both Light and Dark modes) */}
                 <div className="w-[600px] h-[600px] bg-indigo-300/40 dark:bg-indigo-600/20 blur-[100px] md:blur-[120px] rounded-full absolute -top-20 -left-20 animate-pulse-slow mix-blend-multiply dark:mix-blend-normal"></div>
                 
                 <div className="w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-600/20 blur-[90px] md:blur-[100px] rounded-full absolute top-20 right-0 animate-pulse-slow mix-blend-multiply dark:mix-blend-normal" style={{ animationDelay: '2s'}}></div>
                 
                 {/* Extra subtle pink orb just for Light Mode depth */}
                 <div className="w-[400px] h-[400px] bg-pink-200/50 dark:bg-transparent blur-[100px] rounded-full absolute top-40 left-1/3 animate-pulse-slow mix-blend-multiply dark:mix-blend-normal" style={{ animationDelay: '4s'}}></div>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
                
                {/* Hero Text Content */}
                <div className="flex flex-col text-left space-y-8 lg:col-span-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 w-fit text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm">
                    <Sparkles size={16} /> Your Most Trusted Platform
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                    Find the best local <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">services</span> in your city.
                  </h2>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                    Skip the endless searching. Discover top-rated cleaners, mechanics, house-help, and more—all vetted and ready right in your neighborhood.
                  </p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <button onClick={scrollToContent} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-extrabold py-4 px-8 rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer text-lg flex items-center justify-center gap-3 group">
                      Explore Services 
                      <ArrowDownCircle size={22} className="group-hover:translate-y-1 transition-transform" />
                    </button>
                    {/* <button onClick={() => setAuthModalView("register")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 font-bold py-4 px-8 rounded-full shadow-sm transition-all transform hover:-translate-y-1 cursor-pointer text-lg flex items-center justify-center text-center">
                      Join as a Professional
                    </button> */}
                  </div>
                </div>

                {/* Hero Dynamic Image Slider */}
                <div className="lg:col-span-6 relative h-[400px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 group animate-in slide-in-from-right-8 fade-in duration-1000">
                  {heroImages.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`Hero ${index}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"}`} 
                    />
                  ))}
                  
                  {/* Subtle Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent z-20 pointer-events-none"></div>

                  {/* Floating Trust Badge */}
                  <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 flex items-center gap-4 z-30 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 transform group-hover:-translate-y-2 transition-transform">
                     <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                       <ShieldCheck size={24} /> 
                     </div>
                     {/* <div>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">100% Verified</p>
                       <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                         <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9/5 Average Rating
                       </div>
                     </div> */}
                  </div>
                </div>

              </div>
            </div>

            <main ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative">
              
              {/* THE FIX 3: Added w-full to the floating search bar so it respects container width dynamically */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-2 md:p-3 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 w-full max-w-4xl mx-auto -mt-16 relative z-30 mb-16 transform transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)]">
                  <div className="flex items-center px-6 py-4 flex-1 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 w-full group">
                    <MapPin size={22} className="text-indigo-500 mr-3 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Location</label>
                      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where? (e.g. Raipur)" className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-semibold placeholder-gray-300 dark:placeholder-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center px-6 py-4 flex-1 w-full group">
                    <Search size={22} className="text-purple-500 mr-3 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Service</label>
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What do you need?" className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-semibold placeholder-gray-300 dark:placeholder-gray-500" />
                    </div>
                  </div>

                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl md:rounded-full py-4 px-8 md:p-5 w-full md:w-auto ml-0 md:ml-2 mt-2 md:mt-0 transition-all cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <Search size={20} className="hidden md:block" />
                    <span className="md:hidden">Search Services</span>
                  </button>
              </div>

              {/* Enhanced Categories Section */}
              <div className="mb-12 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white shrink-0 tracking-tight">Explore Categories</h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
                  <button 
                    onClick={() => setActiveMainCategory("All")}
                    className={`snap-start px-8 py-3.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 border ${activeMainCategory === "All" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
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
                        className={`snap-start px-8 py-3.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 border ${activeMainCategory === catName ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                      >
                        {catName} 
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Subcategories */}
              {activeMainCategory !== "All" && subCategories.length > 0 && (
                <div className="mb-14 animate-in slide-in-from-top-4 duration-300 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Refine Search</h4>
                  <div className="flex flex-wrap gap-3">
                    {subCategories.map((sub) => (
                      <button 
                        key={sub.id || sub.name} 
                        onClick={() => setActiveSubCategory(sub)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${activeSubCategory?.id === sub.id ? "bg-indigo-600 text-white shadow-md transform scale-105" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600"}`}
                      >
                        {activeSubCategory?.id === sub.id && <CheckCircle size={14} />}
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Listings Grid */}
              <div className="animate-in fade-in duration-700 delay-150">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    {activeMainCategory === "All" 
                      ? "Trending Services" 
                      : (activeSubCategory ? activeSubCategory.name : activeMainCategory)} 
                    </h3>
                  {isLoadingData && <Loader2 className="animate-spin text-indigo-600" size={24} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredListings.length > 0 ? (
                    filteredListings.map((item, i) => (
                      <div key={item.id || i} className="animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                        <ServiceCard 
                          item={item} 
                          onCardClick={(selectedItem) => {
                            setBookingService(selectedItem);
                            setActivePage("service-details");
                          }}
                          onPreviewClick={(selectedItem) => setSelectedModalListing(selectedItem)}
                        />
                      </div>
                    ))
                  ) : (
                    !isLoadingData && (
                      <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
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
        <Footer setActivePage={setActivePage} />
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