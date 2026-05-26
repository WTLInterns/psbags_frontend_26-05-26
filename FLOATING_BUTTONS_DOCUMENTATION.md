# Floating Action Buttons Documentation

## Overview
This project includes floating action buttons for WhatsApp and Call functionality, providing easy access to customer support across all pages.

## Components

### 1. FloatingButtons.tsx (Basic Version)
**Location:** `src/components/FloatingButtons.tsx`

**Features:**
- WhatsApp button (bottom-right corner)
- Call button (bottom-left corner)
- Responsive design (mobile + desktop)
- Hover animations and tooltips
- Pulse animation to attract attention
- Ripple effects on hover

**Usage:**
```tsx
import FloatingButtons from '@/components/FloatingButtons';

// Already included in main layout.tsx
```

### 2. FloatingButtonsAdvanced.tsx (Advanced Version)
**Location:** `src/components/FloatingButtonsAdvanced.tsx`

**Features:**
- Expandable menu with toggle button
- WhatsApp, Call, and Email options
- Smooth animations and transitions
- Space-efficient design
- Professional appearance

**Usage:**
```tsx
import FloatingButtonsAdvanced from '@/components/FloatingButtonsAdvanced';

// Replace in layout.tsx if you prefer the advanced version
```

## Configuration

### Phone Numbers and Links
Update the contact information in the component files:

```tsx
// WhatsApp (replace 919999999999 with your number)
const handleWhatsAppClick = () => {
  window.open('https://wa.me/91 8983434817', '_blank');
};

// Phone Call (replace +919999999999 with your number)
const handleCallClick = () => {
  window.open('tel:+91 8983434817', '_self');
};

// Email (for advanced version)
const handleEmailClick = () => {
  window.open('mailto:regaloobyps@gmail.com', '_self');
};
```

### Styling Customization

#### Colors
```css
/* WhatsApp Button */
bg-[#25D366] /* Official WhatsApp green */

/* Call Button */
bg-[#007BFF] /* Professional blue */

/* Email Button (Advanced) */
bg-[#EA4335] /* Gmail red */

/* Main Menu Button (Advanced) */
bg-black /* Professional black */
```

#### Positioning
```css
/* Current positioning */
bottom-5 right-5 /* WhatsApp - 20px from bottom-right */
bottom-5 left-5  /* Call - 20px from bottom-left */

/* Responsive sizes */
w-12 h-12 sm:w-14 sm:h-14 /* 48px mobile, 56px desktop */
```

## Implementation Details

### 1. Installation
The component uses `react-icons` package:
```bash
npm install react-icons
```

### 2. Integration
The FloatingButtons component is integrated globally in the main layout:

```tsx
// src/app/layout.tsx
import FloatingButtons from '@/components/FloatingButtons';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {/* Other providers */}
        {children}
        <FloatingButtons />
      </body>
    </html>
  );
}
```

### 3. Responsive Design
- **Mobile:** Smaller buttons (48px), adjusted spacing
- **Desktop:** Larger buttons (56px), enhanced hover effects
- **Tablets:** Smooth scaling between mobile and desktop

### 4. Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast tooltips
- Semantic button elements

## Animations and Effects

### 1. Basic Animations
- **Hover Scale:** `hover:scale-110` (10% size increase)
- **Pulse Effect:** `animate-pulse` (attracts attention)
- **Shadow Enhancement:** `hover:shadow-2xl`

### 2. Advanced Animations
- **Ripple Effect:** Expanding circle animation
- **Tooltip Transitions:** Smooth fade-in/out with transform
- **Menu Toggle:** Rotation and scaling effects

### 3. Performance Optimizations
- CSS transforms for smooth animations
- Minimal JavaScript state management
- Efficient event handlers

## Browser Compatibility
- **Modern Browsers:** Full support (Chrome, Firefox, Safari, Edge)
- **Mobile Browsers:** Optimized for iOS Safari and Chrome Mobile
- **Fallbacks:** Graceful degradation for older browsers

## Testing Checklist

### Functionality
- [ ] WhatsApp opens correctly with phone number
- [ ] Call function works on mobile devices
- [ ] Email opens default mail client (advanced version)
- [ ] Buttons are clickable and responsive

### Visual
- [ ] Buttons appear in correct positions
- [ ] Hover effects work smoothly
- [ ] Tooltips display properly
- [ ] Responsive sizing works across devices

### Accessibility
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] High contrast mode support
- [ ] Touch target size (minimum 44px)

## Customization Examples

### Change Button Positions
```tsx
// Move WhatsApp to bottom-left
className="fixed bottom-5 left-5 ..."

// Move Call to top-right
className="fixed top-5 right-5 ..."
```

### Add Custom Colors
```tsx
// Custom brand colors
className="... bg-[#FF6B35] ..." // Orange
className="... bg-[#6C5CE7] ..." // Purple
```

### Modify Animation Speed
```tsx
// Faster animations
className="... transition-all duration-200 ..."

// Slower animations
className="... transition-all duration-500 ..."
```

## Troubleshooting

### Common Issues

1. **Buttons not visible**
   - Check z-index value (should be 50 or higher)
   - Verify positioning classes are applied

2. **WhatsApp not opening**
   - Ensure phone number format is correct (country code without +)
   - Check if WhatsApp is installed on mobile

3. **Hover effects not working**
   - Verify Tailwind CSS is properly configured
   - Check for conflicting CSS styles

4. **Responsive issues**
   - Test on actual devices, not just browser dev tools
   - Verify Tailwind responsive prefixes (sm:, md:, lg:)

### Debug Mode
Add this temporary class to make buttons more visible during development:
```tsx
className="... border-4 border-red-500 ..."
```

## Future Enhancements

### Potential Features
- **Social Media Integration:** Instagram, Facebook buttons
- **Live Chat Widget:** Integration with customer support
- **Internationalization:** Multi-language tooltips
- **Analytics Tracking:** Click event monitoring
- **Customizable Themes:** Dark/light mode support

### Performance Improvements
- **Lazy Loading:** Load icons only when needed
- **Bundle Optimization:** Tree-shake unused icons
- **CDN Integration:** Serve icons from CDN

## Support
For issues or customization requests, refer to:
- React Icons documentation: https://react-icons.github.io/react-icons/
- Tailwind CSS documentation: https://tailwindcss.com/docs
- Next.js documentation: https://nextjs.org/docs