---
title: Architecture
description: Vue d’ensemble du système, modèle de données, gestion multidevise et authentification.
---

## Vue d’ensemble du système

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Six composants utilisent une seule base de données.

1. **web** — application Next.js avec les tableaux de bord et les routes d’API.
2. **auth** — connexion par code de vérification à usage unique reçu par e-mail et configuration initiale des agents sur le domaine d’authentification.
3. **sql-api** — fonction AWS Lambda derrière API Gateway pour les agents et les programmes.
4. **mcp** — fonction AWS Lambda et API HTTP dans API Gateway, toutes deux dédiées au point d’accès MCP hébergé.
5. **worker** — récupère les taux de change quotidiens de la BCE (ECB), de la Banque centrale de Russie (CBR) et de la Banque nationale de Serbie (NBS).
6. **Postgres** — source de données unique avec sécurité au niveau des lignes.

## Modèle de données

- **ledger_entries** — une ligne par mouvement sur un compte (revenu, dépense ou transfert).
- **budget_lines** — chaque modification d’une cellule du budget s’ajoute à l’historique. La dernière écriture fait foi.
- **budget_comments** — notes associées aux cellules du budget, enregistrées par ajout uniquement.
- **workspace_settings** — devise de référence et paramètres propres à l’espace de travail.
- **account_metadata** — métadonnées de chaque compte, comme sa classification par liquidité.
- **exchange_rates** — taux de change quotidiens utilisés pour la conversion lors des requêtes.
- **workspaces** / **workspace_members** — isolation des données entre espaces de travail.
- **accounts** — vue dérivée des écritures comptables.

## Gestion multidevise

Tous les montants sont stockés dans leur devise d’origine. La conversion dans la devise de référence se fait à la lecture, par des jointures SQL sur `exchange_rates`. Les montants d’origine restent intacts.

## Authentification

La variable d’environnement `AUTH_MODE` propose deux modes.

- `none` — sans authentification, avec un seul espace de travail local.
- `cognito` — connexion sans mot de passe par code à usage unique reçu par e-mail via AWS Cognito, avec inscription ouverte.

Pour les agents et les programmes, le point d’entrée public de la découverte est `GET /v1/`. L’agent s’authentifie sur le domaine d’authentification avec un code à usage unique reçu par e-mail, obtient une clé API de longue durée (ApiKey), puis exécute ses requêtes SQL via l’API pour programmes derrière API Gateway.

Les clients compatibles avec MCP se connectent séparément à `https://mcp.expense-budget-tracker.com/mcp`. Une API HTTP dédiée dans API Gateway et une fonction Lambda MCP traitent les requêtes à cette adresse. L’autorisation interactive passe par OAuth dans le navigateur, sur le domaine d’authentification.

Chaque utilisateur dispose d’un espace de travail isolé. Les règles de sécurité au niveau des lignes (RLS) vérifient l’appartenance à l’espace à chaque requête, y compris pour les requêtes SQL envoyées par les agents ou les programmes.
