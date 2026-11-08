import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import '../ai-providers.js';
import '../ai-connections.js';
const ai=globalThis.WorkflowAI,connections=globalThis.WorkflowAIConnections,originalFetch=globalThis.fetch;
const id='connection_11111111-1111-4111-8111-111111111111';
const json=value=>new Response(JSON.stringify(value));
afterEach(()=>{globalThis.fetch=originalFetch;delete ai.providers[id];delete ai.models[id];});
test('connection metadata excludes secrets and limits each API connection to its model capability',async()=>{
 const r=connections.register({id,catalogId:'deepseek',name:'Work',mode:'api',capability:'text',model:'my-model',key:'never-save',token:'never-save'},ai);
 assert.equal(JSON.stringify(r).includes('never-save'),false);assert.deepEqual(ai.providers[id].types,['text']);
 let body,auth;globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.deepseek.com/v1/chat/completions');body=JSON.parse(options.body);auth=options.headers.Authorization;return json({choices:[{message:{content:'Answer'}}]});};
 const result=await ai.api(id,{mediaType:'text',prompt:'Hello',rules:'Rules'},'session-only');
 assert.equal(result.text,'Answer');assert.equal(body.model,'my-model');assert.equal(body.messages[0].content,'Rules');assert.equal(auth,'Bearer session-only');
 assert.throws(()=>ai.validate(id,{mediaType:'image'}));assert.throws(()=>ai.validate(id,{mediaType:'text',referenceImages:['image']}),/văn bản/);
});
test('each compatible provider uses its own endpoint and rejects empty responses',async()=>{
 for(const provider of ['deepseek','qwen','grok','mistral','perplexity']){
  globalThis.fetch=async(url,options)=>{assert.equal(url,ai.providers[provider].endpoint+'/chat/completions');assert.equal(options.redirect,'error');return json({choices:[{message:{content:'OK'}}]});};
  assert.equal((await ai.api(provider,{mediaType:'text',model:'user-model',prompt:'test'},'key')).text,'OK');
 }
 globalThis.fetch=async()=>json({choices:[]});await assert.rejects(ai.api('deepseek',{mediaType:'text',model:'x',prompt:'x'},'key'),/văn bản/);
 globalThis.fetch=async()=>json({choices:[{finish_reason:'length',message:{content:'Truncated'}}]});await assert.rejects(ai.api('deepseek',{mediaType:'text',model:'x',prompt:'x'},'key'),/chưa nhận được văn bản hoàn chỉnh/);
});
test('Claude uses Messages API with separate system instructions and bounded output',async()=>{
 globalThis.fetch=async(url,o)=>{assert.equal(url,'https://api.anthropic.com/v1/messages');assert.equal(o.headers['x-api-key'],'claude-key');assert.equal(o.headers.Authorization,undefined);const body=JSON.parse(o.body);assert.equal(body.system,'System');assert.equal(body.max_tokens,4096);return json({content:[{type:'thinking',text:'hidden'},{type:'text',text:'Claude answer'}]});};
 assert.equal((await ai.api('anthropic',{mediaType:'text',model:'chosen',prompt:'hello',rules:'System'},'claude-key')).text,'Claude answer');
});
test('custom endpoints reject credential leaks, private hosts and unsafe schemes before fetch',async()=>{
 let count=0;globalThis.fetch=async()=>{count++;return json({});};
 for(const endpoint of ['http://api.deepseek.com/v1','https://127.0.0.1/v1','https://evil.test/v1','https://key@api.openai.com/v1','https://api.openai.com/v1?key=secret','https://api.openai.com:999/v1'])assert.throws(()=>ai.endpoint(endpoint));
 assert.equal(count,0);
 const r=connections.register({id,catalogId:'compatible',name:'Custom',mode:'api',model:'chosen',capability:'text',endpoint:'https://openrouter.ai/api/v1/'},ai);
 assert.equal(r.endpoint,'https://openrouter.ai/api/v1');
 globalThis.fetch=async(url,o)=>{assert.equal(url,'https://openrouter.ai/api/v1/chat/completions');return json({choices:[{message:{content:'Custom'}}]});};
 assert.equal((await ai.api(id,{mediaType:'text',prompt:'Hi'},'key')).text,'Custom');
});
test('tab connections validate provider ownership and retain exact conversation',()=>{
 const r=connections.register({id,catalogId:'chatgpt',name:'Personal',mode:'tab',tabId:42,url:'https://chatgpt.com/c/exact'},ai);
 assert.equal(r.url,'https://chatgpt.com/c/exact');assert.equal(ai.providers[id].baseProvider,'chatgpt');
 assert.throws(()=>connections.normalize({...r,url:'https://chatgpt.com.evil.test/c/a'},ai));
 assert.throws(()=>connections.normalize({...r,catalogId:'claude'},ai),/adapter/);
});
test('credential checks read model listings and never submit generation',async()=>{
 globalThis.fetch=async(url,o)=>{assert.equal(url,'https://api.deepseek.com/v1/models');assert.equal(o.method,undefined);return json({data:[]});};
 assert.equal((await ai.checkAPI('deepseek','key')).ok,true);
 await assert.rejects(ai.checkAPI('perplexity','key'),/không tạo nội dung/);
 const controller=new AbortController();controller.abort();await assert.rejects(ai.api('deepseek',{mediaType:'text',model:'x'},'key',controller.signal),{name:'AbortError'});
});
