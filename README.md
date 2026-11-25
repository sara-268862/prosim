# PRO SIM – Simulateur Professionnel Marocain

Plateforme de simulation et de formation professionnelle : simulations par métier, évaluations, progression, avatar personnalisable, gestion des utilisateurs et administration. Elle réunit le **simulateur de métiers marocains** (ci-dessous) et les **huit spécialités** historiques (reste du document).

## Rangs, comptes, suggestions, administration, stockage
- **Rangs** (`js/engine/rewards.js`) : Stagiaire Terrain, Analyste Confirmé, Chef de Mission, Manager Senior, Directeur Exécutif = niveaux d'XP 1 à 5 (seuils 0, 50, 200, 450, 800 XP). Niveau 1 : blazer, Smart Casual, hijab classique, coiffures courtes ; niveau 2 : costume gris, coiffures longues et attachées, hijab moderne ; niveau 3 : casque audio et pin's ; niveau 4 : tenue de direction dorée ; niveau 5 : maîtrise complète. Éléments verrouillés visibles (🔒) dans le studio d'avatar ; toast à chaque nouveau rang.
- **Accès** : connexion étudiant, création de compte étudiant (nom, e-mail, mot de passe, établissement facultatif), accès invité avec identifiant `inv-xxxx`, déconnexion. Le mot de passe (8 caractères minimum, lettres et chiffres) est haché PBKDF2 et jamais stocké en clair ; une adresse inconnue ne crée pas de compte.
- **Suggestions de métiers** (`js/views/suggest.js`) : nom, secteur, description ; auteur, date et statut « Nouveaux » enregistrés. Statuts : Nouveaux, À étudier, Validé.
- **Administration** (menu du compte, compte administrateur + **code PIN** choisi à la première ouverture, stocké haché ; 5 erreurs = blocage 30 s) : visiteurs, sessions, suggestions ; section visiteurs (recherche), section suggestions (filtre et changement de statut), comptes ; actualisation, export CSV (section affichée) et JSON (tout).
- **Stockage** (localStorage) : `prosim_progress_v4:<id>` (progression), `prosim_avatar_v4`, `prosim_account_v4` (compte ou invité courant), `prosim_users_v4`, `prosim_visitors_db_v4`, `prosim_suggestions_db_v4`, `prosim_admin_pin_v4`. Les anciennes clés `dw-*` sont migrées automatiquement.

## Intégrations et plateforme (modules ajoutés)
- **Firebase Firestore (facultatif)** – `js/firebase-config.js` + `js/core/cloud.js`. SDK 10.12.2 chargé à la demande. Renseignez `apiKey` et `projectId` pour activer l'enregistrement dans les collections `visitors` et `suggestions` ; le bouton « Actualiser » de l'administration **lit** aussi Firestore et fusionne dans l'affichage (le plus récent l'emporte). Le stockage local reste la solution de secours : une erreur réseau n'interrompt rien. Configuration vide = 100 % local. Attention : une clé web Firebase n'est pas un secret, c'est donc aux **règles de sécurité Firestore** de limiter lecture et écriture (à configurer côté Firebase, hors de ce code).
- **Google Sites / iframe** – `js/core/embed.js`. Réception de `PRO_SIM_PING` → réponse `PRO_SIM_PONG` ; émission de `PRO_SIM_READY` et `PRO_SIM_HEIGHT` (hauteur) ; `VISITOR_SYNC` et `SUGGESTION_SYNC` (données personnelles) uniquement vers la cible configurée (`PROSIM_EMBED.target` ou `?target=https://…`). Sans cible, seuls READY, PONG et la hauteur sont émis ; avec cible, les messages entrants d'une autre origine sont ignorés.
- **Sons** – Web Audio, sans fichier : bonne réponse, mauvaise réponse, réussite d'un niveau (`win`) ; interrupteurs Sons et Musique.
- **Langues** – `js/core/i18n.js` : français, anglais, espagnol (sélecteur dans l'en-tête, choix mémorisé). L'interface est traduite à l'affichage (dictionnaire + modèles). Les scénarios, questions et explications restent en français ; une phrase absente du dictionnaire s'affiche en français (à compléter dans `DICT`).
- **Recherche et filtres** – page Métiers : recherche sans accents et filtre par secteur.
- **Reprise automatique** – un niveau interrompu est sauvegardé à chaque question et proposé via « Reprendre » (page du métier).
- **Effets** – confettis à chaque niveau réussi (désactivés si « réduire les animations »), défilement fluide, `safeReadJSON` / `safeWriteJSON` (`js/core/safe.js`).
- **Synthèse** – panneau de l'accueil : 35 métiers, 6 secteurs, 175 niveaux, 2 625 questions, 3 langues, 5 rangs.

## Simulateur de métiers marocains
- **6 secteurs, 35 métiers** (`js/data/sectors.js`) : Finance, Audit et Comptabilité (6) · Commerce, Marketing et Vente (6) · Supply Chain, Logistique et Achats (6) · Droit, Juridique et Conformité (6) · Économie, Conseil et Stratégie (6) · Santé, Technologie et Management (5).
- **5 niveaux par métier** : Fondamentaux Terrain, Gestion Opérationnelle, Arbitrage et Conformité, Pilotage Stratégique, Direction et Crise → **175 niveaux**.
- **15 questions par niveau, 4 propositions, 30 s par question**, correction et explication après chaque réponse → **2 625 questions**. Les propositions sont mélangées à chaque tentative.
- **Génération** (`js/engine/career.js`) : 15 scénarios de base (écarts financiers, dérogation urgente, KPI incohérents, réglementation, incident critique, coût d'un contrat, signatures manquantes, négociation fournisseur, déploiement numérique, priorisation, retard de données, départ d'un collaborateur clé, ESG/énergie, défaut qualité, objectifs annuels) adaptés au métier et au niveau. Ce ne sont donc pas 2 625 questions rédigées une à une.
- **Notation** : bonne réponse +20, mauvaise réponse −10, temps écoulé = fausse (−10). Réussite : au moins **10 bonnes réponses sur 15**.
- **Progression** (`D.pro`, enregistrée par utilisateur) : niveau débloqué, niveaux réussis, réponses de la dernière tentative, score, historique par métier. Statistiques : score total, métiers maîtrisés (5 niveaux réussis), niveaux réussis, progression générale. Chaque niveau réussi rapporte de l'XP et débloque le suivant ; deux nouveaux succès ont été ajoutés.
- **Avatar** (`js/core/character.js`, `js/views/char.js`) : 6 teints, 6 couleurs de cheveux, 10 coiffures (dont hijab classique et moderne), 4 tenues, 4 accessoires, style aléatoire. Les anciens avatars sont convertis automatiquement.
- **Administration** (`js/views/admin.js`, menu du compte) : statistiques globales, activité par secteur, liste des utilisateurs, rôle administrateur, réinitialisation de progression, suppression, export CSV. Le premier compte créé est administrateur (sur une installation existante sans administrateur, le plus ancien compte).

## Nouveautés ProSim
- **Nouvelle identité** : nom ProSim, logo (`img/logo.png`), palette bleu nuit / turquoise / vert (`css/prosim.css`).
- **Personnage personnalisable** (`js/core/character.js`, `js/views/char.js`) : peau, coiffure, couleur des cheveux, yeux, sourcils, expression, pilosité, vêtement et couleur, accessoires, morphologie, âge, personnalité, ambition. Créé juste après l'inscription, modifiable via le menu du compte.
- **Budget / Temps / Énergie** (`js/core/economy.js`, barre en haut → planning) : chaque mission coûte de l'argent, des heures et de l'énergie ; les gains dépendent du score. 8 h par jour, énergie qui se régénère, repos, café, fin de journée (frais de vie 40 €), bonus « journée équilibrée ».
- **Niveaux interconnectés** : Intermédiaire = ≥ 70 en Débutant dans la spécialité + ≥ 60 en Débutant dans 1 autre ; Difficile = ≥ 70 en Intermédiaire + ≥ 60 en Intermédiaire dans 2 autres + niveau de carrière 3.


Ouvrez `index.html` dans un navigateur : aucun serveur n'est nécessaire.

## Nouveautés : comptes et plateforme
- **Inscription / connexion / déconnexion**, option « rester connecté », limitation des essais (5 erreurs = blocage 30 s).
- **Code de récupération** affiché une seule fois à l'inscription : permet de réinitialiser un mot de passe oublié.
- **Profil** : nom, couleur d'avatar, changement de mot de passe, export/import JSON de la progression, réinitialisation, suppression du compte.
- **XP, niveaux, titres, série quotidienne et 13 badges.**
- **Défi du jour** (5 questions identiques pour tous), **carnet de révision** (les questions ratées sont rejouables).
- **Tableau de bord** : courbe des scores, compétences, maîtrise par spécialité et niveau, conseils.
- **Certificats** imprimables (PDF) à partir de 70/100 par spécialité et niveau.
- **Classement** des comptes présents sur l'appareil, thème clair/sombre/auto, raccourcis clavier (1-2-3, Entrée), bouton Retour du navigateur.
- Le mode **sans compte** reste possible ; la progression d'invité peut être importée à l'inscription.

### Limite importante
Il n'y a pas de serveur : les comptes et données sont stockés dans le navigateur (localStorage) de l'appareil utilisé.
Un compte créé sur un ordinateur n'existe pas sur un autre (utiliser Export/Import pour déplacer sa progression).
Les mots de passe sont hachés (PBKDF2-SHA256, sel aléatoire) et jamais stockés en clair, mais une sécurité de niveau production
exige un vrai backend : `js/core/auth.js` et `js/core/store.js` sont isolés pour pouvoir être remplacés par des appels API.

## Structure
- `js/core/store.js` (comptes, session, données), `auth.js` (hachage, connexion…), `ui.js` (toasts, modales, thème, en-tête)
- `js/engine/progress.js` : XP, badges, série, défi du jour, révision
- `js/views/auth.js`, `profile.js`, `board.js`, `review.js` : nouveaux écrans
- `css/style.css` : styles et thèmes clair/sombre
- `js/core/` : outils, constantes, illustrations, audio, état
- `js/data/fields/` : une spécialité par fichier (rôle, contexte, décisions rapides)
- `js/data/banks/` : **une banque de scénarios par spécialité** (10 scénarios par niveau)
- `js/data/speakers.js`, `levels.js` : personnages et niveaux
- `js/engine/rounds.js` : transforme une banque en questions
- `js/views/` : écrans (accueil, spécialités, réglages, jeu, rapport, progression)

## Ajouter ou compléter une spécialité
1. Créer `js/data/banks/<nom>.js` avec `BANK['Nom exact de la spécialité']={deb:[...],int:[...],hard:[...]}`.
2. Chaque scénario : `[personnage, compétence, [scénario, question], meilleure option, option moyenne, mauvaise option, explication]`.
3. Ajouter la balise `<script>` dans `index.html`, après `controle-gestion.js` (déjà fait pour les 8 spécialités).

Les 8 banques sont complètes : 10 scénarios Débutant, 10 Intermédiaire et 10 Difficile par spécialité (240 au total).

## Pédagogie par niveau
- Débutant : indication « Pour comprendre » affichée dès le début.
- Intermédiaire : indice facultatif, affiché uniquement au clic.
- Difficile : aucun indice ni aide avant la réponse.
- Tous niveaux : bonne réponse et explication affichées après la validation.
