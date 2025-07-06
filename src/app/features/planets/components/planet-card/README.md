# PlanetCard Directive - Uso Semántico

## Ejemplo de Uso

La directiva `appPlanetCard` permite crear tarjetas de planetas semánticamente correctas, aplicándose a cualquier elemento HTML:

### Uso como botón semántico:
```html
<button appPlanetCard [planet]="planet" type="button">
  <app-planet-card-content [planet]="planet"></app-planet-card-content>
</button>
```

### Uso como artículo semántico:
```html
<article appPlanetCard [planet]="planet">
  <app-planet-card-content [planet]="planet"></app-planet-card-content>
</article>
```

### Uso como div con rol de botón:
```html
<div appPlanetCard [planet]="planet" role="button">
  <app-planet-card-content [planet]="planet"></app-planet-card-content>
</div>
```

## Ventajas del Nuevo Enfoque

1. **HTML Semántico**: Permite usar elementos HTML apropiados (`<button>`, `<article>`, etc.)
2. **Accesibilidad**: Manejo automático de ARIA attributes y navegación por teclado
3. **Separación de Responsabilidades**: 
   - `PlanetCardDirective`: Maneja el comportamiento (clicks, navegación, estilos)
   - `PlanetCardContent`: Maneja la presentación visual
4. **Flexibilidad**: Se puede aplicar a cualquier elemento HTML
5. **Mantenibilidad**: Código más limpio y fácil de mantener

## Características Automáticas

- **Navegación por teclado**: Enter y Space
- **Atributos ARIA**: aria-label, aria-describedby
- **Estilos CSS**: Aplicación automática de todas las clases de estilo
- **Transiciones**: view-transition-name automático
- **Focusable**: tabindex automático si es necesario
- **Rol semántico**: role="button" automático si no es un botón nativo
