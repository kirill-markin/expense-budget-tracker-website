---
title: Configurer un agent IA
description: Communiquez une URL de découverte à Claude Code, Codex ou OpenClaw. L’agent suit les indications du service, vérifie le code à 8 chiffres, conserve sa clé API de longue durée (ApiKey) et accède à votre espace de travail.
---

## Le lien à transmettre à votre agent

Transmettez cette URL exacte.

`https://api.expense-budget-tracker.com/v1/`

Ce point d’accès fournit le document de découverte public de référence pour les agents IA. Il indique comment lancer l’authentification, quels points d’accès appeler ensuite, quel mécanisme d’authentification utiliser par la suite et où trouver le schéma exposé par le service et le code source.

Ce guide explique comment connecter des agents en ligne de commande et des clients HTTP directement à l’API pour agents. Si votre client prend en charge MCP, utilisez le [connecteur MCP hébergé](/fr/docs/mcp-connector/). Il se connecte à `https://mcp.expense-budget-tracker.com/mcp` et utilise une autorisation OAuth interactive dans le navigateur, sans passer par la création d’une clé API (ApiKey).

## Étapes côté utilisateur

1. Ouvrez Claude Code, Codex, OpenClaw ou un autre agent capable d’envoyer des requêtes HTTP.
2. Demandez à l’agent de se connecter à Expense Budget Tracker via `https://api.expense-budget-tracker.com/v1/`.
3. Lorsque l’agent vous demande une adresse e-mail, donnez-lui celle que vous utilisez pour Expense Budget Tracker.
4. Relevez le code de vérification à 8 chiffres dans votre boîte de réception.
5. Transmettez ce code à l’agent.
6. Laissez l’agent conserver la clé API reçue dans un emplacement distinct de la mémoire du chat, puis reprenez votre importation, votre requête ou la préparation de votre budget.

Vous n’avez pas à copier-coller de clé manuellement pour vous connecter. L’agent configure sa propre connexion après vérification du code reçu par e-mail.

## Étapes côté agent

Voici la procédure complète.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Lire la réponse de découverte et suivre les actions renvoyées par le service. Éviter de coder les étapes suivantes en dur.
3. Envoyer l’adresse e-mail de l’utilisateur via `POST` à l’adresse `bootstrapUrl` renvoyée.
4. Recevoir `otpSessionToken` et l’action `verify_code`.
5. Demander à l’utilisateur le code de vérification à 8 chiffres reçu par e-mail.
6. Envoyer `code`, `otpSessionToken` et un `label` pour la connexion via `POST` à `https://auth.expense-budget-tracker.com/api/agent/verify-code`.
7. Recevoir une nouvelle clé `ApiKey`.
8. Enregistrer la clé en dehors de la mémoire du chat, de préférence sous le nom `EXPENSE_BUDGET_TRACKER_API_KEY`.
9. `GET https://api.expense-budget-tracker.com/v1/me` avec `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Si nécessaire, créer un espace de travail avec `POST /v1/workspaces`.
12. Enregistrer un espace de travail par défaut avec `POST /v1/workspaces/{workspaceId}/select`.
13. Consulter les relations autorisées avec `GET https://api.expense-budget-tracker.com/v1/schema`.
14. Lire les données via `POST https://api.expense-budget-tracker.com/v1/sql/query` et envoyer les opérations d’écriture approuvées via `POST https://api.expense-budget-tracker.com/v1/sql/execute`.

La sélection d’un espace de travail est explicite et persistante. Après `POST /v1/workspaces/{workspaceId}/select`, le serveur mémorise l’espace sélectionné pour cette clé API. Les appels suivants à `/v1/sql/query` et `/v1/sql/execute` peuvent donc omettre `X-Workspace-Id`. Vous pouvez toujours envoyer `X-Workspace-Id` pour utiliser un autre espace que celui enregistré, le temps d’une requête. Le point d’accès de compatibilité `POST /v1/sql` est réservé aux scripts atomiques comportant plusieurs instructions. Pour les opérations courantes de lecture et d’écriture, utilisez les points d’accès dédiés.

Si l’utilisateur ne dispose que d’un espace de travail et qu’aucune sélection n’est enregistrée pour la clé, le serveur enregistre et utilise automatiquement cet espace.

## Ce que l’agent doit conserver

La clé renvoyée par `verify-code` est de longue durée. Conservez-la en dehors de la mémoire du chat.

- Si l’utilisateur autorise l’écriture dans un fichier, enregistrez la clé dans un fichier local `.env` sous la forme `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`.
- Sinon, exportez-la dans le shell en cours sous la forme `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` et demandez à l’utilisateur de la conserver dans un emplacement durable.

Les requêtes authentifiées utilisent les en-têtes suivants.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` uniquement pour remplacer l’espace de travail enregistré ou tant qu’aucun espace n’a été enregistré.

## Instructions pour les agents IA

Commencez par cette commande.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Suivez ensuite les actions renvoyées par le serveur. Utilisez les étapes indiquées dans le document de découverte lorsqu’il les fournit, sans les coder en dur.

Après `verify-code`, conservez la clé `ApiKey` renvoyée dans un emplacement sûr. Chargez ensuite les ressources suivantes.

- `/v1/me` pour le contexte du compte utilisateur.
- `/v1/workspaces` pour les espaces de travail disponibles.
- `/v1/schema` pour les relations et colonnes SQL autorisées.
- `/v1/openapi.json` ou `/v1/swagger.json` uniquement lorsqu’un client interroge les URL habituelles de spécification. Les réponses contiennent des liens de découverte et vers le code source, sans spécification d’API.

## Exemples d’instructions à donner à l’agent

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Ce que vous pouvez faire après la configuration

- Importer des relevés bancaires ou des relevés de carte exportés.
- Classer les transactions dans vos catégories existantes.
- Rapprocher les soldes de vos comptes des soldes bancaires.
- Consulter les dépenses par catégorie, période, commerçant ou compte.
- Mettre à jour les lignes budgétaires du mois suivant.

Pour connaître les points d’accès et les modalités d’authentification, consultez la [référence de l’API](/fr/docs/api/).
