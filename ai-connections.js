/* Public connection metadata only. Keys are owned by the application's session store. */
((root)=>{
 'use strict';
 const catalog=[
  {id:'chatgpt',name:'ChatGPT / OpenAI',kinds:['text','image'],api:'openai',tab:'chatgpt',site:'https://chatgpt.com/'},
  {id:'gemini',name:'Gemini / Veo',kinds:['text','image','video'],api:'google',tab:'gemini',site:'https://gemini.google.com/app'},
  {id:'muse',name:'Muse.ai',kinds:['image','video'],tab:'muse',site:'https://muse.ai/'},
  {id:'claude',name:'Claude',kinds:['text'],api:'anthropic',site:'https://claude.ai/'},
  {id:'deepseek',name:'DeepSeek',kinds:['text'],api:'deepseek',site:'https://chat.deepseek.com/'},
  {id:'qwen',name:'Qwen',kinds:['text'],api:'qwen',site:'https://chat.qwen.ai/'},
  {id:'grok',name:'Grok',kinds:['text'],api:'grok',site:'https://grok.com/'},
  {id:'mistral',name:'Mistral',kinds:['text'],api:'mistral',site:'https://chat.mistral.ai/'},
  {id:'perplexity',name:'Perplexity',kinds:['text'],api:'perplexity',site:'https://www.perplexity.ai/'},
  {id:'fal',name:'fal.ai',kinds:['video'],api:'fal',site:'https://fal.ai/'},
  {id:'replicate',name:'Replicate',kinds:['image','video'],site:'https://replicate.com/'},
  {id:'kling',name:'Kling',kinds:['video'],site:'https://app.klingai.com/'},
  {id:'runway',name:'Runway',kinds:['video'],site:'https://app.runwayml.com/'},
  {id:'luma',name:'Luma',kinds:['video'],site:'https://dream-machine.lumalabs.ai/'},
  {id:'elevenlabs',name:'ElevenLabs',kinds:['audio'],site:'https://elevenlabs.io/'},
  {id:'compatible',name:'API tương thích OpenAI',kinds:['text'],api:'compatible'}
 ];
 const labels={text:'Văn bản',image:'Ảnh',video:'Video',audio:'Âm thanh'};
 function normalize(raw,ai){
  const item=catalog.find(x=>x.id===raw?.catalogId);
  if(!item||!['api','tab'].includes(raw.mode))throw new Error('Chọn nhà cung cấp và kiểu kết nối hợp lệ.');
  const base=raw.mode==='api'?item.api:item.tab;
  if(!base||!ai.providers[base])throw new Error('Kiểu kết nối này chưa có adapter.');
  if(!/^connection_[a-f0-9-]{36}$/.test(raw.id||''))throw new Error('Mã kết nối không hợp lệ.');
  const name=String(raw.name||'').trim();if(!name||name.length>80)throw new Error('Tên kết nối cần từ 1 đến 80 ký tự.');
  const record={id:raw.id,catalogId:item.id,name,mode:raw.mode,baseProvider:base};
  if(raw.mode==='api'){
   const capability=String(raw.capability||'');if(!ai.providers[base].types.includes(capability))throw new Error('Loại đầu ra không được adapter hỗ trợ.');
   const model=String(raw.model||'').trim();if(!model||model.length>200)throw new Error('Nhập model ID hợp lệ.');
   Object.assign(record,{capability,model});
   if(base==='compatible')record.endpoint=ai.endpoint(raw.endpoint);
  }else{
   const tabId=Number(raw.tabId),url=String(raw.url||'');
   if(raw.tabId===''||raw.tabId==null||!Number.isInteger(tabId)||tabId<0)throw new Error('Chọn một tab AI đang mở.');
   const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.port)throw new Error('URL tab AI không hợp lệ.');
   const allowed=ai.providers[base].urls.some(pattern=>{const host=new URL(pattern.replace('*.', '')).hostname;return parsed.hostname===host||(pattern.includes('*.')&&parsed.hostname.endsWith('.'+host));});
   if(!allowed)throw new Error('Tab không thuộc nhà cung cấp đã chọn.');
   record.tabId=tabId;record.url=parsed.origin+parsed.pathname.replace(/\/$/,'');
  }
  return record;
 }
 function register(record,ai){
  const r=normalize(record,ai),base=ai.providers[r.baseProvider];
  ai.providers[r.id]={...base,name:r.name+' · '+(r.mode==='api'?'API':'Tab'),baseProvider:r.baseProvider,connectionId:r.id,
   ...(r.mode==='api'?{types:[r.capability],...(r.endpoint?{endpoint:r.endpoint}:{})}:{} )};
  if(r.mode==='api')ai.models[r.id]={[r.capability]:r.model};else delete ai.models[r.id];
  return r;
 }
 root.WorkflowAIConnections={catalog,labels,normalize,register};
})(globalThis);
