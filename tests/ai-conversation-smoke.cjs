const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
for(const host of ['chatgpt.com','gemini.google.com']){
const page=await browser.newPage();await page.route('https://'+host+'/**',r=>r.fulfill({contentType:'text/html',body:'<main></main><form><textarea id="prompt-textarea" aria-label="Message"></textarea><button aria-label="Send message" type="button">Send</button></form>'}));await page.goto('https://'+host+'/c/original');await page.clock.install();
await page.evaluate(()=>{window.sent=0;window.result=null;window.chrome={runtime:{id:'test',sendMessage:async()=>{},onMessage:{addListener:f=>window.handler=f}}};document.querySelector('button').onclick=()=>{sent++;document.querySelector('textarea').value='';const u=document.createElement(location.hostname==='chatgpt.com'?'article':'user-query');u.dataset.messageAuthorRole='user';u.textContent='Original request';document.querySelector('main').append(u);};});
for(const f of ['composer-controls.js','ai-bridge.js'])await page.addScriptTag({path:require('node:path').resolve(__dirname,'..',f)});
await page.evaluate(()=>handler({type:'WORKFLOW_AI_GENERATE',requestId:'switch-test',mediaType:'text',prompt:'Original request'},{id:'test'},r=>window.result=r));await page.clock.runFor(1000);assert.equal(await page.evaluate(()=>sent),1);
await page.evaluate(()=>{history.pushState({},'', '/c/unrelated');document.querySelector('main').replaceChildren();const r=document.createElement(location.hostname==='chatgpt.com'?'article':'model-response');r.dataset.messageAuthorRole='assistant';r.textContent='ANSWER FROM DIFFERENT CHAT';document.querySelector('main').append(r);});await page.clock.runFor(7000);
const result=await page.evaluate(()=>result);console.log(host,JSON.stringify(result));assert.equal(result?.ok,false,'Must reject results after switching conversations');assert.match(result.error,/Cuộc trò chuyện đã thay đổi/);assert.equal(result.text,undefined);assert.equal(await page.evaluate(()=>sent),1);console.log('PASS reject switched conversation: '+host);await page.close();
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
