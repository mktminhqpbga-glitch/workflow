const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

// Execute the actual routing function with Chrome transport boundaries stubbed.
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const routing=source.slice(source.indexOf('  async function otherTabMessage('),source.indexOf('  function clearCanvasPrompts('));
function fixture(latestUrl,reply={ok:true,text:'Original answer',conversationUrl:'https://chatgpt.com/c/original'}){
 const original={id:1,url:'https://chatgpt.com/c/original'};
 const context={WorkflowAI:{providers:{chatgpt:{name:'ChatGPT',urls:[]}}},aiChatTargets:{},aiTabs:new Map(),
  chooseChat:()=>original,chatKey:url=>url,sendMuseTabMessage:async(_id,msg)=>msg.type==='WORKFLOW_AI_CHECK'?{ok:true,composer:true}:reply,
  chrome:{tabs:{query:async()=>[original],update:async()=>{},get:async()=>({id:1,url:latestUrl})},scripting:{executeScript:async()=>{}}}};
 vm.createContext(context);vm.runInContext(routing+';globalThis.route=otherTabMessage;',context);return context;
}
test('AI routing rejects a tab switched after the bridge returned its answer',async()=>{
 const c=fixture('https://chatgpt.com/c/unrelated');
 await assert.rejects(c.route('chatgpt',{type:'WORKFLOW_AI_GENERATE',requestId:'r'}),/Cuộc trò chuyện đã thay đổi/);
 assert.equal(c.aiTabs.size,0);
});
test('AI routing preserves the verified original target',async()=>{
 const c=fixture('https://chatgpt.com/c/original');const r=await c.route('chatgpt',{type:'WORKFLOW_AI_GENERATE',requestId:'r'});
 assert.equal(r.text,'Original answer');assert.equal(r.chatTarget.url,'https://chatgpt.com/c/original');assert.equal(c.aiTabs.size,0);
});
test('failed AI response never adopts the current tab as a new target',async()=>{
 const c=fixture('https://chatgpt.com/c/unrelated',{ok:false,error:'Stopped'});const r=await c.route('chatgpt',{type:'WORKFLOW_AI_GENERATE',requestId:'r'});
 assert.equal(r.ok,false);assert.equal(r.chatTarget,undefined);assert.equal(c.aiTabs.size,0);
});
test('AI routing rejects an answer claiming a different conversation even if the tab returned',async()=>{
 const c=fixture('https://chatgpt.com/c/original',{ok:true,text:'Wrong answer',conversationUrl:'https://chatgpt.com/c/unrelated'});
 await assert.rejects(c.route('chatgpt',{type:'WORKFLOW_AI_GENERATE',requestId:'r'}),/Cuộc trò chuyện đã thay đổi/);
 assert.equal(c.aiTabs.size,0);
});
