/* V3 cards wrap the existing live controls; no cloned buttons or second graph. */
((root)=>{
 'use strict';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function button(text,action,title=text){const b=el('button','',text);b.type='button';b.title=title;b.onclick=event=>{event.stopPropagation();void Promise.resolve().then(action).catch(e=>root.WorkflowV3.report(e));};return b;}
 function richHTML(value){
  const parsed=new DOMParser().parseFromString(String(value||''),'text/html'),safe=document.createElement('div');
  const tags=new Set(['B','STRONG','I','EM','S','STRIKE','BR','DIV','P','SPAN','FONT']);
  function copy(source,target){for(const item of source.childNodes){if(item.nodeType===3){target.append(document.createTextNode(item.textContent));continue;}if(item.nodeType!==1)continue;if(!tags.has(item.tagName)){if(!['SCRIPT','STYLE','IFRAME','OBJECT'].includes(item.tagName))copy(item,target);continue;}const n=document.createElement(item.tagName==='FONT'?'span':item.tagName.toLowerCase());for(const key of ['fontWeight','fontStyle','textDecoration','color','fontFamily','fontSize']){const v=item.style?.[key];if(v&&/^[#(),.\s\w%+-]+$/.test(v)&&!/(url|expression|var)\s*\(/i.test(v))n.style[key]=v;}if(item.tagName==='FONT'){const c=item.getAttribute('color'),f=item.getAttribute('face');if(/^#[a-f0-9]{6}$/i.test(c||''))n.style.color=c;if(['Arial','Georgia','monospace','Inter'].includes(f))n.style.fontFamily=f;}copy(item,n);target.append(n);}}
  copy(parsed.body,safe);return safe.innerHTML;
 }
 function editor(node,oldOutput,api){
  const wrap=el('div'),format=el('div','v3-format-bar'),field=el('div','v3-text-editor');field.contentEditable='true';field.setAttribute('role','textbox');field.setAttribute('aria-label','Nội dung văn bản trên thẻ');field.setAttribute('aria-multiline','true');field.dataset.placeholder='Tự viết nội dung…\n\nNhập văn bản tại đây hoặc gửi Prompt bên dưới để tạo bằng AI.';
  if(node.data.richText&&node.data.richTextPlain===node.data.text)field.innerHTML=richHTML(node.data.richText);else field.textContent=node.data.text||'';
  const commit=()=>{node.data.text=field.innerText;node.data.richText=richHTML(field.innerHTML);node.data.richTextPlain=node.data.text;if(oldOutput)oldOutput.value=node.data.text;api.changed(node);};
  field.oninput=commit;field.onpaste=e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));};field.ondrop=e=>{if(e.dataTransfer?.types.includes('text/html')){e.preventDefault();document.execCommand('insertText',false,e.dataTransfer.getData('text/plain'));}};
  const apply=(command,value)=>{field.focus();document.execCommand(command,false,value);commit();};
  for(const [label,command] of [['B','bold'],['I','italic'],['S̶','strikeThrough']]){const b=button(label,()=>apply(command),{bold:'Chữ đậm',italic:'Chữ nghiêng',strikeThrough:'Gạch ngang'}[command]);b.onmousedown=e=>e.preventDefault();format.append(b);}
  const font=el('select');font.setAttribute('aria-label','Phông chữ văn bản');for(const f of ['Inter','Arial','Georgia','monospace'])font.append(new Option(f,f));font.onchange=()=>apply('fontName',font.value);format.append(font);
  const color=el('input');color.type='color';color.value='#e5e5e5';color.setAttribute('aria-label','Màu chữ');color.oninput=()=>apply('foreColor',color.value);format.append(color);
  const zoom=button('⤢',()=>{const d=root.WorkflowV3.dialog('Soạn văn bản');const input=el('textarea');input.value=node.data.text||'';input.setAttribute('aria-label','Nội dung văn bản mở rộng');d.dialog.append(input,button('Lưu văn bản',()=>{api.undo('Sửa văn bản');node.data.text=input.value;delete node.data.richText;api.changed(node);api.render();d.dialog.close();}));});format.append(zoom);
  const shortcuts=el('div','v3-quick-text');shortcuts.append(button('Văn bản → Video',()=>api.connectText(node,'generateVideo')),button('Ảnh → Prompt',()=>api.imagePrompt(node)),button('Văn bản → Giọng đọc',()=>api.connectText(node,'voiceover')));
  wrap.append(format,field,shortcuts);return wrap;
 }
 function shotsDialog(node,api){
  const {dialog:d,status}=root.WorkflowV3.dialog('Bảng phân cảnh');d.classList.add('v3-story-dialog');
  const initial=node.data.shots||[{title:'Cảnh 1',duration:5,image:'',camera:'Ngang tầm mắt',lighting:'Tự nhiên',dialogue:'',sound:'',motion:''}];let rows=structuredClone(initial);
  const steps=el('div','v3-story-steps');steps.append(el('span','','1 · Xác nhận góc máy'),el('span','','2 · Chuẩn bị tài sản'),el('span','','3 · Tổng hợp kịch bản'));d.append(steps);
  const scroll=el('div','v3-table-scroll'),table=el('table','v3-story-table');const head=el('thead'),tr=el('tr');for(const text of ['Cảnh','Giây','Hình ảnh / Prompt ảnh','Góc máy','Ánh sáng','Lời thoại','Âm thanh','Chuyển động',''])tr.append(el('th','',text));head.append(tr);const body=el('tbody');table.append(head,body);scroll.append(table);d.append(scroll);
  function paint(){body.replaceChildren();rows.forEach((row,index)=>{const line=el('tr');for(const key of ['title','duration','image','camera','lighting','dialogue','sound','motion']){const cell=el('td'),input=el(key==='duration'?'input':'textarea');if(key==='duration'){input.type='number';input.min='1';input.max='600';}input.value=row[key]??'';input.setAttribute('aria-label',key+' cảnh '+(index+1));input.oninput=()=>row[key]=key==='duration'?Number(input.value):input.value;cell.append(input);line.append(cell);}const cell=el('td');cell.append(button('×',()=>{rows.splice(index,1);paint();},'Xóa cảnh '+(index+1)));line.append(cell);body.append(line);});}
  const actions=el('div','v3-actions');actions.append(button('＋ Thêm cảnh',()=>{rows.push({title:'Cảnh '+(rows.length+1),duration:5,image:'',camera:'',lighting:'',dialogue:'',sound:'',motion:''});paint();}),button('Chuẩn bị tài sản',()=>api.assets('image')),button('Lưu phân cảnh',()=>{if(!rows.length||rows.some(r=>!r.title.trim()||!Number.isFinite(r.duration)||r.duration<=0||r.duration>600)){status.textContent='Mỗi cảnh cần tên và thời lượng 1–600 giây.';return;}let time=0;const lines=rows.map((row,index)=>{const start=time;time+=row.duration;return 'CẢNH '+(index+1)+' ('+start+'s–'+time+'s): '+row.title+'\nPrompt ảnh: '+row.image+'\nPrompt video: '+[row.motion,row.camera,row.lighting].filter(Boolean).join('. ')+'\nLời thoại: '+row.dialogue+'\nÂm thanh: '+row.sound;});api.undo('Lưu bảng phân cảnh');node.data.shots=structuredClone(rows);node.data.script=lines.join('\n\n');api.changed(node);api.render();d.close();}));d.append(actions);paint();
 }
 function decorate(node,rootEl,api){
  rootEl.classList.add('v3-node');rootEl.dataset.v3Role=node.data.nodeRole||node.type;
  const body=rootEl.querySelector('.node-body');if(!body)return;
  const original=[...body.children],card=el('div','v3-node-card');
  const generated=['generateText','generateImage','generateVideo'].includes(node.type),script=node.type==='masterScript',audio=node.type==='voiceover';
  if(!generated&&!script&&!audio){card.append(...original);body.append(card);for(const p of rootEl.querySelectorAll('.port'))p.textContent='+';return;}
  const composerShell=el('div','v3-composer-shell'),composer=el('div','v3-composer'),advanced=el('details','v3-node-settings');advanced.open=!!node.data.v3OptionsOpen;advanced.append(el('summary','','Thiết lập chi tiết'));
  advanced.ontoggle=()=>{if(!advanced.isConnected)return;node.data.v3OptionsOpen=advanced.open;geometry(api.zoom());};
  composerShell.append(composer);
  const draft=body.querySelector('.node-local-prompt')||(audio?body.querySelector('textarea:not([readonly])'):null),common=body.querySelector('.node-common-composer'),promptActions=body.querySelector('.shared-prompt-actions'),status=body.querySelector('.status');
  const output=body.querySelector('textarea[readonly]'),media=[...body.querySelectorAll(':scope > video,:scope > audio,:scope > .image-link')][0];
  const toggle=button(node.data.v3PromptCollapsed?'⌄ Mở Prompt':'⌃ Thu gọn Prompt',()=>{node.data.v3PromptCollapsed=!node.data.v3PromptCollapsed;composer.classList.toggle('collapsed',node.data.v3PromptCollapsed);toggle.textContent=node.data.v3PromptCollapsed?'⌄ Mở Prompt':'⌃ Thu gọn Prompt';api.changed(node);geometry(api.zoom());});toggle.className='v3-composer-toggle';composer.append(toggle);composer.classList.toggle('collapsed',!!node.data.v3PromptCollapsed);
  if(draft){draft.classList.add('node-local-prompt');composer.append(draft);}if(promptActions)composer.append(promptActions);
  if(node.type==='generateText'){if(output){output.classList.add('v3-legacy-output');card.append(output);}card.append(editor(node,output,api));}
  else if(script){const scriptField=body.querySelector('textarea:not([readonly])');if(scriptField)card.append(scriptField);const panel=button('▤ Bảng phân cảnh',()=>shotsDialog(node,api));card.append(panel);if(!draft){const instruction=el('textarea','node-local-prompt');instruction.placeholder='Yêu cầu dành cho kịch bản…';instruction.setAttribute('aria-label','Prompt kịch bản');instruction.value=node.data.localPrompt||'';instruction.oninput=()=>{node.data.localPrompt=instruction.value;api.changed(node);};composer.append(instruction);}}
  else if(media)card.append(media);
  else{const placeholder=el('div','v3-empty');placeholder.append(el('span','',node.type==='generateVideo'?'▷':audio?'♫':node.data.nodeRole==='director'?'◉':'▧'),el('p','',node.type==='generateVideo'?'Video sẽ xuất hiện tại đây':audio?'Âm thanh sẽ xuất hiện tại đây':node.data.nodeRole==='director'?'Tạo ảnh bối cảnh và chọn góc máy':'Ảnh sẽ xuất hiện tại đây'));card.append(placeholder);}
  if(common)composer.append(common);
  for(const child of original){if([draft,common,promptActions,output,media,status].includes(child)||card.contains(child)||child.contains(card.querySelector('textarea')))continue;
   if(child.matches('.gen-controls,.visual-node-options'))composer.append(child);
   else if(child.matches('.node-generation-actions')){
    const run=child.querySelector('.node-run-button.primary');if(run){run.classList.add('node-common-send');run.classList.toggle('is-running',['running','queued','waiting'].includes(node.data.status));run.classList.toggle('is-error',node.data.status==='error');run.textContent=['running','queued','waiting'].includes(node.data.status)?'◌':node.data.status==='error'?'!':'↑';run.setAttribute('aria-label',node.data.status==='running'?'Dừng tạo nội dung':'Gửi Prompt');(common?.querySelector('.node-common-composer-actions')||composer).append(run);}
    if(child.childElementCount)composer.append(child);
   }else advanced.append(child);
  }
  if(status)composer.append(status);if(advanced.childElementCount>1)composer.append(advanced);
  body.replaceChildren(card,composerShell);
  for(const p of rootEl.querySelectorAll('.port'))p.textContent='+';
 }
 function geometry(zoom=1){
  const z=Math.max(.25,Number(zoom)||1);document.documentElement.style.setProperty('--v3-inverse-zoom',String(1/z));document.documentElement.style.setProperty('--v3-zoom',String(z));
  for(const composer of document.querySelectorAll('.v3-composer')){const shell=composer.parentElement;const h=Math.ceil(composer.offsetHeight/z);if(shell.style.height!==h+'px')shell.style.height=h+'px';}
 }
 root.WorkflowV3Nodes={decorate,geometry,richHTML,shotsDialog};
})(globalThis);
