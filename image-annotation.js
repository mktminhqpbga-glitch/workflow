/* Local image mark-up / yellow note editor shared by generated and uploaded images.
 * Stores normalized vector annotations only; no AI call, source image unchanged.
 */
(function(root){
'use strict';
function clamp01(v){return Math.max(0,Math.min(1,Number.isFinite(Number(v))?Number(v):0));}
function normalizePoint(x,y,width,height){
  if(!(width>0&&height>0))throw new Error('Vùng ảnh không có kích thước hợp lệ.');
  return {x:clamp01(x/width),y:clamp01(y/height)};
}
function sanitize(input){
  if(!input||typeof input!=='object')return {strokes:[],note:''};
  const strokes=Array.isArray(input.strokes)?input.strokes.slice(0,200).filter(s=>['pen','rect','point','text'].includes(s?.tool)).map(s=>({
    tool:s.tool,color:/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#f97316',
    size:Math.max(1,Math.min(20,Number(s.size)||3)),
    points:(Array.isArray(s.points)?s.points:[]).slice(0,2500).map(p=>({x:clamp01(p.x),y:clamp01(p.y)})),
    text:String(s.text||'').slice(0,100)
  })).filter(s=>s.points.length):[];
  return {strokes,note:String(input.note||'').slice(0,2000)};
}
let openPanel=null;
function close(){openPanel?.remove();openPanel=null;}
function open({url,initial,onSave,anchor}={}){
  if(typeof document==='undefined')throw new Error('Trình đánh dấu yêu cầu cửa sổ ứng dụng.');
  if(!url||typeof onSave!=='function')throw new Error('Chưa có ảnh hoặc chức năng lưu ghi chú.');
  close();
  const state=sanitize(initial),strokes=state.strokes.slice(),redo=[];
  let tool='pen',draft=null,size=3,color='#f97316';
  const el=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;};
  const panel=el('div','workflow-image-note-editor');panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Đánh dấu ảnh và ghi chú');
  const head=el('div','image-note-head');head.append(el('strong','', 'Đánh dấu ảnh'));
  const dismiss=el('button','image-note-close','×');dismiss.type='button';dismiss.title='Đóng, không lưu';dismiss.onclick=close;head.append(dismiss);
  const toolbar=el('div','image-note-toolbar');
  const tools=[['pen','✎ Vẽ'],['rect','▭ Vùng'],['point','● Điểm'],['text','T Chữ']];
  const buttons={};
  for(const [value,label] of tools){
    const btn=el('button','image-note-tool',label);btn.type='button';btn.setAttribute('aria-pressed',String(value===tool));
    btn.onclick=()=>{tool=value;for(const [key,item] of Object.entries(buttons))item.setAttribute('aria-pressed',String(key===value));};
    toolbar.append(btn);buttons[value]=btn;
  }
  const undo=el('button','image-note-tool','↶');undo.type='button';undo.title='Hoàn tác nét cuối';
  const redoButton=el('button','image-note-tool','↷');redoButton.type='button';redoButton.title='Làm lại nét';
  toolbar.append(undo,redoButton);
  const colors=el('input','image-note-color');colors.type='color';colors.value=color;colors.title='Màu nét';colors.oninput=()=>color=colors.value;
  const thickness=el('input','image-note-size');thickness.type='range';thickness.min='1';thickness.max='20';thickness.value='3';thickness.title='Độ dày nét';thickness.oninput=()=>size=Number(thickness.value);
  toolbar.append(colors,thickness);
  const stage=el('div','image-note-stage');
  const image=el('img','image-note-image');image.src=url;image.alt='Ảnh nguồn — không bị thay đổi';
  const canvas=el('canvas','image-note-canvas');canvas.setAttribute('aria-label','Vùng vẽ chú thích lên ảnh');
  stage.append(image,canvas);
  const textField=el('textarea','image-note-textarea');textField.value=state.note;textField.placeholder='Ghi chú cho ảnh…';textField.maxLength=2000;textField.rows=2;
  const footer=el('div','image-note-footer');
  const cancel=el('button','','Hủy');cancel.type='button';cancel.onclick=close;
  const save=el('button','image-note-save','Lưu ghi chú');save.type='button';
  save.onclick=()=>{
    const payload=sanitize({strokes,note:textField.value});
    try{onSave(payload);close();}catch(error){warning.textContent=error.message||'Không lưu được ghi chú.';}
  };
  const warning=el('small','image-note-warning','');
  footer.append(cancel,save);
  panel.append(head,toolbar,stage,textField,warning,footer);
  document.body.append(panel);openPanel=panel;
  if(anchor?.getBoundingClientRect){
    const rect=anchor.getBoundingClientRect();
    panel.style.left=Math.max(8,Math.min(innerWidth-490-8,rect.right+12))+'px';
    panel.style.top=Math.max(8,Math.min(innerHeight-560-8,rect.top))+'px';
  }
  function resize(){
    const width=Math.max(1,Math.round(stage.clientWidth)),height=Math.max(1,Math.round(stage.clientHeight));
    if(width!==canvas.width||height!==canvas.height){canvas.width=width;canvas.height=height;}
    draw();
  }
  function drawStroke(ctx,s){
    const pts=s.points||[];if(!pts.length)return;
    ctx.strokeStyle=s.color;ctx.fillStyle=s.color;ctx.lineWidth=s.size;ctx.lineCap='round';ctx.lineJoin='round';
    const p=pts.map(({x,y})=>({x:x*canvas.width,y:y*canvas.height}));
    if(s.tool==='pen'){ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);for(const point of p.slice(1))ctx.lineTo(point.x,point.y);if(p.length===1){ctx.lineTo(p[0].x+.1,p[0].y+.1);}ctx.stroke();}
    if(s.tool==='rect'&&p.length>1){ctx.strokeRect(p[0].x,p[0].y,p.at(-1).x-p[0].x,p.at(-1).y-p[0].y);}
    if(s.tool==='point'){ctx.beginPath();ctx.arc(p[0].x,p[0].y,Math.max(3,s.size*1.4),0,Math.PI*2);ctx.fill();}
    if(s.tool==='text'){ctx.font=Math.max(12,s.size*5)+'px sans-serif';ctx.fillText(s.text||'Ghi chú',p[0].x,p[0].y);}
  }
  function draw(){const ctx=canvas.getContext('2d');if(!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);for(const s of strokes)drawStroke(ctx,s);if(draft)drawStroke(ctx,draft);}
  const position=e=>{const box=canvas.getBoundingClientRect();return normalizePoint(e.clientX-box.left,e.clientY-box.top,box.width,box.height);};
  canvas.onpointerdown=e=>{
    if(e.button!==0)return;
    e.preventDefault();e.stopPropagation();
    const start=position(e);
    const text=tool==='text'?window.prompt('Chữ ghi trên ảnh (không quá 100 ký tự):',''):'';
    if(tool==='text'&&text===null)return;
    draft={tool,color,size,points:[start],text:String(text||'').slice(0,100)};
    if(tool==='text'||tool==='point'){strokes.push(draft);draft=null;redo.length=0;draw();return;}
    canvas.setPointerCapture?.(e.pointerId);draw();
  };
  canvas.onpointermove=e=>{if(!draft)return;const pt=position(e);if(draft.tool==='rect')draft.points=[draft.points[0],pt];else if(draft.points.length<2500)draft.points.push(pt);draw();};
  const finish=e=>{if(!draft)return;const pt=position(e);if(draft.tool==='rect')draft.points=[draft.points[0],pt];strokes.push(draft);draft=null;redo.length=0;try{canvas.releasePointerCapture(e.pointerId);}catch{}draw();};
  canvas.onpointerup=finish;canvas.onpointercancel=e=>{draft=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}draw();};
  undo.onclick=()=>{if(strokes.length){redo.push(strokes.pop());draw();}};
  redoButton.onclick=()=>{if(redo.length){strokes.push(redo.pop());draw();}};
  image.addEventListener('load',()=>{
    if(image.naturalWidth>0&&image.naturalHeight>0){
      const aspect=image.naturalWidth/image.naturalHeight;
      // Keep the drawing surface exactly aligned with displayed pixels, not
      // with a letterboxed 4:3 wrapper (portrait uploads are common).
      const maxWidth=Math.max(100,Math.min(456,panel.clientWidth-24));
      const width=Math.min(maxWidth,330*aspect);
      stage.style.width=Math.round(width)+'px';
      stage.style.aspectRatio=String(aspect);
      stage.style.maxHeight='330px';
    }
    resize();
  });
  requestAnimationFrame(resize);
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}});
  dismiss.focus();
  return panel;
}
const api=Object.freeze({open,close,sanitize,normalizePoint});
root.WorkflowImageAnnotations=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
