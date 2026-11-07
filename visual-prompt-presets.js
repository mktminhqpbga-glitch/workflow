/* I05 image style and V05 video camera controls. All controls alter the
 * actual AI request, never the user's saved visible Prompt. */
(function(root){
'use strict';
const styles=Object.freeze([
 {id:'cinematic',name:'Điện ảnh',group:'Video & phim',instruction:'Cinematic frame, carefully motivated lighting, film color grade, strong depth and visual storytelling.'},
 {id:'documentary',name:'Chân thực',group:'Ảnh chụp',instruction:'Natural documentary photography, believable lighting, realistic textures and authentic scene detail.'},
 {id:'portrait',name:'Chân dung studio',group:'Ảnh chụp',instruction:'Professional studio portrait, deliberate key and fill lights, natural skin texture, controlled backdrop.'},
 {id:'fashion',name:'Thời trang',group:'Ảnh chụp',instruction:'Editorial fashion photography, clean styling, intentional posing and lighting.'},
 {id:'anime',name:'Anime',group:'Minh họa',instruction:'Hand-drawn anime aesthetic, expressive clean linework, detailed cel shading and coherent backgrounds.'},
 {id:'illustration',name:'Minh họa',group:'Minh họa',instruction:'High-quality authored illustration, distinctive shapes and consistent visual language.'},
 {id:'watercolor',name:'Màu nước',group:'Minh họa',instruction:'Traditional watercolor washes, fine paper texture, softly layered pigment and nuanced edges.'},
 {id:'render3d',name:'Đồ họa 3D',group:'Kỹ thuật số',instruction:'Physically based 3D render, believable materials, precise shadows and global illumination.'},
 {id:'minimal',name:'Tối giản',group:'Kỹ thuật số',instruction:'Minimalist art direction, uncluttered composition, negative space and disciplined palette.'},
 {id:'noir',name:'Đen trắng',group:'Video & phim',instruction:'Expressive monochrome film photography, sculpted contrast, atmospheric directional shadows.'},
 {id:'vintage',name:'Hoài cổ',group:'Video & phim',instruction:'Vintage analog photography aesthetic, subtle organic film grain, natural tone response.'},
 {id:'fantasy',name:'Giả tưởng',group:'Kỹ thuật số',instruction:'Imaginative fantasy art, rich environmental storytelling and coherent light and textures.'}
]);
const groups=Object.freeze(['Tất cả',...new Set(styles.map(x=>x.group))]);
const cameraOptions=Object.freeze({
 shot:[['wide','Toàn cảnh'],['medium','Trung cảnh'],['close','Cận cảnh'],['extreme','Đặc tả']],
 angle:[['eye','Ngang tầm mắt'],['low','Từ dưới'],['high','Từ trên'],['overhead','Từ đỉnh']],
 motion:[['static','Máy cố định'],['pan','Máy lia ngang'],['dolly','Máy tiến/lùi'],['orbit','Máy quay vòng'],['handheld','Cầm tay']],
 lens:[['24','24 mm'],['35','35 mm'],['50','50 mm'],['85','85 mm']],
 aperture:[['1.8','f/1.8'],['2.8','f/2.8'],['5.6','f/5.6'],['8','f/8']]
});
function byId(id){return styles.find(style=>style.id===id)||null;}
function stylePrompt(prompt,id){
 const source=String(prompt||'').trim(),style=byId(id);
 return style?[source,'VISUAL STYLE GUIDANCE: '+style.instruction+
   ' Follow the user subject and composition request first. Do not add captions or watermarks.'].filter(Boolean).join('\n\n'):source;
}
function cameraPrompt(prompt,settings={}){
 const input=String(prompt||'').trim();
 if(!settings||Object.keys(settings).length===0)return input;
 const resolved={};
 for(const [key,values] of Object.entries(cameraOptions)){
  const value=String(settings[key]||'');
  if(value&&values.some(([id])=>id===value))resolved[key]=value;
 }
 if(Object.keys(resolved).length===0)return input;
 const value=(key)=>cameraOptions[key].find(([id])=>id===resolved[key])?.[1]||'Tùy ý';
 return [input,'CAMERA DIRECTION FOR VIDEO: shot '+value('shot')+
   '; viewpoint '+value('angle')+'; movement '+value('motion')+
   '; focal length '+value('lens')+'; aperture '+value('aperture')+
   '. Keep the visual action clear; these instructions are camera suggestions, not an extra scene.'].filter(Boolean).join('\n\n');
}
function dialog(title){
 const d=document.createElement('dialog');d.className='visual-preset-dialog';
 const head=document.createElement('header');
 const name=document.createElement('strong');name.textContent=title;
 const close=document.createElement('button');close.type='button';close.textContent='×';
 close.setAttribute('aria-label','Đóng');close.onclick=()=>d.close();
 head.append(name,close);d.append(head);
 d.addEventListener('close',()=>d.remove());
 document.body.append(d);d.showModal();return d;
}
function button(label,onClick){
 const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=onClick;return b;
}
function showStyles(current,onSelect){
 const d=dialog('Chọn phong cách ảnh');
 const search=document.createElement('input');search.type='search';search.placeholder='Tìm phong cách…';
 search.setAttribute('aria-label','Tìm phong cách ảnh');d.append(search);
 const tabs=document.createElement('div');tabs.className='visual-preset-tabs';
 const tiles=document.createElement('div');tiles.className='visual-preset-grid';
 d.append(tabs,tiles);
 let chosen='Tất cả';
 function paint(){
  tabs.replaceChildren(...groups.map(group=>{
   const b=button(group,()=>{chosen=group;paint();});
   if(chosen===group)b.classList.add('is-active');return b;
  }));
  const q=search.value.toLocaleLowerCase('vi').trim();
  const filtered=styles.filter(x=>(chosen==='Tất cả'||x.group===chosen)&&
   (x.name.toLocaleLowerCase('vi').includes(q)||x.group.toLocaleLowerCase('vi').includes(q)));
  tiles.replaceChildren(...filtered.map(style=>{
   const b=button(style.name,()=>{d.close();onSelect(style.id);});
   b.className='visual-preset-tile'+(current===style.id?' is-active':'');
   b.title=style.instruction;return b;
  }));
  if(!filtered.length){const empty=document.createElement('p');empty.textContent='Không tìm thấy phong cách phù hợp.';tiles.append(empty);}
 }
 search.oninput=paint;paint();search.focus();
}
function showCamera(current,onSelect){
 const d=dialog('Công cụ góc máy');
 const form=document.createElement('form');form.method='dialog';
 form.className='visual-camera-form';
 const selected={...current};
 for(const [key,options] of Object.entries(cameraOptions)){
  const label=document.createElement('label');
  label.textContent={shot:'Cỡ cảnh',angle:'Góc máy',motion:'Chuyển động máy',lens:'Tiêu cự',aperture:'Khẩu độ'}[key];
  const select=document.createElement('select');
  for(const [id,name] of options)select.append(new Option(name,id));
  select.value=selected[key]||options[0][0];
  selected[key]=select.value;
  select.onchange=()=>{selected[key]=select.value;};
  label.append(select);form.append(label);
 }
 const save=button('Áp dụng góc máy',()=>{onSelect(selected);d.close();});
 save.className='primary';form.append(save);d.append(form);
}
function mount(node,body,onChange){
 if(!node||!body||!['generateImage','generateVideo'].includes(node.type))return;
 const bar=document.createElement('div');bar.className='visual-node-options';
 if(node.type==='generateImage'){
  const style=byId(node.data.stylePreset);
  bar.append(button('◈ '+(style?.name||'Chọn phong cách'),()=>{
   showStyles(node.data.stylePreset,id=>{node.data.stylePreset=id;onChange?.();});
  }));
 }
 if(node.type==='generateVideo'){
  bar.append(button('▧ Công cụ góc máy',()=>showCamera(node.data.cameraSettings||{},newSettings=>{
   node.data.cameraSettings=newSettings;onChange?.();
  })));
 }
 body.append(bar);
}
root.WorkflowVisualPresets=Object.freeze({styles,groups,cameraOptions,byId,stylePrompt,cameraPrompt,mount});
if(typeof module!=='undefined'&&module.exports)module.exports=root.WorkflowVisualPresets;
})(typeof globalThis!=='undefined'?globalThis:this);
