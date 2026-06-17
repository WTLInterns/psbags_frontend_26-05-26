'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import AuthModal from './AuthModal';
import UserDropdown from './UserDropdown';
import CartSidebar from './CartSidebar';
import Link from 'next/link';
import SearchResultsModal from './SearchResultsModal';
import { subcategoryService, Subcategory } from '@/services/subcategoryService';
import { announcementService } from '@/services/announcementService';

// Component that handles search params logic
const SearchParamsHandler = ({ onOpenAuthModal }: { onOpenAuthModal: (mode: 'login' | 'signup') => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginParam = searchParams?.get('login');
    if (loginParam === 'true') {
      onOpenAuthModal('login');
      // Remove the login param so the modal doesn't keep reopening on navigation
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('login');
        const newUrl = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
        window.history.replaceState({}, '', newUrl);
      } catch { }
    }
  }, [searchParams, onOpenAuthModal]);

  return null;
};

interface CategoryDropdownProps {
  category: string;
  subcategories: Subcategory[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CategoryDropdown = ({ category, subcategories, isOpen, onMouseEnter, onMouseLeave }: CategoryDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log({ category, isOpen, openDropdownValue: isOpen });

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center space-x-1 text-sm font-bold transition-all duration-200 whitespace-nowrap tracking-wide relative group cursor-pointer hover:scale-105 text-white hover:text-white/80">
        <span>{category}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/80 transition-all duration-300 group-hover:w-full"></span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && subcategories.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
        >
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/products?subcategory=${encodeURIComponent(subcategory.subcategoryName)}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
            >
              {subcategory.subcategoryName}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubcategories, setMobileSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { state: cartState, toggleCart } = useCart();

  // Default fallback announcements
  const defaultAnnouncements = [
    "10% off when you subscribe to our emails. Brand exclusions apply. T&Cs apply",
    "Guess what's just landed? Discover the latest arrivals now",
    "All over india delivery and free returns - shop now"
  ];

  // Load announcements from API
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        console.log('🔄 Loading announcements from API...');

        const apiAnnouncements = await announcementService.getActiveAnnouncements();
        console.log('📡 API Response:', apiAnnouncements);

        // Filter out empty/null values and build dynamic array
        const filteredAnnouncements = apiAnnouncements.filter(
          (announcement: string) => announcement && announcement.trim().length > 0
        );

        if (filteredAnnouncements.length > 0) {
          setAnnouncements(filteredAnnouncements);
          console.log('✅ Final announcements array:', filteredAnnouncements);
        } else {
          console.log('⚠️ No valid announcements from API, using fallback');
          setAnnouncements(defaultAnnouncements);
        }
      } catch (error) {
        console.error('❌ Failed to load announcements from API:', error);
        console.log('🔄 Using fallback announcements');
        setAnnouncements(defaultAnnouncements);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Announcement rotation logic
  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentAnnouncement((prev) => {
          const nextIndex = (prev + 1) % announcements.length;
          console.log('🔄 Current announcement index:', nextIndex, '- Text:', announcements[nextIndex]);
          return nextIndex;
        });
        setIsFading(false);
      }, 500);
    }, 3500);

    return () => clearInterval(interval);
  }, [announcements]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleDropdownOpen = (categoryName: string) => {
    console.log('OPENING', categoryName);
    setOpenDropdown(categoryName);
  };

  const handleDropdownClose = () => {
    console.log('CLOSING');
    setOpenDropdown(null);
  };

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryName ? null : categoryName);
  };

  // Listen for global auth open events so pages can request login modal
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail || {};
        const desiredMode = detail.mode === 'signup' ? 'signup' : 'login';
        setAuthModalMode(desiredMode);
        setIsAuthModalOpen(true);
      } catch {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      }
    };
    window.addEventListener('auth:open', handler as EventListener);
    return () => window.removeEventListener('auth:open', handler as EventListener);
  }, []);

  const categories = [
    { name: "Home", isActive: true, href: "/", label: "", hasDropdown: false },
    { name: "All", isActive: true, href: "/products", label: "", hasDropdown: false },
    { name: "Shop Online", isActive: true, href: "/shop-online", label: "", hasDropdown: true },
    { name: "Corporate Gifts", isActive: true, href: "/corporate-gifts", label: "", hasDropdown: true },
    { name: "Wholesale / Distributor", isActive: true, href: "/wholesale-distributor", label: "", hasDropdown: true },
    { name: "Blog", isActive: true, href: "/blog", label: "", hasDropdown: false },
  ];

  useEffect(() => {
    console.log('openDropdown changed:', openDropdown);
  }, [openDropdown]);

  // Fetch subcategories for all categories
  useEffect(() => {
    const fetchSubcategories = async () => {
      const categoryNames = ['Shop Online', 'Corporate Gifts', 'Wholesale / Distributor'];
      const subcategoryData: Record<string, Subcategory[]> = {};

      for (const categoryName of categoryNames) {
        try {
          const subs = await subcategoryService.getSubcategoriesByCategory(categoryName);
          subcategoryData[categoryName] = subs;
        } catch (error) {
          console.error(`Failed to fetch subcategories for ${categoryName}:`, error);
          subcategoryData[categoryName] = [];
        }
      }

      setSubcategories(subcategoryData);
      setMobileSubcategories(subcategoryData);
    };

    fetchSubcategories();
  }, []);

  return (
    <>
      <header className="w-full relative z-[70]">
        {/* Search Params Handler wrapped in Suspense */}
        <Suspense fallback={null}>
          <SearchParamsHandler onOpenAuthModal={handleOpenAuthModal} />
        </Suspense>

        {/* Top Announcement Bar */}
        <div className="bg-white border-b border-gray-300 py-3 px-4 text-center">
          {announcementsLoading ? (
            <p className="text-sm text-black font-medium">
              Loading announcements...
            </p>
          ) : (
            <p className={`text-sm text-black transition-opacity duration-1000 ease-in-out font-medium ${isFading ? 'opacity-0' : 'opacity-100'
              }`}>
              {announcements[currentAnnouncement] || defaultAnnouncements[0]}
            </p>
          )}
        </div>

        {/* Main Navigation Bar */}
        <div className="border-b border-white/10" style={{ background: 'linear-gradient(135deg, var(--ps-brand-primary), var(--ps-brand-primary-light))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Left - Authentication Section (Hidden on mobile) */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <div className="flex items-center space-x-4">
                    {/* Login */}
                    <div
                      onClick={handleLoginClick}
                      className="flex items-center space-x-1 cursor-pointer group hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-white group-hover:text-white/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 
                           2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 
                           21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 
                           0l-3 3m3-3H3"
                        />
                      </svg>
                      <span className="text-sm font-bold text-white group-hover:text-white/80">
                        Login
                      </span>
                    </div>

                    {/* Sign Up */}
                    <div
                      onClick={handleSignupClick}
                      className="flex items-center space-x-1 cursor-pointer group hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-white group-hover:text-white/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 
                           3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 
                           1115 0v.75H4.5v-.75zM18 9v3m0 0v3m0-3h3m-3 
                           0h-3"
                        />
                      </svg>
                      <span className="text-sm font-bold text-white group-hover:text-white/80">
                        Sign Up
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Center - Premium Logo */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 transition-all duration-200"
                onClick={handleLogoClick}
              >
                <div className="relative w-48 sm:w-56 h-12 sm:h-14">
                  <Image
                    src="/psbags/pslogo1.png"
                    alt="PS BAGS Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Right - Navigation Icons + Page Links */}
              <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
                <button onClick={() => setIsSearchOpen(true)} className="hidden sm:flex items-center space-x-2 text-white hover:text-white/80 transition-all duration-200 cursor-pointer group hover:scale-105">
                  <div className="p-2 rounded-full group-hover:bg-white/10 transition-all duration-200">
                    <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold hidden md:inline">Search</span>
                </button>

                {/* ✅ Fixed Wishlist Button */}
                <Link
                  href="/wishlist"
                  className="p-2 rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer group hover:scale-105"
                >
                  <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </Link>

                <button
                  onClick={toggleCart}
                  className="relative p-2 rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer group hover:scale-105"
                >
                  <svg className="w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartState.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <div className="pb-4 border-b border-gray-200">
                  <UserDropdown />
                </div>
              ) : (
                <div className="pb-4 border-b border-gray-200 space-y-3">
                  <button
                    onClick={handleLoginClick}
                    className="w-full flex items-center space-x-3 text-left"
                  >
                    <div className="p-2 rounded-full bg-gray-100">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-black font-bold">Login</span>
                  </button>
                  <button
                    onClick={handleSignupClick}
                    className="w-full bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Search */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="p-2 rounded-full bg-gray-100">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-sm text-black font-bold">Search</span>
              </div>

              {/* Mobile Categories with Accordion */}
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index}>
                    {category.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleMobileCategory(category.name)}
                          className="w-full flex items-center justify-between py-3 text-base font-bold border-b border-gray-100 text-black hover:text-gray-700 transition-colors duration-200"
                        >
                          <span>{category.name}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${expandedMobileCategory === category.name ? 'rotate-180' : ''
                              }`}
                          >
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </button>
                        {expandedMobileCategory === category.name && mobileSubcategories[category.name] && (
                          <div className="pl-4 py-2 space-y-2">
                            {mobileSubcategories[category.name].map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/products?subcategory=${encodeURIComponent(subcategory.subcategoryName)}`}
                                className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subcategory.subcategoryName}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={category.href}
                        className="block py-3 text-base font-bold border-b border-gray-100 text-black hover:text-gray-700 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Category Navigation Bar - Sticky Strip */}
      <nav className="sticky top-0 z-[60] shadow-md" style={{ background: 'linear-gradient(135deg, var(--ps-brand-primary-dark), var(--ps-brand-primary))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-4 sm:space-x-8 lg:space-x-12 py-3 overflow-x-auto md:overflow-visible hide-scrollbar whitespace-nowrap">
            {categories.map((category, index) => (
              category.hasDropdown ? (
                <div key={index} className="flex-shrink-0">
                  <div className="hidden md:block">
                    <CategoryDropdown
                      category={category.name}
                      subcategories={subcategories[category.name] || []}
                      isOpen={openDropdown === category.name}
                      onMouseEnter={() => handleDropdownOpen(category.name)}
                      onMouseLeave={handleDropdownClose}
                    />
                  </div>
                  {/* Mobile simple link for the sticky strip */}
                  <Link
                    href={category.href}
                    className="md:hidden text-xs sm:text-sm font-bold transition-all duration-200 text-white hover:text-white/80"
                  >
                    {category.name}
                  </Link>
                </div>
              ) : (
                <Link
                  key={index}
                  href={category.href}
                  className="flex-shrink-0 text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap tracking-wide relative group cursor-pointer hover:scale-105 text-white hover:text-white/80"
                >
                  {category.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/80 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />

      {/* Cart Sidebar */}
      <CartSidebar onAuthRequired={() => {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      }} />

      {/* Search Modal */}
      <SearchResultsModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
