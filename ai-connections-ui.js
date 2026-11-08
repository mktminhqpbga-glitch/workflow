/* Connection settings UI. No credentials enter the persistent catalog records. */
((root)=>{
 'use strict';
 const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const button=(text,action,cls='')=>{const b=el('button',cls,text);b.type='button';b.onclick=action;return b;};
 function mount(host,options){
  const {catalog,labels}=WorkflowAIConnections;
  let filter='all',term='',editing=null,lastFocus=null,busy=false,revision=0,draftId=null,lastInspection=null;
  const status=new Map();
  const heading=el('header','ai-directory-heading');const intro=el('div');intro.append(el('span','ai-directory-eyebrow','KHÔNG GIAN LÀM VIỆC'),el('h2','','Kết nối AI'),el('p','','Chọn đúng AI, tài khoản và cách kết nối cho từng node.'));
  const add=button('＋ Thêm kết nối',()=>open());add.className='primary';const headingActions=el('div','ai-directory-heading-actions');const closeSettings=button('×',()=>options.close());closeSettings.setAttribute('aria-label','Đóng Kết nối AI');headingActions.append(add,closeSettings);heading.append(intro,headingActions);
  const search=el('input');search.type='search';search.placeholder='Tìm tên AI hoặc kết nối…';search.setAttribute('aria-label','Tìm kết nối AI');
  const filters=el('nav','ai-directory-filters');filters.setAttribute('aria-label','Lọc kết nối AI');
  const notice=el('p','ai-directory-notice');notice.setAttribute('role','status');
  const cards=el('div','ai-directory-grid');
  const stats=el('p','ai-directory-stats');
  host.append(heading,search,filters,stats,notice,cards);
  const dialog=el('dialog','ai-connection-dialog');dialog.setAttribute('aria-labelledby','aiConnectionTitle');
  const form=el('form');const title=el('h2','','Thêm kết nối AI');title.id='aiConnectionTitle';
  const close=button('×',()=>dialog.close(),'ai-connection-close');close.setAttribute('aria-label','Đóng thêm kết nối AI');
  function field(label,node){const wrap=el('label','ai-connection-field');wrap.append(el('span','',label),node);form.append(wrap);return wrap;}
  form.append(close,title);
  const provider=el('select');provider.name='provider';provider.setAttribute('aria-label','Nhà cung cấp AI');
  for(const item of catalog){const o=el('option','',item.name);o.value=item.id;provider.append(o);}field('Nhà cung cấp',provider);
  const modes=el('div','ai-connection-modes');modes.setAttribute('role','group');modes.setAttribute('aria-label','Kiểu kết nối');
  const modeInput=el('input');modeInput.type='hidden';modeInput.value='api';form.append(modeInput,modes);
  const name=el('input');name.name='connectionName';name.required=true;name.maxLength=80;field('Tên kết nối',name);
  const capability=el('select');capability.name='capability';const capabilityField=field('Loại đầu ra của model',capability);
  const model=el('input');model.name='model';model.maxLength=200;model.placeholder='Nhập model ID từ tài khoản nhà cung cấp';const modelField=field('Model ID',model);
  const endpoint=el('input');endpoint.name='endpoint';endpoint.type='url';endpoint.placeholder='https://openrouter.ai/api/v1';const endpointField=field('Địa chỉ API',endpoint);
  const endpointHelp=el('small','', 'Máy chủ hỗ trợ: '+WorkflowAI.apiHosts.join(', ')+'. HTTPS, không chứa khóa hoặc tham số URL.');endpointField.append(endpointHelp);
  const key=el('input');key.name='apiKey';key.type='password';key.autocomplete='off';key.spellcheck=false;
  const keyField=field('API key · chỉ giữ trong phiên',key);const reveal=button('Hiện khóa',()=>{key.type=key.type==='password'?'text':'password';reveal.textContent=key.type==='password'?'Hiện khóa':'Ẩn khóa';});reveal.setAttribute('aria-pressed','false');reveal.addEventListener('click',()=>reveal.setAttribute('aria-pressed',String(key.type==='text')));keyField.append(reveal);
  const tabs=el('select');tabs.name='tab';const tabField=field('Tab / cuộc trò chuyện đang mở',tabs);
  const refresh=button('↻ Làm mới tab',()=>void loadTabs());const site=button('↗ Mở website AI',()=>void options.openSite(current().site).catch(showError));tabField.append(refresh,site);
  const help=el('p','ai-connection-help');const feedback=el('p','ai-connection-feedback');feedback.setAttribute('role','status');
  const actions=el('footer','ai-connection-actions');const check=button('Kiểm tra kết nối',()=>void inspect());const cancel=button('Hủy',()=>dialog.close());const save=el('button','primary','Lưu kết nối');save.type='submit';actions.append(check,cancel,save);form.append(help,feedback,actions);dialog.append(form);document.body.append(dialog);
  const current=()=>catalog.find(x=>x.id===provider.value);
  const showError=error=>{feedback.textContent=error.message||String(error);feedback.dataset.state='error';};
  const setBusy=value=>{busy=value;for(const b of form.querySelectorAll('button,input,select'))b.disabled=value;};
  const rawRecord=()=>({id:draftId,catalogId:provider.value,mode:modeInput.value,name:name.value,capability:capability.value,model:model.value,endpoint:endpoint.value,tabId:tabs.value,url:tabs.selectedOptions[0]?.dataset.url});
  async function loadTabs(){
   const token=++revision;tabs.replaceChildren();tabs.append(new Option('Chọn một cuộc trò chuyện',''));refresh.disabled=true;
   try{const list=await options.tabs(current().tab);if(token!==revision)return;
    for(const tab of list){const o=new Option(tab.title||tab.url,String(tab.id));o.dataset.url=tab.url;tabs.append(o);}
    if(editing?.mode==='tab')tabs.value=String(editing.tabId);
    if(!list.length)feedback.textContent='Chưa tìm thấy tab. Mở website, đăng nhập và mở cuộc trò chuyện; sau đó làm mới.';
   }catch(error){if(token===revision)showError(error);}finally{if(token===revision)refresh.disabled=false;}
  }
  function configure(mode){
   revision++;lastInspection=null;feedback.textContent='';const item=current();modeInput.value=mode;
   const api=mode==='api',supported=!!(api?item.api:item.tab);
   modes.replaceChildren();for(const [id,label] of [['api','API'],['tab','Tab trình duyệt / Extension']]){const b=button(label,()=>configure(id));b.setAttribute('aria-pressed',String(mode===id));modes.append(b);}
   for(const node of [capabilityField,modelField,keyField])node.hidden=!api||!supported;
   endpointField.hidden=!api||item.api!=='compatible';tabField.hidden=api||!supported;
   name.closest('label').hidden=!supported;check.disabled=save.disabled=!supported;
   if(!supported){help.textContent=api?'API này chưa có adapter trong ứng dụng; chưa thể lưu hoặc chạy.':'Website này chưa có bộ nối extension được kiểm tra; chưa thể gửi/nhận tự động.';return;}
   if(api){
    capability.replaceChildren();for(const kind of WorkflowAI.providers[item.api].types)capability.append(new Option(labels[kind],kind));
    if(editing?.catalogId===item.id&&editing.mode==='api')capability.value=editing.capability;
    model.value=editing?.catalogId===item.id&&editing.mode==='api'?editing.model:WorkflowAI.models[item.api]?.[capability.value]||'';
    model.required=true;key.placeholder=editing?'Để trống để giữ khóa trong phiên hiện tại':'Nhập API key';
    help.textContent='Khóa không lưu vào workflow. Kiểm tra chỉ đọc danh sách model nếu nhà cung cấp hỗ trợ; không tạo nội dung. Khi chạy node có thể phát sinh phí.';
   }else{model.required=false;help.textContent='Dùng tab đã đăng nhập. Kiểm tra chỉ xác nhận ô nhập sẵn sàng; không gửi prompt. Không đổi cuộc trò chuyện khi tác vụ đang chạy.';void loadTabs();}
  }
  function open(itemId='chatgpt',record=null){
   if(busy)return;editing=record;draftId=record?.id||'connection_'+crypto.randomUUID();lastInspection=null;lastFocus=document.activeElement;provider.value=record?.catalogId||itemId;provider.disabled=false;
   title.textContent=record?'Quản lý kết nối AI':'Thêm kết nối AI';name.value=record?.name||current().name+' cá nhân';key.value='';key.type='password';reveal.textContent='Hiện khóa';reveal.setAttribute('aria-pressed','false');endpoint.value=record?.endpoint||'';
   configure(record?.mode||(current().api?'api':'tab'));dialog.showModal();provider.focus();
  }
  provider.onchange=()=>{editing=null;draftId='connection_'+crypto.randomUUID();key.value='';name.value=current().name+' cá nhân';endpoint.value='';configure(current().api?'api':'tab');};
  capability.onchange=()=>{lastInspection=null;model.value=WorkflowAI.models[current().api]?.[capability.value]||'';};
  for(const input of [key,model,endpoint,name,tabs])input.addEventListener('input',()=>{lastInspection=null;feedback.textContent='';});
  async function inspect(){
   if(busy)return;let record;try{record=WorkflowAIConnections.normalize(rawRecord(),WorkflowAI);}catch(error){showError(error);return;}
   setBusy(true);feedback.textContent='Đang kiểm tra…';
   try{const result=await options.check(record,key.value.trim());feedback.textContent=result.detail;feedback.dataset.state='checked';lastInspection={record:JSON.stringify(record),detail:result.detail};}
   catch(error){showError(error);}finally{setBusy(false);}
  }
  form.onsubmit=async event=>{event.preventDefault();if(busy)return;
   let record;try{record=WorkflowAIConnections.normalize(rawRecord(),WorkflowAI);}catch(error){showError(error);return;}
   setBusy(true);try{await options.save(record,key.value.trim());status.delete(record.id);if(lastInspection?.record===JSON.stringify(record))status.set(record.id,lastInspection.detail);render();dialog.close();notice.textContent='Đã lưu '+record.name+'. '+(status.get(record.id)||(record.mode==='api'?'Chưa xác thực tác vụ tạo nội dung.':'Chưa kiểm tra ô chat.'));}
   catch(error){showError(error);}finally{setBusy(false);}
  };
  dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  dialog.addEventListener('close',()=>{key.value='';revision++;lastFocus?.focus();});
  function render(){
   const records=options.records();cards.replaceChildren();stats.textContent=records.length+' kết nối đã lưu · '+catalog.length+' nhà cung cấp';filters.replaceChildren();
   for(const [id,label] of [['connected','Đã kết nối'],['all','Tất cả'],...Object.entries(labels)]){const b=button(label,()=>{filter=id;render();});b.setAttribute('aria-pressed',String(id===filter));filters.append(b);}
   let count=0;
   for(const item of catalog){
    const saved=records.filter(x=>x.catalogId===item.id);
    if(filter==='connected'&&!saved.length||!['connected','all'].includes(filter)&&!item.kinds.includes(filter))continue;
    if(term&&!([item.name,...saved.map(x=>x.name)].join(' ').toLocaleLowerCase('vi').includes(term)))continue;
    count++;const card=el('article','ai-directory-card');card.dataset.catalog=item.id;
    const top=el('div','ai-directory-card-head'),logo=el('span','ai-directory-logo',item.name.slice(0,2).toUpperCase()),nameBox=el('div');nameBox.append(el('h3','',item.name),el('p','ai-directory-kinds',item.kinds.map(x=>labels[x]).join(' · ')));top.append(logo,nameBox);card.append(top);
    card.append(el('p','ai-directory-support','API: '+(item.api?'Có adapter':'Chưa hỗ trợ')+' · Tab: '+(item.tab?'Có bộ nối':'Chưa hỗ trợ')));
    for(const record of saved){
     const row=el('div','ai-directory-connection');const text=el('div');text.append(el('strong','',record.name),el('small','',record.mode==='api'?'API · '+record.model:'Tab · '+record.url));
     const state=options.state(record);text.append(el('small','ai-connection-state',status.get(record.id)||state));
     const edit=button('Quản lý',()=>open(item.id,record));edit.setAttribute('aria-label','Quản lý '+record.name);
     const remove=button('Xóa',async()=>{if(!confirm('Xóa kết nối “'+record.name+'”?'))return;remove.disabled=true;try{await options.remove(record);status.delete(record.id);render();}catch(error){notice.textContent=error.message;remove.disabled=false;}});remove.setAttribute('aria-label','Xóa '+record.name);row.append(text,edit,remove);card.append(row);
    }
    const connect=button(saved.length?'＋ Thêm kết nối khác':'＋ Kết nối',()=>open(item.id),'ai-directory-connect');connect.disabled=!item.api&&!item.tab;
    if(connect.disabled)connect.textContent='Chưa có adapter';card.append(connect);cards.append(card);
   }
   if(!count)cards.append(el('p','ai-directory-empty','Không tìm thấy kết nối phù hợp. Thử tên hoặc bộ lọc khác.'));
  }
  search.oninput=()=>{term=search.value.trim().toLocaleLowerCase('vi');render();};
  host.closest('.ai-settings-modal').addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();options.close();return;}
   if(event.key!=='Tab')return;
   const nodes=[...host.closest('.ai-settings-modal').querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(n=>!n.disabled&&n.getClientRects().length);
   const first=nodes[0],last=nodes.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
  render();return {render,open};
 }
 root.WorkflowAIConnectionsUI={mount};
})(globalThis);
