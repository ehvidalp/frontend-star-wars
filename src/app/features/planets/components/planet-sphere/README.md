# PlanetSphere Component

Un componente standalone de Angular para renderizar esferas de planetas con efectos visuales dinámicos basados en las características del planeta.

## Características

- **Tipado fuerte**: Usa el modelo `Planet` existente del proyecto
- **Efectos visuales dinámicos**: Cambia colores y efectos según el tipo de planeta
- **Responsive**: Se adapta a diferentes tamaños
- **Accesible**: Incluye soporte para `prefers-reduced-motion`
- **Reutilizable**: Componente standalone que puede usarse en cualquier parte

## Uso

```html
<app-planet-sphere 
  [planet]="planetData"
  size="medium"
  variant="holographic"
  class="w-full h-full">
</app-planet-sphere>
```

## Inputs

### `planet` (required)
- **Tipo**: `Planet` (PlanetDetail | PlanetSummary)
- **Descripción**: Los datos del planeta a renderizar

### `size` (optional)
- **Tipo**: `'small' | 'medium' | 'large'`
- **Default**: `'medium'`
- **Descripción**: Tamaño del planeta

### `variant` (optional)
- **Tipo**: `'holographic' | 'realistic' | 'minimal'`
- **Default**: `'holographic'`
- **Descripción**: Variante visual del planeta

## Tipos de Planetas Detectados

El componente analiza automáticamente las características del planeta y aplica estilos visuales correspondientes. Si no hay información específica, selecciona aleatoriamente un tipo basado en el nombre del planeta:

- **Desert**: Planetas con clima o terreno desértico → Gradientes amarillo/naranja/rojo
- **Ice**: Planetas con clima helado → Gradientes azul claro/cian
- **Ocean**: Planetas con océanos → Gradientes azul marino
- **Forest**: Planetas con bosques → Gradientes verde
- **Urban**: Planetas urbanos → Gradientes grises
- **Gas Giant**: Gigantes gaseosos → Gradientes púrpura/rosa
- **Volcanic**: Planetas volcánicos → Gradientes rojo/naranja intenso
- **Crystal**: Planetas cristalinos → Gradientes rosa/púrpura/índigo
- **Toxic**: Planetas tóxicos → Gradientes lima/verde/esmeralda
- **Swamp**: Planetas pantanosos → Gradientes verde/ámbar/verde oscuro
- **Rocky**: Planetas rocosos → Gradientes piedra/gris/piedra oscura
- **Terrestrial**: Planetas por defecto → Gradientes azul/amarillo o cian/púrpura (según variante)

## Selección Aleatoria

Cuando no hay información específica del planeta, el componente:
1. Genera un hash basado en el nombre del planeta
2. Usa este hash para seleccionar consistentemente el mismo tipo visual
3. Asegura que el mismo planeta siempre se vea igual
4. Proporciona variedad visual entre diferentes planetas

## Efectos Visuales

- **Holographic Grid**: Líneas de cuadrícula que aparecen en hover
- **Smooth Transitions**: Transiciones suaves de 500ms
- **Glow Effects**: Efectos de resplandor dinámicos
- **Scale Animation**: Escalado sutil en hover
- **Accessibility**: Respeta la preferencia de movimiento reducido

## Ejemplo de Integración

```typescript
// En tu componente
export class MiComponente {
  planeta = signal<Planet>({
    name: 'Tatooine',
    climate: 'desert',
    terrain: 'desert',
    // ... otros datos
  });
}
```

```html
<!-- En tu template -->
<div class="planet-container">
  <app-planet-sphere 
    [planet]="planeta()"
    size="large"
    variant="realistic">
  </app-planet-sphere>
</div>
```
