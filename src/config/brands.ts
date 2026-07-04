/**
 * Brand Logos Configuration
 * 
 * This file contains the configuration for brand logos displayed in the
 * "Trusted By Countless Brands" section.
 * 
 * To add/update brand logos:
 * 1. Add a new object to the brands array
 * 2. Provide: id, name, and image path
 * 3. Place your brand logo images in public/images/brands/ directory
 * 
 * Example:
 * {
 *   id: 7,
 *   name: "Your Brand",
 *   image: "/images/brands/your-brand.png"
 * }
 */

export interface Brand {
  id: number;
  name: string;
  image: string;
}

export const brands: Brand[] = [
  {
    id: 1,
    name: "Blazeclan",
    image: "/psbags/kesari.jfif"
  },
  {
    id: 2,
    name: "Bajaj Finserv",
    image: "/psbags/ritz.png"
  },
  {
    id: 3,
    name: "SAP",
    image: "/psbags/jw.png"
  },
  {
    id: 4,
    name: "Amul",
    image: "/psbags/bentley.png"
  },
  {
    id: 5,
    name: "GeeksforGeeks",
    image: "/psbags/tlwalkars2.png"
  },
  {
    id: 6,
    name: "GeeksforGeeks",
    image: "/psbags/semtech2.svg"
  },
  {
    id: 7,
    name: "GeeksforGeeks",
    image: "/psbags/girikand.png"
  }
];

// Section configuration
export const trustedBrandsConfig = {
  title: "Trusted By Countless Brands",
  subtitle: "250+ Clients | 1600+ Happy Customers",
  scrollSpeed: 6,
  pauseOnHover: true
};
