/* Navigation (avec adresses #…, retour du navigateur), boutons son/musique/thème, raccourcis clavier, démarrage */
const VIEWS={home,missions,dash,setup,play,report,login,register,recovery,recov,profile,board,review,char,jobs,jobup,jplay,jrep,admin,suggest};
const NAVMAP={char:'home',jobs:'jobs',suggest:'jobs',jobup:'jobs',jplay:'jobs',jrep:'jobs',home:'home',missions:'missions',setup:'missions',play:'missions',report:'missions',dash:'dash',review:'review',board:'board'};
let curHash='';
const live=()=>(view==='play'&&S&&!S.res)||(view==='jplay'&&PS&&!PS.res);
function nav(v,fromHash){
if(live()&&!['play','report','jplay','jrep'].includes(v)&&!fromHash&&!confirm(t(view==='jplay'?'Quitter le niveau en cours ? Il sera sauvegardé et vous pourrez le reprendre.':'Quitter la mission en cours ? Votre progression sur cette mission sera perdue.')))return;
stopT();
if((v==='play'&&!S)||(v==='report'&&!(S&&S.res))||(v==='jplay'&&!PS)||(v==='jrep'&&!(PS&&PS.res))||!VIEWS[v])v='home';
if(!F[cur])cur=0;
view=v;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===NAVMAP[v]));scrollTo(0,0);col();
if(!fromHash){const h='#'+v+(v==='setup'?'/'+cur:v==='jobup'?'/'+jcur:'');if(location.hash!==h){curHash=h;location.hash=h}}
VIEWS[v]();app.setAttribute('tabindex','-1');const h=app.querySelector('h1,h2');if(h&&v!=='play'){h.setAttribute('tabindex','-1')}}
function route(){const[v,a]=location.hash.slice(1).split('/');if(v==='setup')cur=Math.min(F.length-1,Math.max(0,+a||0));if(v==='jobup')jcur=Math.min(JOBS.length-1,Math.max(0,+a||0));curHash=location.hash;nav(VIEWS[v]?v:'home',true)}
addEventListener('hashchange',()=>{if(location.hash===curHash)return;
if(live()&&!confirm(t(view==='jplay'?'Quitter le niveau en cours ? Il sera sauvegardé et vous pourrez le reprendre.':'Quitter la mission en cours ? Votre progression sur cette mission sera perdue.'))){location.hash=curHash;return}route()});

document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>nav(b.dataset.v));
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;e.preventDefault();const mn=$('#mn');if(mn)mn.hidden=true;nav(b.dataset.go)});
document.addEventListener('keydown',e=>{if(view!=='play'||e.ctrlKey||e.metaKey||e.altKey||$('#modal'))return;
if(/^[1-3]$/.test(e.key)){const b=document.querySelectorAll('.opt')[+e.key-1];if(b&&!b.disabled){e.preventDefault();b.click()}}
else if(e.key==='Enter'&&!e.target.closest('button,input,textarea,a,select')){const n=$('#nx');if(n){e.preventDefault();n.click()}}});
$('#sfx').onclick=e=>{sfxOn=!sfxOn;e.target.classList.toggle('on',sfxOn);e.target.setAttribute('aria-pressed',sfxOn);if(sfxOn)sfx('ok')};$('#mus').onclick=e=>{music(!musOn);e.target.classList.toggle('on',musOn);e.target.setAttribute('aria-pressed',musOn)};
Auth.restore();initTheme();renderHeader();I18N.init();
if(!LS.ok)toast('Stockage du navigateur indisponible : comptes et progression ne seront pas conservés.');
location.hash&&VIEWS[location.hash.slice(1).split('/')[0]]?route():nav('home');
