/* ProSim – ressources : Budget, Temps, Énergie ; niveaux progressifs à débloquer */
const ECO={cost:{deb:50,int:100,hard:180},hrs:{deb:1,int:2,hard:3},en:{deb:15,int:25,hard:35},start:{budget:800,day:8},living:40,regen:20/3600000};
const SLOTS=[['mission','Missions','#1fa97a'],['training','Formation','#0e7490'],['rest','Repos','#e8761b']];
function eco(){let r=D.res;if(!r){r=D.res={budget:ECO.start.budget,energy:100,ts:Date.now(),day:ymd(),h:{mission:0,training:0,rest:0},gday:1,spent:0,earned:0,own:[]}}
if(!r.h)r.h={mission:0,training:0,rest:0};
const now=Date.now();r.energy=Math.min(100,r.energy+(now-r.ts)*ECO.regen);r.ts=now;
if(r.day!==ymd()){r.day=ymd();r.h={mission:0,training:0,rest:0};r.gday++;r.energy=Math.min(100,r.energy+50);const l=Math.min(r.budget,ECO.living);r.budget-=l;r.spent+=l;}
return r}
const hUsed=()=>{const h=eco().h;return h.mission+h.training+h.rest},hLeft=()=>Math.max(0,ECO.start.day-hUsed());
const eNow=()=>Math.floor(eco().energy);
/* Une mission peut-elle démarrer ? mode : 'deb'|'int'|'hard'|'daily'|'review' */
function need(m){const d=m==='daily'?'int':m==='review'?'deb':m;return{fee:m==='daily'||m==='review'?0:ECO.cost[d],h:m==='daily'||m==='review'?1:ECO.hrs[d],en:m==='daily'?15:m==='review'?10:ECO.en[d]}}
function canPay(m){const n=need(m),r=eco(),miss=[];if(r.budget<n.fee)miss.push('budget insuffisant ('+n.fee+' € requis)');if(hLeft()<n.h)miss.push('plus assez de temps ('+n.h+' h requises)');if(r.energy<n.en)miss.push('énergie insuffisante ('+n.en+' requis)');return miss}
function spend(m){const n=need(m),r=eco();r.budget-=n.fee;r.spent+=n.fee;r.energy-=n.en;r.h[m==='review'||m==='daily'?'training':'mission']+=n.h;persist();renderHud()}
/* Gains à la fin d'une mission : dépend du score ; fatigue = malus */
function payout(m,total){const n=need(m),r=eco(),tired=r.energy<25,f=m==='daily'?60+total:m==='review'?20+Math.round(total/2):Math.round(n.fee*(.3+total/100*1.5));const g=tired?Math.round(f*.85):f;r.budget+=g;r.earned+=g;persist();renderHud();return{gain:g,fee:n.fee,tired}}
function rest(){const r=eco();if(hLeft()<1)return toast('Plus de temps aujourd’hui : terminez la journée.');if(r.energy>=100)return toast('Vous êtes déjà en pleine forme.');r.h.rest+=1;r.energy=Math.min(100,r.energy+30);persist();renderHud();toast('Pause : +30 énergie, −1 h.')}
function coffee(){const r=eco();if(r.budget<15)return toast('Budget insuffisant.');r.budget-=15;r.spent+=15;r.energy=Math.min(100,r.energy+10);persist();renderHud();toast('Café : +10 énergie, −15 €.')}
function endDay(){const r=eco();r.day='';eco();r.day=ymd();persist();renderHud();toast('Nouvelle journée (jour '+r.gday+') : 8 h, +50 énergie, 40 € de frais de vie.')}
/* ---- Niveaux (parcours) : débloqués par les résultats réels ---- */
const NEED=70,SIDE=60,TIERS=['deb','int','hard'];
function reqs(fi,dg){const n=F[fi].n,o=[];if(dg==='deb')return o;const pv=dg==='int'?'deb':'int',own=bestLv(n,pv);
o.push({t:'Score ≥ '+NEED+' en '+LN[pv]+' · '+n,v:own,ok:own>=NEED});
const k=dg==='int'?1:2,side=F.filter((f,i)=>i!==fi&&bestLv(f.n,pv)>=SIDE).length;
o.push({t:'≥ '+SIDE+' en '+LN[pv]+' dans '+k+' autre'+(k>1?'s':'')+' spécialité'+(k>1?'s':'')+' (polyvalence)',v:side,max:k,ok:side>=k});
if(dg==='hard'){const l=lvlOf(D.xp);o.push({t:'Niveau de carrière ≥ 3',v:l,max:3,ok:l>=3})}
return o}
const unlocked=(fi,dg)=>reqs(fi,dg).every(r=>r.ok);
/* Rang de parcours global : 1 Découverte, 2 Praticien, 3 Expert */
function path(){const a=TIERS.map(d=>F.filter((f,i)=>bestLv(f.n,d)>=NEED).length);return a}
