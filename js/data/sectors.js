/* PRO SIM – 6 secteurs, 35 métiers. Métier : [intitulé, objet du travail, interlocuteur clé] */
const SECT=[
{n:'Finance, Audit et Comptabilité',col:'#6d4fd1',ic:'📊',j:[
['Auditeur financier et commissaire aux comptes','le dossier d’audit','le directeur financier'],
['Contrôleur de gestion industriel','le tableau de bord de gestion','le directeur d’usine'],
['Analyste crédit Corporate et financement','le dossier de crédit','le comité des engagements'],
['Fiscaliste d’entreprise et conformité DGI','la déclaration fiscale','l’inspecteur de la DGI'],
['Trésorier international et gestion des changes','le plan de trésorerie','la banque partenaire'],
['Expert-comptable et conseil financier PME','la clôture des comptes de la PME','le dirigeant de la PME']]},
{n:'Commerce, Marketing et Vente',col:'#e8761b',ic:'🛒',j:[
['Responsable export et commerce international','le contrat d’exportation','l’importateur étranger'],
['Chef de produit grande consommation (FMCG)','le lancement du produit','le directeur marketing'],
['Key Account Manager B2B et grands comptes','le compte stratégique','le directeur des achats du client'],
['Responsable marketing digital et acquisition','la campagne d’acquisition','le directeur commercial'],
['Responsable Trade Marketing et réseau de détail','le plan de merchandising','le distributeur'],
['Brand Manager et communication Corporate','la plateforme de marque','le directeur de la communication']]},
{n:'Supply Chain, Logistique et Achats',col:'#0e7490',ic:'🚢',j:[
['Responsable transit et douane Tanger Med','la déclaration en douane','le transporteur'],
['Demand & Supply Chain Planner (S&OP)','le plan S&OP','le directeur des opérations'],
['Responsable entrepôt et logistique WMS','l’entrepôt','le chef d’équipe logistique'],
['Acheteur industriel et sourcing local','le cahier des charges d’achat','le fournisseur local'],
['Coordinateur transport multimodal et frigorifique','la chaîne de transport frigorifique','le transporteur'],
['Ingénieur flux et amélioration continue Lean','le flux de production','le responsable de ligne']]},
{n:'Droit, Juridique et Conformité',col:'#8a5a00',ic:'⚖️',j:[
['Juriste d’affaires et droit des sociétés','le dossier juridique','le conseil d’administration'],
['Responsable conformité et LBC-FT','le dispositif de conformité','le comité de conformité'],
['Délégué à la protection des données (Loi 09-08)','le registre des traitements de données','la direction générale'],
['Juriste marchés publics et réglementation','le dossier d’appel d’offres','le maître d’ouvrage'],
['Juriste droit social et relations collectives','le dossier social','les représentants du personnel'],
['Spécialiste arbitrage commercial et CIMAC','le dossier d’arbitrage','le tribunal arbitral']]},
{n:'Économie, Conseil et Stratégie',col:'#1fa97a',ic:'🌍',j:[
['Consultant en stratégie et transformation','la mission de transformation','le comité de direction'],
['Responsable RSE et décarbonation ESG','le plan de décarbonation','le comité RSE'],
['Économiste et analyste conjoncture sectorielle','la note de conjoncture','la direction de la stratégie'],
['Directeur développement Afrique et partenariats','le projet de partenariat','le partenaire africain'],
['Consultant intégration ERP et digitalisation PME','le projet ERP','le dirigeant de la PME'],
['Manager Qualité, Sécurité et Environnement (QSE)','le système de management QSE','l’auditeur de certification']]},
{n:'Santé, Technologie et Management',col:'#d6336c',ic:'💡',j:[
['Directeur de projet et PMO grands programmes','le portefeuille de projets','le comité de pilotage'],
['Directeur des ressources humaines et talents','le plan de gestion des talents','le comité de direction'],
['Data Analyst et Business Intelligence','le tableau de bord BI','la direction commerciale'],
['Product Owner Fintech et paiement mobile','le produit de paiement mobile','la banque partenaire'],
['Responsable sécurité des systèmes d’information et résilience numérique','le plan de résilience numérique','la direction générale']]}];
