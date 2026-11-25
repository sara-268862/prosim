/* Formulaire de suggestion d'un nouveau métier : enregistré avec auteur, date et statut « Nouveaux » */
function suggest(){const mine=SUGS.all().filter(x=>x.aid===uid()).sort((a,b)=>b.date-a.date);
app.innerHTML=`<p><button class="btn ghost sm" data-go="jobs">← Métiers</button></p><div class="auth panel" style="max-width:640px"><h2>Proposer un nouveau métier</h2><p class="muted">Il manque un métier ? Décrivez-le : l’équipe d’administration examinera votre proposition.</p>
<form id="sf" novalidate><label class="fl" for="sn">Nom du métier proposé<input id="sn" maxlength="80" required></label>
<label class="fl" for="ss">Secteur professionnel<select id="ss">${SECT.map((s,i)=>`<option value="${i}">${s.n}</option>`).join('')}<option value="-1">Autre secteur</option></select></label>
<label class="fl" for="sd">Contexte ou description<textarea id="sd" rows="5" maxlength="600" required placeholder="Missions, contexte marocain, situations typiques…"></textarea></label>
<p class="muted" style="margin:0">Auteur : ${esc(U?U.name:'Invité '+GID.slice(4))} · statut initial : ${SST.new}</p><p class="err" id="er" role="alert"></p><button class="btn" id="sb">Envoyer la proposition</button></form></div>
${mine.length?`<div class="panel" style="margin-top:16px"><h3>Mes suggestions</h3>${mine.map(x=>`<p style="margin:.4em 0"><b>${esc(x.name)}</b> · ${esc(x.sector)} · <span class="pill">${SST[x.status]||x.status}</span> <small class="muted">${new Date(x.date).toLocaleDateString('fr-FR')}</small></p>`).join('')}</div>`:''}`;
$('#sf').onsubmit=e=>{e.preventDefault();clearErr();const n=$('#sn').value.trim().replace(/\s+/g,' '),d=$('#sd').value.trim(),si=+$('#ss').value;
if(n.length<3)return showErr('Indiquez le nom du métier (3 caractères minimum).','sn');
if(d.length<10)return showErr('Décrivez brièvement le contexte (10 caractères minimum).','sd');
const all=SUGS.all(),day=Date.now()-864e5;if(all.filter(x=>x.aid===uid()&&x.date>day).length>=5)return showErr('Limite atteinte : 5 propositions par jour.');
if(all.some(x=>x.aid===uid()&&x.name.toLowerCase()===n.toLowerCase()))return showErr('Vous avez déjà proposé ce métier.','sn');
all.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:n,sector:si>=0?SECT[si].n:'Autre secteur',desc:d,author:U?U.name:'Invité '+GID.slice(4),aid:uid(),date:Date.now(),status:'new'});
if(!SUGS.save(all.slice(-500)))return showErr('Enregistrement impossible : stockage du navigateur indisponible.');
toast('Merci ! Votre proposition a été enregistrée.');suggest()}}
