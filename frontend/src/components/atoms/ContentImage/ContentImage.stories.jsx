// ===== CONTENT IMAGE ATOM STORIES - COMPLETADO =====
// src/components/atoms/ContentImage/ContentImage.stories.jsx

import React, { useState } from 'react';
import { ContentImage } from './ContentImage';
import './ContentImage.css';

export default {
  title: 'Components/Atoms/ContentImage',
  component: ContentImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ContentImage Atom

El átomo **ContentImage** es un componente especializado para mostrar imágenes de contenido multimedia con aspect ratios específicos, fallbacks inteligentes y estados de carga optimizados.

## 🎯 Características principales

- **7 aspect ratios**: 1:1, 4:3, 3:2, 16:9, 2:3, 3:4, auto
- **5 object fit modes**: Cover, Contain, Fill, Scale-down, None
- **5 border radius**: SM, MD, LG, XL, Full
- **Estados completos**: Loading, Loaded, Error con fallbacks automáticos
- **Skeleton loading**: Animación de carga con shimmer effect
- **Error handling**: Fallback SVG automático según tipo de contenido
- **Lazy loading**: Optimizado para performance
- **Accesibilidad completa**: Alt text, reduced motion, high contrast
- **Theming automático**: Variables CSS del sistema, modo oscuro
- **Mobile optimized**: Touch-friendly, responsive design

## 🏗️ Atomic Design

Como **átomo perfecto**:
- ✅ **Componente básico**: No depende de otros componentes
- ✅ **Altamente reutilizable**: Carátulas, avatares, banners, thumbnails
- ✅ **Consistente**: Usa variables del sistema de diseño
- ✅ **Extensible**: Base para ContentCard y otros componentes complejos

## 🔧 Uso básico

\`\`\`jsx
import { ContentImage } from './atoms/ContentImage';

// Carátula de película (2:3)
<ContentImage 
  src="https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg"
  alt="Carátula de Avatar"
  aspectRatio="2/3"
  contentType="movie"
/>

// Avatar circular (1:1)
<ContentImage 
  src="https://randomuser.me/api/portraits/women/44.jpg"
  alt="Avatar de usuario"
  aspectRatio="1/1"
  rounded="full"
  objectFit="cover"
/>

// Banner widescreen (16:9)
<ContentImage 
  src="https://picsum.photos/1920/1080"
  alt="Banner promocional"
  aspectRatio="16/9"
  objectFit="cover"
  rounded="lg"
/>

// Con estados avanzados
<ContentImage 
  src="https://picsum.photos/300/450"
  alt="Contenido"
  loading="lazy"
  onLoad={handleLoad}
  onError={handleError}
  placeholder="🖼️"
  showFallback={true}
/>
\`\`\`

## 🎨 Casos de uso especializados

### **Carátulas de contenido (2:3)**
- Películas, series, libros, álbumes
- Aspecto vertical típico de portadas

### **Banners y thumbnails (16:9)**
- Videos, promociones, headers
- Aspecto horizontal widescreen

### **Avatares y logos (1:1)**
- Perfiles de usuario, iconos de apps
- Aspecto cuadrado, usualmente con border radius full

### **Fotografías (4:3, 3:2)**
- Galerías, portfolios, contenido editorial
- Aspectos clásicos de fotografía

## ♿ Accesibilidad

- **Alt text requerido**: Descripción obligatoria para screen readers
- **Estados anunciados**: Loading y error states accesibles
- **Reduced motion**: Respeta preferencias de animación
- **High contrast**: Compatible con modo de alto contraste
- **Focus management**: Navegación por teclado cuando es necesario
- **Content visibility**: Optimizado para lazy loading accesible

## 🎭 Variables CSS heredadas

Usa automáticamente las variables del sistema:
\`\`\`css
:root {
  --bg-muted: #f9fafb;
  --bg-secondary: #f3f4f6;
  --text-muted: #6b7280;
  --color-danger: #ef4444;
  --radius-sm: 0.4rem;
  --radius-md: 0.6rem;
  --radius-lg: 0.8rem;
  --radius-xl: 1.2rem;
  --radius-full: 9999px;
  --transition-normal: 0.2s ease-in-out;
  --space-xs: 0.4rem;
  --space-sm: 0.8rem;
  --font-size-xs: 1.2rem;
  /* Y todas las demás del sistema... */
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    src: {
      name: 'URL de imagen',
      description: 'URL de la imagen a mostrar',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Básicas'
      }
    },
    alt: {
      name: 'Texto alternativo',
      description: 'Descripción de la imagen para accesibilidad (requerido)',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Básicas'
      }
    },
    aspectRatio: {
      name: 'Aspect Ratio',
      description: 'Proporción de aspecto de la imagen',
      control: 'select',
      options: ['1/1', '4/3', '3/2', '16/9', '2/3', '3/4', 'auto'],
      table: {
        type: { summary: "'1/1' | '4/3' | '3/2' | '16/9' | '2/3' | '3/4' | 'auto'" },
        defaultValue: { summary: '2/3' },
        category: 'Apariencia'
      }
    },
    objectFit: {
      name: 'Object Fit',
      description: 'Comportamiento de ajuste de la imagen',
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      table: {
        type: { summary: "'cover' | 'contain' | 'fill' | 'scale-down' | 'none'" },
        defaultValue: { summary: 'cover' },
        category: 'Apariencia'
      }
    },
    rounded: {
      name: 'Border Radius',
      description: 'Curvatura de las esquinas',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: 'md' },
        category: 'Apariencia'
      }
    },
    contentType: {
      name: 'Tipo de contenido',
      description: 'Tipo de contenido para fallback apropiado',
      control: 'select',
      options: ['movie', 'series', 'generic'],
      table: {
        type: { summary: "'movie' | 'series' | 'generic'" },
        defaultValue: { summary: 'generic' },
        category: 'Funcionalidad'
      }
    },
    loading: {
      name: 'Estrategia de carga',
      description: 'Cuándo cargar la imagen',
      control: 'select',
      options: ['eager', 'lazy'],
      table: {
        type: { summary: "'eager' | 'lazy'" },
        defaultValue: { summary: 'lazy' },
        category: 'Performance'
      }
    },
    showFallback: {
      name: 'Mostrar fallback',
      description: 'Si mostrar imagen de fallback en error',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Estados'
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Emoji o texto para placeholder/fallback',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Estados'
      }
    },
    blur: {
      name: 'Efecto blur',
      description: 'Aplicar efecto de desenfoque',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Estados'
      }
    },
    onLoad: {
      name: 'Función onLoad',
      description: 'Callback cuando la imagen carga exitosamente',
      action: 'loaded',
      table: {
        type: { summary: '(event: Event) => void' },
        category: 'Eventos'
      }
    },
    onError: {
      name: 'Función onError',
      description: 'Callback cuando falla la carga de imagen',
      action: 'error',
      table: {
        type: { summary: '(event: Event) => void' },
        category: 'Eventos'
      }
    },
    className: {
      name: 'Clase CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Extensibilidad'
      }
    }
  }
};

// ===== DATOS REALISTAS =====
const sampleImages = {
  moviePoster: "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg", // Avatar
  seriesPoster: "https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg", // Stranger Things
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  banner: "https://picsum.photos/1920/1080?random=1",
  landscape: "https://picsum.photos/800/600?random=2",
  portrait: "https://picsum.photos/600/800?random=3",
  invalidUrl: "https://invalid-url-that-will-fail.com/image.jpg"
};

// ========== 1. DEFAULT STORY (OBLIGATORIA) ==========
export const Default = {
  args: {
    src: sampleImages.moviePoster,
    alt: "Carátula de Avatar: El Camino del Agua",
    aspectRatio: "2/3",
    contentType: "movie",
    rounded: "md"
  }
};

// ========== 2. SIZES STORY (OBLIGATORIA) ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    alignItems: 'start',
    padding: 'var(--space-md)',
    maxWidth: '800px'
  }}>
    {[
      { size: '80px', label: 'XS' },
      { size: '120px', label: 'SM' },
      { size: '160px', label: 'MD' },
      { size: '200px', label: 'LG' },
      { size: '240px', label: 'XL' }
    ].map(({ size, label }) => (
      <div key={size} style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
          {label}
        </h4>
        <div style={{ maxWidth: size, margin: '0 auto' }}>
          <ContentImage 
            src={sampleImages.moviePoster}
            alt={`Carátula tamaño ${label}`}
            aspectRatio="2/3"
            contentType="movie"
          />
        </div>
      </div>
    ))}
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'ContentImage en diferentes tamaños. Al ser un átomo, se adapta al contenedor parent, manteniendo siempre el aspect ratio especificado.'
    }
  }
};

// ========== 3. VARIANTS STORY (OBLIGATORIA) ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start',
    padding: 'var(--space-md)'
  }}>
    {[
      { 
        aspectRatio: '2/3', 
        label: 'Carátula (2:3)', 
        src: sampleImages.moviePoster, 
        alt: 'Carátula de película',
        contentType: 'movie'
      },
      { 
        aspectRatio: '16/9', 
        label: 'Banner (16:9)', 
        src: sampleImages.banner, 
        alt: 'Banner promocional',
        contentType: 'generic'
      },
      { 
        aspectRatio: '1/1', 
        label: 'Avatar (1:1)', 
        src: sampleImages.avatar, 
        alt: 'Avatar de usuario',
        contentType: 'generic',
        rounded: 'full'
      },
      { 
        aspectRatio: '4/3', 
        label: 'Landscape (4:3)', 
        src: sampleImages.landscape, 
        alt: 'Imagen landscape',
        contentType: 'generic'
      },
      { 
        aspectRatio: '3/2', 
        label: 'Fotografía (3:2)', 
        src: sampleImages.portrait, 
        alt: 'Fotografía portrait',
        contentType: 'generic'
      }
    ].map(({ aspectRatio, label, src, alt, contentType, rounded = 'md' }) => (
      <div key={aspectRatio} style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>{label}</h4>
        <ContentImage 
          src={src}
          alt={alt}
          aspectRatio={aspectRatio}
          contentType={contentType}
          rounded={rounded}
        />
      </div>
    ))}
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Diferentes aspect ratios para casos de uso específicos: carátulas de contenido (2:3), banners widescreen (16:9), avatares circulares (1:1), y fotografías (4:3, 3:2).'
    }
  }
};

// ========== 4. STATES STORY (OBLIGATORIA) ==========
export const States = () => {
  const [imageStates, setImageStates] = useState({});

  const handleLoad = (key) => (e) => {
    setImageStates(prev => ({ ...prev, [key]: 'loaded' }));
    console.log(`Imagen ${key} cargada`);
  };

  const handleError = (key) => (e) => {
    setImageStates(prev => ({ ...prev, [key]: 'error' }));
    console.log(`Error cargando imagen ${key}`);
  };

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      alignItems: 'start',
      padding: 'var(--space-md)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Normal</h4>
        <ContentImage 
          src={sampleImages.moviePoster}
          alt="Estado normal"
          aspectRatio="2/3"
          contentType="movie"
          onLoad={handleLoad('normal')}
        />
        <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Estado: {imageStates.normal || 'Cargando...'}
        </small>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Error con Fallback</h4>
        <ContentImage 
          src={sampleImages.invalidUrl}
          alt="Error con fallback"
          aspectRatio="2/3"
          contentType="movie"
          showFallback={true}
          onError={handleError('fallback')}
        />
        <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Muestra SVG automático
        </small>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Error sin Fallback</h4>
        <ContentImage 
          src={sampleImages.invalidUrl}
          alt="Error sin fallback"
          aspectRatio="2/3"
          contentType="movie"
          showFallback={false}
          onError={handleError('noFallback')}
        />
        <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Muestra mensaje de error
        </small>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Placeholder Custom</h4>
        <ContentImage 
          src={sampleImages.invalidUrl}
          alt="Placeholder personalizado"
          aspectRatio="2/3"
          contentType="series"
          placeholder="📺"
          showFallback={true}
          onError={handleError('custom')}
        />
        <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Emoji personalizado
        </small>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)' }}>Blur Effect</h4>
        <ContentImage 
          src={sampleImages.seriesPoster}
          alt="Efecto blur"
          aspectRatio="2/3"
          contentType="series"
          blur={true}
          onLoad={handleLoad('blur')}
        />
        <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Con desenfoque
        </small>
      </div>
    </div>
  );
};

States.parameters = {
  docs: {
    description: {
      story: 'Estados del componente: normal, error con/sin fallback, placeholder personalizado y efecto blur. Observa la consola para eventos de carga.'
    }
  }
};

// ========== 5. INTERACTIVE STORY (OBLIGATORIA) ==========
export const Interactive = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingStats, setLoadingStats] = useState({});

  const handleImageLoad = (id) => (e) => {
    const loadTime = performance.now();
    setLoadingStats(prev => ({ 
      ...prev, 
      [id]: { 
        status: 'loaded', 
        time: loadTime.toFixed(0) + 'ms',
        size: `${e.target.naturalWidth}x${e.target.naturalHeight}`
      }
    }));
  };

  const handleImageError = (id) => (e) => {
    setLoadingStats(prev => ({ 
      ...prev, 
      [id]: { status: 'error', time: 'N/A', size: 'N/A' }
    }));
  };

  const handleImageClick = (id, src) => {
    setSelectedImage({ id, src });
    alert(`Imagen seleccionada: ${id}`);
  };

  const images = [
    { 
      id: 'movie-1', 
      src: sampleImages.moviePoster, 
      alt: 'Avatar: El Camino del Agua',
      aspectRatio: '2/3',
      contentType: 'movie'
    },
    { 
      id: 'series-1', 
      src: sampleImages.seriesPoster, 
      alt: 'Stranger Things',
      aspectRatio: '2/3',
      contentType: 'series'
    },
    { 
      id: 'avatar-1', 
      src: sampleImages.avatar, 
      alt: 'Usuario María González',
      aspectRatio: '1/1',
      contentType: 'generic',
      rounded: 'full'
    },
    { 
      id: 'banner-1', 
      src: sampleImages.banner, 
      alt: 'Banner promocional',
      aspectRatio: '16/9',
      contentType: 'generic'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)',
      padding: 'var(--space-md)'
    }}>
      <div style={{
        display: 'grid',
        gap: 'var(--space-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }}>
        {images.map(({ id, src, alt, aspectRatio, contentType, rounded = 'md' }) => (
          <div key={id} style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: 'var(--space-sm)' }}>{alt}</h4>
            <div 
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick(id, src)}
            >
              <ContentImage 
                src={src}
                alt={alt}
                aspectRatio={aspectRatio}
                contentType={contentType}
                rounded={rounded}
                loading="eager"
                onLoad={handleImageLoad(id)}
                onError={handleImageError(id)}
              />
            </div>
            <div style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Estado: {loadingStats[id]?.status || 'Cargando...'}<br/>
              {loadingStats[id]?.size && `Tamaño: ${loadingStats[id].size}`}<br/>
              {loadingStats[id]?.time && `Tiempo: ${loadingStats[id].time}`}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div style={{
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center'
        }}>
          <strong>Imagen seleccionada:</strong> {selectedImage.id}
        </div>
      )}
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplos interactivos con diferentes tipos de contenido. Haz click en cualquier imagen para seleccionarla. Observa los tiempos de carga y tamaños reales.'
    }
  }
};

// ========== 6. ACCESSIBILITY STORY (OBLIGATORIA) ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-md)',
    maxWidth: '800px'
  }}>
    {/* Ejemplo completo de accesibilidad */}
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>
        🛡️ Accesibilidad Completa
      </h3>
      
      <div style={{
        display: 'grid',
        gap: 'var(--space-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }}>
        <div>
          <h4>Alt text descriptivo</h4>
          <ContentImage 
            src={sampleImages.moviePoster}
            alt="Carátula de Avatar: El Camino del Agua, película de ciencia ficción dirigida por James Cameron, mostrando a los personajes Na'vi en un ambiente acuático"
            aspectRatio="2/3"
            contentType="movie"
          />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            ✅ Descripción detallada para screen readers
          </p>
        </div>

        <div>
          <h4>Fallback accesible</h4>
          <ContentImage 
            src={sampleImages.invalidUrl}
            alt="Imagen no disponible temporalmente"
            aspectRatio="2/3"
            contentType="movie"
            showFallback={true}
            placeholder="🎬"
          />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            ✅ Fallback con significado semántico
          </p>
        </div>

        <div>
          <h4>Lazy loading accesible</h4>
          <ContentImage 
            src={sampleImages.landscape}
            alt="Paisaje montañoso con lago cristalino durante el atardecer"
            aspectRatio="4/3"
            contentType="generic"
            loading="lazy"
          />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            ✅ Carga diferida optimizada
          </p>
        </div>
      </div>
    </div>

    {/* Guía de buenas prácticas */}
    <div style={{
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <h4 style={{ marginBottom: 'var(--space-md)' }}>
        📋 Buenas Prácticas de Accesibilidad
      </h4>
      
      <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
        <p><strong>✅ Alt text obligatorio:</strong> Siempre proporciona descripción meaningful</p>
        <p><strong>✅ Fallbacks informativos:</strong> Usa placeholders que indiquen el tipo de contenido</p>
        <p><strong>✅ Loading progresivo:</strong> Lazy loading respeta reduced motion preferences</p>
        <p><strong>✅ Estados claros:</strong> Error states son anunciados apropiadamente</p>
        <p><strong>✅ Contrast ratio:</strong> Skeleton y fallbacks mantienen contraste adecuado</p>
        <p><strong>✅ Content hints:</strong> contentType mejora la experiencia con AT</p>
      </div>
    </div>

    {/* Demostración de aspectos avanzados */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-lg)' }}>
        🔧 Características Avanzadas
      </h4>
      
      <div style={{
        display: 'grid',
        gap: 'var(--space-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
      }}>
        {[
          { 
            label: 'Object Fit: Cover', 
            objectFit: 'cover',
            src: sampleImages.avatar
          },
          { 
            label: 'Object Fit: Contain', 
            objectFit: 'contain',
            src: sampleImages.avatar
          },
          { 
            label: 'Rounded: Full', 
            rounded: 'full',
            src: sampleImages.avatar
          },
          { 
            label: 'Content: Series', 
            contentType: 'series',
            src: sampleImages.invalidUrl,
            showFallback: true
          }
        ].map(({ label, src = sampleImages.avatar, ...props }, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <h5 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
              {label}
            </h5>
            <ContentImage 
              src={src}
              alt={`Demostración de ${label.toLowerCase()}`}
              aspectRatio="1/1"
              {...props}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Demostración completa de características de accesibilidad: alt text descriptivo, fallbacks semánticos, lazy loading respetuoso, y buenas prácticas para AT (Assistive Technologies).'
    }
  }
};