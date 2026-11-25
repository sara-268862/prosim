function play(){const r=S.rs[S.i];if(r.fi!=null&&r.fi!==cur){cur=r.fi;col()}const f=F[cur],d=S.cfg.diff,sp=SPK[cur][r.sp??S.i];S.r=r;
let tw='';if(S.i==2&&!r.bk){const a=S.sc.reduce((x,y)=>x+y,0)/(S.i*40);tw=`<p class="tw"><b>Événement.</b> ${f.tw[a>=.65?0:1]}</p>`}
const mt=r.bk?BM():f.m.map((x,k)=>`<div class="m"><small>${x[0]}</small><strong>${S.v[k]}${x[1]}</strong></div>`).join('')+`<div class="m"><small>Décision</small><strong>${S.i+1} sur 3</strong></div>`;
app.innerHTML=`<div class="meters">${mt}</div><div class="panel memo"><small>${esc(r.t)}</small>${tw}<div class="talk"><div class="who">${av(cur,S.i,sp[2])}<b>${esc(sp[0])}</b>${esc(sp[1])}</div><div class="bub">${r.s?'<small class="lb">Scénario</small><p class="sc">'+esc(r.s)+'</p><small class="lb">Question</small>':''}${esc(r.q)}</div></div>${d=='deb'?'<div class="hint" style="display:block"><b>Pour comprendre :</b> '+esc(r.h)+'</div>':d=='int'?'<button class="btn ghost" id="hb">Afficher un indice</button><div class="hint" id="ht">'+esc(r.h)+'</div>':''}<div class="opts" id="op">${r.o.map((o,i)=>`<button class="opt" data-i="${i}"><b>${esc(o[0])}</b>${d=='deb'&&!r.bk?'<span>'+esc(o[1])+'</span>':''}</button>`).join('')}</div><p class="muted kb">Astuce : touches 1, 2, 3 pour répondre, Entrée pour continuer.</p><div id="fbk" aria-live="polite"></div></div>`;
if(d=='int')$('#hb').onclick=()=>{$('#ht').style.display='block'};
$('#op').onclick=e=>{const b=e.target.closest('.opt');if(b&&!b.disabled)choose(+b.dataset.i)}}
function choose(i){const f=F[cur],r=S.r,o=r.o[i],d=S.cfg.diff,hard=d=='hard';
o[2].forEach((d,k)=>S.v[k]=Math.max(0,S.v[k]+d));
const q=o[3].split('').map(n=>Math.max(0,parseInt(n,36)-(hard?1:0)));q.forEach((n,k)=>S.sc[k]+=n);
const sum=x=>x[3].split('').reduce((a,b)=>a+parseInt(b,36),0),bst=r.o.reduce((a,b)=>sum(b)>sum(a)?b:a);
S.log.push({t:r.t,pick:o[0],best:bst[0],ok:bst===o});if(r.bk){noteError(r,bst===o,S.cfg.mode);persist();renderHeader()}
document.querySelectorAll('.opt').forEach((b,k)=>{b.disabled=true;if(k===i)b.classList.add('pick');if(r.o[k]===bst)b.classList.add('best')});
const last=S.i>=S.n-1,sm=sum(o);sfx(sm>=26?'ok':sm<=14?'bad':'mid');S.pts+=sm>=26?10:sm<=14?0:4;S.streak=sm>=26?S.streak+1:0;
$('#fbk').innerHTML=`<div class="fb"><b>${sm>=26?'Excellent choix.':sm<=14?'Ce choix est une erreur.':'Ce n’est pas le choix le plus approprié.'}</b> ${bst===o?'<br><b>Explication :</b> '+esc(o[1]):(r.bk?'':'Votre choix : '+esc(o[1])+' ')+'<br><b>Bonne réponse :</b> '+esc(bst[0])+'.<br><b>Explication :</b> '+esc(bst[1])}</div>`+`<p><button class="btn" id="nx">${last?'Voir mon rapport':'Décision suivante'}</button></p>`;
$('#nx').onclick=()=>{if(last)finish();else{S.i++;play();scrollTo(0,0)}};$('#nx').focus()}
