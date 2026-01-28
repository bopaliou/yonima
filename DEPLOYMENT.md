# 🚀 Plan de Déploiement YONIMA

Ce document détaille la stratégie de déploiement robuste pour l'infrastructure YONIMA, garantissant haute disponibilité, sécurité et mises à jour fluides pour les opérations critiques à Dakar et Thiès.

---

## 🏗 Architecture de Déploiement Globale

### 1. Philosophie DevOps
*   **Infrastructure as Code (IaC) :** Toute l'infrastructure est définie par code (Docker, Terraform si nécessaire).
*   **Immuabilité :** Les conteneurs déployés ne sont jamais modifiés, toujours remplacés.
*   **CI/CD Automatisé :** Aucun déploiement manuel. Tout passe par le pipeline d'intégration continue.
*   **Parité Dev/Prod :** L'environnement de staging est un miroir iso-fonctionnel de la production.

### 2. Stack d'Infrastructure
*   **Application Mobile :** **Expo EAS** (Expo Application Services) pour les builds natifs et les mises à jour OTA (Over-The-Air).
*   **Backend API :** **Docker** sur un service de conteneurs managé (ex: DigitalOcean App Platform, AWS ECS ou Railway) pour l'orchestration NestJS.
*   **Base de Données :** **Supabase** (Managed PostgreSQL + PostGIS).
*   **Cache/Redis :** Redis managé pour les files d'attente (BullMQ) et le cache de session.

---

## 📱 Pipeline Mobile (React Native / Expo)

Nous utilisons **EAS (Expo Application Services)** pour gérer le cycle de vie de l'application mobile.

### Canaux de Distribution
1.  **Développement (Internal) :**
    *   *Trigger :* Push sur la branche `dev`.
    *   *Action :* Build `eas build --profile development`.
    *   *Distribution :* Disponible immédiatement pour l'équipe technique via Expo Go ou build de dev.

2.  **Staging (Preview) :**
    *   *Trigger :* Push sur la branche `staging`.
    *   *Action :* Publication d'une mise à jour OTA (`eas update --channel preview`).
    *   *Cible :* Testeurs QA et Beta-testeurs pilotes à Dakar.

3.  **Production (Store) :**
    *   *Trigger :* Tag Git `v*.*.*`.
    *   *Action :* Build natif (`eas build --profile production`) et soumission aux stores (Google Play Console / Apple App Store Connect).
    *   *Hotfix :* Utilisation de `eas update --channel production` pour les correctifs critiques sans passer par la validation des stores (JavaScript only).

### Configuration `eas.json`
Configuration stricte des profils pour isoler les variables d'environnement (API URLs, Clés Mapbox).

---

## ⚙️ Pipeline Backend (NestJS & Docker)

Le backend est conteneurisé pour garantir la portabilité et l'échelle.

### Workflow CI/CD (GitHub Actions)

#### Étape 1 : Validation (Sur Pull Request)
*   Linting (ESLint) & Formatage (Prettier).
*   Tests Unitaires (Jest).
*   Tests E2E critiques.

#### Étape 2 : Build & Publish (Sur Merge `main`)
*   Build de l'image Docker `yonima-backend`.
*   Scan de sécurité des vulnérabilités (Trivy).
*   Push vers le Container Registry privé (GHCR ou Docker Hub).

#### Étape 3 : Déploiement (Continuous Deployment)
*   Mise à jour de l'orchestrateur (ex: K8s ou App Platform).
*   **Exécution des Migrations Prisma** avant le démarrage des nouveaux conteneurs.
*   *Health Check :* Vérification de l'endpoint `/health`. Si échec, rollback automatique.

### Stratégie de Base de Données (Prisma + Supabase)
*   **Migrations :** Ne jamais exécuter `prisma push` en production. Utiliser `prisma migrate deploy` dans le pipeline CI/CD.
*   **PostGIS :** S'assurer que les extensions PostGIS sont activées sur l'instance Supabase de production.

---

## 🛡 Sécurité & Monitoring

### Observabilité
*   **Logs Centralisés :** Winston logger envoyant les logs vers un service d'agrégation (ex: Datadog, Papertrail).
*   **Performance (APM) :** Monitoring des temps de réponse API et des requêtes lentes DB.
*   **Tracking d'Erreurs :** **Sentry** intégré à la fois sur le Mobile et le Backend pour la remontée de crashs en temps réel.

### Redondance & Backup
*   **Base de Données :** Backups quotidiens automatisés par Supabase + Point-in-Time Recovery (PITR).
*   **Zero Downtime :** Déploiement "Rolling Update" pour s'assurer qu'il y a toujours des instances actives pendant la mise à jour.

---

## 🚨 Plan de Reprise d'Activité (Rollback)

### Scénario : Bug Critique en Production

1.  **Mobile (Bug JS) :**
    *   Commande : `eas update:rollback --channel production`.
    *   Effet : Les utilisateurs reviennent à la version JS précédente au prochain redémarrage de l'app.

2.  **Backend (Bug API) :**
    *   Action : Revert du commit sur `main` ou redéploiement de l'image Docker précédente via le dashboard cloud.

3.  **Base de Données (Migration corrompue) :**
    *   Action : Restauration immédiate backup Supabase (PITR).
