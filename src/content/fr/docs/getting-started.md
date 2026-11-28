---
title: Premiers pas
description: Inscrivez-vous à la version cloud ou déployez votre propre instance en quelques minutes.
---

## Version cloud

La version cloud gérée est le moyen le plus rapide de commencer.

1. Ouvrez [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com).
2. Inscrivez-vous avec votre adresse e-mail. Vous recevrez un code de vérification à usage unique pour vous connecter sans mot de passe.
3. Commencez à suivre vos dépenses dans l’application web.
4. Pour un client compatible avec MCP, ajoutez `https://mcp.expense-budget-tracker.com/mcp` et autorisez l’accès dans votre navigateur.
5. Pour un agent en ligne de commande ou un client HTTP direct, commencez par `GET https://api.expense-budget-tracker.com/v1/`.

Vous n’avez rien à installer ni à configurer sur un serveur. La sécurité au niveau des lignes dans Postgres isole les données de chaque espace de travail.

## Accès pour les agents et les programmes

Vous pouvez utiliser le même compte pour l’application hébergée et les intégrations.

- L’interface web à l’adresse `https://app.expense-budget-tracker.com`.
- Le [connecteur MCP hébergé](/fr/docs/mcp-connector/) à l’adresse `https://mcp.expense-budget-tracker.com/mcp`, avec autorisation OAuth dans le navigateur.
- L’[API pour agents](/fr/docs/agent-setup/), à partir de `GET https://api.expense-budget-tracker.com/v1/`, puis via des requêtes HTTP directes avec `Authorization: ApiKey <key>`.

## Auto-hébergement

Pour déployer votre propre instance, consultez le [guide d’auto-hébergement](/fr/docs/self-hosting/).

## Mode démo

Dans l’en-tête de l’application, passez de **Tout** à **Démo** pour explorer l’interface avec des données d’exemple, sans avoir à configurer de base de données.
