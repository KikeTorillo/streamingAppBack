import React, { useState, useEffect } from 'react';
import './App.css';

export default {
  title: 'Design System/Variables',
};

// Componente para mostrar notificaciones de copiado
const Notification = ({ message }) => (
  <div style={{
    position: 'fixed',
    top: 'var(--space-lg)',
    right: 'var(--space-lg)',
    backgroundColor: 'var(--color-success)',
    color: 'var(--text-on-primary)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 'var(--z-tooltip)',
    transition: 'transform var(--transition-normal), opacity var(--transition-normal)',
    transform: 'translateY(0)',
    opacity: 1
  }}>
    {message}
  </div>
);

const Section = ({ title, children }) => (
  <section style={{ 
    padding: 'var(--space-xl)', 
    marginBottom: 'var(--space-xl)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-secondary)'
  }}>
    <h2 style={{ 
      fontSize: 'var(--font-size-xl)',
      marginBottom: 'var(--space-md)',
      color: 'var(--text-primary)',
      borderBottom: '2px solid var(--border-primary)',
      paddingBottom: 'var(--space-sm)'
    }}>
      {title}
    </h2>
    {children}
  </section>
);

const ColorBox = ({ name, value, onCopy }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        backgroundColor: `var(${value})`,
        color: value.includes('primary') || value.includes('danger') || 
               value.includes('success') || value.includes('warning') || 
               value.includes('secondary') ? 'var(--text-on-primary)' : 'var(--text-primary)',
        padding: 'var(--space-md)',
        marginBottom: 'var(--space-md)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onClick={() => onCopy(value, name)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <strong>{name}</strong>: <code>{value}</code>
    </div>
  );
};

const ColorPalette = ({ title, prefix, range = [50,100,200,300,400,500,600,700,800,900], onCopy }) => (
  <Section title={title}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
      {range.map(shade => {
        const varName = `--${prefix}-${shade}`;
        return (
          <div 
            key={varName} 
            style={{
              width: '12rem',
              height: '7rem',
              backgroundColor: `var(${varName})`,
              color: shade >= 500 ? 'var(--text-on-primary)' : 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: 'var(--font-size-sm)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'transform var(--transition-normal)',
              transform: 'scale(1)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => onCopy(varName, `${prefix}-${shade}`)}
          >
            <div>{shade}</div>
            <code style={{ fontSize: 'var(--font-size-xs)' }}>{varName}</code>
          </div>
        );
      })}
    </div>
  </Section>
);

const NativeInputDemo = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-md)', 
    maxWidth: '300px' 
  }}>
    <input
      type="text"
      placeholder="Input de texto nativo"
      style={{
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-base)',
      }}
    />
    
    <textarea
      placeholder="Textarea nativo"
      style={{
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-base)',
        minHeight: '6rem',
      }}
    />
    
    <select
      style={{
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-base)',
      }}
    >
      <option>Select nativo</option>
      <option>Opción 1</option>
    </select>
  </div>
);

const DemoButton = ({ label = 'Botón', variant = '--color-primary', hover = '--color-primary-hover' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="focus-ring"
      style={{
        backgroundColor: `var(${isHovered ? hover : variant})`,
        color: 'var(--text-on-primary)',
        border: 'none',
        padding: 'var(--space-sm) var(--space-md)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </button>
  );
};

const ShadowDemo = ({ onCopy }) => {
  const shadows = [
    { var: '--shadow-sm', name: 'Sombra pequeña' },
    { var: '--shadow-md', name: 'Sombra mediana' },
    { var: '--shadow-lg', name: 'Sombra grande' },
    { var: '--shadow-xl', name: 'Sombra extra grande' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {shadows.map(shadow => (
        <div 
          key={shadow.var}
          style={{ 
            padding: 'var(--space-md)',
            boxShadow: `var(${shadow.var})`,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'transform var(--transition-normal)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          onClick={() => onCopy(shadow.var, shadow.name)}
        >
          <code>{shadow.var}</code>
        </div>
      ))}
    </div>
  );
};

const RadiusDemo = ({ onCopy }) => {
  const radii = [
    { var: '--radius-sm', name: 'Radio pequeño' },
    { var: '--radius-md', name: 'Radio mediano' },
    { var: '--radius-lg', name: 'Radio grande' },
    { var: '--radius-xl', name: 'Radio extra grande' },
    { var: '--radius-full', name: 'Radio circular' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
      {radii.map(radius => (
        <div 
          key={radius.var}
          style={{
            width: '8rem',
            height: '8rem',
            backgroundColor: 'var(--color-primary)',
            borderRadius: `var(${radius.var})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            transition: 'transform var(--transition-normal)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => onCopy(radius.var, radius.name)}
        >
          <code style={{ fontSize: 'var(--font-size-sm)' }}>{radius.var}</code>
        </div>
      ))}
    </div>
  );
};

const SpacingDemo = ({ onCopy }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
    {[
      { name: '--space-xs', value: 'var(--space-xs)', label: 'Extra pequeño' },
      { name: '--space-sm', value: 'var(--space-sm)', label: 'Pequeño' },
      { name: '--space-md', value: 'var(--space-md)', label: 'Mediano' },
      { name: '--space-lg', value: 'var(--space-lg)', label: 'Grande' },
      { name: '--space-xl', value: 'var(--space-xl)', label: 'Extra grande' },
      { name: '--space-2xl', value: 'var(--space-2xl)', label: '2X grande' },
      { name: '--space-3xl', value: 'var(--space-3xl)', label: '3X grande' },
    ].map((space) => (
      <div 
        key={space.name} 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          padding: 'var(--space-xs)',
          borderRadius: 'var(--radius-sm)',
          transition: 'background-color var(--transition-normal)',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-muted)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        onClick={() => onCopy(space.name, space.label)}
      >
        <div style={{ 
          backgroundColor: 'var(--color-primary)',
          width: space.value,
          height: 'var(--space-lg)',
          borderRadius: 'var(--radius-sm)',
          marginRight: 'var(--space-md)'
        }} />
        <div>
          <code>{space.name}</code> = {space.value}
        </div>
      </div>
    ))}
  </div>
);

const FontWeightDemo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
    <p style={{ fontWeight: 'var(--font-weight-normal)', padding: 'var(--space-sm)' }}>
      Normal: El veloz murciélago hindú comía feliz cardillo y kiwi
    </p>
    <p style={{ fontWeight: 'var(--font-weight-medium)', padding: 'var(--space-sm)' }}>
      Medium: El veloz murciélago hindú comía feliz cardillo y kiwi
    </p>
    <p style={{ fontWeight: 'var(--font-weight-semibold)', padding: 'var(--space-sm)' }}>
      Semibold: El veloz murciélago hindú comía feliz cardillo y kiwi
    </p>
    <p style={{ fontWeight: 'var(--font-weight-bold)', padding: 'var(--space-sm)' }}>
      Bold: El veloz murciélago hindú comía feliz cardillo y kiwi
    </p>
  </div>
);

const LineHeightDemo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '600px' }}>
    <div style={{ backgroundColor: 'var(--bg-muted)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginBottom: 'var(--space-sm)' }}>Tight (1.25)</h3>
      <p style={{ lineHeight: 'var(--line-height-tight)' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
        Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
        rhoncus ut eleifend nibh porttitor.
      </p>
    </div>
    
    <div style={{ backgroundColor: 'var(--bg-muted)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginBottom: 'var(--space-sm)' }}>Normal (1.5)</h3>
      <p style={{ lineHeight: 'var(--line-height-normal)' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
        Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
        rhoncus ut eleifend nibh porttitor.
      </p>
    </div>
    
    <div style={{ backgroundColor: 'var(--bg-muted)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginBottom: 'var(--space-sm)' }}>Relaxed (1.625)</h3>
      <p style={{ lineHeight: 'var(--line-height-relaxed)' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
        Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
        rhoncus ut eleifend nibh porttitor.
      </p>
    </div>
  </div>
);

const TransitionDemo = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div>
        <h3>Fast (0.15s)</h3>
        <div
          style={{
            width: isHovered ? '200px' : '100px',
            height: '60px',
            backgroundColor: 'var(--color-primary)',
            transition: 'var(--transition-fast)',
            borderRadius: 'var(--radius-md)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
      
      <div>
        <h3>Normal (0.2s)</h3>
        <div
          style={{
            width: isHovered ? '200px' : '100px',
            height: '60px',
            backgroundColor: 'var(--color-primary)',
            transition: 'var(--transition-normal)',
            borderRadius: 'var(--radius-md)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
      
      <div>
        <h3>Slow (0.3s)</h3>
        <div
          style={{
            width: isHovered ? '200px' : '100px',
            height: '60px',
            backgroundColor: 'var(--color-primary)',
            transition: 'var(--transition-slow)',
            borderRadius: 'var(--radius-md)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
    </div>
  );
};

const ZIndexDemo = ({ onCopy }) => (
  <div style={{ 
    position: 'relative', 
    minHeight: '400px',
    border: '1px dashed var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-xl)',
    backgroundColor: 'var(--bg-muted)',
    overflow: 'visible'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 'var(--space-lg)',
      zIndex: 1,
      position: 'relative'
    }}>
      {[
        { 
          name: '--z-dropdown', 
          value: 1000, 
          color: 'var(--blue-300)', 
          label: 'Dropdown',
          recommendation: 'Menús desplegables, context menus'
        },
        { 
          name: '--z-sticky', 
          value: 1020, 
          color: 'var(--blue-400)', 
          label: 'Sticky',
          recommendation: 'Elementos que se mantienen visibles al hacer scroll'
        },
        { 
          name: '--z-fixed', 
          value: 1030, 
          color: 'var(--blue-500)', 
          label: 'Fixed',
          recommendation: 'Headers fijos, botones de acción flotantes'
        },
        { 
          name: '--z-modal-backdrop', 
          value: 1040, 
          color: 'var(--blue-600)', 
          label: 'Modal Backdrop',
          recommendation: 'Fondo oscuro detrás de los modales'
        },
        { 
          name: '--z-modal', 
          value: 1050, 
          color: 'var(--blue-700)', 
          label: 'Modal',
          recommendation: 'Ventanas modales, diálogos de confirmación'
        },
        { 
          name: '--z-popover', 
          value: 1060, 
          color: 'var(--blue-800)', 
          label: 'Popover',
          recommendation: 'Menús contextuales, tooltips avanzados'
        },
        { 
          name: '--z-tooltip', 
          value: 1070, 
          color: 'var(--blue-900)', 
          label: 'Tooltip',
          recommendation: 'Tooltips, elementos que deben estar sobre todo'
        },
      ].map((z, index) => (
        <div
          key={z.name}
          style={{
            backgroundColor: z.color,
            color: 'var(--text-on-primary)',
            borderRadius: 'var(--radius-md)',
            zIndex: z.value,
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--space-md)',
            cursor: 'pointer',
            transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
            position: 'relative',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onClick={() => onCopy(z.name, z.label)}
        >
          <div>
            <div style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)'
            }}>
              {z.label}
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 'var(--space-sm) 0'
            }}>
              {z.value}
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              marginTop: 'var(--space-sm)',
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <code>{z.name}</code>
            </div>
            
            <div style={{
              fontSize: 'var(--font-size-xs)',
              marginTop: 'var(--space-sm)',
              opacity: 0.9,
              fontStyle: 'italic'
            }}>
              {z.recommendation}
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Guía de uso */}
    <div style={{
      marginTop: 'var(--space-xl)',
      padding: 'var(--space-md)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      borderLeft: '4px solid var(--color-primary)'
    }}>
      <h3 style={{ marginBottom: 'var(--space-sm)' }}>📌 Recomendaciones de uso</h3>
      <ul style={{ paddingLeft: 'var(--space-md)' }}>
        <li><strong>Dropdown (1000):</strong> Para elementos que aparecen temporalmente sobre el contenido</li>
        <li><strong>Sticky (1020):</strong> Elementos que permanecen visibles durante el scroll</li>
        <li><strong>Fixed (1030):</strong> Elementos fijos en la pantalla (headers, sidebars)</li>
        <li><strong>Modal Backdrop (1040):</strong> Fondo oscurecido detrás de los modales</li>
        <li><strong>Modal (1050):</strong> Diálogos que requieren atención completa</li>
        <li><strong>Popover (1060):</strong> Contenido contextual emergente</li>
        <li><strong>Tooltip (1070):</strong> Información flotante sobre cualquier elemento</li>
      </ul>
      <p style={{ marginTop: 'var(--space-sm)', fontStyle: 'italic' }}>
        Los valores aumentan en pasos de 10 para permitir elementos intermedios cuando sea necesario.
      </p>
    </div>
  </div>
);

export const Variables = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleCopy = (variableName, displayName) => {
    navigator.clipboard.writeText(variableName);
    setCopiedNotification(`${displayName} copiado: ${variableName}`);
    
    // Limpiar notificación después de 2 segundos
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2000);
  };

  return (
    <div
      style={{
        padding: 'var(--space-xl)',
        fontFamily: 'var(--font-family-base)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        transition: 'background-color var(--transition-slow), color var(--transition-slow)',
      }}
    >
      {copiedNotification && <Notification message={copiedNotification} />}

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginBottom: 'var(--space-xl)',
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--text-on-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'var(--transition-normal)',
          fontWeight: 'var(--font-weight-medium)'
        }}
        className="focus-ring"
      >
        {darkMode ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙'}
      </button>

      <Section title="🎨 Colores semánticos">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
          <ColorBox name="Primary" value="--color-primary" onCopy={handleCopy} />
          <ColorBox name="Primary Light" value="--color-primary-light" onCopy={handleCopy} />
          <ColorBox name="Primary Hover" value="--color-primary-hover" onCopy={handleCopy} />
          <ColorBox name="Secondary" value="--color-secondary" onCopy={handleCopy} />
          <ColorBox name="Secondary Light" value="--color-secondary-light" onCopy={handleCopy} />
          <ColorBox name="Secondary Hover" value="--color-secondary-hover" onCopy={handleCopy} />
          <ColorBox name="Success" value="--color-success" onCopy={handleCopy} />
          <ColorBox name="Success Light" value="--color-success-light" onCopy={handleCopy} />
          <ColorBox name="Success Hover" value="--color-success-hover" onCopy={handleCopy} />
          <ColorBox name="Danger" value="--color-danger" onCopy={handleCopy} />
          <ColorBox name="Danger Light" value="--color-danger-light" onCopy={handleCopy} />
          <ColorBox name="Danger Hover" value="--color-danger-hover" onCopy={handleCopy} />
          <ColorBox name="Warning" value="--color-warning" onCopy={handleCopy} />
          <ColorBox name="Warning Light" value="--color-warning-light" onCopy={handleCopy} />
          <ColorBox name="Warning Hover" value="--color-warning-hover" onCopy={handleCopy} />
        </div>
      </Section>

      <Section title="🧪 Botones de prueba">
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <DemoButton label="Primary" variant="--color-primary" hover="--color-primary-hover" />
          <DemoButton label="Secondary" variant="--color-secondary" hover="--color-secondary-hover" />
          <DemoButton label="Success" variant="--color-success" hover="--color-success-hover" />
          <DemoButton label="Danger" variant="--color-danger" hover="--color-danger-hover" />
          <DemoButton label="Warning" variant="--color-warning" hover="--color-warning-hover" />
        </div>
      </Section>

      <Section title="🔤 Tipografía">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
          <div>
            <h3>Tamaños de fuente:</h3>
            <p style={{ fontSize: 'var(--font-size-xs)', margin: 'var(--space-md) 0' }}>XS - 12px</p>
            <p style={{ fontSize: 'var(--font-size-sm)', margin: 'var(--space-md) 0' }}>SM - 14px</p>
            <p style={{ fontSize: 'var(--font-size-base)', margin: 'var(--space-md) 0' }}>Base - 16px</p>
            <p style={{ fontSize: 'var(--font-size-lg)', margin: 'var(--space-md) 0' }}>LG - 18px</p>
            <p style={{ fontSize: 'var(--font-size-xl)', margin: 'var(--space-md) 0' }}>XL - 20px</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', margin: 'var(--space-md) 0' }}>2XL - 24px</p>
            <p style={{ fontSize: 'var(--font-size-3xl)', margin: 'var(--space-md) 0' }}>3XL - 30px</p>
            <p style={{ fontSize: 'var(--font-size-4xl)', margin: 'var(--space-md) 0' }}>4XL - 36px</p>
          </div>
          
          <div>
            <h3>Pesos de fuente:</h3>
            <FontWeightDemo />
          </div>
        </div>
        
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h3>Altura de línea:</h3>
          <LineHeightDemo />
        </div>
        
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h3>Familias tipográficas:</h3>
          <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div style={{ padding: 'var(--space-md)', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-lg)' }}>
                Base: {window.getComputedStyle(document.documentElement).getPropertyValue('--font-family-base')}
              </p>
            </div>
            <div style={{ padding: 'var(--space-md)', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--font-size-lg)' }}>
                Mono: {window.getComputedStyle(document.documentElement).getPropertyValue('--font-family-mono')}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="🧾 Formularios">
        <NativeInputDemo />
      </Section>

      <Section title="📏 Espaciado">
        <SpacingDemo onCopy={handleCopy} />
      </Section>

      <Section title="🔄 Transiciones">
        <p>Pasa el mouse sobre los elementos:</p>
        <TransitionDemo />
      </Section>

      <Section title="🖼️ Bordes y Radios">
        <RadiusDemo onCopy={handleCopy} />
      </Section>

      <Section title="🌫️ Sombras">
        <ShadowDemo onCopy={handleCopy} />
      </Section>

      <Section title="🔄 Z-Index">
        <ZIndexDemo onCopy={handleCopy} />
      </Section>

      <Section title="🌈 Paletas de colores">
        <ColorPalette title="🎨 Azul (Blue)" prefix="blue" onCopy={handleCopy} />
        <ColorPalette title="⚫ Gris (Gray)" prefix="gray" onCopy={handleCopy} />
        <ColorPalette title="🔴 Rojo (Red)" prefix="red" onCopy={handleCopy} />
        <ColorPalette title="🟢 Verde (Green)" prefix="green" onCopy={handleCopy} />
        <ColorPalette title="🟡 Amarillo (Yellow)" prefix="yellow" onCopy={handleCopy} />
      </Section>
    </div>
  );
};