/* Base des visiteurs (prosim_visitors_db_v4) : une fiche par compte ou invité */
const VIS={all:()=>jget(LS.get(K.vis),{}),save(v){LS.set(K.vis,JSON.stringify(v))},
drop(id){const a=VIS.all();delete a[id];VIS.save(a)},
touch(extra){const id=uid();if(!id)return;const a=VIS.all(),now=Date.now(),r=a[id]||(a[id]={id,first:now,sessions:0}),s=proStats();
Object.assign(r,{name:U?U.name:'Invité '+id.slice(4),type:U?(U.role==='admin'?'admin':'student'):'guest',school:U?(U.school||''):'',last:now,levels:s.levels,score:s.score,mastered:s.mastered},extra||{});
const k='prosim_sess:'+id;if(!SS.get(k)){SS.set(k,'1');r.sessions=(r.sessions||0)+1}VIS.save(a)},
/* Recalcule les fiches des comptes depuis leurs données (bouton « Actualiser ») */
sync(){const a=VIS.all(),us=DB.users();Object.values(us).forEach(u=>{const d=U&&u.id===U.id?D:DB.loadData(u.id),s=proStats(d),r=a[u.id]||(a[u.id]={id:u.id,first:u.created,sessions:0,last:u.created});
Object.assign(r,{name:u.name,type:u.role==='admin'?'admin':'student',school:u.school||'',levels:s.levels,score:s.score,mastered:s.mastered})});
Object.keys(a).forEach(id=>{if(!id.startsWith('inv-')&&!us[id])delete a[id]});VIS.save(a);return a}};
/* Suggestions de métiers (prosim_suggestions_db_v4) */
const SUGS={all:()=>jget(LS.get(K.sug),[]),save(a){return LS.set(K.sug,JSON.stringify(a))}};
const SST={new:'Nouveaux',study:'À étudier',ok:'Validé'};
