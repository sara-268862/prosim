/* Firebase Firestore (SDK modulaire 10.12.2, chargé à la demande) — facultatif.
   Collections : « visitors » (fiches visiteurs) et « suggestions » (propositions de métiers).
   Le stockage local reste la source de secours : toute erreur réseau laisse l'application fonctionner. */
const FB_VER='10.12.2',FB_CDN='https://www.gstatic.com/firebasejs/'+FB_VER+'/';
const Cloud=(()=>{const cfg=window.PROSIM_FIREBASE||{},on=!!(cfg.apiKey&&cfg.projectId);let fs=null,db=null,err='',last=0,loading=null;
const sent=()=>safeReadJSON('prosim_cloud_sent_v4',{});
function init(){if(!on)return Promise.resolve(null);if(db)return Promise.resolve(db);
return loading||(loading=(async()=>{try{const app=await import(FB_CDN+'firebase-app.js');fs=await import(FB_CDN+'firebase-firestore.js');
const a=app.getApps().length?app.getApp():app.initializeApp({apiKey:cfg.apiKey,projectId:cfg.projectId,authDomain:cfg.authDomain||undefined,appId:cfg.appId||undefined});
db=fs.getFirestore(a);err='';return db}catch(e){err=String(e&&e.message||e);loading=null;return null}})())}
const clean=o=>JSON.parse(JSON.stringify(o));
async function put(col,id,data){const d=await init();if(!d)return false;try{await fs.setDoc(fs.doc(d,col,String(id)),clean(data),{merge:true});last=Date.now();return true}catch(e){err=String(e&&e.message||e);return false}}
return{on,get error(){return err},get last(){return last},
visitor(r){return r?put('visitors',r.id,r):Promise.resolve(false)},
async suggestions(list){const s=sent(),todo=list.filter(x=>s[x.id]!==x.status);for(const x of todo){if(await put('suggestions',x.id,x)){s[x.id]=x.status;safeWriteJSON('prosim_cloud_sent_v4',s)}}},
/* Lecture : fusionne les données Firestore dans le stockage local (le plus récent l'emporte) pour alimenter l'administration */
async pull(){const d=await init();if(!d)return{ok:false,n:0};try{let n=0;
const vs=await fs.getDocs(fs.collection(d,'visitors')),va=VIS.all();vs.forEach(s=>{const r=s.data();if(r&&r.id&&(!va[r.id]||(r.last||0)>(va[r.id].last||0))){va[r.id]=Object.assign({},va[r.id],r);n++}});VIS.save(va);
const ss=await fs.getDocs(fs.collection(d,'suggestions')),sa=SUGS.all(),by=Object.fromEntries(sa.map(x=>[x.id,x])),sn=sent();
ss.forEach(s=>{const x=s.data();if(x&&x.id){if(!by[x.id]){sa.push(x);n++}else if(x.status!==by[x.id].status&&x.upd>(by[x.id].upd||0)){by[x.id].status=x.status;n++}sn[x.id]=x.status}});
SUGS.save(sa.slice(-500));safeWriteJSON('prosim_cloud_sent_v4',sn);last=Date.now();err='';return{ok:true,n}}catch(e){err=String(e&&e.message||e);return{ok:false,n:0}}}}})();
/* Branchement : chaque mise à jour locale est répercutée sur Firestore (en arrière-plan) */
if(Cloud.on){let lt=0;const t0=VIS.touch;VIS.touch=function(){const r=t0.apply(this,arguments);if(Date.now()-lt>15000){lt=Date.now();Cloud.visitor(VIS.all()[uid()])}return r};
const s0=SUGS.save;SUGS.save=function(a){const r=s0.call(this,a);Cloud.suggestions(a);return r}}
