/* Rangs professionnels et éléments d'avatar débloqués par la progression (niveau d'XP 1 à 5) */
const myRank=()=>Math.min(RANKS.length,lvlOf(D.xp));
/* niveau requis par élément d'avatar (indice dans CH) ; absent = niveau 1 */
const UNL={hair:{2:1,3:2,4:2,5:2,6:2,7:2,9:2},outfit:{1:2,2:4},acc:{2:3,3:3}};
const lockLv=(k,i)=>(UNL[k]||{})[i]||1;
function sanitizeChar(c){const d={hair:0,outfit:3,acc:0},l=myRank();c=Object.assign({},c);['hair','outfit','acc'].forEach(k=>{if(lockLv(k,c[k])>l)c[k]=d[k]});return c}
const RWD=['Blazer bleu marine, Smart Casual, hijab classique, coiffures courtes et bouclées','Costume gris anthracite, coiffures longues et attachées, hijab moderne','Casque audio et pin’s','Tenue de direction dorée','Maîtrise complète : tout le catalogue est débloqué'];
function rankPanel(){const l=myRank();
return`<div class="panel pth"><h3>Rangs et récompenses</h3><p class="muted" style="margin-top:0">Gagnez de l’XP (missions et niveaux de métiers) pour monter en grade et débloquer de nouvelles tenues et coiffures.</p><div class="steps">${RANKS.map((r,k)=>`<div class="stp ${k+1<=l?'on':''}"><b>${k+1}. ${r}${k+1===l?' · vous':''}</b><small class="muted">${lvlStart(k+1)} XP</small><p class="muted" style="margin:.4em 0 0;font-size:.9rem">${k+1<=l?'🔓':'🔒'} ${RWD[k]}</p></div>`).join('')}</div><p style="margin:12px 0 0"><button class="btn ghost sm" data-go="char">Personnaliser mon avatar</button></p></div>`}
function rankCheck(){const l=myRank();if(D.rk==null||l<D.rk){D.rk=l;return}if(l>D.rk){D.rk=l;persist();toast('Nouveau rang : '+rankOf(l)+' ! De nouveaux éléments d’avatar sont débloqués.')}}
