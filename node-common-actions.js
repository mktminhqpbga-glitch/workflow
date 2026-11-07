/* Shared action controls for every real Canvas node.
 * Model/reference/send actions are capability-driven; do not show fake AI features.
 * Translation and expanded editor are provided by shared-node-controls.js.
 */
(function(root){
'use strict';
const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
function button(text,title,handler){const el=create('button','',text);el.type='button';el.title=title;el.setAttribute('aria-label',title);if(handler)el.onclick=event=>{event.stopPropagation();handler(event);};return el;}
function connectedOnly(groups){return (groups||[]).filter(g=>g?.connected&&Array.isArray(g.choices)).map(g=>({...g,choices:g.choices.filter(item=>item?.value)})).filter(g=>g.choices.length>0);}
function stateLabel(status){return status==='running'||status==='queued'||status==='waiting'?'Đang xử lý':status==='error'?'Có lỗi':'Sẵn sàng';}
let currentPopup=null,currentPopupCleanup=null;
function dismissPopup(){
  if(currentPopup){currentPopup.remove();currentPopup=null;}
  if(currentPopupCleanup){currentPopupCleanup();currentPopupCleanup=null;}
}
function menu(anchor,build){
  dismissPopup();
  const popup=create('div','node-common-popup');popup.setAttribute('role','menu');
  build(popup,()=>dismissPopup());
  document.body.append(popup);currentPopup=popup;
  const r=anchor.getBoundingClientRect(),w=Math.min(365,innerWidth-16);
  popup.style.width=w+'px';popup.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';
  const h=popup.getBoundingClientRect().height;popup.style.top=Math.max(8,Math.min(innerHeight-h-8,r.bottom+7))+'px';
  popup.addEventListener('pointerdown',event=>event.stopPropagation());
  const off=event=>{if(event.key==='Escape'||event.type==='pointerdown'&&!popup.contains(event.target)&&event.target!==anchor) dismissPopup();};
  document.addEventListener('pointerdown',off,true);document.addEventListener('keydown',off,true);
  currentPopupCleanup=()=>{document.removeEventListener('pointerdown',off,true);document.removeEventListener('keydown',off,true);};
  return popup;
}
function modelMenu(buttonEl,groups,selected,onPick){
  menu(buttonEl,(panel,close)=>{
    panel.append(create('p','node-common-menu-title','Chọn AI đã kết nối'));
    const options=connectedOnly(groups);
    if(!options.length){panel.append(create('p','node-common-empty','Chưa có AI đã kết nối cho tác vụ này. Mở Cài đặt → Kết nối AI.'));return;}
    for(const group of options){
      const head=button(group.name,'Hiển thị model hoặc tab của '+group.name,()=>{
        const open=!list.hidden;panel.querySelectorAll('.node-common-sublist').forEach(x=>x.hidden=true);list.hidden=open;
      });head.className='node-common-provider';head.append(create('span','node-common-caret','⌄'));panel.append(head);
      const list=create('div','node-common-sublist');list.hidden=group.id!==selected?.provider;panel.append(list);
      for(const item of group.choices){
        const row=button(item.name,'Chọn '+group.name+' · '+item.name,()=>{onPick(group,item);close();});
        row.className='node-common-model'+(selected?.provider===group.id&&selected?.value===item.value?' is-active':'');
        row.prepend(create('span','node-common-model-icon',group.symbol||'✦'));
        if(item.tag)row.append(create('span','node-common-model-tag',item.tag));
        list.append(row);
      }
    }
  });
}
function referenceMenu(anchor,options){
  menu(anchor,(panel,close)=>{
    panel.append(create('p','node-common-menu-title','Thêm tài nguyên tham chiếu'));
    for(const opt of options||[]){
      const row=button(opt.label,opt.title||opt.label,()=>{close();opt.action?.();});
      row.className='node-common-menu-item';row.disabled=!!opt.disabled;
      if(opt.disabled)row.title=opt.title||'Tính năng này chưa được kết nối';
      panel.append(row);
    }
  });
}
function viewMedia(src,kind,title){
  if(!src)return;
  const backdrop=create('div','node-common-lightbox');
  const frame=create('div','node-common-lightbox-frame');
  const heading=create('div','node-common-lightbox-head');
  heading.append(create('span','',title||'Xem kết quả'));
  const close=button('×','Đóng trình xem',()=>backdrop.remove());heading.append(close);
  const media=document.createElement(kind==='video'?'video':kind==='audio'?'audio':'img');
  if(kind==='video'||kind==='audio')media.controls=true;
  if(kind==='img')media.alt=title||'Ảnh kết quả';
  media.src=src;frame.append(heading,media);backdrop.append(frame);
  backdrop.addEventListener('pointerdown',e=>{if(e.target===backdrop)backdrop.remove();});
  backdrop.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();backdrop.remove();}});
  document.body.append(backdrop);close.focus();
}
function attach({node,root:el,body,modelGroups,onModelPick,onTranslate,onReference,onSend,onDownload,onDuplicate,media,readText,hasResult=false}={}){
  if(!node||!el||!body)return;
  const editable=[...body.querySelectorAll('textarea')].find(x=>!x.readOnly&&!x.disabled);
  const isDraft=!!editable;
  if(isDraft){
    // A common model picker, reference selector and send button for equivalent prompts.
    const container=create('div','node-common-composer');container.dataset.nodeId=node.id;
    const actions=create('div','node-common-composer-actions');
    if(modelGroups){
      const groups=typeof modelGroups==='function'?modelGroups():modelGroups;
      const selected=node.data?.provider;
      const current=connectedOnly(groups).find(g=>g.id===selected);
      const selectedItem=current?.choices.find(item=>item.value===(node.data.apiModel||String(node.data.chatTarget?.tabId||'')));
      const title=selectedItem?current.name+' · '+selectedItem.name:'Chọn AI/model';
      const picker=button('✦ '+title,'Chọn AI, model hoặc tab đã kết nối',()=>modelMenu(picker,typeof modelGroups==='function'?modelGroups():modelGroups,{provider:node.data.provider,value:node.data.apiModel||String(node.data.chatTarget?.tabId||'')},onModelPick));
      picker.className='node-common-model-picker';actions.append(picker);
    }
    if(onReference){
      const ref=button('＋ Tham chiếu','Thêm tham chiếu từ Canvas, máy hoặc kho tài sản',()=>referenceMenu(ref,onReference()));
      ref.className='node-common-reference';actions.append(ref);
    }
    if(onSend){
      const status=node.data?.status||'idle';
      const send=button(status==='running'||status==='queued'||status==='waiting'?'◌':status==='error'?'!':'↑',stateLabel(status)+' · Gửi Prompt',()=>{
        if(status==='running'||status==='queued'||status==='waiting')return;
        send.disabled=true;send.textContent='◌';send.classList.add('is-running');
        Promise.resolve().then(()=>onSend()).catch(e=>{send.classList.add('is-error');send.textContent='!';send.title=e.message||'Không gửi được';}).finally(()=>{send.disabled=false;send.classList.remove('is-running');});
      });
      send.className='node-common-send'+(status==='error'?' is-error':status==='running'||status==='queued'||status==='waiting'?' is-running':'');
      send.disabled=['running','queued','waiting'].includes(status);
      if(status==='error'&&node.data.error)send.title=node.data.error;
      actions.append(send);
    }
    if(actions.childElementCount){container.append(actions);body.append(container);}
  }
  // One rule for every node: NO floating toolbar before a real output exists.
  // Even after a result exists, CSS displays it ONLY for a selected node.
  const showMedia=!!media?.url;
  const hasText=typeof readText==='function'&&Boolean(String(readText()||'').trim());
  if(hasResult){
    const top=create('div','node-common-context-tools');
    if((showMedia||hasText)&&onDownload)top.append(button('↓','Tải kết quả',onDownload));
    if(showMedia)top.append(button('⤢','Xem lớn / Zoom',()=>viewMedia(media.url,media.kind,media.name)));
    if(onDuplicate)top.append(button('⧉','Nhân bản Node',onDuplicate));
    if(top.childElementCount){el.append(top);el.classList.add('has-common-context-tools');}
  }
}
root.WorkflowNodeCommonActions=Object.freeze({attach,connectedOnly,modelMenu,referenceMenu,viewMedia,stateLabel,dismissPopup});
})(typeof globalThis!=='undefined'?globalThis:window);
