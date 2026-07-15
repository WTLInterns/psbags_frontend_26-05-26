"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistService } from "@/services/wishlistService";
import { hasStoredToken } from "@/utils/authToken";

type Props = {
  product: Product;
  className?: string;
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  );

const calcDiscount = (
  price?: number,
  originalPrice?: number,
  existing?: number
): number | undefined => {
  if (typeof existing === "number" && isFinite(existing)) return existing;
  if (
    typeof price === "number" &&
    typeof originalPrice === "number" &&
    isFinite(price) &&
    isFinite(originalPrice) &&
    originalPrice > 0
  ) {
    const pct = Math.max(0, Math.min(100, ((originalPrice - price) / originalPrice) * 100));
    return Math.round(pct);
  }
  return undefined;
};

export default function ProductCard({ product, className = "" }: Props) {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const discount = useMemo(
    () => calcDiscount(product.price, product.originalPrice, (product as any).discountPercent),
    [product]
  );

  // PHASE 4: Get all available images for rotation
  const allImages = useMemo(() => {
    if (product.hasVariants && product.productColors && product.productColors.length > 0) {
      const firstColor = product.productColors[0];
      return firstColor.images.map(img => img.imageUrl);
    }
    return product.images || [];
  }, [product]);

  // PHASE 4: Get display image based on current index
  const displayImage = useMemo(() => {
    if (allImages.length > 0) {
      return allImages[currentImageIndex];
    }
    return "/images/placeholder.jpg";
  }, [allImages, currentImageIndex]);

  // Truncate description to 2 lines similar to reference UI
  const description = product.description || "";

  useEffect(() => {
    let isMounted = true;

    const syncWishlistState = async () => {
      if (!isAuthenticated || !hasStoredToken()) {
        if (isMounted) {
          setIsWishlisted(false);
        }
        return;
      }

      try {
        const inWishlist = await wishlistService.isProductInWishlist(Number(product.id));
        if (isMounted) {
          setIsWishlisted(inWishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist state:", error);
      }
    };

    syncWishlistState();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, product.id]);

  // PHASE 4: Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, []);

  // PHASE 4: Handle mouse enter - immediately switch to second image, then rotate every 1 second
  const handleMouseEnter = () => {
    // Only start rotation if there are multiple images
    if (allImages.length <= 1) return;

    // Clear any existing timer to prevent duplicates
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
    }

    // Immediately switch to second image (index 1)
    setCurrentImageIndex(1);

    // Start timer for subsequent rotations every 1 second
    rotationTimerRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    }, 1000);
  };

  // PHASE 4: Handle mouse leave - stop rotation and reset to first image
  const handleMouseLeave = () => {
    // Clear the rotation timer
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }

    // Reset to first image
    setCurrentImageIndex(0);
  };

  const handleWishlistClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !hasStoredToken()) {
      window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode: 'login' } }));
      return;
    }

    try {
      setIsWishlistLoading(true);
      const result = await wishlistService.toggleWishlist(Number(product.id));
      setIsWishlisted(result.action === 'added');
    } catch (error: any) {
      console.error("Wishlist toggle failed:", error);
      alert(error?.message || "Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className={`group block ${className}`}>
      <div className="relative bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div
          className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            key={displayImage}
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-opacity duration-300"
            priority={false}
          />

          {/* Left bottom badge (rating) */}
          <div className="absolute left-2 bottom-2 md:left-3 md:bottom-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 md:px-2 md:py-1 shadow">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.5 13.348a1 1 0 00-1.175 0l-2.944 2.125c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.746 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.303-3.292z" />
            </svg>
            <span className="text-[10px] md:text-xs font-semibold text-gray-900">{product.rating?.toFixed(1) ?? "4.2"}</span>
          </div>

          {/* Wishlist button top-right */}
          <button
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className={`absolute right-1.5 top-1.5 md:right-2 md:top-2 z-10 h-8 w-8 md:h-9 md:w-9 rounded-full backdrop-blur-sm border shadow flex items-center justify-center hover:bg-white disabled:opacity-70 ${
              isWishlisted ? "bg-red-50 border-red-200" : "bg-white/90 border-gray-200"
            }`}
          >
            <svg
              className={`w-4 h-4 md:w-5 md:h-5 ${isWishlisted ? "text-red-600" : "text-gray-800"}`}
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-2 md:p-3">
          <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 truncate" title={product.name}>
            {product.name}
          </h3>
          <p
            className="mt-1 text-[10px] md:text-xs text-gray-600 line-clamp-2"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={description}
          >
            {description}
          </p>

          <div className="mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 flex-wrap">
            <span className="text-sm md:text-base font-bold text-gray-900">₹{formatPrice(product.price)}</span>
            {typeof product.originalPrice === "number" && (
              <span className="text-[10px] md:text-xs text-red-500 line-through">₹{formatPrice(product.originalPrice)}</span>
            )}
            {typeof discount === "number" && discount > 0 && (
              <span className="text-[9px] md:text-[10px] lg:text-xs font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
          {typeof product.originalPrice === "number" && product.originalPrice > product.price && (
            <div className="mt-0.5 md:mt-1 text-[9px] md:text-[11px] lg:text-xs text-green-700">
              You save ₹{formatPrice((product.originalPrice - product.price))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
