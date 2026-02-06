# Mobile Responsiveness Guide

## Overview

ContractGuard is now fully optimized for mobile, tablet, and desktop devices using a mobile-first design approach with Tailwind CSS responsive utilities.

## Responsive Breakpoints

Tailwind CSS uses the following breakpoints:

```
sm:  640px   (Small phones, large phones)
md:  768px   (Tablets)
lg:  1024px  (Desktops)
xl:  1280px  (Large desktops)
2xl: 1536px  (Extra large desktops)
```

## Mobile-First Approach

```
Default (mobile):  Base styles for all devices
sm:               Overrides for screens ≥640px
md:               Overrides for screens ≥768px
lg:               Overrides for screens ≥1024px
```

## Navigation

### Mobile Navigation (`MobileNav`)
- **When**: Visible on mobile devices only (`md:hidden`)
- **Features**:
  - Hamburger menu (3-line icon)
  - Expandable drawer menu
  - Alerts badge with count
  - Quick logout button
  - User email display

### Desktop Navigation (`Navigation`)
- **When**: Hidden on mobile, visible on tablets/desktops (`hidden md:block`)
- **Features**:
  - Full navigation bar
  - User profile details
  - Alerts button with badge
  - Logout link with icon

## Layout & Spacing

### Responsive Padding
```tsx
// Mobile: 4px (p-4), Tablet/Desktop: 6px (sm:p-6)
<div className="px-4 sm:px-6 py-6 sm:py-8">
```

### Responsive Grid Systems

**Stats Cards**
```tsx
grid-cols-1       // Mobile: 1 column
sm:grid-cols-2    // Tablets: 2 columns  
lg:grid-cols-4    // Desktops: 4 columns
```

**Charts**
```tsx
grid-cols-1       // Mobile: Stack vertically
lg:grid-cols-2    // Desktops: Side by side
```

**Contract Details Grid**
```tsx
grid-cols-1       // Mobile: 1 column
sm:grid-cols-2    // Tablets: 2 columns
md:grid-cols-3    // Desktops: 3 columns
```

## Components Optimization

### ContractTable
- **Mobile**: Card-based layout with clickable cards
- **Desktop**: Traditional table format
- **Features**:
  - Horizontal scrolling for desktop overflow
  - Touch-friendly card taps on mobile
  - Chevron icon indicating clickable items
  - Risk badge with full label on mobile

### Modals
- **Mobile**: Full-height slide-up from bottom (`items-end`)
- **Desktop**: Centered modal (`md:items-center`)
- **Sizing**:
  - Mobile: `h-[90vh]` (90% of viewport)
  - Desktop: `md:max-h-[80vh]` (80% of viewport)
- **Base**:
  - Mobile: `rounded-t-2xl` (rounded top corners)
  - Desktop: `md:rounded-lg` (all corners)

### Form Inputs
- **Touch Targets**: Minimum 44px height (iOS recommendation)
- **Sizing**: `py-3` (12px padding) for easy mobile input
- **Font Size**: `text-base` to prevent iOS zoom
- **Width**: Full-width on mobile, adjusted spacing on desktop

### Upload Area
- **Icon Size**: `w-10 h-10` on mobile, `sm:w-12 sm:h-12` on desktop
- **Padding**: `p-6 sm:p-8` for responsive spacing
- **Text Size**: `text-base sm:text-lg` for readability

## Touch-Friendly Design

### Button Sizing
```tsx
// Minimum 44x44px touch target (mobile)
py-3 px-4            // 48x variable width
h-12 w-12            // Square buttons for icons
```

### Spacing Between Interactive Elements
```tsx
gap-3 sm:gap-4       // Mobile: 12px, Desktop: 16px
```

### Tap Feedback
```tsx
hover:bg-gray-100    // Changes on hover (desktop)
active:scale-95      // Can add for mobile press feedback
transition-colors    // Smooth color transitions
```

## Typography Scaling

```tsx
text-lg sm:text-xl   // Mobile: Large, Desktop: Extra Large
text-sm              // Consistent across devices
text-xs              // Small text - captions, help text
```

## Common Patterns

### Responsive Flex Layout
```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  {/* Stacks vertically on mobile, horizontally on desktop */}
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* 1 col mobile, 2 cols tablet, 4 cols desktop */}
</div>
```

### Responsive Text with Truncation
```tsx
<div className="flex-1 min-w-0">
  <p className="font-semibold text-gray-900 truncate">
    Long contract name
  </p>
</div>
```

### Responsive Width Container
```tsx
<div className="w-full md:max-w-3xl">
  {/* Full width on mobile, max-width on desktop */}
</div>
```

## Mobile-Specific Features

### Safe Area Insets
The app respects devices with notches/safe areas through viewport settings in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Touch Scrolling
Modals use `overflow-y-auto` with smooth scrolling:
```tsx
<div className="overflow-y-auto">
  {/* Content automatically scrollable on mobile */}
</div>
```

### Keyboard Handling
Forms handle:
- Auto-dismiss keyboard on button click
- Enter key to submit (`onKeyPress` handler)
- Prevented iOS zoom on input focus (handled via `text-base` font size)

## Device-Specific Optimizations

### iPhone/Small Phones (< 375px)
- Single column for all layouts
- Smaller padding and gaps
- Simplified modals
- Prioritized tap targets

### Android/Standard Phones (375-428px)
- Standard `sm:` breakpoint support
- Two-column layouts where appropriate
- Full feature access

### Tablets (768px+)
- `md:` breakpoint styling
- Two-column tables and grids
- More spacious layouts
- Desktop-like navigation

### Desktops (1024px+)
- Full feature set
- Multi-column layouts
- Side-by-side content
- Hover states and effects

## Testing Mobile Responsiveness

### Browser DevTools
```
1. Open Chrome DevTools (F12)
2. Click Device Toolbar icon (Ctrl+Shift+M)
3. Select device preset or custom size
4. Test at various breakpoints
```

### Common Breakpoints to Test
- 320px (iPhone SE)
- 375px (iPhone X)
- 428px (iPhone 14 Pro Max)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)

### Testing Checklist
- [ ] Navigation menu works on mobile
- [ ] All text readable without zoom
- [ ] Forms easily fillable on mobile
- [ ] Modals open/close properly
- [ ] Buttons have adequate spacing
- [ ] Images scale properly
- [ ] Tables are readable
- [ ] No horizontal scrolling on main content
- [ ] Alerts/notifications display correctly
- [ ] Charts responsive and readable

## Performance Considerations

### Image Optimization
- SVG icons scale automatically
- No `max-width` limiting on key content
- Touch-friendly icon sizes (24x24 minimum)

### Viewport Height
- Modals use `h-[90vh]` to account for mobile bars
- Content avoids 100vh to prevent cutoff on mobile
- Safe area handled by browser defaults

## Future Enhancements

1. **Orientation Handling**
   - Portrait/landscape detection
   - Landscape-optimized layouts

2. **Gesture Support**
   - Swipe to close modals
   - Pull-to-refresh capability
   - Long-press context menus

3. **Mobile App Shell**
   - Progressive Web App (PWA)
   - Offline support
   - Add to home screen

4. **Accessibility**
   - Touch size audits (WCAG)
   - High contrast mobile mode
   - Dark mode support

## Debugging Tips

### Emulate Network Throttling
```
DevTools > Network > Throttle > Slow 4G
Test performance on slower connections
```

### Check Touch Events
```tsx
// Add this to verify touch target sizes
const touchTarget = document.querySelectorAll('button, [role="button"]');
touchTarget.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    console.warn('Small touch target:', el);
  }
});
```

### Mobile Viewport Analysis
```
Use Lighthouse audit in DevTools
Check for mobile-friendliness issues
Validate responsive design
```

## Browser Compatibility

- **iOS Safari**: iOS 12+
- **Android Chrome**: Android 6+
- **Android Firefox**: Android 68+
- **Samsung Internet**: 4.0+

All modern browsers get enhanced styling via responsive utilities.

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First CSS](https://www.mobileapproach.com/)
- [WCAG Touch Target Guidance](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

---

**Version**: 1.0.0  
**Last Updated**: February 6, 2026
