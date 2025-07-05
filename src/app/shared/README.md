# Shared Components Architecture

## 📁 Estructura Organizacional

```
src/app/shared/
├── components/                 # Componentes reutilizables
│   ├── loading-state/
│   │   ├── loading-state.ts   # Lógica del componente
│   │   └── loading-state.html # Template HTML separado
│   ├── error-state/
│   │   ├── error-state.ts
│   │   └── error-state.html
│   ├── end-state/
│   │   ├── end-state.ts
│   │   └── end-state.html
│   └── index.ts               # Barrel exports
├── models/                     # Types, interfaces y modelos
│   ├── ui-state.model.ts      # Modelos para componentes UI
│   └── index.ts               # Barrel exports
└── directives/                 # Directivas reutilizables
    └── infinity-scroll/
```

## 🎯 Principios de Organización

### 1. **Separación de Responsabilidades**
- **`.ts`**: Lógica del componente, computed properties, inputs/outputs
- **`.html`**: Template HTML puro, sin lógica embebida
- **`.model.ts`**: Types, interfaces y configuraciones

### 2. **Computed Properties Pattern**
```typescript
// ✅ CORRECTO: Computed properties reactivas
readonly containerClasses = computed(() => {
  const sizeClasses = { small: 'py-4', medium: 'py-8', large: 'py-16' };
  return `flex items-center justify-center ${sizeClasses[this.size()]}`;
});

// ❌ INCORRECTO: Funciones en el template
getContainerClasses(): string {
  // Se ejecuta en cada change detection
}
```

### 3. **Signal-First Architecture**
- Usar `computed()` para derivar estados
- Evitar funciones en templates
- Aprovechar la reactividad automática de signals

### 4. **Modelos Centralizados**
```typescript
// src/app/shared/models/ui-state.model.ts
export type LoadingSize = 'small' | 'medium' | 'large';
export interface LoadingStateConfig {
  size: LoadingSize;
  variant: LoadingVariant;
  ariaLabel: string;
}
```

### 5. **Barrel Exports**
```typescript
// src/app/shared/components/index.ts
export * from './loading-state/loading-state';
export * from './error-state/error-state';
export * from './end-state/end-state';

// src/app/shared/models/index.ts
export * from './ui-state.model';
```

## 🚀 Beneficios

### **Performance**
- Computed properties se actualizan solo cuando cambian las dependencias
- Eliminación de re-evaluaciones innecesarias
- Change detection más eficiente

### **Mantenibilidad**
- Estructura consistente y predecible
- Separación clara de responsabilidades
- Fácil testing y debugging

### **Reutilización**
- Componentes tipados y configurables
- Modelos compartidos evitan duplicación
- Barrel exports simplifican importaciones

### **Developer Experience**
- IntelliSense mejorado con TypeScript
- Estructura clara y navegable
- Convenciones consistentes

## 📋 Checklist de Componentes

Al crear nuevos componentes seguir:

- [ ] **Crear modelo** en `shared/models/` si aplica
- [ ] **Separar template** en archivo `.html`
- [ ] **Usar computed properties** en lugar de funciones
- [ ] **Aplicar change detection OnPush**
- [ ] **Documentar inputs/outputs**
- [ ] **Agregar a barrel exports**
- [ ] **Mantener accesibilidad** (aria-*, roles)

## 🎪 Ejemplos de Uso

```typescript
// Uso con configuración tipada
<app-loading-state 
  size="large" 
  variant="primary"
  ariaLabel="Cargando planetas">
  Explorando la galaxia...
</app-loading-state>

// Reactive computed properties
readonly loadingState = computed<'initial' | 'more' | 'none'>(() => {
  if (!this.store.isLoading()) return 'none';
  if (!this.store.hasData()) return 'initial';
  return 'more';
});
```

Esta arquitectura garantiza **escalabilidad**, **performance** y **mantenibilidad** a largo plazo.
