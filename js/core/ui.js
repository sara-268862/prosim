/* Interface commune : notifications, fenêtres modales, thème, en-tête utilisateur */
function toast(msg){const c=$('#toasts');if(!c)return;const t=document.createElement('div');t.className='toast';t.textContent=msg;c.appendChild(t);setTimeout(()=>t.remove(),4500)}

let modalPrev=null;
function openModal(html,cls=''){closeModal();modalPrev=document.activeElement;const m=document.createElement('div');m.id='modal';m.className='ov';
m.innerHTML=`<div class="dlg ${cls}" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`;document.body.appendChild(m);
m.addEventListener('mousedown',e=>{if(e.target===m)closeModal()});const d=m.firstChild;(d.querySelector('input,button')||d).focus();return d}
function closeModal(){const m=$('#modal');if(m){m.remove();if(modalPrev&&modalPrev.focus)modalPrev.focus()}}

/* Thème : auto / clair / sombre (mémorisé sur l'appareil) */
const THEMES=['auto','light','dark'],TH_LABEL={auto:'Thème : auto',light:'Thème : clair',dark:'Thème : sombre'};
function applyTheme(t){const r=document.documentElement;if(t==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);const b=$('#theme');if(b)b.textContent=TH_LABEL[t]}
function initTheme(){let t=LS.get('dw-theme');if(!THEMES.includes(t))t='auto';applyTheme(t);$('#theme').onclick=()=>{t=THEMES[(THEMES.indexOf(t)+1)%3];LS.set('dw-theme',t);applyTheme(t)}}

/* En-tête : connexion / menu du compte */
function avatar(u,sz=''){const px={'':34,lg:56,xl:84}[sz]||34;return `<span class="av ${sz}" aria-hidden="true">${charSvg(cOf(u),px,true)}</span>`}
function renderHeader(){const el=$('#usr');rankCheck();
el.innerHTML=U?`<div class="um"><button class="ub" id="um" aria-haspopup="true" aria-expanded="false">${avatar(U)}<span class="un">${esc(U.name.split(' ')[0])}</span></button><div class="menu" id="mn" hidden><div class="mh"><b>${esc(U.name)}</b><small>Niveau ${lvlOf(D.xp)} · ${rankOf(lvlOf(D.xp))}</small></div><button data-go="char">Mon personnage</button><button data-go="jobs">Métiers</button><button data-go="suggest">Proposer un métier</button>${isAdmin(U)?'<button data-go="admin">Administration</button>':''}<button data-go="profile">Mon profil</button><button data-go="board">Classement</button><button id="lo">Se déconnecter</button></div></div>`
:`<button class="ub" data-go="char" title="Mon avatar (accès invité)">${avatar(null)}<span class="un">Invité ${esc(GID.slice(4))}</span></button><button class="btn ghost sm" data-go="login">Connexion</button><button class="btn sm" data-go="register">Créer un compte</button>`;
const um=$('#um');if(um){um.onclick=e=>{e.stopPropagation();const mn=$('#mn');mn.hidden=!mn.hidden;um.setAttribute('aria-expanded',!mn.hidden)};
$('#lo').onclick=()=>{const n=U.name.split(' ')[0];Auth.logout();S=null;renderHeader();toast('À bientôt, '+n+'. Vous êtes déconnecté.');nav('home')}}
renderHud();const rv=$('#rv');if(rv){const n=D.errors.length;rv.innerHTML='Réviser'+(n?` <span class="cnt">${n}</span>`:'')}}
document.addEventListener('click',e=>{const mn=$('#mn');if(mn&&!mn.hidden&&!e.target.closest('.um')){mn.hidden=true;const um=$('#um');if(um)um.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();const mn=$('#mn');if(mn)mn.hidden=true}});

/* Champs de mot de passe : bouton afficher/masquer + jauge de robustesse */
function wirePw(root=document){root.querySelectorAll('.eye').forEach(b=>b.onclick=()=>{const i=document.getElementById(b.dataset.t),show=i.type==='password';i.type=show?'text':'password';b.textContent=show?'Masquer':'Afficher';b.setAttribute('aria-label',(show?'Masquer':'Afficher')+' le mot de passe')})}
const pwField=(id,label,auto,extra='')=>`<label class="fl" for="${id}">${label}<span class="pw"><input id="${id}" type="password" autocomplete="${auto}" required ${extra}><button type="button" class="eye" data-t="${id}" aria-label="Afficher le mot de passe">Afficher</button></span></label>`;
function wireMeter(inp,meter){inp.addEventListener('input',()=>{const s=pwdScore(inp.value);meter.className='meter s'+s;meter.querySelector('b').textContent=inp.value?PWD_LABEL[s]:''})}
const meterHtml='<div class="meter s0" aria-live="polite"><i></i><i></i><i></i><i></i><b></b></div>';
