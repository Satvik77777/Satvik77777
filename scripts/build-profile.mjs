import { mkdir, writeFile } from 'node:fs/promises';
const output = 'assets/profile';
await mkdir(output, { recursive: true });
const themes = {
  light: { bg: '#f8fafc', panel: '#edf3f6', ink: '#172839', muted: '#53697b', line: '#cbdbe5', accent: '#007c91', bright: '#b65b13', levels: ['#e3ecf2','#c3e1e7','#7ac4cf','#2b9eaf','#00758c'] },
  dark: { bg: '#0c1523', panel: '#132438', ink: '#edf5fc', muted: '#9eb3c7', line: '#29465e', accent: '#53d9df', bright: '#ffbd71', levels: ['#1d3045','#244f62','#237d90','#25b3bd','#72e6e3'] }
};
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=14,fill='var(--ink)',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
const rect = (x,y,w,h,fill='var(--panel)',radius=10,stroke='var(--line)') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
function svg(theme,w,h,label,body) {
  const c=themes[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style>:root{--bg:${c.bg};--panel:${c.panel};--ink:${c.ink};--muted:${c.muted};--line:${c.line};--accent:${c.accent};--bright:${c.bright}}text{font-family:Arial,Helvetica,sans-serif}.mono{font-family:Consolas,monospace;letter-spacing:1.5px}.moving{transform:translateX(0)}@keyframes packet{to{offset-distance:100%}}.pulse{animation:pulse 3s ease-in-out infinite}.blink{animation:blink 1.3s steps(2) infinite}.scan{animation:scan 8s linear infinite}@keyframes pulse{50%{opacity:.35}}@keyframes blink{50%{opacity:0}}@keyframes scan{to{stroke-dashoffset:-250}}@keyframes packet-travel{to{transform:translateX(801px)}}</style>${rect(1,1,w-2,h-2,'var(--bg)',16)}${body}</svg>`;
}
async function save(name,theme,w,h,label,body) {
  // Literal colors keep the SVG readable in renderers without CSS variable support.
  const markup=svg(theme,w,h,label,body).replace(/var\(--([a-z]+)\)/g,(_,key)=>themes[theme][key]);
  await writeFile(`${output}/${name}-${theme}.svg`,markup);
}
for(const theme of Object.keys(themes)) {
  let header='';
  for(let x=24;x<1100;x+=32) header+=`<path d="M${x} 1V299" stroke="var(--line)" opacity=".22"/>`;
  for(let y=16;y<300;y+=32) header+=`<path d="M1 ${y}H1099" stroke="var(--line)" opacity=".22"/>`;
  header+=text(38,41,'PERSONAL WORKSPACE / SATVIK77777',10,'var(--muted)','class="mono"');
  header+=text(38,117,'Satvik Saini',59,'var(--ink)','font-weight="700" letter-spacing="-2"');
  header+=text(40,145,'Full Stack Developer · Open Source Contributor',17,'var(--muted)');
  header+=text(40,199,'Thoughtful interfaces. Dependable backends.',15,'var(--accent)');
  header+=rect(683,50,378,204,'var(--panel)',14);
  header+=text(707,80,'~/satvik/workspace',11,'var(--muted)','class="mono"');
  header+=`<circle cx="1028" cy="76" r="4" fill="var(--accent)" class="pulse"/>`;
  header+=`<path d="M700 96H1045" stroke="var(--line)"/>`;
  header+=text(707,126,'const craft = {',14,'var(--accent)','font-family="Consolas,monospace"');
  header+=text(726,154,'interface: "React",',14,'var(--ink)','font-family="Consolas,monospace"');
  header+=text(726,179,'logic: "Node.js",',14,'var(--ink)','font-family="Consolas,monospace"');
  header+=text(726,204,'data: "MongoDB"',14,'var(--ink)','font-family="Consolas,monospace"');
  header+=text(707,230,'};',14,'var(--accent)','font-family="Consolas,monospace"');
  header+=`<rect x="732" y="219" width="7" height="13" fill="var(--bright)" class="blink"/>`;
  for(const [i,label] of ['MERN STACK','GENERATIVE AI','OPEN SOURCE'].entries()) header+=rect(40+i*184,229,168,31,'var(--panel)',7)+text(54+i*184,249,label,10,'var(--accent)','class="mono"');
  header+=`<path d="M40 279H1060" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="70 180" class="scan" opacity=".6"/>`;
  await save('header',theme,1100,300,'Satvik Saini — Full Stack Developer and Open Source Contributor',header);
  const names=['INTERFACE','API','VALIDATION','DATABASE'];
  let pipeline=text(28,33,'HOW I THINK ABOUT A REQUEST',10,'var(--muted)','class="mono"');
  names.forEach((name,i)=>{const x=35+i*267;pipeline+=rect(x,64,229,76);pipeline+=text(x+114,99,name,12,'var(--ink)','text-anchor="middle" class="mono"');pipeline+=text(x+114,120,['React','Express','Zod','MongoDB'][i],10,'var(--accent)','text-anchor="middle"');pipeline+=`<path d="M${x+114} 140V174" stroke="var(--line)"/>`;});
  pipeline+=`<path d="M149 174H950" fill="none" stroke="var(--accent)" stroke-width="2" opacity=".35"/><g id="pipeline-packet"><circle class="moving" cx="149" cy="174" r="7" fill="var(--bright)" style="animation:packet-travel 5s linear infinite"/></g>`;
  pipeline+=text(28,218,'REQUEST → RESPONSE  /  SMALL DETAILS, CONNECTED',10,'var(--muted)','class="mono"');
  await save('pipeline',theme,1100,240,'Illustrative request pipeline: interface, API, validation, database',pipeline);
  const aiStages=[['INPUT','Résumé + job description'],['GEMINI','Questions + preparation plan'],['ZOD','Validated structured output'],['DELIVERY','React interface + PDF résumé']];
  let ai=text(29,33,'PROJECT BLUEPRINT / AI CAREER TOOLS',10,'var(--accent)','class="mono"');
  aiStages.forEach(([title,sub],i)=>{const x=29+i*267;ai+=rect(x,62,240,100);ai+=text(x+17,91,title,10,'var(--accent)','class="mono"');ai+=text(x+17,125,sub,13);if(i<3)ai+=text(x+252,119,'→',18,'var(--muted)','text-anchor="middle"');});
  ai+=text(29,197,'UNSTRUCTURED TEXT → STRUCTURED ANSWERS → A USEFUL NEXT STEP',10,'var(--muted)','class="mono"');
  ai+=`<path d="M29 172H1070" stroke="var(--accent)" stroke-width="2" stroke-dasharray="30 180" class="scan"/>`;
  await save('project-ai',theme,1100,220,'AI project architecture illustration',ai);
  let ledger=text(29,33,'PROJECT BLUEPRINT / DOUBLE-ENTRY LEDGER',10,'var(--accent)','class="mono"');
  ledger+=rect(29,66,215,85)+text(46,94,'REQUEST',10,'var(--accent)','class="mono"')+text(46,128,'Unique transaction key',15);
  ledger+=text(263,115,'→',20,'var(--muted)');
  ledger+=rect(300,52,460,114,'var(--panel)',12,'var(--accent)')+text(319,77,'ONE ATOMIC TRANSACTION',10,'var(--accent)','class="mono"');
  ledger+=rect(318,90,187,54,'var(--bg)')+text(338,123,'Debit  − amount',16)+text(522,124,'⇄',24,'var(--accent)')+rect(558,90,184,54,'var(--bg)')+text(576,123,'Credit  + amount',16);
  ledger+=text(779,115,'→',20,'var(--muted)')+rect(819,66,252,85)+text(837,94,'APPEND-ONLY LEDGER',10,'var(--accent)','class="mono"')+text(837,128,'Balance from entries',16);
  ledger+=text(29,198,'CONSISTENT TRANSFERS · IDEMPOTENT RETRIES · TRACEABLE ENTRIES',10,'var(--muted)','class="mono"');
  ledger+=`<path d="M300 169H760" stroke="var(--bright)" stroke-width="2" stroke-dasharray="35 100" class="scan"/>`;
  await save('project-ledger',theme,1100,220,'Ledger architecture illustration: debit and credit in an atomic transaction',ledger);
}
for(const [name,label,width] of [['linkedin','LinkedIn',109],['email','Email',92],['portfolio','Portfolio',118],['github','GitHub',103],['x','X',65]]) {
  const body=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="34" viewBox="0 0 ${width} 34" role="img" aria-label="${label}"><rect x=".5" y=".5" width="${width-1}" height="33" rx="7" fill="#222c35" stroke="#43515d"/><text x="13" y="22" fill="#f0ece5" font-family="Arial,sans-serif" font-size="12">${label}</text><text x="${width-18}" y="22" fill="#e8ad6b" font-family="Arial,sans-serif" font-size="13">↗</text></svg>`;
  await writeFile(`${output}/button-${name}.svg`,body);
}

const response=await fetch('https://github.com/users/Satvik77777/contributions', { headers: { 'User-Agent':'Satvik-profile-artwork' } });
if(!response.ok) throw new Error(`Public calendar request failed: ${response.status}`);
const html=await response.text();
const tips=new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(m=>[m[1].match(/\bfor="([^"]+)"/)?.[1],m[2].replace(/<[^>]+>/g,'').trim()]));
const days=[...html.matchAll(/<td\b[^>]*\bdata-date="([^"]+)"[^>]*>/g)].map(m=>{
  const id=m[0].match(/\bid="([^"]+)"/)?.[1];
  const tip=tips.get(id);
  if(!tip) throw new Error(`Missing calendar tooltip: ${m[1]}`);
  const count=/^No contributions/.test(tip)?0:Number(tip.match(/^([\d,]+) contribution/)?.[1]?.replaceAll(',',''));
  const level=Number(m[0].match(/data-level="(\d)"/)?.[1]);
  if(!Number.isFinite(count)||!Number.isInteger(level)||level<0||level>4) throw new Error(`Invalid calendar day: ${m[1]}`);
  return {date:m[1],count,level};
}).sort((a,b)=>a.date.localeCompare(b.date));
if(days.length<350 || new Set(days.map(d=>d.date)).size!==days.length) throw new Error('Incomplete or duplicate calendar data');
const first=Date.parse(days[0].date+'T00:00:00Z');
const today=new Date().toISOString().slice(0,10);
const data={username:'Satvik77777',updated:today,source:'https://github.com/users/Satvik77777/contributions',from:days[0].date,to:days.at(-1).date,total:days.reduce((sum,d)=>sum+d.count,0),activeDays:days.filter(d=>d.count>0).length,days};
await writeFile(`${output}/contributions.json`,JSON.stringify(data,null,2)+'\n');
const points=days.map(d=>({...d,x:Math.floor((Date.parse(d.date+'T00:00:00Z')-first)/86400000/7),y:new Date(d.date+'T00:00:00Z').getUTCDay()}));
const pending=points.filter(d=>d.count>0);
let cursor={x:pending[0]?.x??0,y:pending[0]?.y??0};const route=[{...cursor}];const visit=new Map([[`${cursor.x},${cursor.y}`,0]]);
function walk(destination){while(cursor.x!==destination.x||cursor.y!==destination.y){if(cursor.x!==destination.x)cursor.x+=Math.sign(destination.x-cursor.x);else cursor.y+=Math.sign(destination.y-cursor.y);route.push({...cursor});const key=`${cursor.x},${cursor.y}`;if(!visit.has(key))visit.set(key,route.length-1);}}
while(pending.length){pending.sort((a,b)=>(Math.abs(a.x-cursor.x)+Math.abs(a.y-cursor.y))-(Math.abs(b.x-cursor.x)+Math.abs(b.y-cursor.y)));walk(pending.shift());}
walk(route[0]);
const position=p=>({x:75+p.x*18.4+5.5,y:82+p.y*18.4+5.5});
const origin=position(route[0]);
const path=route.map((p,i)=>`${i?'L':'M'}${(position(p).x-origin.x).toFixed(1)},${(position(p).y-origin.y).toFixed(1)}`).join(' ');
await writeFile(`${output}/motion-data.json`,JSON.stringify({route:route.map(position),visit:[...visit],points,origin})+'\n');
for(const theme of Object.keys(themes)){
  let body=text(28,32,'A YEAR OF BUILDING',11,'var(--ink)','class="mono"')+text(1070,32,`${data.total} CONTRIBUTIONS · ${data.activeDays} ACTIVE DAYS`,10,'var(--accent)','text-anchor="end" class="mono"');
  for(const [row,label] of [[1,'Mon'],[3,'Wed'],[5,'Fri']]) body+=text(30,93+row*18.4,label,9,'var(--muted)');
  let lastMonth=-1;
  for(const p of points){const date=new Date(p.date+'T00:00:00Z');if(date.getUTCMonth()!==lastMonth){lastMonth=date.getUTCMonth();if(p.x<51)body+=text(75+p.x*18.4,68,date.toLocaleString('en',{month:'short',timeZone:'UTC'}),9,'var(--muted)');}
    const key=`${p.x},${p.y}`;const step=visit.get(key);const style=p.count>0&&step!==undefined?` style="animation:eat${step} 38s linear infinite"`:'';
    body+=`<rect class="day" x="${75+p.x*18.4}" y="${82+p.y*18.4}" width="11" height="11" rx="2" fill="${themes[theme].levels[p.level]}"${style}><title>${p.date}: ${p.count} contributions</title></rect>`;
    if(style){const percentage=Math.min(96,step/(route.length-1)*100);body+=`<style>@keyframes eat${step}{0%,${percentage.toFixed(2)}%{opacity:1}${Math.min(percentage+1,97).toFixed(2)}%,97%{opacity:.18}100%{opacity:1}}</style>`;}}
  const keyframes=route.map((p,i)=>`${(i/(route.length-1)*100).toFixed(3)}%{transform:translate(${position(p).x.toFixed(1)}px,${position(p).y.toFixed(1)}px)}`).join('');
  body+=`<style>@keyframes snake-travel{${keyframes}}.snake{animation:snake-travel 28s linear infinite}</style><!-- snake:start --><g id="snake-layer">`;
  for(let i=8;i>=0;i--){
    const resting=position(route[Math.max(0,route.length-1-i)]);
    body+=`<g class="snake" style="transform:translate(${resting.x}px,${resting.y}px);animation-delay:-${(8-i)*.1}s"><circle r="${i===0?7:5.9}" fill="var(--bright)" stroke="var(--bg)" stroke-width="1" opacity="${1-i*.065}"/>${i===0?'<circle cx="2" cy="-2.5" r="1.3" fill="var(--ink)"/><circle cx="2" cy="2.5" r="1.3" fill="var(--ink)"/>':''}</g>`;
  }
  body+='</g><!-- snake:end -->';
  body+=text(28,238,`${data.from} — ${data.to} · PUBLIC GITHUB CALENDAR`,9,'var(--muted)')+text(1070,238,`UPDATED ${today}`,9,'var(--muted)','text-anchor="end"');
  body+=text(800,217,'Less',9,'var(--muted)');themes[theme].levels.forEach((level,i)=>body+=rect(833+i*17,207,11,11,level,2,'none'));body+=text(927,217,'More',9,'var(--muted)');
  await save('contributions',theme,1100,260,'Public contribution calendar with an animated snake and dated activity summary',body);
}
console.log(`Generated profile artwork from ${days.length} calendar days: ${data.total} contributions, ${data.activeDays} active days; updated ${today}.`);
