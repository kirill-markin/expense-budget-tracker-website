---
title: Assistance
description: Obtenir de l’aide ou signaler un problème de sécurité concernant Expense Budget Tracker, y compris le service MCP hébergé.
slug: support
sections:
  - type: simple_markdown_page
---

## Assistance pour le service hébergé et MCP

Pour obtenir de l’aide sur l’application hébergée, un compte utilisateur, une autorisation OAuth ou le serveur MCP public, écrivez à [markinkirill@gmail.com](mailto:markinkirill@gmail.com). L’assistance est fournie dans la mesure du possible, sans garantie de délai de réponse.

Indiquez uniquement les éléments nécessaires au diagnostic.

- Le nom et la version du client.
- La date, l’heure et le fuseau horaire de l’incident.
- Le point d’accès ou la page concernée.
- L’étape du flux OAuth ou le nom de l’outil MCP.
- Le message d’erreur exact, après retrait des données sensibles, et l’identifiant de la requête s’il a été affiché.
- Le résultat attendu et ce qui s’est passé.

N’envoyez jamais de mots de passe, de cookies de session, de codes OAuth, de jetons d’accès ou de renouvellement, de clés d’API, de données financières brutes ni de corps de requête qui n’a pas été expurgé.

## Signalements de sécurité

Ne signalez pas une vulnérabilité présumée dans un ticket GitHub public. Écrivez à [markinkirill@gmail.com](mailto:markinkirill@gmail.com) avec l’objet **Expense Budget Tracker security report** et les étapes minimales pour reproduire le problème, sans données sensibles. N’incluez ni identifiants d’accès actifs ni données financières. Si un accès a pu être compromis, révoquez d’abord la connexion dans **Paramètres > Accès des agents et des programmes**, puis renouvelez tout autre identifiant d’accès concerné.

## Bugs, auto-hébergement et questions à la communauté

Utilisez les [tickets GitHub (en anglais)](https://github.com/kirill-markin/expense-budget-tracker/issues) pour les bugs reproductibles, les questions d’auto-hébergement et les échanges publics avec la communauté. Consultez d’abord les tickets existants et retirez les données privées des journaux et captures d’écran. Le [guide d’auto-hébergement](/fr/docs/self-hosting/) et le [dépôt du code source (en anglais)](https://github.com/kirill-markin/expense-budget-tracker) traitent du déploiement et du développement.

## Avant de signaler un problème MCP

Vérifiez que votre client prend en charge MCP à distance via Streamable HTTP, le flux de code d’autorisation OAuth 2.1 avec PKCE et l’enregistrement dynamique des clients. Utilisez exactement le point d’accès universel indiqué dans le [guide MCP](/fr/docs/mcp-connector/), puis rétablissez la connexion MCP et réessayez une fois. Si le problème persiste, envoyez les informations de diagnostic indiquées plus haut, sans données sensibles.
