/* Communication avec la page hôte quand ProSim est intégré en iframe (Google Sites…).
   Reçoit : PRO_SIM_PING → répond PRO_SIM_PONG.   Émet : PRO_SIM_READY, PRO_SIM_HEIGHT,
   et, seulement si une cible est configurée : VISITOR_SYNC, SUGGESTION_SYNC.
   Cible : PROSIM_EMBED.target (firebase-config.js) ou ?target=… dans l'adresse. */
const Embed=(()=>{const inFrame=(()=>{try{return window.parent!==window}catch(e){return true}})();
const norm=u=>{try{return u?new URL(u).origin:''}catch(e){return''}};
const target=norm(new URLSearchParams(location.search).get('target')||(window.PROSIM_EMBED||{}).target);
let learned='';
const post=(type,data,sensitive)=>{if(!inFrame)return;const to=target||(sensitive?'':learned||'*');if(!to)return;try{window.parent.postMessage(Object.assign({source:'prosim',type},data||{}),to)}catch(e){}};
if(inFrame){document.documentElement.classList.add('embedded');
addEventListener('message',e=>{const d=e.data;if(!d||d.type!=='PRO_SIM_PING')return;if(target&&e.origin!==target)return;if(!target)learned=e.origin&&e.origin!=='null'?e.origin:'';
try{e.source.postMessage({source:'prosim',type:'PRO_SIM_PONG',version:4,id:d.id},target||(e.origin&&e.origin!=='null'?e.origin:'*'))}catch(x){}});
let h=0;const sendH=()=>{const n=Math.ceil(document.documentElement.scrollHeight);if(n!==h){h=n;post('PRO_SIM_HEIGHT',{height:n})}};
addEventListener('load',()=>{post('PRO_SIM_READY',{height:document.documentElement.scrollHeight});sendH()});
addEventListener('resize',sendH);if('ResizeObserver' in window)new ResizeObserver(sendH).observe(document.body);}
/* VISITOR_SYNC / SUGGESTION_SYNC : données personnelles, envoyées uniquement vers la cible configurée */
const t0=VIS.touch;VIS.touch=function(){const r=t0.apply(this,arguments);post('VISITOR_SYNC',{visitor:VIS.all()[uid()]},true);return r};
const s0=SUGS.save;let seen=new Set(SUGS.all().map(x=>x.id+x.status));
SUGS.save=function(a){const r=s0.call(this,a);const n=a.filter(x=>!seen.has(x.id+x.status));n.forEach(x=>seen.add(x.id+x.status));if(n.length)post('SUGGESTION_SYNC',{suggestions:n},true);return r};
return{inFrame,target,post}})();
