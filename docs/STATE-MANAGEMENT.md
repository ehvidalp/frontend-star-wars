# State Management with Signal Store

## The "Signal Store" Pattern

This project implements a modern and efficient approach to state management using the **Signal Store** pattern. This solution is a lightweight and localized alternative to heavier libraries like NgRx, especially suitable for applications requiring granular reactivity at the feature level.

### Pattern Philosophy

The Signal Store is based on three fundamental principles:

1. **Native Reactivity:** Leverages Angular's native signals for optimal reactivity
2. **Feature Localization:** Each business domain has its own independent store
3. **Simplicity:** Clear and direct API without unnecessary boilerplate

### Advantages Over Other Solutions

| Aspect | Signal Store | NgRx | Traditional Services |
|---------|--------------|------|----------------------|
| **Bundle Size** | Minimal | Large | Minimal |
| **Complexity** | Low | High | Medium |
| **Reactivity** | Native | RxJS | Manual |
| **DevTools** | Basic | Advanced | None |
| **Learning Curve** | Gentle | Steep | Gentle |

## Signal Store Implementation

### Base Structure

```typescript
@Injectable({
  providedIn: 'root'
})
export class FeatureStore {
  // 1. Private state as signal
  private stateSignal = signal<FeatureState>(initialState);
  
  // 2. Public selectors as computed
  readonly data = computed(() => this.stateSignal().data);
  readonly loading = computed(() => this.stateSignal().loading);
  readonly error = computed(() => this.stateSignal().error);
  
  // 3. Methods to update state
  updateState(updater: (state: FeatureState) => FeatureState): void {
    this.stateSignal.update(updater);
  }
}
```

### Real Example: PlanetsStore

```typescript
@Injectable({
  providedIn: 'root'
})
export class PlanetsStore {
  private destroyRef = inject(DestroyRef);
  private planetService = inject(PlanetsApi);
  
  // Private state
  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE);
  
  // Computed selectors (read-only)
  readonly planets = computed(() => this.planetsStore().planets);
  readonly selectedPlanet = computed(() => this.planetsStore().selectedPlanet);
  readonly nextPageUrl = computed(() => this.planetsStore().nextPageUrl);
  readonly isLoading = computed(() => this.planetsStore().isLoading);
  readonly isLastPage = computed(() => !this.planetsStore().nextPageUrl);
  readonly error = computed(() => this.planetsStore().error);
  readonly hasError = computed(() => !!this.planetsStore().error);
  readonly hasPlanets = computed(() => this.planetsStore().planets.length > 0);
  
  // Actions (public methods)
  loadPlanets(url?: string | null): void {
    this.planetsStore.update(store => ({
      ...store,
      isLoading: true,
      error: null
    }));
    
    this.planetService.getPlanets(url).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(data => {
        this.planetsStore.update(store => ({
          ...store,
          planets: [...store.planets, ...data.results],
          nextPageUrl: data.next,
          isLoading: false
        }));
      }),
      catchError(error => {
        this.planetsStore.update(store => ({
          ...store,
          isLoading: false,
          error: error.message
        }));
        return EMPTY;
      })
    ).subscribe();
  }
}
```

### State Interface

```typescript
export interface IPlanetsStore {
  planets: Planet[];
  selectedPlanet: Planet | null;
  nextPageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const EMPTY_PLANET_STORE: IPlanetsStore = {
  planets: [],
  selectedPlanet: null,
  nextPageUrl: null,
  isLoading: false,
  error: null
};
```

## Usage in Components

### Smart Component (Page)

```typescript
@Component({
  selector: 'app-planets-list',
  template: `
    <div class="planets-container">
      @if (planetsStore.isLoading()) {
        <app-loading />
      }
      
      @if (planetsStore.hasError()) {
        <app-error [message]="planetsStore.error()!" />
      }
      
      @if (planetsStore.hasPlanets()) {
        <div class="planets-grid">
          @for (planet of planetsStore.planets(); track planet.name) {
            <app-planet-card [planet]="planet" />
          }
        </div>
      }
      
      @if (!planetsStore.isLastPage()) {
        <button 
          (click)="loadMore()"
          [disabled]="planetsStore.isLoading()">
          Load More
        </button>
      }
    </div>
  `
})
export class PlanetsListComponent {
  planetsStore = inject(PlanetsStore);
  
  ngOnInit() {
    // Load initial data
    this.planetsStore.loadPlanets();
  }
  
  loadMore() {
    this.planetsStore.loadPlanets(this.planetsStore.nextPageUrl());
  }
}
```

### Dumb Component

```typescript
@Component({
  selector: 'app-planet-card',
  template: `
    <article class="planet-card">
      <app-planet-sphere 
        [planet]="planet()" 
        size="medium" />
      <h3>{{ planet().name }}</h3>
      <p>Climate: {{ planet().climate }}</p>
    </article>
  `
})
export class PlanetCardComponent {
  planet = input.required<Planet>();
  
  // No state logic - only presentation
}
```

## Usage Rules

### ✅ When to Create a Signal Store

1. **Complex feature state:** When state has multiple related properties
2. **Shared data:** When multiple components need to access the same state
3. **Asynchronous operations:** When handling HTTP calls or side effects
4. **Change history:** When you need to track state changes

**Use case example:**
```typescript
// ✅ Perfect for Signal Store
interface UserProfileStore {
  user: User | null;
  preferences: UserPreferences;
  notifications: Notification[];
  isLoading: boolean;
  lastSync: Date | null;
}
```

### ✅ When to Use Local Signals

1. **Simple UI state:** Toggles, forms, visibility states
2. **Temporary state:** Data that doesn't need to persist
3. **Component-specific:** State that only one component uses

**Local usage example:**
```typescript
@Component({
  template: `
    <div>
      <button (click)="toggleMenu()">
        {{ isMenuOpen() ? 'Close' : 'Open' }} Menu
      </button>
      
      @if (isMenuOpen()) {
        <nav class="menu">
          <!-- Menu items -->
        </nav>
      }
    </div>
  `
})
export class NavigationComponent {
  // ✅ Local signal for simple UI state
  isMenuOpen = signal(false);
  
  toggleMenu() {
    this.isMenuOpen.update(isOpen => !isOpen);
  }
}
```

## Advanced Patterns

### Computed Properties for Derived Logic

```typescript
export class PlanetsStore {
  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE);
  
  // Base data
  readonly planets = computed(() => this.planetsStore().planets);
  
  // Derived logic
  readonly desertPlanets = computed(() => 
    this.planets().filter(p => p.climate.includes('desert'))
  );
  
  readonly planetsByClimate = computed(() => {
    const planets = this.planets();
    return planets.reduce((acc, planet) => {
      const climate = planet.climate || 'unknown';
      acc[climate] = acc[climate] || [];
      acc[climate].push(planet);
      return acc;
    }, {} as Record<string, Planet[]>);
  });
  
  readonly statisticsSummary = computed(() => ({
    total: this.planets().length,
    byClimate: Object.keys(this.planetsByClimate()).length,
    desertCount: this.desertPlanets().length
  }));
}
```

### RxJS Integration for Side Effects

```typescript
export class PlanetsStore {
  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE);
  
  // Method that combines signals and observables
  searchPlanets(query: string): void {
    this.planetsStore.update(store => ({
      ...store,
      isLoading: true,
      error: null
    }));
    
    this.planetService.searchPlanets(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        this.planetsStore.update(store => ({
          ...store,
          isLoading: false,
          error: error.message
        }));
        return EMPTY;
      })
    ).subscribe(results => {
      this.planetsStore.update(store => ({
        ...store,
        planets: results,
        isLoading: false
      }));
    });
  }
}
```

## Best Practices

### 1. Immutability
```typescript
// ✅ Correct - always create new objects
this.stateSignal.update(state => ({
  ...state,
  planets: [...state.planets, newPlanet]
}));

// ❌ Incorrect - mutate existing state
this.stateSignal.update(state => {
  state.planets.push(newPlanet);
  return state;
});
```

### 2. Consistent Naming
```typescript
// ✅ Selectors as properties
readonly planets = computed(() => this.stateSignal().planets);
readonly isLoading = computed(() => this.stateSignal().isLoading);

// ✅ Actions as methods
loadPlanets(): void { /* ... */ }
addPlanet(planet: Planet): void { /* ... */ }
clearPlanets(): void { /* ... */ }
```

### 3. Memory Management
```typescript
export class FeatureStore {
  private destroyRef = inject(DestroyRef);
  
  someAsyncOperation(): void {
    this.httpClient.get('/api/data').pipe(
      takeUntilDestroyed(this.destroyRef) // ✅ Automatic cleanup
    ).subscribe(/* ... */);
  }
}
```

## Signal Store Benefits

### Performance
- **Optimized Change Detection:** Only runs when used signals change
- **Granularity:** Specific updates without unnecessary re-rendering
- **Memory Efficient:** Automatic memory management and cleanup

### Developer Experience
- **TypeScript Friendly:** Strong typing and autocomplete
- **Simple Debugging:** Visible state in DevTools
- **Intuitive API:** Clear and familiar syntax

### Scalability
- **Modular:** Each feature has its own independent store
- **Composable:** Easy combination of multiple stores
- **Testable:** Isolated stores easy to mock

This Signal Store pattern provides a solid foundation for state management in modern Angular applications, combining development simplicity with the performance and scalability needed for production applications.
