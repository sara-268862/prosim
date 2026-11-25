/* Stockage : comptes, session et données de progression par utilisateur.
   Tout est local au navigateur (aucun serveur). Si localStorage est indisponible
   (navigation privée stricte), un repli en mémoire est utilisé pour la session. */
const LS=(()=>{const mem={};let ok=true;try{localStorage.setItem('dw-t','1');localStorage.removeItem('dw-t')}catch(e){ok=false}
return{ok,
get(k){try{return ok?localStorage.getItem(k):(k in mem?mem[k]:null)}catch(e){return null}},
set(k,v){try{if(ok)localStorage.setItem(k,v);else mem[k]=v;return true}catch(e){return false}},
del(k){try{if(ok)localStorage.removeItem(k);else delete mem[k]}catch(e){}},
keys(){try{return ok?Object.keys(localStorage):Object.keys(mem)}catch(e){return[]}}}})();
const SS=(()=>{const mem={};return{get(k){try{return sessionStorage.getItem(k)}catch(e){return k in mem?mem[k]:null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){mem[k]=v}},del(k){try{sessionStorage.removeItem(k)}catch(e){delete mem[k]}}}})();
const K={users:'prosim_users_v4',prog:'prosim_progress_v4',ava:'prosim_avatar_v4',acc:'prosim_account_v4',vis:'prosim_visitors_db_v4',sug:'prosim_suggestions_db_v4',pin:'prosim_admin_pin_v4'};
let GID=null;const newGuest=()=>'inv-'+Date.now().toString(36).slice(-4)+Math.random().toString(36).slice(2,6);
const jget=(s,d)=>{try{const v=JSON.parse(s);return v==null?d:v}catch(e){return d}};

/* Données par défaut d'un utilisateur */
const newData=()=>({hist:[],xp:0,streak:0,bestStreak:0,lastDay:'',badges:{},errors:[],fixed:0,daily:{date:'',total:0},ver:3});
const ymd=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');

const DB={
users(){return jget(LS.get(K.users),{})},
saveUsers(u){return LS.set(K.users,JSON.stringify(u))},
byEmail(e){const u=DB.users();return Object.values(u).find(x=>x.email===e)||null},
byId(id){return DB.users()[id]||null},
dataKey:id=>K.prog+':'+(id||GID),
loadData(id){const d=jget(LS.get(DB.dataKey(id)),null);return Object.assign(newData(),d||{})},
saveData(id,d){return LS.set(DB.dataKey(id),JSON.stringify(d))},
dropData(id){LS.del(DB.dataKey(id))}};
/* Avatar : une entrée par identifiant (compte ou invité) */
const AV={all:()=>jget(LS.get(K.ava),{}),get:id=>AV.all()[id],set(id,c){const a=AV.all();a[id]=c;LS.set(K.ava,JSON.stringify(a))},del(id){const a=AV.all();delete a[id];LS.set(K.ava,JSON.stringify(a))}};
const uid=()=>U?U.id:GID;

/* Utilisateur courant (U) et ses données (D). hist reste un alias de D.hist pour les anciennes vues. */
let U=null,D=newData(),hist=D.hist;
function useData(d){D=d;hist=D.hist}
function persist(){if(!DB.saveData(U?U.id:null,D))toast('Impossible d’enregistrer : stockage du navigateur indisponible.')}

/* Migration unique des anciennes clés (dw-*) vers les clés prosim_*_v4 */
(function migrate(){if(!LS.get(K.users)&&LS.get('dw-users')){const us=jget(LS.get('dw-users'),{}),av={};Object.values(us).forEach(u=>{if(u.char){av[u.id]=u.char;delete u.char}});LS.set(K.users,JSON.stringify(us));LS.set(K.ava,JSON.stringify(av));LS.del('dw-users')}
if(!LS.get(K.acc)&&LS.get('dw-session'))LS.set(K.acc,LS.get('dw-session'));LS.del('dw-session');
LS.keys().filter(k=>k.startsWith('dw-data:')&&k!=='dw-data:guest').forEach(k=>{LS.set(K.prog+':'+k.slice(8),LS.get(k));LS.del(k)})})();
/* Ancienne progression d'invité : reprise par le premier identifiant invité créé */
function claimLegacy(){const lg=LS.get('dw-data:guest'),old=jget(LS.get('dw-hist2'),null);if(lg){LS.set(DB.dataKey(null),lg);LS.del('dw-data:guest')}else if(Array.isArray(old)&&!LS.get(DB.dataKey(null))){const d=newData();d.hist=old;DB.saveData(null,d)}LS.del('dw-hist2')}

/* Niveaux, XP et titres */
const RANKS=['Stagiaire Terrain','Analyste Confirmé','Chef de Mission','Manager Senior','Directeur Exécutif'];
const lvlOf=xp=>Math.floor(Math.sqrt(xp/50))+1;
const lvlStart=l=>50*(l-1)*(l-1);
const rankOf=l=>RANKS[Math.min(RANKS.length,Math.max(1,l))-1];
