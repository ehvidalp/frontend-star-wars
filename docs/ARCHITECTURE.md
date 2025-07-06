# Project Architecture

## Architectural Philosophy

This project is built on three fundamental pillars that define Angular's modern architecture and frontend development best practices:

### 1. **Standalone Components**
We have fully adopted Angular's new paradigm, completely eliminating the use of NgModules. All components are standalone, which provides:
- **Better tree-shaking:** Only necessary code is included in the final bundle
- **Simplicity:** Reduced architectural complexity
- **Reusability:** More portable and easier to test components
- **Simplified lazy loading:** Each feature can be loaded independently

### 2. **Feature-Sliced Design**
The project structure follows the Feature-Sliced Design pattern, organizing code by business domain rather than file type. This improves:
- **Scalability:** Easy addition of new features
- **Maintainability:** Related code logically grouped together
- **Team collaboration:** Different developers can work on independent features
- **Testability:** More specific and isolated tests per feature

### 3. **Container/Presentational Pattern**
We implement a clear separation between "Smart" (pages) and "Dumb" (presentational components) components:
- **Pages (Smart Components):** Handle business logic, state, and orchestration
- **Components (Dumb Components):** Focus solely on presentation and UI

## Detailed Folder Structure

```
src/app/
├── core/                    # Cross-cutting logic and singleton services
│   ├── layouts/            # Main application layouts
│   │   └── main-layout/    # Base layout with navigation
│   └── services/           # Singleton services and global utilities
│       └── navigation-state.service.ts
├── features/               # Business modules (lazy-loaded)
│   ├── home/              # Home page feature
│   │   ├── pages/         # Pages (Smart Components)
│   │   │   └── home/      # Main page component
│   │   └── home.routes.ts # Feature routes
│   └── planets/           # Planets feature
│       ├── components/    # Presentational components (Dumb)
│       │   ├── planet-card/
│       │   ├── planet-sphere/
│       │   └── planets-list/
│       ├── pages/         # Pages (Smart Components)
│       │   └── planet-details/
│       ├── services/      # Feature-specific services
│       │   └── planets.api.ts
│       ├── store/         # Feature Signal Store
│       │   └── planets.store.ts
│       ├── models/        # Feature-specific models and types
│       │   └── planet.model.ts
│       └── planets.routes.ts
└── shared/                # Truly reusable stateless components
    └── components/        # General UI components
        ├── loading/
        └── error/
```

### Directory Description

#### `/core`
Contains all cross-cutting application logic:
- **layouts/:** Layout components that define the general visual structure
- **services/:** Singleton services used throughout the application
- **guards/:** Route guards for route protection
- **interceptors/:** HTTP interceptors for centralized request handling

#### `/features`
Each subdirectory represents a complete business domain:
- **pages/:** Smart components directly associated with routes
- **components/:** Dumb presentational components specific to the feature
- **services/:** Domain-specific services (APIs, utilities)
- **store/:** Signal Store for feature state management
- **models/:** Feature-specific interfaces, types, and models

#### `/shared`
Truly reusable elements throughout the application:
- **components/:** UI components without business logic
- **directives/:** Reusable directives
- **pipes/:** Custom pipes
- **models/:** Global models and types

## Container/Presentational Separation

### Smart Components (Pages)
Components in the `pages/` folder are responsible for:
- **State management:** Interact with stores and services
- **Business logic:** Process data and make decisions
- **Orchestration:** Coordinate multiple presentational components
- **Navigation:** Handle routing and transitions

**Example:** `planet-details.component.ts`
```typescript
@Component({
  selector: 'app-planet-details',
  imports: [PlanetSphere, PlanetCard, LoadingComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (isLoading()) {
        <app-loading />
      } @else if (planet()) {
        <app-planet-sphere [planet]="planet()!" size="large" />
        <app-planet-card [planet]="planet()!" />
      }
    </div>
  `
})
export class PlanetDetailsComponent {
  // Business logic and state management
}
```

### Dumb Components (Components)
Components in the `components/` folder focus on:
- **Pure presentation:** Only concerned with displaying data
- **Inputs/Outputs:** Receive data and emit events
- **Reusability:** Can be used in multiple contexts
- **Testability:** Easy to test in isolation

**Example:** `planet-sphere.component.ts`
```typescript
@Component({
  selector: 'app-planet-sphere',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure [class]="'planet-sphere ' + sizeClasses()">
      <div [class]="planetClasses()"></div>
    </figure>
  `
})
export class PlanetSphere {
  planet = input.required<Planet>();
  size = input<'small' | 'medium' | 'large'>('medium');
  
  // Only presentation logic
}
```

## Data Flow and Lazy Loading

### Lazy Loading by Features
Each feature is loaded lazily to optimize performance:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes')
  },
  {
    path: 'planets',
    loadChildren: () => import('./features/planets/planets.routes')
  }
];
```

### Unidirectional Data Flow
1. **Pages (Smart)** get data from stores
2. **Stores** manage state using signals
3. **Services** make HTTP calls and asynchronous operations
4. **Components (Dumb)** receive data as inputs and emit events

## Benefits of This Architecture

### Scalability
- Easy addition of new features without affecting existing code
- Clear separation of concerns
- Component reusability across features

### Maintainability
- Code organized by business domain
- Clear and explicit dependencies
- Easy functionality location

### Performance
- Lazy loading reduces initial bundle
- Tree-shaking eliminates unused code
- Automatic change detection optimization

### Testability
- Isolated components with clear responsibilities
- Easy dependency mocking
- More specific and faster unit tests

This architecture represents Angular's modern best practices and is designed for long-term scalability and maintainability.
