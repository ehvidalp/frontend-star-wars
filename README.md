# Star Wars Frontend - Technical Assessment

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/frontend-star-wars)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green)](https://github.com/yourusername/frontend-star-wars)
[![Angular](https://img.shields.io/badge/Angular-20.0-red)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

> A modern web application built with Angular 20, consuming the Star Wars API (SWAPI) to display detailed planet information. Built with frontend architecture best practices and a focus on user experience.

## 🚀 Tech Stack

- **Framework:** Angular 20 (Standalone Components)
- **State Management:** Angular native Signals with Signal Store pattern
- **Styling:** Tailwind CSS 4.0 with utility-first approach
- **Architecture:** Feature-Sliced Design with lazy loading
- **Language:** TypeScript 5.7
- **Testing:** Jasmine + Karma
- **Build:** Angular CLI with SSR enabled

## 📋 Key Features

- ✅ **Modern Architecture:** 100% Standalone Components without NgModules
- ✅ **Reactive State Management:** Signals with computed properties
- ✅ **Lazy Loading:** Performance optimization by features
- ✅ **Responsive Design:** Mobile-first with Tailwind CSS
- ✅ **Accessibility:** WAI-ARIA implementation and best practices
- ✅ **Advanced Animations:** Smooth transitions and visual effects
- ✅ **Server-Side Rendering:** SEO optimized

## 🛠️ Quick Start

### Prerequisites

- Node.js 18.19+ or 20.9+
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/frontend-star-wars.git

# Navigate to directory
cd frontend-star-wars

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

## 📜 Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm run build:ssr  # Build with SSR
npm run serve:ssr  # Serve application with SSR
npm test           # Run unit tests
npm run test:watch # Tests in watch mode
npm run lint       # Code linter
```

## 📊 Performance

- **First Contentful Paint:** < 1.2s
- **Largest Contentful Paint:** < 2.0s
- **Time to Interactive:** < 3.0s
- **Bundle Size:** < 350KB (initial)

## 🏗️ Project Architecture

This project implements a modern architecture based on:

- **Feature-Sliced Design:** Organization by business domain
- **Container/Presentational Pattern:** Clear separation of concerns
- **Signal Store Pattern:** Reactive and efficient state management
- **Utility-First Styling:** Rapid development with Tailwind CSS

## 📚 Technical Documentation

For a deep understanding of architectural decisions and implemented patterns, consult the complete technical documentation:

- **[General Architecture](./docs/ARCHITECTURE.md)** - Structure and design principles
- **[State Management](./docs/STATE-MANAGEMENT.md)** - Signal Store pattern and data flow
- **[Styling Architecture](./docs/STYLING-ARCHITECTURE.md)** - Tailwind philosophy and design system

## 🤝 Contributing

This project follows development best practices. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a technical assessment and is available under the [MIT License](LICENSE).

---

**Built with ❤️ using Angular 20 and modern frontend best practices**
