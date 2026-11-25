/* Authentification locale.
   - Les mots de passe ne sont jamais stockés : seulement un hachage salé (PBKDF2-SHA256 via WebCrypto,
     ou un repli SHA-256 itéré si WebCrypto est indisponible).
   - Les comptes vivent dans ce navigateur (localStorage). Pour un vrai multi-appareils il faudrait un serveur ;
     toutes les fonctions ci-dessous sont asynchrones afin de pouvoir être branchées sur une API plus tard. */
const enc=new TextEncoder();
const b64=u8=>btoa(String.fromCharCode(...u8));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const rnd=n=>{const a=new Uint8Array(n);(window.crypto||{getRandomValues:x=>x.forEach((_,i)=>x[i]=Math.random()*256)}).getRandomValues(a);return a};

/* SHA-256 en JavaScript pur (repli) */
const sha256=(()=>{const P=[];for(let n=2;P.length<64;n++)if(P.every(p=>n%p))P.push(n);
const fr=x=>Math.floor((x-Math.floor(x))*4294967296),K=P.map(p=>fr(Math.cbrt(p))),H0=P.slice(0,8).map(p=>fr(Math.sqrt(p)));
const rr=(x,n)=>(x>>>n)|(x<<(32-n));
return bytes=>{const l=bytes.length,t=((l+9+63)>>6)<<6,m=new Uint8Array(t);m.set(bytes);m[l]=128;
const dv=new DataView(m.buffer);dv.setUint32(t-8,Math.floor(l*8/4294967296));dv.setUint32(t-4,(l*8)>>>0);
const h=H0.slice(),w=new Uint32Array(64);
for(let o=0;o<t;o+=64){for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);
for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rr(a,7)^rr(a,18)^(a>>>3))+w[i-7]+(rr(b,17)^rr(b,19)^(b>>>10)))>>>0}
let[a,b,c,d,e,f,g,k]=h;
for(let i=0;i<64;i++){const t1=(k+(rr(e,6)^rr(e,11)^rr(e,25))+((e&f)^(~e&g))+K[i]+w[i])>>>0,t2=((rr(a,2)^rr(a,13)^rr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
k=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}
[a,b,c,d,e,f,g,k].forEach((v,i)=>h[i]=(h[i]+v)>>>0)}
const out=new Uint8Array(32),ov=new DataView(out.buffer);h.forEach((v,i)=>ov.setUint32(i*4,v));return out}})();

const HAS_SUBTLE=!!(window.crypto&&crypto.subtle&&crypto.subtle.importKey);
async function hashSecret(secret,saltB64,algo){const salt=unb64(saltB64);
if(algo==='pbkdf2'&&HAS_SUBTLE){const k=await crypto.subtle.importKey('raw',enc.encode(secret),'PBKDF2',false,['deriveBits']);
return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:150000},k,256)))}
/* repli : SHA-256 itéré */
let cur=new Uint8Array([...salt,...enc.encode(secret)]);for(let i=0;i<20000;i++)cur=sha256(new Uint8Array([...cur,...salt]));return b64(cur)}
const bestAlgo=()=>HAS_SUBTLE?'pbkdf2':'sha256x';
const same=(a,b)=>{if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0};

/* Validation */
const normEmail=e=>String(e||'').trim().toLowerCase();
const okEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function pwdScore(p){let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/.test(p)&&/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return Math.min(4,Math.max(p?1:0,s-(p.length<8?1:0)))}
const PWD_LABEL=['','Faible','Moyen','Bon','Excellent'];
function checkPwd(p){if(p.length<8)return'Le mot de passe doit contenir au moins 8 caractères.';if(!/[A-Za-z]/.test(p)||!/\d/.test(p))return'Utilisez au moins une lettre et un chiffre.';return''}

/* Limitation des essais : 5 erreurs => blocage 30 s (par e-mail) */
const lockKey=e=>'dw-lock:'+e;
function lockLeft(e){const l=jget(LS.get(lockKey(e)),null);return l&&l.until>Date.now()?Math.ceil((l.until-Date.now())/1000):0}
function failed(e){const l=jget(LS.get(lockKey(e)),{n:0,until:0});l.n=(l.until&&l.until<Date.now()?0:l.n)+1;if(l.n>=5){l.until=Date.now()+30000;l.n=0}LS.set(lockKey(e),JSON.stringify(l))}

function recoveryCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=rnd(12);let s='';r.forEach((v,i)=>{s+=A[v%A.length];if(i%4==3&&i<11)s+='-'});return s}
const initials=n=>n.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const AV_COLORS=['#6d4fd1','#0f7b6c','#d6336c','#e8761b','#2563eb','#8a5a00'];

const Auth={
async register({name,email,password,school,importGuest}){
name=String(name||'').trim().replace(/\s+/g,' ');email=normEmail(email);
if(name.length<2)return{error:'Indiquez votre nom (2 caractères minimum).',field:'name'};
if(name.length>40)return{error:'Le nom est limité à 40 caractères.',field:'name'};
if(!okEmail(email))return{error:'Adresse e-mail invalide.',field:'email'};
school=String(school||'').trim().replace(/\s+/g,' ');if(school.length>80)return{error:'L’établissement est limité à 80 caractères.',field:'school'};
const pe=checkPwd(password);if(pe)return{error:pe,field:'password'};
if(DB.byEmail(email))return{error:'Un compte existe déjà avec cette adresse. Connectez-vous.',field:'email'};
const users=DB.users(),id='u'+Date.now().toString(36)+b64(rnd(4)).replace(/[^A-Za-z0-9]/g,''),algo=bestAlgo(),salt=b64(rnd(16)),rsalt=b64(rnd(16)),rc=recoveryCode();
const user={id,name,email,algo,salt,hash:await hashSecret(password,salt,algo),rsalt,rhash:await hashSecret(rc.replace(/-/g,''),rsalt,algo),color:AV_COLORS[Object.keys(users).length%AV_COLORS.length],school,created:Date.now(),role:Object.keys(users).length?'user':'admin'};
users[id]=user;if(!DB.saveUsers(users))return{error:'Création impossible : le stockage du navigateur est indisponible.'};
const d=importGuest?DB.loadData(null):newData();if(importGuest)DB.dropData(null);DB.saveData(id,d);
return{user,recovery:rc}},

async login({email,password,remember}){email=normEmail(email);
const wait=lockLeft(email);if(wait)return{error:'Trop d’essais. Réessayez dans '+wait+' s.'};
const u=DB.byEmail(email);
if(!u){await hashSecret(password||'x',b64(rnd(16)),bestAlgo());failed(email);return{error:'E-mail ou mot de passe incorrect.'}}
const h=await hashSecret(password,u.salt,u.algo);
if(!same(h,u.hash)){failed(email);return{error:'E-mail ou mot de passe incorrect.'}}
LS.del(lockKey(email));Auth.start(u,remember);return{user:u}},

start(u,remember){LS.del(K.acc);SS.del(K.acc);(remember?LS:SS).set(K.acc,u.id);U=u;useData(DB.loadData(u.id));VIS.touch()},
restore(){const id=LS.get(K.acc)||SS.get(K.acc),g=id&&String(id).startsWith('inv-'),u=id&&!g&&DB.byId(id);
if(u){U=u;useData(DB.loadData(u.id))}else{U=null;GID=g?id:newGuest();LS.set(K.acc,GID);claimLegacy();useData(DB.loadData(null))}VIS.touch()},
logout(){LS.del(K.acc);SS.del(K.acc);U=null;GID=newGuest();LS.set(K.acc,GID);useData(DB.loadData(null));VIS.touch()},

async reset({email,code,password}){email=normEmail(email);
const wait=lockLeft(email);if(wait)return{error:'Trop d’essais. Réessayez dans '+wait+' s.'};
const pe=checkPwd(password);if(pe)return{error:pe};
const users=DB.users(),u=Object.values(users).find(x=>x.email===email);
const c=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
if(!u||!same(await hashSecret(c,u.rsalt,u.algo),u.rhash)){failed(email);return{error:'E-mail ou code de récupération incorrect.'}}
const rc=recoveryCode(),salt=b64(rnd(16)),rsalt=b64(rnd(16)),algo=bestAlgo();
Object.assign(u,{algo,salt,hash:await hashSecret(password,salt,algo),rsalt,rhash:await hashSecret(rc.replace(/-/g,''),rsalt,algo)});
users[u.id]=u;DB.saveUsers(users);LS.del(lockKey(email));return{user:u,recovery:rc}},

async changePassword({current,password}){if(!U)return{error:'Vous n’êtes pas connecté.'};
if(!same(await hashSecret(current,U.salt,U.algo),U.hash))return{error:'Mot de passe actuel incorrect.',field:'current'};
const pe=checkPwd(password);if(pe)return{error:pe,field:'password'};
const salt=b64(rnd(16)),users=DB.users();U.salt=salt;U.hash=await hashSecret(password,salt,U.algo);
users[U.id]=U;DB.saveUsers(users);return{ok:true}},

updateChar(c){AV.set(uid(),c)},

updateProfile({name,color}){if(!U)return{error:'Vous n’êtes pas connecté.'};name=String(name||'').trim().replace(/\s+/g,' ');
if(name.length<2||name.length>40)return{error:'Le nom doit contenir entre 2 et 40 caractères.'};
const users=DB.users();U.name=name;if(color)U.color=color;users[U.id]=U;DB.saveUsers(users);return{ok:true}},

async remove(password){if(!U)return{error:'Vous n’êtes pas connecté.'};
if(!same(await hashSecret(password,U.salt,U.algo),U.hash))return{error:'Mot de passe incorrect.'};
const users=DB.users(),id=U.id;delete users[id];DB.saveUsers(users);DB.dropData(id);AV.del(id);VIS.drop(id);Auth.logout();return{ok:true}}};
