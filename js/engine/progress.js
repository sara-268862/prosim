/* Progression : XP, série quotidienne, badges, défi du jour, révision des erreurs */
const BADGES=[
{id:'first',n:'Première mission',d:'Terminer une mission.',i:'🚀',t:()=>D.hist.length>=1},
{id:'ten',n:'Habitué',d:'Terminer 10 missions.',i:'📚',t:()=>D.hist.length>=10},
{id:'thirty',n:'Infatigable',d:'Terminer 30 missions.',i:'🏋️',t:()=>D.hist.length>=30},
{id:'perfect',n:'Sans faute',d:'Obtenir 100/100 à une mission.',i:'🎯',t:c=>c.total>=100},
{id:'solid',n:'Solide',d:'Obtenir au moins 80/100.',i:'⭐',t:c=>c.total>=80},
{id:'hard',n:'Esprit d’acier',d:'Réussir (70+) une mission en niveau Difficile.',i:'🛡️',t:c=>c.diff==='hard'&&!c.mode&&c.total>=70},
{id:'four',n:'Curieux',d:'Essayer 4 spécialités.',i:'🧭',t:()=>F.filter(f=>D.hist.some(h=>h.f===f.n)).length>=4},
{id:'all',n:'Touche-à-tout',d:'Essayer les 8 spécialités.',i:'🌍',t:()=>F.every(f=>D.hist.some(h=>h.f===f.n))},
{id:'s3',n:'Régulier',d:'3 jours d’activité d’affilée.',i:'🔥',t:()=>D.bestStreak>=3},
{id:'s7',n:'Assidu',d:'7 jours d’activité d’affilée.',i:'🏆',t:()=>D.bestStreak>=7},
{id:'daily',n:'Rendez-vous du jour',d:'Terminer un défi du jour.',i:'📅',t:c=>c.mode==='daily'},
{id:'fix',n:'Je progresse',d:'Corriger 10 erreurs en révision.',i:'✅',t:()=>D.fixed>=10},
{id:'l5',n:'Niveau 5',d:'Atteindre le niveau 5.',i:'🎖️',t:()=>lvlOf(D.xp)>=5}];
function unlock(c){const nb=[];BADGES.forEach(b=>{if(!D.badges[b.id]&&b.t(c)){D.badges[b.id]=Date.now();nb.push(b)}});return nb}

/* Série de jours consécutifs */
function bumpStreak(){const t=ymd(),y=ymd(new Date(Date.now()-864e5));if(D.lastDay===t)return;D.streak=D.lastDay===y?D.streak+1:1;D.lastDay=t;D.bestStreak=Math.max(D.bestStreak,D.streak)}
const streakNow=()=>{const t=ymd(),y=ymd(new Date(Date.now()-864e5));return D.lastDay===t||D.lastDay===y?D.streak:0};

/* Défi du jour : mêmes 5 questions pour tout le monde à une date donnée */
function seeded(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const dailyDone=()=>D.daily.date===ymd();
function dailyRounds(){const r=seeded('dw'+ymd()),idx=shuf(F.map((_,i)=>i),r).slice(0,5);
return idx.map((fi,k)=>{const n=BANK[F[fi].n].int.length;return mkq(fi,'int',Math.floor(r()*n),'Défi '+(k+1)+' sur 5 · '+F[fi].n)})}
function reviewRounds(){const L=D.errors.slice(0,10);return L.map((e,k)=>mkq(e.fi,e.dg,e.j,'Révision '+(k+1)+' sur '+L.length+' · '+F[e.fi].n))}
function noteError(r,ok,mode){const k=D.errors.findIndex(e=>e.fi===r.fi&&e.dg===r.dg&&e.j===r.j);
if(!ok){if(k<0)D.errors.push({fi:r.fi,dg:r.dg,j:r.j,n:1,ts:Date.now()});else D.errors[k].n++}
else if(mode==='review'&&k>=0){D.errors.splice(k,1);D.fixed++}}

/* Meilleur score par spécialité et niveau */
const bestLv=(n,dg)=>Math.max(0,...hist.filter(h=>h.f===n&&h.diff===dg&&!h.mode).map(h=>h.total));

/* Lancer une série de questions préparée (défi du jour, révision) */
function startRun(cfg,rs){const m=canPay(cfg.mode);if(m.length)return toast('Impossible pour le moment : '+m.join(', ')+'.');spend(cfg.mode);ctx();S={cfg,v:[],i:0,n:rs.length,rs,sc:[0,0,0,0],log:[],r:null,streak:0,pts:0};nav('play')}
/* Jauge d'XP réutilisée sur l'accueil et le profil */
function xpBar(){const l=lvlOf(D.xp),into=lvlStart(l+1)-lvlStart(l),have=D.xp-lvlStart(l);
return `<div class="xp"><div class="row"><b>Niveau ${l} · ${rankOf(l)}</b><span class="muted">${D.xp} XP</span></div><div class="bar" role="progressbar" aria-label="Progression vers le niveau ${l+1}" aria-valuemin="0" aria-valuemax="${into}" aria-valuenow="${have}"><i style="width:${Math.round(have/into*100)}%"></i></div><small class="muted">${into-have} XP avant le niveau ${l+1}</small></div>`}
