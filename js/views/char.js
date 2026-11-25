/* Éditeur de personnage + planning (Budget / Temps / Énergie) */
let CE=null,ceFirst=false;
function char(){const nm=U?U.name:'Invité '+GID.slice(4);
CE=CE||sanitizeChar(normChar(AV.get(uid())));
const sw=(k,arr)=>`<div class="sw2" data-k="${k}">${arr.map((c,i)=>`<button type="button" data-i="${i}" class="${CE[k]===i?'on':''}" style="background:${c}" aria-label="${k} ${i+1}"></button>`).join('')}</div>`;
const ch=(k,arr)=>`<div class="chp" data-k="${k}">${arr.map((c,i)=>{const n=lockLv(k,i),lk=n>myRank();return`<button type="button" data-i="${i}" class="${CE[k]===i?'on':''}${lk?' lk':''}" ${lk?'disabled title="Débloqué au niveau '+n+'"':''}>${c}${lk?' 🔒 Niv. '+n:''}</button>`}).join('')}</div>`;
const grp=(t,h)=>`<div class="cg"><h4>${t}</h4>${h}</div>`;
app.innerHTML=`<div class="chr"><div class="chv panel"><div id="pv" class="pvb">${charSvg(CE,230)}</div><h3 style="text-align:center;margin:.3em 0">${esc(nm)}</h3><p class="muted" style="text-align:center;margin:0">${CH.trait[CE.trait]} · ${CH.goal[CE.goal]}</p>
<div class="row" style="justify-content:center;margin-top:14px"><button class="btn ghost sm" id="rd">Style aléatoire</button><button class="btn" id="sv">${ceFirst?'Valider et commencer':'Enregistrer'}</button></div></div>
<div class="panel cfm"><h2>${ceFirst?'Créez votre personnage':'Mon personnage'}</h2><p class="muted">Il vous représente dans toutes vos simulations. Rang actuel : <b>${rankOf(myRank())}</b> (niveau ${myRank()}). Les éléments 🔒 se débloquent avec votre progression.</p>
${grp('Teint de peau',sw('skin',CH.skin))}${grp('Coiffure',ch('hair',CH.hair))}${grp('Couleur des cheveux (ou du hijab)',sw('hairC',CH.hairC))}
${grp('Yeux',sw('eyes',CH.eyes))}${grp('Sourcils',ch('brows',CH.brows))}${grp('Expression',ch('mouth',CH.mouth))}${grp('Pilosité',ch('beard',CH.beard))}
${grp('Tenue',ch('outfit',CH.outfit))}${grp('Accessoire',ch('acc',CH.acc))}
${grp('Morphologie',ch('build',['Fine','Moyenne','Large']))}${grp('Âge',ch('age',['Jeune','Adulte','Expérimenté']))}${grp('Personnalité',ch('trait',CH.trait))}${grp('Ambition',ch('goal',CH.goal))}</div></div>`;
const up=()=>{$('#pv').innerHTML=charSvg(CE,230);document.querySelectorAll('.chr [data-k]').forEach(g=>[...g.children].forEach((b,i)=>b.classList.toggle('on',CE[g.dataset.k]===i)));$('.chv h3+p').textContent=CH.trait[CE.trait]+' · '+CH.goal[CE.goal]};
$('.cfm').onclick=e=>{const b=e.target.closest('button'),g=b&&b.closest('[data-k]');if(!g)return;CE[g.dataset.k]=+b.dataset.i;up()};
$('#rd').onclick=()=>{randChar(CE);up()};
$('#sv').onclick=()=>{Auth.updateChar(sanitizeChar(CE));CE=null;const f=ceFirst;ceFirst=false;renderHeader();toast(f?'Bienvenue sur ProSim !':'Personnage enregistré.');nav('home')}}
/* Planning : répartition du temps + actions */
function renderHud(){const el=$('#hud');if(!el)return;const r=eco(),e=Math.floor(r.energy),h=hLeft(),tot=ECO.start.day,col=e<25?'#e8761b':'#1fa97a';
el.innerHTML=`<button class="hud wrap" id="hb2" aria-label="Ouvrir mon planning"><span class="hi"><b>💰 ${Math.round(r.budget)} €</b><small>Budget</small></span><span class="hi"><b>⏳ ${h} / ${tot} h</b><small>Temps · jour ${r.gday}</small></span><span class="hi en"><b>⚡ ${e} %</b><span class="bar"><i style="width:${e}%;background:${col}"></i></span></span></button>`;
$('#hb2').onclick=planning}
function planning(){const r=eco(),t=ECO.start.day;
const d=openModal(`<h3>Mon planning · jour ${r.gday}</h3><p class="muted">Répartissez vos ${t} h de la journée. Une journée équilibrée (missions, formation et repos) rapporte un bonus de motivation.</p>
<div class="stk">${SLOTS.map(s=>`<i style="flex:${r.h[s[0]]};background:${s[2]}" title="${s[1]}"></i>`).join('')}<i style="flex:${hLeft()};background:var(--line)"></i></div>
<div class="row" style="margin:6px 0 12px">${SLOTS.map(s=>`<span class="pill" style="background:${s[2]}22;color:${s[2]}">${s[1]} : ${r.h[s[0]]} h</span>`).join('')}<span class="pill">Libre : ${hLeft()} h</span></div>
<table><tr><td>Budget</td><td><b>${Math.round(r.budget)} €</b></td><td class="muted">gagné ${r.earned} € · dépensé ${r.spent} €</td></tr><tr><td>Énergie</td><td><b>${Math.floor(r.energy)} %</b></td><td class="muted">+20 %/h au repos naturel</td></tr></table>
<div class="row" style="margin-top:14px"><button class="btn sm" id="a1">Se reposer (1 h · +30 ⚡)</button><button class="btn ghost sm" id="a2">Café (15 € · +10 ⚡)</button><button class="btn ghost sm" id="a3">Terminer la journée</button></div>
<p class="muted" style="font-size:.85rem">Coûts d’une mission : Débutant 50 € · 1 h · 15 ⚡ — Intermédiaire 100 € · 2 h · 25 ⚡ — Difficile 180 € · 3 h · 35 ⚡. Vos gains dépendent de votre score ; fatigué (&lt; 25 ⚡) vous gagnez 15 % de moins.</p><button class="btn ghost" id="cl">Fermer</button>`,'wide');
const re=()=>{closeModal();planning()};$('#a1').onclick=()=>{rest();re()};$('#a2').onclick=()=>{coffee();re()};$('#a3').onclick=()=>{endDay();re()};$('#cl').onclick=closeModal}
