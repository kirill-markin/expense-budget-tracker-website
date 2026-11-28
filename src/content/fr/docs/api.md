---
title: Référence de l’API
description: Configuration des agents et référence de l’API SQL pour accéder à vos données financières depuis un programme.
---

## Présentation

Expense Budget Tracker expose une API publique pour les agents et les programmes à l’adresse suivante.

`https://api.expense-budget-tracker.com/v1/`

Cette API s’utilise de deux façons.

1. **Connexion d’un agent** à partir de `GET /v1/`.
2. **Requêtes HTTP directes** avec une clé API de longue durée (ApiKey) dont vous disposez déjà.

Toutes les requêtes sont soumises aux mêmes règles Postgres de sécurité au niveau des lignes (RLS) que l’application web.

Si votre client prend en charge MCP, utilisez le [connecteur MCP hébergé](/fr/docs/mcp-connector/) à l’adresse `https://mcp.expense-budget-tracker.com/mcp` et autorisez-le via OAuth dans le navigateur. Cette page décrit la configuration de l’API pour agents et les requêtes HTTP directes. Les deux modes utilisent une clé `ApiKey` de longue durée.

## Découverte, code source et schéma exposé

Commencez à cette adresse.

`https://api.expense-budget-tracker.com/v1/`

La réponse de découverte indique aux agents comment lancer l’authentification et quels points d’accès appeler ensuite. Elle contient aussi des liens vers le README et le code source. L’API expose les points d’accès suivants.

- `GET /v1/schema`
- `GET /v1/openapi.json` et `GET /v1/swagger.json` sont des points d’accès de compatibilité. Ils signalent qu’aucune spécification OpenAPI n’est disponible et renvoient les clients vers le document de découverte et le code source.

Utilisez `schema` pour obtenir la liste exacte des relations et colonnes autorisées par `/v1/sql/query`, `/v1/sql/execute` et le point d’accès de compatibilité `/v1/sql`.

## Connexion d’un agent

Pour que Claude Code, Codex, OpenClaw ou un autre agent configure sa propre connexion, commencez par le point d’accès de découverte et suivez les actions renvoyées par le serveur.

### Processus d’authentification

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Lire l’action `send_code` et le champ `bootstrapUrl` renvoyés.
3. Envoyer l’adresse e-mail de l’utilisateur via `POST` à `https://auth.expense-budget-tracker.com/api/agent/send-code`.
4. Recevoir `otpSessionToken`.
5. Demander à l’utilisateur le code de vérification à 8 chiffres reçu par e-mail.
6. Envoyer `code`, `otpSessionToken` et `label` via `POST` à `https://auth.expense-budget-tracker.com/api/agent/verify-code`.
7. Recevoir une clé `ApiKey` de longue durée.
8. Enregistrer la clé en dehors de la mémoire du chat.
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Au besoin, créer un espace de travail avec `POST https://api.expense-budget-tracker.com/v1/workspaces`.
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Lire les données avec `POST https://api.expense-budget-tracker.com/v1/sql/query` et envoyer les opérations d’écriture approuvées avec `POST https://api.expense-budget-tracker.com/v1/sql/execute`.

### En-tête d’authentification

- `Authorization: ApiKey <key>`

### Sélection de l’espace de travail

- `POST /v1/workspaces/{workspaceId}/select` enregistre l’espace de travail par défaut pour cette clé API.
- Une fois l’espace de travail enregistré, les appels à `/v1/sql/query`, `/v1/sql/execute` et au point d’accès de compatibilité `/v1/sql` peuvent omettre `X-Workspace-Id`.
- `X-Workspace-Id: <workspaceId>` reste utilisable pour remplacer l’espace enregistré le temps d’une requête.
- Si l’utilisateur ne dispose que d’un espace de travail et qu’aucune sélection n’est enregistrée pour la clé, l’API enregistre et utilise automatiquement cet espace.

Pour les étapes à suivre côté utilisateur, consultez le [guide de configuration des agents IA](/fr/docs/agent-setup/).

## Requêtes HTTP directes avec une clé existante

Les scripts, tâches cron, tableaux de bord et applications personnalisées peuvent appeler directement la même API dès qu’ils disposent d’une clé API de longue durée (ApiKey).

### Authentification

Transmettez la clé API dans l’en-tête d’authentification avec le schéma ApiKey, comme dans cet exemple.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` est nécessaire uniquement si aucun espace de travail par défaut n’est enregistré pour la clé ou pour remplacer l’espace enregistré le temps de la requête.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` si nécessaire

## Liste des points d’accès

- `GET /v1/` — document de découverte public.
- `GET /v1/openapi.json` et `GET /v1/swagger.json` — points d’accès de compatibilité qui renvoient vers le code source et le document de découverte, sans exposer de spécification d’API.
- `GET /v1/me` — contexte du compte utilisateur authentifié.
- `GET /v1/workspaces` — liste les espaces de travail accessibles au titulaire de la clé.
- `POST /v1/workspaces` — crée un espace de travail.
- `POST /v1/workspaces/{workspaceId}/select` — enregistre l’espace de travail par défaut pour la clé.
- `GET /v1/schema` — présente les relations et colonnes SQL autorisées.
- `POST /v1/sql/query` — exécute une instruction `SELECT` ou `WITH ... SELECT` en lecture seule.
- `POST /v1/sql/execute` — exécute une instruction `INSERT`, `UPDATE` ou `DELETE` approuvée.
- `POST /v1/sql` — point d’accès de compatibilité pour les scripts atomiques à plusieurs instructions.

## Règles SQL

Les points d’accès principaux séparent la lecture de l’écriture.

- `POST /v1/sql/query` accepte exactement une instruction `SELECT` ou `WITH ... SELECT` en lecture seule.
- `POST /v1/sql/execute` accepte exactement une opération d’écriture `INSERT`, `UPDATE` ou `DELETE`, y compris les formes prises en charge avec `WITH`.
- Le point d’accès de compatibilité `POST /v1/sql` accepte des scripts restreints comportant plusieurs instructions et les exécute de façon atomique. Utilisez-le uniquement lorsque cette exécution atomique est nécessaire.

Les formes suivantes sont bloquées ou rejetées.

- Plusieurs instructions sur les points d’accès principaux `/v1/sql/query` et `/v1/sql/execute`.
- Instructions DDL telles que `CREATE`, `DROP` et `ALTER`.
- Instructions de contrôle des transactions telles que `BEGIN`, `COMMIT` et `ROLLBACK`.
- `set_config()`.
- Commentaires SQL.
- Identifiants entre guillemets.
- Chaînes délimitées par des signes dollar.

Le serveur restreint aussi les relations interrogeables. Consultez `/v1/schema` pour connaître les relations et colonnes exposées avant de générer du SQL.

Les relations actuellement exposées sont les suivantes.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (lecture seule)
- `fx_rates_raw` (lecture seule)
- `fx_rates_daily` (lecture seule)

## Limites

- 100 lignes renvoyées par requête.
- 100 lignes affectées par instruction d’écriture et par requête.
- Délai total maximal de 25 secondes par requête SQL.
- 10 requêtes par seconde et 10 000 requêtes par jour et par clé.

## Sécurité

- Les clés API sont enregistrées sous forme d’empreintes SHA-256. Elles ne sont jamais stockées en clair.
- La sécurité au niveau des lignes (RLS) assure l’isolation des espaces de travail dans la base de données.
- Vous pouvez révoquer une clé à tout moment depuis l’application.
- Lorsque vous retirez un membre d’un espace de travail, toutes ses clés sont automatiquement révoquées.
