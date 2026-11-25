/* Écrans : connexion, inscription, récupération, code de récupération */
let afterLogin='home',RC=null;
const needLogin=to=>{afterLogin=to||'home';nav('login');toast('Connectez-vous pour accéder à cette page.')};
function busy(btn,on,label){btn.disabled=on;btn.textContent=on?'Veuillez patienter…':label}
function showErr(msg,field){const e=$('#er');e.textContent=msg;const f=field&&document.getElementById(field);if(f){f.setAttribute('aria-invalid','true');f.focus()}}
const clearErr=()=>{const e=$('#er');if(e)e.textContent='';document.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'))};
const FID={name:'nm',email:'em',password:'pw',current:'cu',school:'sc'};

function login(){app.innerHTML=`<div class="auth panel"><h2>Connexion étudiant</h2><p class="muted">Retrouvez votre progression, vos badges et votre place au classement.</p>
<form id="lf" novalidate><label class="fl" for="em">Adresse e-mail<input id="em" type="email" autocomplete="username" required></label>${pwField('pw','Mot de passe','current-password')}
<label class="ck"><input type="checkbox" id="rm" checked> Rester connecté sur cet appareil</label><p class="err" id="er" role="alert"></p><button class="btn" id="sb">Se connecter</button></form>
<p class="muted"><button class="lnk" data-go="recovery">Mot de passe oublié ?</button></p><p>Pas encore de compte ? <button class="lnk" data-go="register">Créer un compte</button></p>
<p class="muted"><button class="lnk" id="gu">Continuer en tant qu’invité</button> (un identifiant d’invité est créé ; la progression reste sur cet appareil).</p></div>`;
wirePw();$('#em').focus();$('#gu').onclick=()=>{toast('Accès invité · identifiant : '+GID);nav('home')};
$('#lf').onsubmit=async e=>{e.preventDefault();clearErr();const em=$('#em').value,pw=$('#pw').value;if(!em||!pw)return showErr('Saisissez votre e-mail et votre mot de passe.',em?'pw':'em');
busy($('#sb'),true);const r=await Auth.login({email:em,password:pw,remember:$('#rm').checked});busy($('#sb'),false,'Se connecter');
if(r.error)return showErr(r.error);S=null;renderHeader();toast('Bon retour, '+r.user.name.split(' ')[0]+' !');const to=afterLogin;afterLogin='home';nav(to)}}

function register(){const gn=DB.loadData(null).hist.length;
app.innerHTML=`<div class="auth panel"><h2>Créer un compte étudiant</h2><p class="muted">Gratuit et immédiat. Votre progression, vos badges et vos certificats sont conservés pour vos prochaines visites.</p>
<form id="rf" novalidate><label class="fl" for="nm">Nom affiché<input id="nm" autocomplete="name" maxlength="40" required></label>
<label class="fl" for="em">Adresse e-mail<input id="em" type="email" autocomplete="username" required></label>
<label class="fl" for="sc">Établissement scolaire (facultatif)<input id="sc" autocomplete="organization" maxlength="80"></label>
${pwField('pw','Mot de passe (8 caractères minimum, avec lettres et chiffres)','new-password')}${meterHtml}${pwField('pw2','Confirmer le mot de passe','new-password')}
${gn?`<label class="ck"><input type="checkbox" id="ig" checked> Importer ma progression actuelle (${gn} mission${gn>1?'s':''})</label>`:''}
<p class="err" id="er" role="alert"></p><button class="btn" id="sb">Créer mon compte</button></form>
<p>Déjà inscrit ? <button class="lnk" data-go="login">Se connecter</button></p><p class="muted">Les comptes sont enregistrés sur cet appareil : le mot de passe n’est jamais stocké en clair, mais il ne peut pas être récupéré sans votre code de récupération, fourni après l’inscription.</p></div>`;
wirePw();wireMeter($('#pw'),$('.meter'));$('#nm').focus();
$('#rf').onsubmit=async e=>{e.preventDefault();clearErr();if($('#pw').value!==$('#pw2').value)return showErr('Les deux mots de passe ne correspondent pas.','pw2');
busy($('#sb'),true);const r=await Auth.register({name:$('#nm').value,email:$('#em').value,password:$('#pw').value,school:$('#sc').value,importGuest:!!($('#ig')&&$('#ig').checked)});busy($('#sb'),false,'Créer mon compte');
if(r.error)return showErr(r.error,FID[r.field]);Auth.start(r.user,true);S=null;renderHeader();ceFirst=true;CE=null;showRecovery(r.recovery,'char','Votre compte est créé')}}

/* Le code de récupération n'est affiché qu'une seule fois */
function showRecovery(code,next,title){RC={code,next,title};nav('recov')}
function recov(){const{code,next,title}=RC||{code:'',next:'home',title:''};
app.innerHTML=`<div class="auth panel"><h2>${esc(title)}</h2><p>Voici votre <b>code de récupération</b>. Il permettra de choisir un nouveau mot de passe si vous l’oubliez. Il ne sera plus affiché : notez-le dans un endroit sûr.</p>
<div class="code" id="cd" aria-label="Code de récupération">${esc(code)}</div><div class="row"><button class="btn ghost" id="cp">Copier le code</button><button class="btn ghost" id="pr">Imprimer</button></div>
<label class="ck"><input type="checkbox" id="ok"> J’ai noté mon code de récupération</label><button class="btn" id="go" disabled>Continuer</button></div>`;
$('#ok').onchange=e=>$('#go').disabled=!e.target.checked;
$('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(code);toast('Code copié.')}catch(e){const r=document.createRange();r.selectNodeContents($('#cd'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Sélectionné : faites Ctrl+C pour copier.')}};
$('#pr').onclick=()=>print();$('#go').onclick=()=>{RC=null;nav(next)}}

function recovery(){app.innerHTML=`<div class="auth panel"><h2>Mot de passe oublié</h2><p class="muted">Saisissez votre e-mail, le code de récupération reçu à l’inscription et un nouveau mot de passe.</p>
<form id="rf" novalidate><label class="fl" for="em">Adresse e-mail<input id="em" type="email" autocomplete="username" required></label>
<label class="fl" for="cd">Code de récupération<input id="cd" autocomplete="off" placeholder="XXXX-XXXX-XXXX" required></label>${pwField('pw','Nouveau mot de passe','new-password')}${meterHtml}
<p class="err" id="er" role="alert"></p><button class="btn" id="sb">Réinitialiser le mot de passe</button></form><p><button class="lnk" data-go="login">Retour à la connexion</button></p></div>`;
wirePw();wireMeter($('#pw'),$('.meter'));$('#em').focus();
$('#rf').onsubmit=async e=>{e.preventDefault();clearErr();busy($('#sb'),true);const r=await Auth.reset({email:$('#em').value,code:$('#cd').value,password:$('#pw').value});busy($('#sb'),false,'Réinitialiser le mot de passe');
if(r.error)return showErr(r.error);toast('Mot de passe modifié.');showRecovery(r.recovery,'login','Nouveau code de récupération')}}
