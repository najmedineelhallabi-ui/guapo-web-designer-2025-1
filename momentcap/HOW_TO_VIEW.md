# 👀 Comment Voir le Code et les Logos

## 1️⃣ Voir le code dans Claude Code

### Dans la fenêtre Claude Code:
1. Click sur l'icône **Explorer** (📁) en haut à gauche
2. Tu vas voir `/home/claude/momentcap/`
3. Expand les dossiers:
   - `app/` → Toutes les pages
   - `lib/` → Code utilitaires
   - `public/` → **Les logos SVG y sont ici!**

### Structure du projet:

```
momentcap/
├── app/
│   ├── page.tsx ..................... Landing page
│   ├── dashboard/page.tsx ........... Create album
│   ├── album/[code]/page.tsx ....... Upload photos
│   └── api/ ......................... API routes
├── lib/
│   ├── supabase.ts .................. Supabase config
│   └── photoUtils.ts ................ Watermark logic
├── public/ .......................... LOGOS HERE!
│   ├── logo-enhanced.svg ........... Main logo ⭐
│   ├── logo-square.svg ............ Social media
│   ├── logo-horizontal.svg ........ Banners
│   ├── favicon.svg ................ Browser tab
│   └── logo.svg ................... Fallback
└── SETUP.md, TODO.md, etc ......... Documentation
```

---

## 2️⃣ Voir les logos

### Option A: Dans Claude Code (IMMÉDIAT)
1. Explorer (📁)
2. Expand `public/`
3. Click sur `logo-enhanced.svg`
4. Tu vas voir le code SVG + preview

### Option B: Dans un navigateur (après npm run dev)
1. Dans terminal: `npm run dev`
2. Ouvre: `http://localhost:3000/logo-enhanced.svg`
3. Tu vas voir le logo rendu!

### Option C: Ouvrir directement le fichier
1. File → Open
2. Navigate to: `/home/claude/momentcap/public/logo-enhanced.svg`
3. Double-click
4. S'ouvre dans le navigateur

---

## 3️⃣ Les 5 Logos

| Logo | Fichier | Utilisation |
|------|---------|-------------|
| ⭐ Main | logo-enhanced.svg | Landing page, headers |
| 📱 Social | logo-square.svg | Instagram, Twitter |
| 📊 Banner | logo-horizontal.svg | Emails, nav bars |
| 🌐 Favicon | favicon.svg | Browser tab |
| 🔙 Fallback | logo.svg | Backup version |

---

## 4️⃣ Vérifier que tout est là

Dans Claude Code terminal:
```bash
cd /home/claude/momentcap
ls -la                    # Voir tous les fichiers
ls public/               # Voir les logos
ls app/                 # Voir les pages
cat package.json        # Voir les dépendances
```

---

## 5️⃣ Accéder aux fichiers

### Fichiers importants à lire:
- `MORNING_TODO.md` ← **Lis ça demain!**
- `SETUP.md` → Guide complet
- `TODO.md` → Roadmap
- `SUPABASE_SCHEMA.sql` → Database schema

### Fichiers à modifier:
- `app/page.tsx` → Landing page
- `app/dashboard/page.tsx` → Create album
- `app/album/[code]/page.tsx` → Upload page
- `.env.local` → Configuration (à créer)

---

## 6️⃣ Voir les logos en haute résolution

Si tu veux les télécharger:
1. Click droit sur le fichier SVG
2. "Save as..."
3. Enregistre en PNG ou PDF

Ou dans le browser:
1. Visite http://localhost:3000/logo-enhanced.svg
2. Click droit → "Save image as"

---

## 🎨 Logos Updated!

**Maintenant tous les logos disent "MOMENTCAPS"** (pas juste CAP)

Logos créés:
✅ logo-enhanced.svg (MAIN) - Yellow bg, bubble text, camera frame
✅ logo-square.svg (SOCIAL) - Instagram ready
✅ logo-horizontal.svg (BANNERS) - Email/nav bars
✅ favicon.svg (TAB ICON) - Browser favicon
✅ logo.svg (FALLBACK) - Backup

---

## 🚀 Next Steps

1. Open Claude Code Explorer
2. Navigate to `/home/claude/momentcap/`
3. Look at the structure
4. Tomorrow: Fill .env.local and npm run dev
5. Visit http://localhost:3000 to see logos live!

---

Questions? Everything is in this project. Explore! 🔍
