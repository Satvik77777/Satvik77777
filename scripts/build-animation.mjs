import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;
const directory='assets/profile';
const motion=JSON.parse(await readFile(`${directory}/motion-data.json`,'utf8'));
const visit=new Map(motion.visit);
const frames=180;
function sample(step){
  const value=((step%(motion.route.length-1))+(motion.route.length-1))%(motion.route.length-1);
  const index=Math.floor(value),fraction=value-index;
  const a=motion.route[index],b=motion.route[index+1];
  return {x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction};
}
async function encode(name,theme,count,makeFrame,delay=100){
  const gif=GIFEncoder();
  let palette, mapping, previous;
  for(let frame=0;frame<count;frame++){
    const svg=makeFrame(frame);
    const {data,info}=await sharp(Buffer.from(svg)).flatten({background:theme==='dark'?'#0c1523':'#f8fafc'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    if(!palette){
      mapping=quantize(data,255);
      palette=[...mapping];
      while(palette.length<256)palette.push([0,0,0]);
    }
    const pixels=applyPalette(data,mapping);
    const delta=pixels.slice();
    if(previous)for(let i=0;i<delta.length;i++)if(pixels[i]===previous[i])delta[i]=255;
    gif.writeFrame(delta,info.width,info.height,{palette:frame===0?palette:null,delay,repeat:0,transparent:frame>0,transparentIndex:255,dispose:1});
    previous=pixels;
  }
  gif.finish();
  const output=gif.bytes();
  await writeFile(`${directory}/${name}-${theme}.gif`,output);
  const metadata=await sharp(Buffer.from(output),{animated:true}).metadata();
  if(metadata.pages!==count)throw new Error(`Invalid frame count for ${name}-${theme}`);
  const first=await sharp(Buffer.from(output),{page:0}).raw().toBuffer();
  const middle=await sharp(Buffer.from(output),{page:Math.floor(count/2)}).raw().toBuffer();
  if(first.equals(middle))throw new Error(`Animation is static: ${name}-${theme}`);
  console.log(`${name}-${theme}: ${count} distinct-timeline frames, ${Math.round(output.length/1024)} KiB.`);
}
for(const theme of ['light','dark']){
  const accent=theme==='dark'?'#53d9df':'#007c91';
  const bright=theme==='dark'?'#ffbd71':'#b65b13';
  const bg=theme==='dark'?'#0c1523':'#f8fafc';
  const ink=theme==='dark'?'#edf5fc':'#172839';
  const graph=(await readFile(`${directory}/contributions-${theme}.svg`,'utf8')).replace(/<!-- snake:start -->[\s\S]*?<!-- snake:end -->/,'');
  await encode('contributions',theme,frames,frame=>{
    const step=(frame/(frames-1))*(motion.route.length-1);
    const faded=graph.replace(/<rect class="day"([^>]*)><title>([^:]+):/g,(whole,attrs,date)=>{
      const day=motion.points.find(p=>p.date===date),arrival=day?visit.get(`${day.x},${day.y}`):undefined;
      return `<rect class="day"${attrs} opacity="${day?.count>0 && arrival!==undefined && arrival<=step ? 0.32 : 1}"><title>${date}:`;
    });
    let snake='';
    for(let i=8;i>=0;i--){
      const point=sample(step-i*.75);
      snake+=`<circle cx="${point.x}" cy="${point.y}" r="${i===0?7:5.9}" fill="${bright}" stroke="${bg}" stroke-width="1" opacity="${1-i*.06}"/>`;
      if(i===0)snake+=`<circle cx="${point.x+2}" cy="${point.y-2.5}" r="1.3" fill="${ink}"/><circle cx="${point.x+2}" cy="${point.y+2.5}" r="1.3" fill="${ink}"/>`;
    }
    return faded.replace('</svg>',snake+'</svg>');
  },100);
  const pipeline=(await readFile(`${directory}/pipeline-${theme}.svg`,'utf8')).replace(/<g id="pipeline-packet">[\s\S]*?<\/g>/,'');
  await encode('pipeline',theme,48,frame=>{
    const x=149+(frame/47)*801;
    const overlay=`<circle cx="${x}" cy="174" r="14" fill="${bright}" opacity=".13"/><circle cx="${x}" cy="174" r="7" fill="${bright}"/><circle cx="${x}" cy="174" r="2" fill="${bg}"/>`;
    return pipeline.replace('</svg>',overlay+'</svg>');
  },110);
  const header=(await readFile(`${directory}/header-${theme}.svg`,'utf8')).replace(/<rect x="732" y="219"[^>]*\/>/,'');
  await encode('header',theme,40,frame=>{
    const x=40+frame/39*930;
    const cursor=frame%12<6?`<rect x="732" y="219" width="7" height="13" fill="${bright}"/>`:'';
    return header.replace('</svg>',`<path d="M${x} 279h70" stroke="${accent}" stroke-width="3"/>${cursor}</svg>`);
  },130);
}
