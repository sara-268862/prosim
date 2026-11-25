/* PRO SIM – écrans du simulateur professionnel : métiers, niveaux, simulation chronométrée, rapport */
let jcur=0,PS=null,pT=null;
const stopT=()=>{if(pT){clearInterval(pT);pT=null}};
const dots=(id,d=D)=>{const p=((d.pro||{}).jobs||{})[id];return[1,2,3,4,5].map(l=>{const b=p&&p.best[l];return`<i class="${b&&b.pass?'ok':b?'tr':''}" title="Niveau ${l}"></i>`}).join('')};
function proPanel(cta){const s=proStats();
return`<div class="panel prp"><div class="prh"><div><h3 style="margin:0">PRO SIM · Simulateur professionnel marocain</h3><p class="muted" style="margin:.3em 0 0">${JOBS.length} métiers, ${SECT.length} secteurs, ${PRO.lv} niveaux par métier, ${PRO.q} questions par niveau.</p></div>${cta?'<button class="btn" id="pj">Explorer les métiers</button>':''}</div>
<div class="pst"><div><b>${s.score}</b><small>Score total</small></div><div><b>${s.mastered}<em>/${JOBS.length}</em></b><small>Métiers maîtrisés</small></div><div><b>${s.levels}<em>/${JOBS.length*PRO.lv}</em></b><small>Niveaux réussis</small></div><div><b>${s.pct} %</b><small>Progression générale</small></div></div>
<div class="bar" role="progressbar" aria-label="Progression générale" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.pct}"><i style="width:${s.pct}%"></i></div></div>`}
let JF={q:'',s:-1};
const norm=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function jobList(){const q=norm(JF.q.trim());let n=0;
const h=SECT.map((s,si)=>{if(JF.s>=0&&JF.s!==si)return'';const L=JOBS.filter(j=>j.si===si&&(!q||norm(j.n).includes(q)));if(!L.length)return'';n+=L.length;
return`<h3 class="sech" style="--f:${s.col}">${s.ic} ${s.n} <span class="pill">${L.length} métiers</span></h3><div class="jg">${L.map(j=>{const p=((D.pro||{}).jobs||{})[j.id],m=jobMastered(j.id);return`<button class="jc" style="--f:${s.col}" data-j="${j.id}"><b>${esc(j.n)}</b><span class="dots">${dots(j.id)}</span><small class="muted">${m?'Métier maîtrisé ✔':'Niveau '+(p?p.lv:1)+' débloqué'}</small></button>`}).join('')}</div>`}).join('');
return h||'<p class="muted">Aucun métier ne correspond à votre recherche.</p>'}
function wireJobs(){document.querySelectorAll('.jc').forEach(b=>b.onclick=()=>{jcur=+b.dataset.j;nav('jobup')})}
function jobs(){app.innerHTML=`<h2>Métiers</h2><p class="muted">Choisissez un métier : cinq niveaux à débloquer, de Fondamentaux Terrain à Direction et Crise. <button class="lnk" data-go="suggest">Un métier manque ? Proposez-le.</button></p>${proPanel()}
<div class="jflt"><input id="jq" type="search" placeholder="Rechercher un métier…" aria-label="Rechercher un métier" value="${esc(JF.q)}" autocomplete="off"><div class="chips" role="group" aria-label="Filtrer par secteur"><button class="chip ${JF.s<0?'on':''}" data-s="-1" aria-pressed="${JF.s<0}">Tous les secteurs</button>${SECT.map((s,i)=>`<button class="chip ${JF.s===i?'on':''}" data-s="${i}" style="--f:${s.col}" aria-pressed="${JF.s===i}">${s.ic} ${s.n}</button>`).join('')}</div></div><div id="jl" aria-live="polite">${jobList()}</div>`;
const upd=()=>{$('#jl').innerHTML=jobList();wireJobs()};
$('#jq').oninput=e=>{JF.q=e.target.value;upd()};
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{JF.s=+c.dataset.s;document.querySelectorAll('.chip').forEach(x=>{const on=+x.dataset.s===JF.s;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});upd()});wireJobs()}
function jobup(){const j=JOBS[jcur],s=SECT[j.si],p=jp(j.id),m=jobMastered(j.id);VIS.touch({job:j.n});app.style.setProperty('--acc',s.col);
app.innerHTML=`<p><button class="btn ghost sm" data-go="jobs">← Tous les métiers</button></p><div class="panel jh" style="--f:${s.col}"><span class="avl">${avatar(U,'xl')}</span><div><span class="pill" style="background:${s.col}22;color:${s.col}">${s.ic} ${s.n}</span><h2 style="margin:.3em 0">${esc(j.n)}</h2><p class="muted" style="margin:0">${m?'Métier maîtrisé : les cinq niveaux sont réussis.':'Réussissez un niveau (au moins '+PRO.pass+' bonnes réponses sur '+PRO.q+') pour débloquer le suivant.'}</p></div></div>
<div class="panel"><h3>Règles</h3><p class="muted" style="margin:0">${PRO.q} questions par niveau · 4 propositions · ${PRO.t} secondes par question · bonne réponse +${PRO.ok} points · mauvaise réponse ou temps écoulé ${PRO.ko} points · réussite à ${PRO.pass}/${PRO.q}. Chaque réponse est corrigée et expliquée.</p></div>
${loadRun(j.id)?`<div class="panel rsm"><div><b>Niveau ${loadRun(j.id).lv} en cours</b><p class="muted" style="margin:.2em 0 0">Question ${loadRun(j.id).i+1} / ${PRO.q} · sauvegarde automatique</p></div><button class="btn sm" id="rsb">Reprendre</button></div>`:''}<div class="jls">${PL.map((l,k)=>{const lv=k+1,lk=lv>p.lv,b=p.best[lv];return`<div class="jl ${lk?'lk':''}"><div><b>Niveau ${lv} · ${l.n}</b><p class="muted" style="margin:.2em 0">${l.d}</p><small>${b?`Meilleur score : ${b.score} pts · ${b.good}/${PRO.q} · ${b.pass?'✔ Réussi':'✘ Non réussi'}`:lk?'🔒 Réussissez le niveau précédent':'À tenter'}</small></div><button class="btn sm" data-l="${lv}" ${lk?'disabled':''}>${b?'Rejouer':'Commencer'}</button></div>`}).join('')}</div>`;
document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>proStart(jcur,+b.dataset.l));const rb=$('#rsb');if(rb)rb.onclick=()=>proResume(jcur)}
const RUNK=id=>'prosim_run_v4:'+(uid()||'x')+':'+id;
const saveRun=()=>{if(PS&&!PS.res)safeWriteJSON(RUNK(PS.id),{id:PS.id,lv:PS.lv,qs:PS.qs,i:PS.i,good:PS.good,bad:PS.bad,score:PS.score,log:PS.log,ts:Date.now()})};
const loadRun=id=>{const r=safeReadJSON(RUNK(id),null);return r&&r.id===id&&Array.isArray(r.qs)&&r.qs.length===PRO.q&&r.i<PRO.q&&r.lv<=jp(id).lv?r:null};
const dropRun=id=>LS.del(RUNK(id));
function proResume(id){const r=loadRun(id);if(!r)return;PS=Object.assign({},r,{res:null});nav('jplay')}
function proStart(id,lv){if(lv>jp(id).lv)return;dropRun(id);PS={id,lv,qs:proQs(JOBS[id],lv),i:0,good:0,bad:0,score:0,log:[],res:null};saveRun();nav('jplay')}
function jplay(){stopT();const j=JOBS[PS.id],s=SECT[j.si],q=PS.qs[PS.i],L=PL[PS.lv-1];PS.cur=q;PS.done=false;PS.dl=Date.now()+PRO.t*1000;app.style.setProperty('--acc',s.col);
app.innerHTML=`<div class="meters"><div class="m"><small>Question</small><strong>${PS.i+1} / ${PRO.q}</strong></div><div class="m"><small>Bonnes réponses</small><strong>${PS.good}</strong></div><div class="m"><small>Score</small><strong>${PS.score}</strong></div><div class="m"><small>Niveau ${PS.lv}</small><strong style="font-size:1rem">${L.n}</strong></div></div>
<div class="panel memo"><div class="ptim" id="pt"><span><b id="tm">${PRO.t}</b> s</span><div class="bar"><i id="tb" style="width:100%"></i></div></div><small>${esc(j.n)} · ${esc(q.cat)}</small>
<div class="talk"><div class="who">${avatar(U,'lg')}<b>${esc(U?U.name:'Vous')}</b>${esc(L.n)}</div><div class="bub"><small class="lb">Contexte</small><p class="sc">${esc(L.c)} ${esc(L.st)}</p><small class="lb">Scénario</small><p class="sc">${esc(q.s)}</p><small class="lb">Question</small>${esc(q.q)}</div></div>
<div class="opts" id="op">${q.o.map((o,i)=>`<button class="opt" data-i="${i}"><b>${esc(o.t)}</b></button>`).join('')}</div><p class="muted kb">Touches 1 à 4 pour répondre, Entrée pour continuer. Sans réponse en ${PRO.t} s, la réponse est comptée fausse.</p><div id="fbk" aria-live="polite"></div></div>`;
$('#op').onclick=e=>{const b=e.target.closest('.opt');if(b&&!b.disabled)jans(+b.dataset.i)};
pT=setInterval(()=>{if(!$('#tm')){stopT();return}const l=Math.max(0,(PS.dl-Date.now())/1000);$('#tm').textContent=Math.ceil(l);$('#tb').style.width=l/PRO.t*100+'%';$('#pt').classList.toggle('low',l<=8);if(l<=0)jans(-1)},200)}
function jans(i){if(!PS||PS.done)return;PS.done=true;stopT();const q=PS.cur,ok=i>=0&&!!q.o[i].ok,g=q.o.find(o=>o.ok).t;
PS.score+=ok?PRO.ok:PRO.ko;ok?PS.good++:PS.bad++;PS.log.push({cat:q.cat,s:q.s,pick:i>=0?q.o[i].t:null,good:g,ok,e:q.e});
document.querySelectorAll('.opt').forEach((b,k)=>{b.disabled=true;if(q.o[k].ok)b.classList.add('best');if(k===i)b.classList.add('pick')});sfx(ok?'ok':'bad');
const last=PS.i>=PRO.q-1;
$('#fbk').innerHTML=`<div class="fb"><b>${ok?'Bonne réponse : +'+PRO.ok+' points.':i<0?'Temps écoulé : réponse comptée fausse ('+PRO.ko+' points).':'Mauvaise réponse ('+PRO.ko+' points).'}</b>${ok?'':'<br><b>Bonne réponse :</b> '+esc(g)+'.'}<br><b>Explication :</b> ${esc(q.e)}</div><p><button class="btn" id="nx">${last?'Voir mon résultat':'Question suivante'}</button></p>`;
$('#nx').onclick=()=>{if(last)jfinish();else{PS.i++;saveRun();jplay();scrollTo(0,0)}};$('#nx').focus()}
function jfinish(){const p=jp(PS.id),lv=PS.lv,pass=PS.good>=PRO.pass,b=p.best[lv],first=pass&&!(b&&b.pass),ts=Date.now();
const rec={good:PS.good,score:PS.score,pass:pass||!!(b&&b.pass),ts};if(!b||PS.score>=b.score)p.best[lv]=rec;else if(pass&&!b.pass)p.best[lv]=Object.assign({},b,{pass:true});
p.last[lv]={good:PS.good,score:PS.score,pass,ts,ans:PS.log.map(x=>({c:x.cat,p:x.pick,ok:x.ok}))};
p.runs.push({lv,good:PS.good,score:PS.score,pass,ts});if(p.runs.length>60)p.runs.shift();
if(pass&&lv<PRO.lv&&p.lv<lv+1)p.lv=lv+1;
const xp=PS.good*4+(first?40:0);D.xp+=xp;if(first)bumpStreak();const nb=unlock({});
PS.res={pass,first,xp,mastered:jobMastered(PS.id),nb};dropRun(PS.id);persist();VIS.touch();renderHeader();nav('jrep');if(pass){sfx('win');confetti(first?180:110)}}
function jrep(){const j=JOBS[PS.id],s=SECT[j.si],r=PS.res,lv=PS.lv,L=PL[lv-1];app.style.setProperty('--acc',s.col);
app.innerHTML=`<div class="panel jrp ${r.pass?'win':''}"><span class="avl">${avatar(U,'xl')}</span><div><small class="muted">${esc(j.n)} · Niveau ${lv} · ${L.n}</small><h2 style="margin:.2em 0">${r.pass?(r.mastered?'Métier maîtrisé !':'Niveau réussi !'):'Niveau non validé'}</h2><p style="margin:0"><b>${PS.good}</b> bonnes réponses sur ${PRO.q} · score <b>${PS.score}</b> pts · seuil de réussite : ${PRO.pass}/${PRO.q}. +${r.xp} XP.</p>${r.pass&&lv<PRO.lv?`<p class="muted" style="margin:.4em 0 0">Niveau ${lv+1} débloqué.</p>`:''}${r.nb.length?`<p style="margin:.4em 0 0">Succès : ${r.nb.map(b=>b.i+' '+esc(b.n)).join(', ')}</p>`:''}</div></div>
<div class="row" style="margin:16px 0">${r.pass&&lv<PRO.lv?`<button class="btn" id="nl">Niveau ${lv+1}</button>`:''}<button class="btn ${r.pass&&lv<PRO.lv?'ghost':''}" id="rt">Rejouer ce niveau</button><button class="btn ghost" id="bj">Retour au métier</button></div>
<h3>Correction détaillée</h3>${PS.log.map((x,k)=>`<div class="panel rv ${x.ok?'ok':'ko'}"><small class="muted">${k+1}. ${esc(x.cat)}</small><p style="margin:.3em 0">${esc(x.s)}</p><p style="margin:.2em 0">${x.ok?'✔':'✘'} ${x.pick?'Votre réponse : '+esc(x.pick):'Aucune réponse dans le temps imparti'}</p>${x.ok?'':'<p style="margin:.2em 0"><b>Bonne réponse :</b> '+esc(x.good)+'</p>'}<p class="muted" style="margin:.2em 0">${esc(x.e)}</p></div>`).join('')}`;
const nl=$('#nl');if(nl)nl.onclick=()=>proStart(PS.id,lv+1);$('#rt').onclick=()=>proStart(PS.id,lv);$('#bj').onclick=()=>{jcur=PS.id;nav('jobup')}}
document.addEventListener('keydown',e=>{if(view!=='jplay'||!PS||e.ctrlKey||e.metaKey||e.altKey||$('#modal'))return;
if(/^[1-4]$/.test(e.key)){const b=document.querySelectorAll('.opt')[+e.key-1];if(b&&!b.disabled){e.preventDefault();b.click()}}
else if(e.key==='Enter'&&!e.target.closest('button,input,textarea,a,select')){const n=$('#nx');if(n){e.preventDefault();n.click()}}});
