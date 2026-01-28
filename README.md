# 🛵 YONIMA : L'Infrastructure Logistique Intelligente pour le Sénégal

**YONIMA** n'est pas une simple application de livraison ; c'est une infrastructure numérique conçue pour résoudre le chaos logistique urbain de **Dakar** et **Thiès**.
En s'inspirant de l'excellence opérationnelle de **Yango**, le projet vise à éliminer les inefficacités du dernier kilomètre par une automatisation radicale basée sur la donnée spatiale.

> **Thèse :** La technologie doit rendre la logistique invisible.

---

## 🏗 Architecture Système

Le système est articulé autour d'une architecture hybride robuste privilégiant la performance en temps réel et la précision géo-spatiale.

- **📱 Interface Mobile "Edge-First" (React Native)**
  Une expérience multiplateforme conçue pour la réactivité, même en conditions de réseau dégradées (Zones blanches).
  
- **🧠 Orchestrateur Backend Modulaire (NestJS)**
  Un moteur agissant comme cerveau central pour la logique métier, la sécurité et la médiation des données.

- **🌍 Moteur Spatial Temps Réel (PostgreSQL + PostGIS)**
  Une base de données augmentée transformant les coordonnées GPS en décisions automatisées.

---

## ⚡ Fonctionnalités du Moteur Central

### 1. Logique de Géofencing "Zéro-Clic" 🛰️
Gestion automatisée du cycle de vie d'une course, sans interaction manuelle.

- **Déclencheurs de Proximité :** Périmètres de 100m pour automatiser les changements d'état.
- **Collecte Automatisée :** Détection instantanée de l'arrivée au point A (Ramassage).
- **Transit Intelligent :** Passage automatique au statut "En transit" dès la sortie de zone.
- **Conscience de la Destination :** Alerte client automatique à l'approche du point B.

### 2. Tarification Dynamique Anticipée (Upfront) 💎
Transparence totale du prix avant confirmation de la commande.

- **Calcul Hybride :** Forfait de base + Variable kilométrique (basée sur l'itinéraire optimal).
- **Contextualisation :** Ajustement tarifaire selon l'urgence et la typologie du colis.

### 3. Règlement Financier Intégré 💸
- **Commission Automatisée :** Prélèvement de 20% par course pour la plateforme.
- **Paiements Hybrides :** Support natif du Cash, Wave et Orange Money.
- **Portefeuille Digital :** Réconciliation en temps réel des soldes partenaires.

---

## 🛡 Protocole de Confiance & Sécurité

### 1. Intégration des Partenaires Professionnels (Onboarding)
- **Vérification Documentaire :** Upload et analyse de la CNI, du Permis de conduire et de l'Assurance.
- **Activation Manuelle :** Audit strict et validation par l'administration YONIMA.

### 2. Remise Sécurisée (OTP)
- **Code de Validation :** Sécurisation du transfert de responsabilité via un code unique entre le Partenaire et le Client final.

---

## 📱 Logique de l'Application Partenaire

### 1. Philosophie UX : "Une Main, Sans Regard" 🖐️
Conçue pour la sécurité et la vitesse sous le soleil sénégalais.
- **Contraste Élevé :** Palette Bleu Marine & Orange pour une lisibilité maximale en extérieur.
- **Mode Conducteur :** Zones de touche larges (60x60px+) pour les actions critiques.
- **Retour Sensoriel :** Vibrations haptiques et signaux sonores pour opérer sans quitter la route des yeux.

### 2. Le Moteur : Opérations en Arrière-plan Persistantes ⚙️
- **Suivi Huate Performance :** Service de localisation en arrière-plan survivant à la minimisation de l'app.
- **Optimisation Batterie :** Polling adaptatif (Fréquence élevée en mouvement, basse à l'arrêt).
- **Réseau Résilient :** File d'attente hors-ligne (Offline Queue) stockant les changements d'état en zone blanche et synchronisant dès reconnexion.

### 3. Flux de Mission Automatisé (Zéro-Contact) 🤖
**Le Radar Intelligent (Overlay) :**
- Alerte prioritaire instantanée pour les nouvelles courses.
- Compte à rebours visuel pour l'acceptation.

**Machine à États de Proximité :**
1.  **Phase A (Approche) :** Itinéraire vers le Point de Collecte.
2.  **Phase B (Zone A < 100m) :** Bascule auto vers les Détails du Colis.
3.  **Phase C (Transit) :** Bascule auto vers l'Itinéraire de Livraison à la sortie de zone.
4.  **Phase D (Zone B < 100m) :** Affichage auto de la saisie OTP.

### 4. Transparence & Fintech 💰
- **Gains en Direct :** Tableau de bord temps réel avec visualisation de la répartition 80/20.
- **Réconciliation :** Suivi distinct des encaissements Cash vs Digital (Wave/Orange Money).

---

## 💻 Stack Technique

- **Frontend :** React Native (Expo), **Mapbox**, TanStack Query.
- **Backend :** NestJS, Prisma.
- **Base de Données/Auth :** Supabase (PostgreSQL / PostGIS).
- **Cartographie :** Mapbox Vector Tiles.

---

## 🚀 Démarrage (Getting Started)

### Prérequis
- Node.js & npm/yarn
- Expo CLI
- Projet Supabase configuré

### Installation

```bash
# Cloner le dépôt
git clone [url-du-depot]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npx expo start
```
