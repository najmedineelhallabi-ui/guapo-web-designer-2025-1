# 🚀 Guide de Déploiement sur Netlify

## ✅ Pré-requis

- ✅ Fichier `netlify.toml` configuré (déjà fait !)
- ✅ Configuration Next.js optimisée pour production (déjà fait !)
- 📦 Code sur GitHub

---

## 🎯 Étapes de Déploiement

### **1. Créer un Compte Netlify**

Allez sur [netlify.com](https://netlify.com) et créez un compte (gratuit).

---

### **2. Connecter votre Repository GitHub**

1. Cliquez sur **"Add new site"** → **"Import an existing project"**
2. Choisissez **"Deploy with GitHub"**
3. Autorisez Netlify à accéder à vos repositories
4. Sélectionnez votre repository `guapowebdesigner`

---

### **3. Configuration du Build**

Netlify va détecter automatiquement votre projet Next.js. Vérifiez que :

```
Build command: npm run build
Publish directory: (laissez vide - géré par le plugin)
```

**✅ Pas besoin de configuration supplémentaire !** Le fichier `netlify.toml` gère tout.

---

### **4. Variables d'Environnement (Si Nécessaire)**

Si votre site utilise des variables d'environnement, ajoutez-les dans :

**Site settings → Environment variables**

Exemple :
```
NEXT_PUBLIC_SITE_URL=https://votre-site.netlify.app
```

Pour ce site, **aucune variable d'environnement n'est requise** pour le moment.

---

### **5. Déployer !**

1. Cliquez sur **"Deploy site"**
2. Attendez 2-5 minutes pendant le build
3. Votre site sera disponible sur une URL comme : `https://random-name-123.netlify.app`

---

## 🌐 Configurer votre Domaine Personnalisé

### **Option A : Domaine que vous possédez déjà**

1. Allez dans **Site settings → Domain management**
2. Cliquez sur **"Add custom domain"**
3. Entrez `guapowebdesigner.com`
4. Suivez les instructions pour configurer les DNS

**Configuration DNS :**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: votre-site.netlify.app
```

### **Option B : Acheter un Domaine via Netlify**

1. **Site settings → Domain management**
2. **"Register a new domain"**
3. Recherchez et achetez `guapowebdesigner.com` (environ $10-15/an)

---

## 🔒 HTTPS Automatique

**✅ Netlify active automatiquement HTTPS** pour tous les sites !

Dès que votre domaine est configuré :
- SSL gratuit via Let's Encrypt
- Certificat renouvelé automatiquement
- Redirection HTTP → HTTPS automatique

---

## 🚦 Vérifications Post-Déploiement

### **1. Testez votre site**

Visitez votre URL Netlify et vérifiez :

- ✅ Page d'accueil s'affiche
- ✅ Images se chargent (logos, portfolio)
- ✅ Navigation fonctionne
- ✅ Menu mobile fonctionne
- ✅ Changement de langue fonctionne
- ✅ Liens vers Instagram/Email fonctionnent

### **2. Testez sur Mobile**

Utilisez les DevTools Chrome (F12) → Mode responsive pour tester.

### **3. Vérifiez les Performances**

1. Allez sur [PageSpeed Insights](https://pagespeed.web.dev/)
2. Entrez votre URL Netlify
3. Vérifiez les scores (devrait être 90+)

---

## 🔄 Déploiements Automatiques

**✅ C'est déjà configuré !**

À chaque fois que vous faites un `git push` sur la branche `main`, Netlify :

1. 🔍 Détecte le changement
2. 🔨 Lance le build automatiquement
3. 🚀 Déploie la nouvelle version
4. ✅ Votre site est à jour en 2-5 minutes !

---

## 📊 Fonctionnalités Netlify Gratuites

| Fonctionnalité | Description | Statut |
|----------------|-------------|--------|
| **Déploiements illimités** | Autant de mises à jour que vous voulez | ✅ Inclus |
| **HTTPS automatique** | SSL gratuit et automatique | ✅ Inclus |
| **CDN Global** | Site rapide partout dans le monde | ✅ Inclus |
| **Builds automatiques** | Déploie à chaque commit GitHub | ✅ Inclus |
| **Preview Deployments** | Testez avant de publier | ✅ Inclus |
| **Analytics** | Statistiques de trafic (option payante) | 💰 Payant |

---

## 🐛 Dépannage

### **Problème : Build Failed**

**Solution :**
1. Vérifiez les logs de build dans Netlify Dashboard
2. Le message d'erreur indiquera le problème exact
3. Contactez-moi avec l'erreur pour aide

### **Problème : Images ne se chargent pas**

**Solution :**
Les images Supabase sont déjà configurées dans `next.config.ts` :
```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'slelguoygbfzlpylpxfs.supabase.co',
  },
]
```
✅ Aucune action nécessaire.

### **Problème : 404 sur certaines pages**

**Solution :**
Le plugin `@netlify/plugin-nextjs` gère automatiquement le routing Next.js.
✅ Devrait fonctionner sans configuration.

---

## 🎨 URLs de Votre Site

Après déploiement, vous aurez :

1. **URL Netlify (gratuite)** : `https://random-name-123.netlify.app`
   - Disponible immédiatement
   - Vous pouvez personnaliser le "random-name"

2. **Domaine personnalisé (après configuration)** : `https://guapowebdesigner.com`
   - Nécessite configuration DNS
   - SSL automatique
   - Redirection depuis www automatique

---

## 💡 Conseils Pro

### **1. Personnalisez votre URL Netlify**

Site settings → Domain management → Options → **Edit site name**

Changez `random-name-123` en `guapowebdesigner` pour obtenir :
`https://guapowebdesigner.netlify.app`

### **2. Activez les Preview Deployments**

Dans **Site settings → Build & deploy → Deploy contexts** :
- ✅ Deploy previews: Any pull request
- ✅ Branch deploys: Deploy only production branch

**Avantage :** Testez vos changements avant de les publier !

### **3. Ajoutez un Badge de Statut**

Ajoutez à votre `README.md` :
```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)
```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Documentation Netlify** : [docs.netlify.com](https://docs.netlify.com)
2. **Support Netlify** : [support.netlify.com](https://support.netlify.com)
3. **Community Forum** : [answers.netlify.com](https://answers.netlify.com)

---

## 🎉 Résumé des Étapes

```bash
1. ✅ Créer compte Netlify
2. ✅ Connecter repository GitHub
3. ✅ Cliquer "Deploy site"
4. ⏳ Attendre 2-5 minutes
5. 🎊 Votre site est en ligne !
```

---

## 📈 Prochaines Étapes (Optionnel)

Après le déploiement, vous pouvez :

1. 🌐 Configurer votre domaine personnalisé
2. 📊 Ajouter Google Analytics (voir `GOOGLE-SETUP.md`)
3. 🔍 Optimiser le SEO (voir `README-SEO.md`)
4. 📧 Configurer un formulaire de contact
5. 💬 Ajouter un chat en direct

---

**🚀 Votre site est maintenant prêt pour le déploiement sur Netlify !**

Les fichiers de configuration sont optimisés et testés. Le déploiement devrait fonctionner sans problème.

**Bonne chance ! 🎨✨**
