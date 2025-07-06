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

## Información del Planeta Mostrada

Las tarjetas ahora muestran información detallada basada en el modelo de datos:

### Datos Principales:
- **Nombre del planeta**: Título principal con efectos visuales
- **Representación visual**: Esfera del planeta con colores basados en clima/terreno

### Datos Expandidos (cuando disponibles):
- **Clima**: Información sobre las condiciones climáticas
- **Terreno**: Tipo de superficie del planeta
- **Población**: Número de habitantes (formateado: K, M, B)
- **Diámetro**: Tamaño del planeta en kilómetros

### Diseño Responsivo:
- **Pantallas pequeñas**: Información compacta en tarjetas de 24rem de altura
- **Pantallas medianas**: Mejor espaciado y legibilidad
- **Pantallas grandes**: Información completa con animaciones suaves

## Ventajas del Nuevo Enfoque

1. **HTML Semántico**: Permite usar elementos HTML apropiados (`<button>`, `<article>`, etc.)
2. **Accesibilidad**: Manejo automático de ARIA attributes y navegación por teclado
3. **Información Rica**: Muestra datos del planeta basados en el modelo de datos
4. **Separación de Responsabilidades**: 
   - `PlanetCardDirective`: Maneja el comportamiento (clicks, navegación, estilos)
   - `PlanetCardContent`: Maneja la presentación visual y los datos
5. **Flexibilidad**: Se puede aplicar a cualquier elemento HTML
6. **Mantenibilidad**: Código más limpio y fácil de mantener

## Características Automáticas

### Comportamiento:
- **Navegación por teclado**: Enter y Space
- **Atributos ARIA**: aria-label, aria-describedby
- **Estilos CSS**: Aplicación automática de todas las clases de estilo
- **Transiciones**: view-transition-name automático
- **Focusable**: tabindex automático si es necesario
- **Rol semántico**: role="button" automático si no es un botón nativo

### Formateo de Datos:
- **Población**: Formato K/M/B (1.5M, 2.3B, etc.)
- **Diámetro**: Formato con 'km' y separadores de miles
- **Clima/Terreno**: Capitalización automática
- **Valores desconocidos**: Mostrar "Desconocido" para datos faltantes

### Estados Visuales:
- **Datos expandidos**: Información completa con animaciones al hover
- **Datos limitados**: Placeholder animado cuando no hay datos expandidos
- **Efectos hover**: Resaltado de bordes y transiciones suaves

## Ejemplos de Datos Mostrados

```typescript
// Planeta con datos expandidos
{
  name: "Tatooine",
  climate: "arid",
  terrain: "desert",
  population: "200000",
  diameter: "10465",
  uid: "1"
}

// Resultado visual:
// Título: "TATOOINE"
// Clima: "Arid"
// Terreno: "Desert"  
// Población: "200K"
// Diámetro: "10,465 km"
```
