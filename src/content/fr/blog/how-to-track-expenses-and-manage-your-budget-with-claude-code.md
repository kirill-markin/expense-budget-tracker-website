---
title: "Suivre ses dépenses avec Claude Code : connexion, import et rapprochement"
description: "Connectez Claude Code à Expense Budget Tracker avec un seul lien, vérifiez et approuvez les écritures avant d’importer vos relevés, rapprochez les soldes et mettez à jour votre budget sans connexion bancaire."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "suivi des dépenses avec Claude Code"
  - "suivi des dépenses avec Claude"
  - "outil de suivi des dépenses pour Claude"
  - "suivi du budget avec Claude Code"
  - "connecter Claude à un outil de suivi des dépenses"
  - "importer un relevé bancaire avec Claude Code"
---

Le rapprochement d’un relevé de quatre lignes peut donner un écart de `€0.00` alors que le budget est faussé. Si vous classez un achat de 54,20 € au supermarché dans « Voyages » au lieu de « Courses », le solde du compte reste exact, tandis que les totaux des deux catégories varient de 54,20 €.

Pour suivre vos dépenses avec Claude Code, vérifiez deux choses. Les mouvements enregistrés doivent expliquer le solde bancaire, et les catégories doivent correspondre aux opérations vérifiées sur le relevé. Claude Code peut extraire les données du relevé, faire les calculs et appeler l’API. À vous de choisir le compte et les catégories, de vérifier les lignes proposées et d’approuver précisément les écritures à enregistrer.

Expense Budget Tracker ne se connecte pas directement à votre banque et ne propose pas d’interface pour importer le fichier de relevé dans ce parcours. Exportez vous-même le relevé, placez-le dans un dossier que Claude Code est autorisé à lire et transmettez uniquement les lignes approuvées via l’API pour agents hébergée. Si votre priorité est d’éviter un accès bancaire permanent, découvrez les [avantages et limites d’une application de budget sans connexion bancaire (en anglais)](/blog/budget-app-without-bank-linking/).

![Une restauratrice de mosaïques retire un carreau bleu mal placé d’une bande en terre cuite, à côté d’une balance en laiton en équilibre](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Connecter Claude Code avec un seul lien de découverte

Installez Claude Code et connectez-vous en suivant le [guide de démarrage officiel](https://code.claude.com/docs/fr/quickstart) d’Anthropic. La [référence de l’interface en ligne de commande](https://code.claude.com/docs/fr/cli-reference) explique comment fonctionnent les répertoires de travail et l’accès à d’autres fichiers.

Ouvrez `claude` dans le répertoire qui contient le relevé ou donnez-lui accès à ce répertoire par une méthode compatible avec votre configuration. Collez ensuite cette instruction.

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

Le [lien de découverte sur le domaine de l’application](https://app.expense-budget-tracker.com/api/agent) renvoie le document de découverte en vigueur. Il indique actuellement `https://api.expense-budget-tracker.com/v1/` comme base de l’API, ainsi que les URL d’authentification et des actions SQL. Collez le lien du domaine de l’application pour que Claude Code suive les URL renvoyées par le service, sans mémoriser la séquence interne.

L’inscription et la connexion suivent la même procédure de vérification par e-mail. Quand vous transmettez le code de vérification à 8 chiffres, Claude Code reçoit une clé `ApiKey` de longue durée. Approuvez un emplacement de stockage précis, comme un fichier de secrets exclu du suivi des versions. Ne mettez jamais la clé dans `CLAUDE.md` et ne l’enregistrez jamais dans un dépôt. Le [guide de configuration des agents IA](/fr/docs/agent-setup/) explique les étapes d’authentification et de sélection de l’espace de travail.

## Choisir entre l’API pour agents et MCP

Le suivi des dépenses avec Claude peut désigner deux intégrations. Cet article utilise Claude Code dans un terminal avec l’API pour agents. Claude et Claude Desktop peuvent utiliser le connecteur MCP distant hébergé.

| | Claude Code avec l’API pour agents | Claude ou Claude Desktop avec MCP |
|---|---|---|
| Usage | Travail dans le terminal avec des fichiers locaux accessibles et des requêtes HTTP directes | Conversations dans un client Claude compatible avec MCP |
| Point de départ | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Authentification | Code à usage unique reçu par e-mail, puis clé `ApiKey` de longue durée | OAuth dans le navigateur |
| Accès aux données | URL de découverte qui mènent aux points d’accès de lecture et d’écriture | Outil `sql_query` et, en option, `sql_execute` |
| Accès au relevé | Fichiers et répertoires accessibles à cette session de Claude Code | Le connecteur distant ne donne pas accès aux fichiers locaux |

Chaque intégration utilise ses propres identifiants d’accès. Pour l’application Claude sur le web ou sur ordinateur, suivez le [guide MCP de suivi des dépenses avec Claude (en anglais)](/blog/claude-expense-tracker-mcp-connector/). Si vous partez d’un fichier accessible à Claude Code, utilisez la procédure avec l’API pour agents décrite ci-dessous.

Gardez aussi deux points à l’esprit.

- Le fournisseur du modèle traite les données séparément de l’API et du stockage d’Expense Budget Tracker. Avant de partager un relevé, consultez la [documentation sur l’utilisation des données dans Claude Code](https://code.claude.com/docs/fr/data-usage) et les conditions du fournisseur configuré dans votre installation.
- La configuration locale Docker Compose du [guide d’auto-hébergement](/fr/docs/self-hosting/) démarre l’application web, le service d’authentification, la base de données et le processus de récupération des taux de change. L’API pour agents gérée utilisée ici n’en fait pas partie. Le dépôt propose un déploiement AWS distinct qui inclut l’API publique pour les agents et les programmes.

## Définir précisément le périmètre de l’import

Pour le premier essai, prenez un seul compte, une seule devise et une période de relevé clôturée. Un CSV est pratique, car ses lignes sont faciles à examiner. Pour tout autre format d’export, demandez d’abord à Claude Code de confirmer qu’il peut lire le fichier dans votre environnement et d’afficher les lignes qu’il en a extraites. L’extension seule ne suffit pas à vérifier la prise en charge.

Donnez ces six informations à Claude Code.

1. Le chemin local du relevé.
2. Le compte bancaire et le compte correspondant dans Expense Budget Tracker.
3. La devise du compte.
4. Les dates de comptabilisation de la première et de la dernière opération.
5. Le solde d’ouverture ou le dernier solde vérifié.
6. Le solde de clôture indiqué sur le relevé.

Laissez de côté les transactions en attente jusqu’à leur comptabilisation. Conservez le fichier source tel quel et demandez à Claude Code de préparer un aperçu séparé.

Vous pouvez ajouter ces règles au fichier `CLAUDE.md` du répertoire où vous travaillez sur vos finances.

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Ajoutez les informations qui changent peu, comme les noms réels de vos comptes, vos règles de classement, votre convention pour les transferts et votre devise de référence. Reprenez les catégories de cet article uniquement si elles correspondent à celles de votre registre.

## Vérifier l’aperçu complet avant d’importer le relevé

Une fois la connexion établie, collez cette instruction et remplacez les valeurs entre crochets.

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Les opérations sur la base restent en lecture seule jusqu’à votre approbation. Claude Code doit consulter le schéma en vigueur pour trouver les noms de colonnes, repérer le compte correspondant et interroger les lignes déjà enregistrées sur la même période. Deux achats distincts peuvent avoir la même date et le même montant. Vérifiez chaque doublon potentiel.

### Un exemple à quatre lignes

Supposons qu’un relevé de compte courant indique un solde d’ouverture de 1 250,00 € et quatre opérations comptabilisées.

| Ligne | Date de comptabilisation | Libellé | Montant signé | Type proposé | Catégorie proposée | À vérifier |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Salaire | +2 000,00 € | Revenu | Salaire | Rien à signaler |
| 2 | 2026-09-02 | Supermarché | −54,20 € | Dépense | Courses | Vérifier le commerçant si le nom est inconnu |
| 3 | 2026-09-03 | Virement vers l’épargne | −300,00 € | Transfert | — | Confirmer l’autre compte |
| 4 | 2026-09-04 | Café | −8,40 € | Dépense | Restauration | Rien à signaler |

La somme des quatre montants signés est de `+€1,637.40`. En l’ajoutant au solde d’ouverture de `€1,250.00`, on obtient un solde de clôture attendu de `€2,887.40`. Cet exemple tient sur un écran. Même pour un import plus long, l’aperçu doit reprendre chaque ligne source et signaler chaque incertitude.

Confirmez le compte de destination du transfert. Un mouvement entre vos propres comptes ne constitue pas une dépense. Conservez également le type réel des remboursements, qu’il s’agisse d’un remboursement d’achat ou d’un remboursement de frais. Si une catégorie est incertaine, marquez-la comme telle jusqu’à ce que vous puissiez trancher.

### Approuver précisément les modifications à appliquer

Vérifiez l’espace de travail, le compte, les dates, le nombre de lignes, le total signé, les doublons possibles et le classement des opérations. Approuvez l’aperçu et les instructions SQL exactes sur cette base. Une consigne générale comme « tout importer » ne définit pas les modifications à appliquer.

L’API pour agents sépare la lecture de l’écriture. Claude Code utilise l’action de lecture indiquée par le service pour une instruction `SELECT` ou `WITH ... SELECT`, puis l’action d’écriture pour une instruction `INSERT`, `UPDATE` ou `DELETE` explicitement approuvée. Le schéma en vigueur fait foi pour les tables et les colonnes. La [référence de l’API](/fr/docs/api/) détaille les règles SQL et les limites.

### Tester les insertions et mises à jour volumineuses avant le traitement par lots

Pour une instruction `INSERT` ou `UPDATE` de grande taille, le document de découverte en vigueur demande d’abord une requête d’essai de structure SQL identique. Pour un `INSERT`, utilisez 1 à 3 lignes dont les valeurs figurent directement dans l’instruction. Pour un `UPDATE`, ciblez une seule ligne. Votre approbation couvre l’essai et les autres lignes comprises dans les modifications vérifiées.

Si l’essai réussit, Claude Code doit enchaîner immédiatement avec des lots successifs de 100 enregistrements au maximum et vérifier chaque lot au fur et à mesure. Pour un import approuvé de 247 lignes, un essai de 3 lignes laisse trois lots de 100, 100 et 44 lignes. Demandez une nouvelle approbation si le périmètre change, qu’une nouvelle ambiguïté apparaît ou qu’une opération échoue. Les lots suivants déjà approuvés peuvent s’enchaîner.

Le SQL restreint ne prend pas en charge `ON CONFLICT`. Il faut donc traiter explicitement les doublons. Les résultats de lecture sont limités à 100 lignes. Claude Code doit consulter les métadonnées pour connaître le nombre de lignes et savoir si la réponse est tronquée. Il doit aussi calculer les totaux en SQL et répartir la vérification détaillée sur plusieurs requêtes ciblées qui trient les résultats. Pour vérifier tout l’import, il faut couvrir aussi les lignes omises d’une réponse tronquée.

### Relire les lignes enregistrées

Une réponse positive de l’API confirme l’exécution de la requête. Pour vérifier que chaque valeur enregistrée correspond à l’aperçu, interrogez à nouveau le compte sur la période concernée et comparez les éléments suivants.

- Le nombre de lignes insérées.
- Les dates, les montants signés et les devises.
- Le compte auquel chaque ligne est rattachée.
- Les types et catégories de transactions.
- Les doublons possibles.
- Les totaux par lot et celui du relevé complet.

En cas d’écart, reprenez le diagnostic en lecture seule. Examinez une correction précise avant toute nouvelle écriture. Le [guide d’importation des relevés bancaires (en anglais)](/blog/how-to-import-bank-statements-into-an-expense-tracker/) détaille le traitement des périodes qui se chevauchent, des remboursements et des transferts.

## Rapprocher le solde et vérifier les catégories séparément

Le rapprochement consiste à vérifier que les mouvements enregistrés expliquent le solde de clôture de la banque sur la même période de comptabilisation.

Pour un compte de dépôt classique, le calcul est le suivant.

**solde de clôture attendu = solde d’ouverture + entrées comptabilisées − sorties comptabilisées**

Si les mouvements ont déjà un signe, utilisez cette formule.

**solde de clôture attendu = solde d’ouverture + somme des mouvements comptabilisés signés**

Les comptes de passif, comme les comptes de carte de crédit, peuvent suivre une autre convention de signe. Demandez à Claude Code d’indiquer celle qu’il a relevée avant de faire le calcul.

Poursuivez avec cette instruction.

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

Dans l’exemple à quatre lignes, `€1,250.00 + €1,637.40 = €2,887.40`. Si la banque indique elle aussi un solde de clôture de 2 887,40 €, l’écart est de `€0.00`.

Cet écart nul valide le calcul du solde sur la période choisie. Si vous déplacez l’achat de 54,20 € au supermarché de « Courses » à « Voyages », l’écart reste nul alors que les totaux de ces catégories varient de 54,20 €. La validation des catégories constitue donc une étape distincte.

Si l’écart est non nul, examinez le solde d’ouverture, les lignes manquantes ou en double, les transferts, les opérations en attente, les signes, les dates et les devises. N’ajoutez jamais de transaction fictive pour faire disparaître l’écart. Le [guide de rapprochement avec le solde bancaire (en anglais)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) détaille la démarche de diagnostic.

## Mettre à jour le budget après le rapprochement

Passez au budget après avoir relu les lignes enregistrées, rapproché le solde et vérifié que les totaux par catégorie sont cohérents. Claude Code peut comparer les revenus et dépenses réels aux montants prévus dans `budget_lines` et préparer des modifications. Un mois inhabituel ne suffit pas à fixer le budget du mois suivant.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Une grosse dépense peut être exceptionnelle. Un dépassement apparent peut venir d’un transfert ou d’un remboursement mal classé. Claude Code peut calculer les écarts et préparer le SQL. À vous de décider des montants pour le mois suivant.

## Garder le même ordre pour chaque relevé

Pour chaque relevé, suivez les étapes dans cet ordre.

1. Partez de `https://app.expense-budget-tracker.com/api/agent` et suivez les indications du document de découverte.
2. Chargez le contexte du compte utilisateur, confirmez l’espace de travail et consultez le schéma en vigueur.
3. Donnez à Claude Code un fichier de relevé accessible et précisez les soldes d’ouverture et de clôture.
4. Consultez les écritures comptables sur la même période et préparez l’aperçu complet de l’import.
5. Approuvez précisément les modifications à appliquer.
6. Pour une insertion volumineuse, faites un essai de 1 à 3 lignes, puis enchaînez les lots de 100 lignes au maximum.
7. Relisez les lignes de chaque lot enregistré et comparez-les à l’aperçu.
8. Rapprochez le solde du compte avec le solde de clôture indiqué par la banque sans créer d’écriture fictive d’équilibrage.
9. Vérifiez les totaux par catégorie même si l’écart de solde est nul.
10. Préparez, approuvez et vérifiez séparément toute modification des lignes budgétaires.

Commencez par un compte et une période clôturée. Une fois le compte rapproché et le budget vérifié, répétez la procédure pour le compte suivant. Claude Code se charge du travail répétitif sur les fichiers et l’API. Vous gardez la main sur chaque décision financière avant qu’elle ne modifie vos données.
