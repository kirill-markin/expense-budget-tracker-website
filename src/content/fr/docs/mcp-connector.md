---
title: Connecteur MCP
description: Connectez un client MCP à Expense Budget Tracker via OAuth pour consulter ou modifier vos données financières en toute sécurité.
---

## Présentation

Expense Budget Tracker propose un connecteur hébergé pour le protocole MCP (Model Context Protocol) à l’adresse suivante.

`https://mcp.expense-budget-tracker.com/mcp`

Ce point d’accès utilise Streamable HTTP et OAuth. Fournissez cette URL à un client MCP compatible avec les serveurs distants via Streamable HTTP et avec la découverte OAuth. Le client ouvre un navigateur pour vous permettre de vous connecter et d’approuver l’accès.

Le client présente son jeton d’accès OAuth au point d’accès MCP. Pour renouveler l’accès, il échange son jeton de renouvellement auprès du serveur d’autorisation. La clé `ApiKey` de longue durée décrite dans la [référence de l’API pour agents](/fr/docs/api/) appartient à une intégration HTTP directe distincte. Le point d’accès MCP ne l’accepte pas.

## Découverte et connexion OAuth

Le connecteur hébergé publie les métadonnées de la ressource protégée à cette adresse.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Ces métadonnées indiquent au client le serveur d’autorisation. Les métadonnées de ce serveur sont disponibles à cette adresse.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Un client compatible suit ces étapes.

1. Se connecter à `https://mcp.expense-budget-tracker.com/mcp` et découvrir les métadonnées de la ressource protégée.
2. S’enregistrer dynamiquement comme client OAuth public, sans utiliser de secret client.
3. Lancer le flux de code d’autorisation et ouvrir l’URL d’autorisation dans le navigateur de l’utilisateur.
4. Utiliser PKCE pour chaque demande d’autorisation. `S256` est la seule méthode de calcul du challenge PKCE prise en charge.
5. Demander `expenses:read`. Ajouter `expenses:write` uniquement si le client doit appeler `sql_execute`.
6. Échanger le code d’autorisation contre des jetons d’accès et de renouvellement, puis laisser le client renouveler l’accès au besoin.

Ne copiez jamais les jetons dans les instructions données à l’IA, l’historique des conversations, les fichiers source ou les journaux. Conservez-les uniquement dans le stockage des identifiants d’accès du client MCP.

## Autorisations

- L’autorisation `expenses:read` est obligatoire. Elle permet de découvrir les espaces de travail, de consulter le schéma et d’exécuter des requêtes en lecture seule.
- L’autorisation facultative `expenses:write` donne accès à l’outil `sql_execute`. Cet outil peut ajouter, modifier ou supprimer des données.

Demandez uniquement les autorisations nécessaires à la tâche. Un client qui se limite à l’analyse ou à la production de rapports doit demander `expenses:read` sans `expenses:write`.

## Outils

### `list_workspaces`

Liste les espaces de travail accessibles à l’utilisateur connecté. Utilisez l’identifiant renvoyé pour désigner explicitement l’espace de travail avant toute lecture ou modification de données.

### `get_schema`

Renvoie les relations et colonnes exposées à MCP pour l’espace de travail sélectionné. Appelez cet outil avant d’écrire du SQL pour connaître les noms des tables et des colonnes.

### `sql_query`

Exécute une requête SQL restreinte en lecture seule dans l’espace de travail sélectionné. La base de données impose également la lecture seule pour ce type de requête. Le résultat est limité à 100 lignes, avec un délai d’exécution maximal de 20 secondes.

### `sql_execute`

Exécute une instruction SQL restreinte qui peut ajouter, modifier ou supprimer des données dans l’espace de travail sélectionné. Cet outil exige l’autorisation distincte `expenses:write`. Confirmez l’espace de travail et relisez l’instruction exacte avant d’approuver l’appel.

Seuls `sql_query` et les règles que la base de données lui applique garantissent la lecture seule. Le serveur MCP expose aussi `sql_execute`, qui permet d’écrire des données.

## Utilisation en toute sécurité

1. Appelez `list_workspaces` et confirmez l’espace de travail visé avec l’utilisateur.
2. Appelez `get_schema` avant de générer du SQL.
3. Utilisez `sql_query` pour consulter les données, calculer des totaux, effectuer des rapprochements et préparer des rapports.
4. Demandez `expenses:write` uniquement si la tâche nécessite une modification des données.
5. Avant d’appeler `sql_execute`, montrez l’instruction exacte et son effet attendu, puis confirmez de nouveau l’espace de travail.
6. Après une écriture, vérifiez le résultat avec `sql_query`.

Le serveur limite les instructions SQL et les relations accessibles. Ces contrôles complètent la relecture attentive du SQL généré, qui reste nécessaire.

## Limites

- 100 lignes au maximum dans les résultats SQL.
- Délai d’exécution maximal de 20 secondes.
- Accès limité aux espaces de travail accessibles à l’utilisateur connecté.
- `sql_query` utilise un sous-ensemble restreint de SQL et la base de données impose la lecture seule.
- `sql_execute` exige `expenses:write` en plus de l’autorisation de lecture obligatoire.

## Confidentialité et auto-hébergement

Un client MCP autorisé peut lire les données financières. Avec `expenses:write`, il peut également y ajouter des données, les modifier ou les supprimer. Consultez la [politique de confidentialité](/fr/privacy/) et la politique de traitement des données du client avant de le connecter.

Les URL indiquées ci-dessus concernent uniquement le service géré Expense Budget Tracker. Pour votre propre déploiement, commencez par le [guide d’auto-hébergement](/fr/docs/self-hosting/) et configurez le point d’accès MCP et les métadonnées OAuth pour vos domaines. Le code est disponible dans le [dépôt du code source (en anglais)](https://github.com/kirill-markin/expense-budget-tracker).
