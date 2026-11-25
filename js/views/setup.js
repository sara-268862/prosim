function setup(){const f=F[cur];let dg=S&&S.cfg&&!S.cfg.mode?S.cfg.diff:'deb';if(!unlocked(cur,dg))dg='deb';
const draw=()=>{const rq=reqs(cur,dg),ok=rq.every(r=>r.ok),n=need(dg),miss=canPay(dg),gMax=Math.round(n.fee*1.8);
const tier=d=>{const lk=!unlocked(cur,d);return `<button class="tier ${d===dg?'on':''} ${lk?'lk':''}" data-v="${d}" aria-pressed="${d===dg}"><span>${lk?'🔒':bestLv(f.n,d)>=NEED?'✅':'▶'}</span><b>${LN[d]}</b><small>${lk?'Verrouillé':bestLv(f.n,d)?'Meilleur : '+bestLv(f.n,d)+'/100':'À tenter'}</small></button>`};
app.innerHTML=`<div class="top"><div style="color:${f.col}">${scene(cur,f.col)}</div><div><h2>${f.n}</h2><p class="muted" style="margin:0 0 6px">${f.ro}</p><div class="panel memo"><small>Note de service</small><p style="margin:4px 0 0">${f.ctx}</p></div></div></div>
<div class="panel"><h3>Parcours · niveau de difficulté</h3><div class="tiers">${TIERS.map(tier).join('')}</div><p class="muted">${LV[dg]}</p>
${dg==='deb'?'':`<div class="rq"><b>${ok?'Niveau débloqué ✔':'Conditions pour débloquer ce niveau'}</b>${rq.map(r=>`<div class="${r.ok?'ok':''}"><span>${r.ok?'✔':'○'}</span> ${r.t} <small class="muted">(${Math.min(r.v,r.max||100)}/${r.max||NEED})</small></div>`).join('')}</div>`}
<div class="costs"><span>💰 ${n.fee} €</span><span>⏳ ${n.h} h</span><span>⚡ ${n.en}</span><span class="muted">Gain possible : jusqu’à ~${gMax} €</span></div>
${miss.length&&ok?`<p class="err">Impossible pour le moment : ${miss.join(', ')}. Ouvrez votre planning (barre en haut) pour vous reposer ou terminer la journée.</p>`:''}
<p style="margin-top:18px"><button class="btn" id="st" ${ok&&!miss.length?'':'disabled'}>${ok?'Lancer la simulation':'Niveau verrouillé'}</button></p></div>`;
$('.tiers').onclick=e=>{const b=e.target.closest('.tier');if(b){dg=b.dataset.v;draw()}};
$('#st').onclick=()=>{if(!unlocked(cur,dg)||canPay(dg).length)return;spend(dg);ctx();const rs=rounds(f,dg);S={cfg:{diff:dg},v:f.m.map(x=>x[2]),i:0,n:rs.length,rs,sc:[0,0,0,0],log:[],r:null,streak:0,pts:0};nav('play')}};draw()}
