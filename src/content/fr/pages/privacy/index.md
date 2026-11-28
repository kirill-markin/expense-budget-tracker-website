---
title: Politique de confidentialité
description: Politique de confidentialité d’Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: août 2026
---
## Données collectées

Lorsque vous utilisez la version cloud, nous stockons les données financières que vous saisissez (transactions, budgets, noms de comptes) et votre adresse e-mail pour l’authentification. Les instances auto-hébergées ne nous transmettent aucune donnée.

## Exploitant

Le service hébergé Expense Budget Tracker est exploité par SAMO DANNI EOOD (TVA : BG207395566). Le site personnel de son créateur, Kirill Markin, se trouve à l’adresse [kirill-markin.com](https://kirill-markin.com/) et fait partie du même ensemble de produits.

Cette politique s’applique au site web, à l’application, à l’API et au service MCP distant que nous hébergeons et exploitons. Les instances auto-hébergées restent sous le contrôle de leur exploitant.

## Utilisation de vos données

Nous utilisons vos données financières uniquement pour fournir le service. Nous ne les vendons pas et ne les utilisons pas à des fins publicitaires. Nous les communiquons à un client tiers uniquement sur votre instruction, par exemple lorsque vous autorisez une connexion MCP. Chaque espace de travail est isolé grâce à la sécurité au niveau des lignes dans Postgres.

## MCP et clients IA tiers

Lorsque vous connectez un client IA au service MCP hébergé, Expense Budget Tracker traite la demande d’autorisation OAuth, l’outil demandé et ses arguments, l’espace de travail sélectionné et les données financières nécessaires pour répondre à une requête de lecture ou effectuer une opération d’écriture approuvée. Les modifications effectuées via MCP sont enregistrées dans les mêmes données financières hébergées que celles faites dans l’application web.

Le service conserve le nom et les URL de redirection du client enregistré, les métadonnées de connexion et des autorisations accordées, les horodatages de création, d’activité et de révocation, ainsi que les empreintes issues du hachage à sens unique des codes d’autorisation OAuth et des jetons d’accès et de renouvellement. Le service ne stocke pas les jetons OAuth en clair. Le service MCP reçoit chaque appel à un outil et renvoie le résultat demandé. Il ne conserve pas la conversation du client IA dans l’historique des conversations du produit.

Le client IA est un tiers distinct. Il peut traiter ou conserver les instructions que vous lui envoyez, les arguments des outils et les données financières renvoyées, selon ses propres conditions et sa politique de confidentialité. Consultez la politique du client avant de le connecter. Vous pouvez révoquer une connexion MCP à tout moment dans **Paramètres > Accès des agents et des programmes**. Vous pouvez supprimer votre compte utilisateur et les données hébergées qui y sont associées depuis **Paramètres**, comme indiqué ci-dessous.

## Stockage des données

Nous stockons les données de la version cloud dans AWS RDS (Postgres), dans la région eu-central-1, et les sauvegardons automatiquement chaque jour. Les données sont chiffrées au repos et en transit.

## Cookies

Nous utilisons un cookie `session` pour l’authentification (HttpOnly, Secure, SameSite=Lax). Nous n’utilisons aucun cookie de suivi ni outil d’analyse tiers.

## Suppression des données

Vous pouvez supprimer votre compte utilisateur et toutes les données associées à tout moment depuis **Paramètres** dans l’application. Si vous auto-hébergez l’application, vous contrôlez directement la base de données.

## Open source

L’intégralité du code est open source. Vous pouvez vérifier précisément ce que l’application fait de vos données.
