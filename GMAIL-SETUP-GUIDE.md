# 📧 Guide de Configuration Gmail SMTP

## ✅ Pourquoi Gmail SMTP ?

**Avantages par rapport à Resend :**
- ✅ **Gratuit** et illimité pour un usage raisonnable
- ✅ **Fiable** - Les emails arrivent TOUJOURS (même si parfois en spam)
- ✅ **Simple** - Pas de vérification de domaine nécessaire
- ✅ **Pas de limite** sur les destinataires (contrairement à Resend test)

**Problème avec Resend :**
- ❌ `onboarding@resend.dev` ne peut envoyer qu'aux emails vérifiés
- ❌ Les emails apparaissent en rouge (échec) sur le dashboard
- ❌ Nécessite une vérification de domaine pour un usage réel

---

## 🔧 Configuration en 3 Étapes

### **Étape 1 : Créer un Mot de Passe d'Application Gmail**

1. **Allez sur** : https://myaccount.google.com/apppasswords
   
2. **Connectez-vous** avec votre compte Gmail (`info@guapowebdesigner.com`)

3. **Créez un mot de passe d'application** :
   - Nom de l'application : `GUAPO Web Designer Website`
   - Cliquez sur **Créer**
   
4. **Copiez le mot de passe** (16 caractères) généré
   - ⚠️ Il ne s'affichera qu'une seule fois !
   - Format : `xxxx xxxx xxxx xxxx` (sans espaces)

---

### **Étape 2 : Configurer les Variables d'Environnement**

Ouvrez votre fichier `.env.local` et remplacez :

```env
# Gmail SMTP Configuration
GMAIL_USER=info@guapowebdesigner.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx

# Email de destination pour recevoir les demandes de devis
CONTACT_EMAIL_TO=info@guapowebdesigner.com
```

**Remplacez :**
- `GMAIL_USER` : Votre email Gmail complet
- `GMAIL_APP_PASSWORD` : Le mot de passe d'application copié (sans espaces)

---

### **Étape 3 : Tester l'Envoi d'Email**

1. **Redémarrez le serveur** (si nécessaire)

2. **Remplissez le formulaire** sur `/devis`

3. **Vérifiez vos emails** :
   - ✅ Email reçu dans **info@guapowebdesigner.com** (propriétaire)
   - ✅ Email reçu dans **l'email du client** (confirmation)

---

## 📋 Checklist de Vérification

- [ ] Compte Gmail actif
- [ ] Vérification en 2 étapes activée sur Gmail
- [ ] Mot de passe d'application créé
- [ ] Variables d'environnement configurées dans `.env.local`
- [ ] Serveur redémarré
- [ ] Test d'envoi effectué

---

## 🔍 Résolution des Problèmes

### **❌ Erreur : "Invalid login"**
- Vérifiez que le mot de passe d'application est correct (16 caractères sans espaces)
- Assurez-vous que la vérification en 2 étapes est activée sur Gmail

### **❌ Erreur : "self signed certificate"**
- Normal en développement local, les emails sont quand même envoyés

### **📧 Les emails vont dans les spams**
**Solutions pour améliorer la délivrabilité :**

1. **Ajouter votre domaine aux expéditeurs autorisés** (chez le destinataire)

2. **Utiliser un domaine personnalisé** (plus tard) :
   - Configurer SPF record
   - Configurer DKIM
   - Configurer DMARC

3. **Demander aux destinataires** de :
   - Marquer vos emails comme "Non spam"
   - Ajouter `info@guapowebdesigner.com` aux contacts

4. **Améliorer le contenu** :
   - Éviter trop de liens
   - Éviter les mots "spam" (gratuit, promo, urgent)
   - Utiliser un bon ratio texte/images

---

## 🎯 Pourquoi les Emails Vont en Spam ?

**Raisons principales :**
1. **Nouveau domaine** : Gmail n'a pas de réputation établie
2. **Envoi SMTP direct** : Pas de SPF/DKIM configurés
3. **Contenu HTML** : Peut être détecté comme commercial

**C'est normal au début !** Avec le temps et l'usage, la réputation s'améliore.

---

## 🚀 Migration Future vers un Service Professionnel

Quand votre site aura plus de trafic, vous pourrez migrer vers :

1. **SendGrid** (gratuit jusqu'à 100 emails/jour)
2. **Mailgun** (gratuit jusqu'à 5000 emails/mois)
3. **Amazon SES** (très peu cher, $0.10 pour 1000 emails)
4. **Resend avec domaine vérifié** (si vous vérifiez `guapowebdesigner.com`)

**Pour l'instant, Gmail SMTP est parfait !** ✅

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur
2. Testez avec un autre email Gmail personnel
3. Vérifiez que les variables d'environnement sont bien définies

---

## ✅ Configuration Terminée !

Une fois configuré, les emails seront envoyés **automatiquement** à chaque demande de devis :
- 📧 **Email 1** : Envoyé à `info@guapowebdesigner.com` (vous)
- 📧 **Email 2** : Envoyé au client (confirmation)

**Bon courage ! 🚀**
