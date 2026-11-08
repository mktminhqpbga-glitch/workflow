/* One local asset catalog for the main Canvas. Binary payloads use the app media store. */
((root)=>{
 'use strict';
 function create(api){
  const {element:el,button,dialog}=root.WorkflowV3;let items=[],writable=false,writeQueue=Promise.resolve(),captureQueue=Promise.resolve(),panel=null,selection=null,filter='all',query='',latestNodes=[];const seen=new Map(),urls=new Map();
  const ready=(async()=>{try{const saved=(await chrome.storage.local.get('workflowAssetLibrary')).workflowAssetLibrary;if(saved!==undefined&&!Array.isArray(saved))throw Error('Kho tài nguyên không hợp lệ; dữ liệu gốc được giữ nguyên.');items=(saved||[]).filter(x=>x&&typeof x.id==='string'&&['image','video','audio','text'].includes(x.kind)&&typeof x.reference==='string');if(items.length!==(saved||[]).length)throw Error('Kho tài nguyên có mục không đọc được; chưa cho ghi đè.');writable=true;}catch(error){api.report(error);}})();
  function persist(){if(!writable)return Promise.reject(Error('Kho chưa được đọc đầy đủ; không thể ghi đè.'));const snapshot=structuredClone(items),write=writeQueue.catch(()=>{}).then(()=>chrome.storage.local.set({workflowAssetLibrary:snapshot}));writeQueue=write;return write;}
  async function resolve(item){if(item.kind==='text')return item.reference;if(urls.has(item.id))return urls.get(item.id);const url=await api.decode(item.reference);urls.set(item.id,url);return url;}
  async function remember(input){
   await ready;if(!writable)throw Error('Kho tài nguyên không khả dụng.');
   const existing=input.sourceAssetId&&items.find(x=>x.sourceAssetId===input.sourceAssetId);if(existing)return existing;
   const id=crypto.randomUUID(),reference=input.kind==='text'?input.url:await api.encode(input.url,'library:'+id);
   const record={id,name:String(input.name||'Tài nguyên').slice(0,120),kind:input.kind,category:input.category||input.kind,reference,sourceNodeId:input.sourceNodeId||null,sourceAssetId:input.sourceAssetId||null,createdAt:Date.now(),favorite:false};items.push(record);try{await persist();}catch(error){items=items.filter(x=>x.id!==id);throw error;}return record;
  }
  function observe(nodes){
   latestNodes=nodes;const entries=nodes.filter(n=>!n.data?.dockOnly).map(n=>{const data=n.data||{},asset=data.asset||data.lockedAsset,url=asset?.url||data.localDataUrl;if(url){const kind=asset?.kind||(['videoInput','generateVideo'].includes(n.type)?'video':['voiceover','audioInput'].includes(n.type)?'audio':'image');if(!['image','video','audio'].includes(kind))return null;return {url,kind,name:asset?.name||data.fileName||data.customName||api.title(n),sourceNodeId:n.id,sourceAssetId:asset?.id||'legacy:'+n.id,category:n.type==='characterLock'?'character':kind};}if(n.type==='generateText'&&data.status==='success'&&data.text)return {url:data.text,kind:'text',name:data.customName||'Văn bản AI',sourceNodeId:n.id,sourceAssetId:'text:'+n.id+':'+data.text,category:'text'};return null;}).filter(Boolean);
   for(const entry of entries){if(seen.get(entry.sourceNodeId)===entry.sourceAssetId)continue;seen.set(entry.sourceNodeId,entry.sourceAssetId);captureQueue=captureQueue.catch(()=>{}).then(()=>remember(entry)).then(()=>{if(panel?.dialog.open)paint();}).catch(error=>{seen.delete(entry.sourceNodeId);api.report(error);});}
  }
  function stopPreviews(){for(const url of urls.values())if(url.startsWith('blob:'))URL.revokeObjectURL(url);urls.clear();}
  async function open(kind='all',onPick=null){
   await ready;observe(latestNodes);await captureQueue;selection=onPick;filter=kind;query='';
   if(panel?.dialog.open){paint();return;}
   panel=dialog(onPick?'Chọn tài nguyên tham chiếu':'Thư viện tài nguyên');panel.dialog.id='v3AssetLibrary';
   panel.filters=el('div','v3-assets-filter');panel.search=el('input');panel.search.type='search';panel.search.placeholder='Tìm tên tài nguyên…';panel.search.setAttribute('aria-label','Tìm tài nguyên');panel.search.oninput=()=>{query=panel.search.value.trim().toLocaleLowerCase('vi');paint();};
   const upload=el('input');upload.type='file';upload.multiple=true;upload.accept='image/*,video/*,audio/*,text/plain';upload.setAttribute('aria-label','Nhập tài nguyên');upload.onchange=async()=>{upload.disabled=true;try{for(const file of upload.files){if(!file.size||file.size>128*1024*1024)throw Error('Mỗi tệp cần có dữ liệu và không vượt 128 MB.');const kind=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':file.type.startsWith('audio/')?'audio':file.type==='text/plain'?'text':null;if(!kind)throw Error('Tệp cần là ảnh, video, âm thanh hoặc văn bản.');const url=kind==='text'?await file.text():URL.createObjectURL(file);try{await remember({name:file.name,kind,url});}finally{if(url.startsWith('blob:'))URL.revokeObjectURL(url);}}await paint();panel.status.textContent='Đã nhập tài nguyên vào bộ nhớ cục bộ.';}catch(error){panel.status.textContent=error.message;}finally{upload.disabled=false;upload.value='';}};
   panel.grid=el('div','v3-asset-grid');panel.dialog.append(panel.search,panel.filters,upload,panel.grid);panel.dialog.addEventListener('close',()=>{stopPreviews();panel=null;selection=null;});await paint();
  }
  let paintRevision=0;
  async function paint(){
   if(!panel?.dialog.open)return;const current=panel,revision=++paintRevision;current.filters.replaceChildren();
   for(const [id,label] of [['all','Tất cả'],['favorite','♡ Yêu thích'],['image','Ảnh'],['video','Video'],['audio','Âm thanh'],['character','Nhân vật'],['scene','Bối cảnh'],['product','Sản phẩm'],['text','Văn bản']]){const b=button(label,()=>{filter=id;paint();});b.setAttribute('aria-pressed',String(filter===id));current.filters.append(b);}
   current.grid.replaceChildren();const visible=items.filter(x=>(filter==='all'||filter==='favorite'&&x.favorite||x.kind===filter||x.category===filter)&&(!query||x.name.toLocaleLowerCase('vi').includes(query)));
   if(!visible.length){current.grid.append(el('p','','Chưa có tài nguyên phù hợp. Nhập tệp hoặc tạo nội dung trên Canvas.'));return;}
   for(const item of visible){
    const card=el('article','v3-asset-card');card.dataset.assetId=item.id;const name=el('h3','',item.name),meta=el('p','v3-asset-meta',new Date(item.createdAt).toLocaleDateString('vi-VN')+' · '+item.kind);card.append(name,meta);current.grid.append(card);
    try{
     const url=await resolve(item);if(panel!==current||revision!==paintRevision)return;
     const preview=el(item.kind==='text'?'pre':item.kind==='image'?'img':item.kind);if(item.kind==='text'){preview.textContent=url.slice(0,400);}else{preview.src=url;if(item.kind==='image')preview.alt=item.name;else{preview.controls=true;preview.preload='metadata';}}
     const actions=el('div','v3-actions'),favorite=button(item.favorite?'♥':'♡',async()=>{const before=item.favorite;item.favorite=!item.favorite;try{await persist();await paint();}catch(e){item.favorite=before;throw e;}},'v3-favorite');favorite.setAttribute('aria-label','Yêu thích '+item.name);favorite.setAttribute('aria-pressed',String(item.favorite));
     const use=button(selection?'Chọn tài nguyên':item.kind==='video'?'Dùng video':'Dùng trên Canvas',async()=>{try{if(selection)await selection(item,url);else await api.use(item,url);current.dialog.close();}catch(error){current.status.textContent=error.message;}});use.setAttribute('aria-label','Dùng '+item.name);
     const view=button('Xem trước',()=>{if(item.kind==='text'){const d=dialog(item.name);d.dialog.append(el('pre','',url));}else root.WorkflowNodeCommonActions.viewMedia(url,item.kind,item.name);});
     const download=button('↓ Tải',()=>api.download(item,url));actions.append(favorite,view,download,use);
     const category=el('select');category.setAttribute('aria-label','Phân loại '+item.name);for(const [id,label] of [[item.kind,'Theo loại tệp'],['character','Nhân vật'],['scene','Bối cảnh'],['product','Sản phẩm'],['other','Khác']])category.append(new Option(label,id));category.value=item.category;category.onchange=()=>{const before=item.category;item.category=category.value;void persist().catch(error=>{item.category=before;current.status.textContent=error.message;});};
     card.append(preview,category,actions);
    }catch(error){card.append(el('p','',error.message||'Không tải được tài nguyên.'));}
   }
  }
  return {open,observe,remember,ready,flush:()=>captureQueue};
 }
 root.WorkflowAssets={create};
})(globalThis);
