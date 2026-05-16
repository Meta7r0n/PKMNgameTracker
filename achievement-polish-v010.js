(()=>{
const SAVE_KEY='pokemonGameCompletionTracker.v0.5.polish';
const HOF_KEY='pokemonGameCompletionTracker.hallOfFame.v0.5.lab';
const BINDER_KEY='pokemonGameCompletionTracker.hofBinder.v0.9.1';
const BADGES=['boulder-badge','cascade-badge','thunder-badge','rainbow-badge','soul-badge','marsh-badge','volcano-badge','earth-badge'];
const TRADE=['alakazam','machamp','golem','gengar'];
const RARE=['snorlax-1','snorlax-2','lapras','eevee','fossil-choice','old-amber','dojo-choice','game-corner','porygon'];
const LEGEND=['articuno','zapdos','moltres','mewtwo','mew'];
const GLITCH=['missingno','item-dupe','trainer-fly','mew-glitch','glitch-city'];
const DEFS=[
 ['first-badge','Main Journey','First Badge','Earn any Kanto gym badge.','👑',d=>any(d,BADGES)],
 ['kanto-badge-master','Main Journey','Kanto Badge Master','Earn all 8 Kanto gym badges.','👑',d=>all(d,BADGES)],
 ['elite-crusher','Main Journey','Elite Crusher','Defeat the Elite Four.','👑',d=>has(d,'elite-four')],
 ['kanto-champion','Main Journey','Kanto Champion','Defeat the Champion.','👑',d=>has(d,'champion')],
 ['journey-complete','Main Journey','Journey Complete','Complete badges, Elite Four, and Champion.','👑',d=>all(d,BADGES)&&has(d,'elite-four')&&has(d,'champion')],
 ['living-dex-seed','Dex','Dex Seed','Start a Living Dex layer or log 20+ goals.','📘',(d,x)=>countPrefix(d,'living-')>0||d.size>=20],
 ['living-dex-builder','Dex','Dex Builder','Log several Living Dex families.','📘',d=>countPrefix(d,'living-')>=3],
 ['living-dex-master','Dex','Living Dex Master','Complete the major Living Dex layer.','📘',d=>countPrefix(d,'living-')>=5||has(d,'living-complete')],
 ['shiny-spark','Dex','Shiny Spark','Track at least one shiny goal.','✨',d=>countText(d,'shiny')>0],
 ['link-cable-spark','Trade','Link Cable Spark','Complete any trade evolution.','🔌',d=>any(d,TRADE)],
 ['trade-circle-complete','Trade','Trade Circle Complete','Complete Alakazam, Machamp, Golem, and Gengar.','🔌',d=>all(d,TRADE)],
 ['trade-archive','Trade','Trade Archive','Log a trade-back partner or trade note.','🔌',d=>has(d,'trade-back')||countText(d,'trade')>=5],
 ['gift-collector','Rare/Gift','Gift Collector','Collect key gift Pokémon like Lapras and Eevee.','🎁',d=>has(d,'lapras')&&has(d,'eevee')],
 ['fossil-curator','Rare/Gift','Fossil Curator','Make fossil choices and revive Old Amber.','🦴',d=>has(d,'fossil-choice')&&has(d,'old-amber')],
 ['game-corner-grinder','Rare/Gift','Game Corner Grinder','Track Game Corner or Porygon goals.','🎰',d=>has(d,'game-corner')||has(d,'porygon')],
 ['rare-master','Rare/Gift','Rare Master','Complete most rare/gift goals.','🎁',d=>countList(d,RARE)>=6],
 ['legendary-bird-keeper','Legendary/Mythical','Legendary Bird Keeper','Catch Articuno, Zapdos, and Moltres.','🪽',d=>all(d,['articuno','zapdos','moltres'])],
 ['cerulean-cave-victor','Legendary/Mythical','Cerulean Cave Victor','Catch Mewtwo.','🧬',d=>has(d,'mewtwo')],
 ['myth-seeker','Legendary/Mythical','Myth Seeker','Log Mew by event, transfer, or glitch route.','✨',d=>has(d,'mew')||has(d,'mew-glitch')],
 ['legend-complete','Legendary/Mythical','Legend Complete','Finish four or more legendary/mythical goals.','🪽',d=>countList(d,LEGEND)>=4],
 ['missingno-researcher','Glitch','MissingNo Researcher','Encounter MissingNo.','🧪',d=>has(d,'missingno')],
 ['item-duplicator','Glitch','Item Duplicator','Perform the classic item duplication trick.','🧪',d=>has(d,'item-dupe')],
 ['glitch-professor','Glitch','Glitch Professor','Complete three glitch goals.','🧪',d=>countList(d,GLITCH)>=3],
 ['mew-glitch-witness','Glitch','Mew Glitch Witness','Complete the Mew glitch route.','🧬',d=>has(d,'mew-glitch')],
 ['challenge-seed','Challenge','Challenge Seed','Start any custom challenge goal.','⚔️',d=>countChallenge(d)>=1],
 ['nuzlocke-survivor','Challenge','Nuzlocke Survivor','Mark a Nuzlocke-style rule and defeat Champion.','⚔️',d=>countText(d,'nuzlocke')>0&&has(d,'champion')],
 ['hardcore-ruleset','Challenge','Hardcore Ruleset','Track hardcore, no-item, level-cap, or permadeath rules.','⚔️',d=>['hardcore','no-item','noitems','level-cap','levelcap','permadeath'].some(k=>countText(d,k)>0)],
 ['custom-rules-master','Challenge','Custom Rules Master','Complete three or more challenge goals.','⚔️',d=>countChallenge(d)>=3],
 ['hof-archivist','HOF/Card','HOF Archivist','Save at least one Hall of Fame Trainer Card.','🗂️',(d,x)=>x.hof.length>0],
 ['full-team-logged','HOF/Card','Full Team Logged','Log all 6 Hall of Fame team slots.','🗂️',(d,x)=>x.hof.some(e=>(e.team||[]).filter(Boolean).length>=6)||x.binder.some(e=>(e.team||[]).filter(Boolean).length>=6)],
 ['photo-finish','HOF/Card','Photo Finish','Attach a Hall of Fame image/banner.','🖼️',(d,x)=>x.hof.some(e=>!!e.image)||x.binder.some(e=>!!e.image)],
 ['binder-claim','HOF/Card','Binder Claimed','Claim at least one HOF Binder card.','🃏',(d,x)=>x.binder.length>0]
];
function has(d,id){return d.has(id)}function all(d,a){return a.every(x=>d.has(x))}function any(d,a){return a.some(x=>d.has(x))}function countList(d,a){return a.filter(x=>d.has(x)).length}function countPrefix(d,p){let n=0;d.forEach(x=>{if(String(x).startsWith(p))n++});return n}function countText(d,t){let n=0;d.forEach(x=>{if(String(x).includes(t))n++});return n}function countChallenge(d){let n=0;d.forEach(x=>{if(/challenge|nuzlocke|hardcore|solo|mono|rule|no-item|noitems|level-cap|permadeath/i.test(x))n++});return n}
function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}}
function collect(){const done=new Set();document.querySelectorAll('.task input[type=checkbox]').forEach(i=>{if(i.checked){['id','data-id','name','value'].forEach(a=>{const v=i.getAttribute(a)||i[a];if(v&&v!=='on')done.add(String(v))});const row=i.closest('.task');if(row){const t=row.querySelector('.task-title');if(t)done.add(t.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));}}});
 const st=read(SAVE_KEY,{});scan(st,done);return done}
function scan(o,set){if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach(v=>{if(typeof v==='string')set.add(v);else scan(v,set)});return}Object.entries(o).forEach(([k,v])=>{if(v===true)set.add(k);if(typeof v==='string'&&v.length<80)set.add(v);if(v&&typeof v==='object')scan(v,set)})}
function compute(){const done=collect(),hof=read(HOF_KEY,[]),binder=read(BINDER_KEY,[]),ctx={hof,binder};return{done,hof,binder,unlocked:DEFS.filter(d=>{try{return d[5](done,ctx)}catch(e){return false}})}}
function addCss(){if(document.getElementById('achPolishCss'))return;const s=document.createElement('style');s.id='achPolishCss';s.textContent='.ach-polish-panel{border:1px solid rgba(250,204,21,.45);border-radius:20px;padding:12px;margin:12px 0;background:linear-gradient(135deg,rgba(250,204,21,.16),rgba(255,255,255,.05))}.ach-polish-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.ach-polish-title{font-weight:1000;color:#fff3a4}.ach-polish-count{font-weight:1000;color:white}.ach-polish-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin:10px 0}.ach-polish-chip{border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);padding:7px 9px;font-weight:900;color:#e5e7eb;font-size:.76rem}.ach-polish-chip b{color:#fff3a4}.ach-polish-next{font-size:.82rem;color:#cbd5e1;line-height:1.35;margin:8px 0}.ach-polish-ribbon{display:inline-flex;gap:6px;align-items:center;border-radius:999px;background:rgba(255,255,255,.1);padding:6px 8px;margin:4px;color:white;font-weight:900;font-size:.76rem}.ach-card.polish-auto{opacity:1!important;filter:none!important;border-color:rgba(250,204,21,.7)!important;box-shadow:0 0 0 1px rgba(250,204,21,.18),0 10px 24px rgba(0,0,0,.18)}@media(max-width:720px){.ach-polish-grid{grid-template-columns:1fr}}';document.head.appendChild(s)}
function renderPanel(){addCss();const drawer=document.getElementById('achievementDrawer');if(!drawer)return;const hero=drawer.querySelector('.ach-hero');if(!hero)return;let p=document.getElementById('achPolishPanel');if(!p){p=document.createElement('div');p.id='achPolishPanel';p.className='ach-polish-panel';hero.insertAdjacentElement('afterend',p)}const r=compute();const by={};DEFS.forEach(d=>by[d[1]]=[0,0]);DEFS.forEach(d=>{by[d[1]][1]++;if(r.unlocked.some(u=>u[0]===d[0]))by[d[1]][0]++});const next=DEFS.filter(d=>!r.unlocked.some(u=>u[0]===d[0])).slice(0,4);p.innerHTML='<div class="ach-polish-top"><div class="ach-polish-title">V0.10 Achievement Logic</div><div class="ach-polish-count">'+r.unlocked.length+' / '+DEFS.length+'</div></div><div class="ach-polish-grid">'+Object.entries(by).map(([k,v])=>'<div class="ach-polish-chip">'+k+': <b>'+v[0]+'/'+v[1]+'</b></div>').join('')+'</div><div>'+r.unlocked.slice(0,8).map(d=>'<span class="ach-polish-ribbon">'+d[4]+' '+d[2]+'</span>').join('')+'</div><div class="ach-polish-next"><b>Next likely unlocks:</b> '+(next.map(d=>d[2]).join(', ')||'All polished achievements unlocked.')+'</div><button class="btn gold" id="syncPolishAchievements" type="button">Sync HOF/Binder Achievement Snapshot</button>';
 const btn=document.getElementById('syncPolishAchievements');if(btn)btn.onclick=syncSnapshots;beautifyNative(r)}
function beautifyNative(r){const names=new Set(r.unlocked.map(d=>d[2].toLowerCase()));document.querySelectorAll('.ach-card').forEach(c=>{const n=c.querySelector('.ach-name');if(n&&names.has(n.textContent.trim().toLowerCase()))c.classList.add('polish-auto')});const meta=document.getElementById('achShelfMeta');if(meta)meta.textContent='V0.10 logic active: '+r.unlocked.length+' polished ribbons detected.'}
function syncSnapshots(){const r=compute();const ids=r.unlocked.map(d=>d[0]);const names=r.unlocked.map(d=>d[2]);let hof=read(HOF_KEY,[]),binder=read(BINDER_KEY,[]),changed=false;if(hof.length){hof=hof.map((e,i)=>i===hof.length-1?Object.assign({},e,{achievements:uniq([...(e.achievements||[]),...ids,...names])}):e);localStorage.setItem(HOF_KEY,JSON.stringify(hof));changed=true}if(binder.length){binder=binder.map((e,i)=>i===binder.length-1?Object.assign({},e,{achievements:uniq([...(e.achievements||[]),...ids,...names])}):e);localStorage.setItem(BINDER_KEY,JSON.stringify(binder));changed=true}toast(changed?'Achievement snapshot synced to latest HOF/Binder card.':'No HOF/Binder card found yet. Save or claim one first.');renderPanel()}
function uniq(a){return Array.from(new Set(a.filter(Boolean)))}function toast(t){const el=document.getElementById('toast');if(!el)return alert(t);el.innerHTML=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function tick(){renderPanel()}document.addEventListener('change',e=>{if(e.target&&e.target.matches('input,select,textarea'))setTimeout(tick,80)});document.addEventListener('click',e=>{if(e.target&&e.target.id==='achBtn')setTimeout(tick,250)});new MutationObserver(()=>{if(document.getElementById('achievementDrawer')?.classList.contains('open'))renderPanel()}).observe(document.body,{childList:true,subtree:true});window.PKMNAchievementPolish={compute,syncSnapshots,defs:DEFS};setTimeout(tick,1200);
})();