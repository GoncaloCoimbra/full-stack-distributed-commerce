# 📄 Page Migration Example — Before & After

## Example: Settings Page Refactor

### BEFORE (Old Design)

```tsx
// pages/Settings.tsx (OLD)
import React, { useState } from 'react';

export const Settings: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            ⚙️ Definições
          </h1>
          <p className="text-slate-400">Gerencie suas preferências e configurações</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Theme Section */}
          <div className="col-span-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">🎨 Tema</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Selecione o tema preferido
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-600 border border-amber-500/30 text-white rounded-lg focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Escuro</option>
                  <option value="auto">🔄 Automático</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="bg-gradient-to-br from-blue-700/30 to-blue-800/20 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-bold text-blue-300 mb-4">📊 Estatísticas</h3>
            <div className="space-y-3 text-slate-300 text-sm">
              <p>Total de configurações: <strong>12</strong></p>
              <p>Última atualização: <strong>Hoje</strong></p>
              <p>Status: <strong className="text-green-400">Ativo</strong></p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mt-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">🔔 Notificações</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 accent-amber-500"
              />
              <span className="text-slate-300">Ativar notificações por email</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button className="px-6 py-3 bg-slate-600 border border-amber-500/30 text-slate-300 rounded-lg hover:border-amber-500/60 hover:bg-slate-700 transition-all">
            Cancelar
          </button>
          <button className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-all">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
```

---

### AFTER (New Design System)

```tsx
// pages/Settings.tsx (NEW)
import React, { useState } from 'react';
import { Button, Card, Input, Badge } from '@/components/common';

export const Settings: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState('user@example.com');

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <h1>⚙️ Definições</h1>
        <p>Gerencie suas preferências e configurações</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Theme Section - Uses new Card component */}
        <div className="col-span-2">
          <Card header={<h2>🎨 Tema</h2>}>
            <div className="space-y-4">
              <div>
                <label htmlFor="theme-select" className="input-label">
                  Selecione o tema preferido
                </label>
                <select
                  id="theme-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Escuro</option>
                  <option value="auto">🔄 Automático</option>
                </select>
              </div>

              {/* Theme Preview */}
              <div>
                <p className="input-label">Pré-visualização</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'btn btn-primary' : 'btn btn-secondary'}
                  >
                    ☀️ Claro
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'btn btn-primary' : 'btn btn-secondary'}
                  >
                    🌙 Escuro
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Stats - New Badge design */}
        <div>
          <Card header={<h3>📊 Estatísticas</h3>}>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted">Total de configurações</span>
                <p style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>12</p>
              </div>
              <div>
                <span className="text-sm text-muted">Última atualização</span>
                <p style={{ fontSize: 'var(--fs-base)' }}>Hoje</p>
              </div>
              <Badge variant="success">✓ Ativo</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mt-6">
        <Card header={<h2>🔔 Notificações</h2>}>
          <div className="space-y-4">
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>Ativar notificações por email</span>
            </label>

            {notifications && (
              <Input
                type="email"
                label="Email para notificações"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            )}
          </div>
        </Card>
      </div>

      {/* Action Buttons - New Button component */}
      <div className="mt-8 flex gap-4 justify-end">
        <Button variant="secondary" size="md">
          Cancelar
        </Button>
        <Button variant="primary" size="md">
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default Settings;
```

---

## Key Changes Explained

### 1. **Card Component**
```tsx
// Old: Manual div with classes
<div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
  <h2 className="text-2xl font-bold text-amber-500 mb-4">Title</h2>
  ...
</div>

// New: Reusable component
<Card header={<h2>Title</h2>}>
  ...
</Card>
```

### 2. **Button Component**
```tsx
// Old: Manual styling
<button className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-all">
  Guardar
</button>

// New: Semantic variants
<Button variant="primary" size="md">Guardar</Button>
```

### 3. **Input Component**
```tsx
// Old: Simple input element
<input
  type="email"
  className="w-full px-4 py-3 bg-slate-600 border border-amber-500/30 text-white rounded-lg"
  placeholder="Email"
/>

// New: Rich component with label, error, hint
<Input
  type="email"
  label="Email"
  placeholder="seu@email.com"
  error={error}
  hint="Usaremos apenas para notificações"
/>
```

### 4. **Badge Component**
```tsx
// Old: Manual span with classes
<span className="text-green-400 font-bold">✓ Ativo</span>

// New: Semantic badge
<Badge variant="success">✓ Ativo</Badge>
```

### 5. **CSS Variables**
```tsx
// Old: Tailwind classes everywhere
<div className="text-lg font-black text-amber-500">Texto</div>

// New: CSS variables (automatically adapt to theme)
<div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--color-brand-red)' }}>
  Texto
</div>
```

---

## Dark Mode Works Automatically

```tsx
// Just add class to html element:
<html class="dark-mode">

// All components automatically update!
// -- This is handled in UnifiedLayout:
setDarkMode(true); // adds 'dark-mode' class to html
```

---

## Migration Workflow

1. **Copy component imports**:
   ```tsx
   import { Button, Input, Card, Badge } from '@/components/common';
   ```

2. **Replace visual elements**:
   - Divs with Cards
   - Buttons with Button component
   - Form inputs with Input component

3. **Use CSS variables for inline styles**:
   ```tsx
   style={{ 
     color: 'var(--color-text-muted)',
     backgroundColor: 'var(--color-surface)'
   }}
   ```

4. **Test light/dark mode** (toggle in header)

5. **Verify responsive design** (test on mobile)

---

## Next Pages to Migrate

Pick one from this list and follow the same pattern:
- Dashboard.tsx
- ProductList.tsx
- SupplierList.tsx
- TransportList.tsx
- Profile.tsx
- Tasks.tsx

All will follow the same pattern: Cards, Buttons, Inputs, Badges.

---

**Difficulty**: Easy ⭐  
**Time per page**: 15-30 minutes  
**Estimated Total**: 4-6 hours for all pages
