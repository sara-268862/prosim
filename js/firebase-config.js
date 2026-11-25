/* Configuration facultative de Firebase / Firestore.
   Laissez apiKey et projectId vides pour rester 100 % local (localStorage).
   Renseignez-les (Console Firebase > Paramètres du projet > Vos applications) pour activer la synchronisation
   des collections « visitors » et « suggestions ». Voir README, section « Firebase ». */
window.PROSIM_FIREBASE={apiKey:'',projectId:'',authDomain:'',appId:''};
/* Intégration iframe (Google Sites…) : origine de la page hôte autorisée à recevoir les données
   (ex. 'https://sites.google.com'). Vide = seuls PRO_SIM_READY / PRO_SIM_PONG / hauteur sont émis, sans données visiteurs.
   Peut aussi être fixée par l'adresse : index.html?target=https://sites.google.com */
window.PROSIM_EMBED={target:''};
