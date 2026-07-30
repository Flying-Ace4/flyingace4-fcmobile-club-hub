let DB;
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const record = r => `${r.wins}-${r.draws}-${r.losses}`;
const pct = n => `${Number(n).toFixed(n % 1 ? 1 : 0)}%`;

async function load(){
  try{
    DB = await fetch('data.json').then(r => {
      if(!r.ok) throw new Error('data.json failed to load');
      return r.json();
    });
    applyBranding(); renderAll(); bind();
  }catch(err){
    document.querySelector('#app').innerHTML = `<section class="panel"><h2>Unable to load club data</h2><p>${err.message}. Open this project through a web server or GitHub Pages rather than directly from the Files app.</p></section>`;
  }
}
function applyBranding(){
  const b=DB.branding;
  document.documentElement.style.setProperty('--blue',b.secondary);
  document.documentElement.style.setProperty('--accent',b.accent);
  $('#clubName').textContent=b.clubName; $('#crest').textContent=b.crestText;
  $('#seasonName').textContent=DB.meta.season;
}
function leaders(){
  const by = key => [...DB.players].sort((a,b)=>b[key]-a[key])[0];
  return {scorer:by('goals'), assists:by('assists'), gva:by('gva')};
}
function renderAll(){
  const s=DB.season, l=leaders();
  $('#recordHero').textContent=record(s.record);
  $('#heroSub').textContent=`${s.division} · ${s.points} points · ${s.goalDifference>=0?'+':''}${s.goalDifference} GD`;
  $('#metricGrid').innerHTML=[
    ['Goals For',s.goalsFor],['Goals Against',s.goalsAgainst],['Formation',s.currentFormation],['Next Match',s.nextMatch]
  ].map(([a,b])=>`<div class="metric"><div class="label">${a}</div><div class="value">${b}</div></div>`).join('');
  $('#leaders').innerHTML=[
    ['Top scorer',l.scorer,l.scorer.goals],['Assist leader',l.assists,l.assists.assists],['GVA leader',l.gva,l.gva.gva]
  ].map(([label,p,val])=>`<div class="leader"><small>${label}</small><strong>${p.name.split(' ').slice(-1)}</strong><b>${val}</b></div>`).join('');
  $('#recentMatches').innerHTML=DB.matches.slice(-2).reverse().map(matchCard).join('');
  $('#matchList').innerHTML=DB.matches.slice().reverse().map(matchCard).join('');
  $('#homeNews').innerHTML=DB.news.slice(0,3).map(newsCard).join('');
  $('#newsList').innerHTML=DB.news.map(newsCard).join('');
  renderPlayers('gva');
  renderFormations();
  renderGoalkeepers();
  renderCaptains();
}
function matchCard(m){
  return `<article class="match-card" data-match="${m.id}">
    <div><div class="match-id">${m.id} · ${m.result}</div><h3>${m.opponent}</h3><p>${m.headline}</p></div>
    <div class="score-pill">${m.scoreFor}-${m.scoreAgainst}</div>
  </article>`;
}
function newsCard(n){return `<article class="news-card"><h3>${n.title}</h3><p>${n.body}</p><small>${n.match}</small></article>`}
function renderPlayers(sortKey){
  const arr=[...DB.players].sort((a,b)=>b[sortKey]-a[sortKey] || b.gva-a.gva || a.name.localeCompare(b.name));
  $('#playerList').innerHTML=arr.map(p=>`<article class="player-card">
    <div><h3>${p.name}</h3><div class="player-meta">${p.position}${p.ovr?` · ${p.ovr} OVR`:''}</div>
    <div class="stat-strip"><span><b>${p.starts}</b>Starts</span><span><b>${p.goals}</b>Goals</span><span><b>${p.assists}</b>Assists</span><span><b>${p.gva}</b>GVA</span></div></div>
    <span class="status">${p.status}</span></article>`).join('');
}
function renderFormations(){
  $('#formationList').innerHTML=DB.formations.map(f=>{
    const gd=f.goalsFor-f.goalsAgainst;
    return `<article class="formation-card"><h3>${f.name}</h3><div class="player-meta">${f.wins}-${f.draws}-${f.losses} · ${f.points} pts</div>
    <div class="mini-grid">
      <div class="mini"><small>GF / GA</small><b>${f.goalsFor} / ${f.goalsAgainst}</b></div>
      <div class="mini"><small>Goal diff.</small><b>${gd>=0?'+':''}${gd}</b></div>
      <div class="mini"><small>Shots on target</small><b>${f.shotsOnTarget}</b></div>
      <div class="mini"><small>Goals / game</small><b>${(f.goalsFor/f.matches).toFixed(1)}</b></div>
      <div class="mini"><small>Possession</small><b>${pct(f.avgPossession)}</b></div>
      <div class="mini"><small>Pass accuracy</small><b>${pct(f.avgPassAccuracy)}</b></div>
    </div></article>`;
  }).join('');
}
function renderGoalkeepers(){
  $('#goalkeeperCentre').innerHTML=DB.goalkeepers.map(g=>`<article class="formation-card"><h3>${g.name}</h3><div class="mini-grid">
    <div class="mini"><small>Saves</small><b>${g.saves}</b></div><div class="mini"><small>Save %</small><b>${pct(g.savePercentage)}</b></div>
    <div class="mini"><small>SOT faced</small><b>${g.shotsOnTargetFaced}</b></div><div class="mini"><small>Goals allowed</small><b>${g.goalsAllowed}</b></div>
    <div class="mini"><small>GA / opp SOT</small><b>${(g.goalsAllowed/g.shotsOnTargetFaced).toFixed(3)}</b></div><div class="mini"><small>3+ save matches</small><b>${g.threePlusSaveMatches}</b></div>
  </div></article>`).join('');
}
function renderCaptains(){
  $('#captaincy').innerHTML=DB.captains.map(c=>`<article class="captain-card"><h3>${c.name}</h3>
  <div class="player-meta">${c.wins}-${c.draws}-${c.losses} as captain · ${c.goalsFor}-${c.goalsAgainst} goals</div></article>`).join('');
}
function openMatch(id){
  const m=DB.matches.find(x=>x.id===id); if(!m)return;
  const assistNote=m.assistsMapped?'':`<p class="player-meta">Assist names are verified, but exact scorer-assist pairings are not mapped.</p>`;
  $('#matchDetail').innerHTML=`<p class="eyebrow">${m.id} · ${m.result}</p><h1>${m.headline}</h1>
    <div class="detail-score">${m.scoreFor}-${m.scoreAgainst}</div><p>${m.summary}</p>
    <div class="detail-block"><div class="kv"><b>Opponent</b><span>${m.opponent}</span></div><div class="kv"><b>Formation</b><span>${m.formation}</span></div><div class="kv"><b>Captain</b><span>${m.captain}</span></div></div>
    <div class="detail-block"><h3>Goals</h3>${m.goals.map(g=>`<div class="event-row"><b>${g.player}</b><span>${g.minute} · ${g.gva} GVA</span></div>`).join('')}</div>
    <div class="detail-block"><h3>Recorded Assists</h3>${m.assists.map(a=>`<div class="event-row"><b>${a}</b></div>`).join('')}${assistNote}</div>
    <div class="detail-block"><h3>Team Statistics</h3>${[
      ['Shots',`${m.stats.shots}-${m.stats.opponentShots}`],['Shots on target',`${m.stats.shotsOnTarget}-${m.stats.opponentShotsOnTarget}`],
      ['Possession',pct(m.stats.possession)],['Pass accuracy',pct(m.stats.passAccuracy)],['Fouls',m.stats.fouls],['Offsides',m.stats.offsides]
    ].map(x=>`<div class="kv"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>
    <div class="detail-block"><h3>Goalkeeper</h3><div class="kv"><b>${m.goalkeeper.player}</b><span>${m.goalkeeper.saves} saves · ${pct(m.goalkeeper.savePercentage)}</span></div></div>
    <div class="detail-block"><h3>Match Notes</h3>${m.notes.map(n=>`<div class="event-row"><span>• ${n}</span></div>`).join('')}</div>
    <div class="detail-block"><div class="tags">${m.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>`;
  $('#matchDialog').showModal();
}
function showView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.target===name));
  scrollTo({top:0,behavior:'smooth'});
}
function bind(){
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-target]'); if(nav)showView(nav.dataset.target);
    const jump=e.target.closest('[data-jump]'); if(jump)showView(jump.dataset.jump);
    const mc=e.target.closest('[data-match]'); if(mc)openMatch(mc.dataset.match);
    const sort=e.target.closest('[data-sort]'); if(sort){$$('[data-sort]').forEach(x=>x.classList.remove('active'));sort.classList.add('active');renderPlayers(sort.dataset.sort)}
  });
  $('#closeDialog').addEventListener('click',()=>$('#matchDialog').close());
  $('#matchDialog').addEventListener('click',e=>{if(e.target===$('#matchDialog'))$('#matchDialog').close()});
}
load();
