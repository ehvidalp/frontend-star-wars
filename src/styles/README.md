# Star Wars Frontend - Styles Architecture

## 📁 Structure Overview

```
src/styles/
├── animations/
│   ├── _keyframes.css      # All keyframe definitions
│   └── _utilities.css      # Animation utility classes
├── base/
│   ├── _variables.css      # CSS custom properties & fonts
│   ├── _view-transitions.css # View transition configurations
│   └── _accessibility.css  # Global accessibility styles
├── components/
│   └── _planet.css         # Planet component styles
├── utilities/
│   └── _starfield.css      # Starfield background utilities
└── styles.css.backup      # Backup of original styles.css
```

## 🎯 Architecture Principles

### 1. **Centralized Animations**
- All `@keyframes` are defined in `animations/_keyframes.css`
- Animation utilities are in `animations/_utilities.css`
- No duplicate keyframes across components

### 2. **Tailwind v4 Integration**
- Uses `@import "tailwindcss"` for Tailwind v4 support
- Component styles use `@layer components` and `@layer utilities`
- Semantic utility classes for planet types

### 3. **Modular Organization**
- **Base**: Core variables, fonts, and view transitions
- **Components**: Component-specific styles that can't be handled by utilities
- **Utilities**: Custom utility classes
- **Animations**: All animation-related code

### 4. **Reduced Duplication**
- Animations are centralized and reusable
- Planet type classes use semantic naming
- View transitions are globally configured

## 🎨 Animation System

### Available Keyframes
- `zoom` - Starfield zoom animation
- `planet-orbit` - Planet orbital rotation
- `planet-float` - Subtle floating motion
- `planet-glow` - Pulsing glow effect
- `ring-rotate` - 3D ring rotation
- `spin-slow` / `spin-reverse` - Ring spinning
- `fadeOutScale` / `fadeInScale` - View transition effects

### Animation Utilities
```css
/* Planet animations */
.animate-planet-float
.animate-planet-glow
.animate-planet-orbit

/* Ring animations */
.animate-ring-rotate
.animate-spin-slow
.animate-spin-reverse

/* Hover variants */
.hover:animate-planet-float:hover
.group:hover .group-hover:animate-planet-float
```

## 🪐 Planet System

### Planet Type Classes
```css
.planet-desert
.planet-ice
.planet-ocean
.planet-forest
.planet-urban
.planet-gas-giant
.planet-volcanic
.planet-crystal
.planet-toxic
.planet-swamp
.planet-rocky
.planet-terrestrial
```

### Component Integration
The `PlanetSphere` component now uses semantic classes:
```typescript
planetClasses = computed(() => {
  const type = this.planetType();
  const classMap = {
    'desert': 'planet-desert',
    'ice': 'planet-ice',
    // ... etc
  };
  return classMap[type] || classMap['terrestrial'];
});
```

## ⭐ Starfield System

### Available Classes
```css
.space-background         # Standard starfield
.space-background-dense   # Denser starfield with layers
.space-background-animated # Animated starfield
```

## 🔄 View Transitions

Global view transition configurations for:
- Planet cards (`planet-card-*`)
- Planet spheres (`planet-sphere-*`)
- Planet titles (`planet-title-*`)

## ♿ Accessibility

Global accessibility styles in `base/_accessibility.css`:
- `prefers-reduced-motion` support throughout
- `prefers-contrast` media queries for high contrast
- Focus indicators and accessible status elements
- Print styles for better printing experience

## 🧹 Component CSS Cleanup

### Analyzed Components
- **planet-card.css**: Removed redundant corner decorations (now using Tailwind utilities)
- **planets-list.css**: Moved global accessibility rules to base layer
- **planet-sphere.css**: Already optimized (minimal component-specific styles)
- **planet-details.css**: Already optimized (minimal component-specific styles)

### Cleanup Principles
1. **Remove duplicate styles** - If it can be done with Tailwind, use Tailwind
2. **Centralize global styles** - Accessibility and animations go to base/global layers
3. **Keep component CSS minimal** - Only styles that can't be handled by utilities
4. **Maintain semantic structure** - Clear separation of concerns

## 🛠️ Usage Examples

### Adding New Animations
1. Add keyframe to `animations/_keyframes.css`
2. Create utility class in `animations/_utilities.css`
3. Use in components

### Adding New Planet Types
1. Add class to `components/_planet.css`
2. Update TypeScript enum in component
3. Use semantic class name

### Custom Component Styles
Place component-specific styles that can't be handled by Tailwind utilities in their respective component CSS files. Use `@layer components` for component styles and `@layer utilities` for utility classes.

## 📦 Benefits

1. **Better maintainability** - Centralized animations and styles
2. **Reduced bundle size** - No duplicate CSS
3. **Improved DX** - Clear organization and semantic naming
4. **Tailwind v4 ready** - Modern CSS architecture
5. **Type safety** - Semantic planet type system
6. **Performance** - Optimized CSS with proper layering
