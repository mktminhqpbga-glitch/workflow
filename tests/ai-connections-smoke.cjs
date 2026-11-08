/* Real app + Chromium, provider API and Chrome boundaries use local fixtures. */
const {chromium}=require('playwright');
const {createServer}=require('node:http');
const {readFile}=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {toolbarAction}=require('./toolbar-actions.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.route('https://**/*',async route=>{
  const request=route.request();if(request.url().startsWith('https://api.deepseek.com/')){
   requests.push({url:request.url(),auth:request.headers().authorization,body:request.postDataJSON()});
   return route.fulfill({contentType:'application/json',body:JSON.stringify(request.url().endsWith('/models')?{data:[]}:{choices:[{message:{content:'Answer from '+request.postDataJSON().model}}]})});
  }return route.fulfill({status:404,body:''});
 });
 await page.addInitScript(()=>{
  const storage=area=>({get:async k=>{const value=JSON.parse(area.getItem('fixtureAI')||'{}');return k?{[k]:value[k]}:value;},set:async patch=>area.setItem('fixtureAI',JSON.stringify({...JSON.parse(area.getItem('fixtureAI')||'{}'),...patch}))});
  const tabs=[{id:41,title:'ChatGPT · Original',url:'https://chatgpt.com/c/original',active:true},{id:42,title:'Gemini · Original',url:'https://gemini.google.com/app/original'}];
  window.fixtureMessages=[];
  window.chrome={runtime:{id:'test',getManifest:()=>({version:'0.31.0'}),getURL:p=>location.origin+'/'+p},storage:{local:storage(localStorage),session:storage(sessionStorage)},downloads:{download:async()=>1},scripting:{executeScript:async()=>[]},tabs:{
   query:async({url}={})=>tabs.filter(t=>!url||(Array.isArray(url)?url:[url]).some(p=>new URL(p.replace('*.','')).hostname===new URL(t.url).hostname)),
   get:async id=>tabs.find(t=>t.id===id),update:async id=>tabs.find(t=>t.id===id),create:async()=>{},
   sendMessage:async(id,msg)=>{fixtureMessages.push({id,type:msg.type});return msg.type==='WORKFLOW_AI_GENERATE'?{ok:true,text:'Tab answer '+id,conversationUrl:tabs.find(t=>t.id===id).url}:{ok:true,composer:true,signedIn:true};},onCreated:{addListener(){}},onUpdated:{addListener(){}}
  }};
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/app.html');await page.waitForSelector('#aiConnectionDirectory .ai-directory-card',{state:'attached'});
 await toolbarAction(page,'#settingsBtn');
 assert.equal(await page.locator('.ai-directory-card').count(),16);
 await page.getByRole('searchbox',{name:'Tìm kết nối AI'}).fill('không tồn tại');assert.equal(await page.locator('.ai-directory-card').count(),0);
 await page.getByRole('searchbox',{name:'Tìm kết nối AI'}).fill('');
 const dialog=page.locator('.ai-connection-dialog');
 async function addAPI(name,model,key){
  await page.locator('[data-catalog="deepseek"] .ai-directory-connect').click();
  await dialog.locator('[name=connectionName]').fill(name);await dialog.locator('[name=model]').fill(model);await dialog.locator('[name=apiKey]').fill(key);
  if(name==='DeepSeek cá nhân'){await dialog.getByRole('button',{name:'Kiểm tra kết nối',exact:true}).click();await dialog.locator('.ai-connection-feedback').filter({hasText:'chưa thử tạo nội dung'}).waitFor();}
  await dialog.getByRole('button',{name:'Lưu kết nối',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.ai-connection-dialog').open);
 }
 await addAPI('DeepSeek cá nhân','model-personal','fixture-personal');await addAPI('DeepSeek công việc','model-work','fixture-work');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('fixtureAI')).workflowAIConnections);
 assert.equal(stored.length,2);assert.ok(!JSON.stringify(stored).includes('fixture-personal'));assert.notEqual(stored[0].id,stored[1].id);
 assert.equal(requests.length,1);assert.ok(requests[0].url.endsWith('/models'));
 await page.locator('[data-catalog="claude"] .ai-directory-connect').click();await dialog.getByRole('button',{name:'Tab trình duyệt / Extension',exact:true}).click();assert.equal(await dialog.getByRole('button',{name:'Lưu kết nối',exact:true}).isDisabled(),true);await dialog.getByRole('button',{name:'Hủy',exact:true}).click();
 await page.locator('[data-catalog="chatgpt"] .ai-directory-connect').click();await dialog.getByRole('button',{name:'Tab trình duyệt / Extension',exact:true}).click();await dialog.locator('[name=connectionName]').fill('ChatGPT cá nhân');await dialog.locator('[name=tab]').selectOption('41');await dialog.getByRole('button',{name:'Kiểm tra kết nối',exact:true}).click();await dialog.locator('.ai-connection-feedback').filter({hasText:'Ô chat sẵn sàng'}).waitFor();await dialog.getByRole('button',{name:'Lưu kết nối',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.ai-connection-dialog').open);
 assert.ok((await page.evaluate(()=>fixtureMessages)).every(x=>x.type.includes('CHECK')));
 await page.locator('.ai-settings-modal').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'/tmp/workflow-ai-connections.png'});
 await page.click('#closeSettingsBtn');
 const graph={nodes:[{id:'p',type:'prompt',x:0,y:0,data:{text:'Hello'}},{id:'n',type:'generateText',x:350,y:0,data:{provider:'gemini'}}],edges:[{id:'e',source:'p',sourcePort:'text',target:'n',targetPort:'prompt'}]};
 await page.locator('#workflowFileInput').setInputFiles({name:'connections.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(graph))});
 const node=page.locator('.node[data-id="n"]');await node.locator('.node-common-model-picker').click();await page.locator('.node-common-provider').filter({hasText:'DeepSeek công việc'}).click();await page.locator('.node-common-model').filter({hasText:'model-work'}).click();await node.locator('.node-run-button').click();await node.locator('.status.success').waitFor();
 assert.equal(await node.locator('textarea[readonly]').inputValue(),'Answer from model-work');const generation=requests.find(x=>x.body?.model==='model-work');assert.equal(generation.auth,'Bearer fixture-work');assert.ok(!requests.some(x=>x.body?.model==='model-personal'));
 await toolbarAction(page,'#saveBtn');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('fixtureAI')).museflow?.nodes.find(n=>n.id==='n')?.data.status==='success');
 const exported=await page.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('fixtureAI')).museflow));assert.ok(!exported.includes('fixture-work'));assert.ok(!exported.includes('fixture-personal'));
 await node.locator('.node-common-model-picker').click();await page.locator('.node-common-provider').filter({hasText:'ChatGPT cá nhân'}).click();await page.getByRole('button',{name:'Chọn ChatGPT cá nhân · Tab · ChatGPT · Original',exact:true}).click();await node.locator('.node-run-button').click();await page.waitForFunction(()=>document.querySelector('.node[data-id="n"] textarea[readonly]')?.value==='Tab answer 41');
 assert.equal((await page.evaluate(()=>fixtureMessages.filter(x=>x.type==='WORKFLOW_AI_GENERATE'))).at(-1).id,41);
 await toolbarAction(page,'#saveBtn');
 await page.reload();await page.waitForSelector('#aiConnectionDirectory .ai-directory-connection',{state:'attached'});await toolbarAction(page,'#settingsBtn');assert.equal(await page.locator('.ai-directory-connection').count(),3);
 await page.getByRole('button',{name:'Quản lý DeepSeek cá nhân',exact:true}).click();await dialog.locator('[name=connectionName]').fill('Không được lưu');await dialog.locator('[name=apiKey]').fill('fixture-rejected-key');
 await page.evaluate(()=>{window.originalFixtureSet=chrome.storage.local.set;chrome.storage.local.set=async patch=>{if(patch.workflowAIConnections)throw Error('fixture write failure');return originalFixtureSet(patch);};});
 await dialog.getByRole('button',{name:'Lưu kết nối',exact:true}).click();await dialog.locator('.ai-connection-feedback').filter({hasText:'fixture write failure'}).waitFor();
 assert.equal(await page.evaluate(id=>JSON.parse(sessionStorage.getItem('fixtureAI')).workflowApiKeys[id],stored[0].id),'fixture-personal');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('fixtureAI')).workflowAIConnections.some(x=>x.name==='Không được lưu')),false);
 await page.evaluate(()=>chrome.storage.local.set=originalFixtureSet);await dialog.getByRole('button',{name:'Hủy',exact:true}).click();
 await page.getByRole('button',{name:'Quản lý DeepSeek cá nhân',exact:true}).click();assert.equal(await dialog.locator('[name=apiKey]').inputValue(),'');await dialog.locator('[name=connectionName]').fill('DeepSeek dự phòng');await dialog.getByRole('button',{name:'Lưu kết nối',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.ai-connection-dialog').open);assert.equal(await page.getByRole('button',{name:'Quản lý DeepSeek dự phòng',exact:true}).count(),1);
 await page.getByRole('button',{name:'Xóa DeepSeek dự phòng',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.ai-directory-connection').length===2);
 await page.evaluate(()=>sessionStorage.clear());await page.reload();await page.waitForSelector('#aiConnectionDirectory .ai-directory-connection',{state:'attached'});await toolbarAction(page,'#settingsBtn');assert.match(await page.locator('[data-catalog="deepseek"]').innerText(),/Cần nhập lại API key/);
 await page.setViewportSize({width:390,height:844});await page.locator('.ai-settings-modal').evaluate(el=>el.scrollTop=0);
 assert.equal(await page.locator('.ai-settings-modal').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'Settings must fit a narrow screen');
 await page.screenshot({path:'/tmp/workflow-ai-connections-mobile.png'});
 await page.keyboard.press('Escape');assert.equal(await page.locator('#settingsModal').isVisible(),false);
 await page.locator('.node[data-id="n"] .node-common-model-picker').click();await page.getByRole('button',{name:'Thêm kết nối AI',exact:true}).click();await dialog.waitFor();await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.equal(await page.locator('#settingsModal').isVisible(),true);
 assert.deepEqual(errors,[]);
 console.log('PASS AI connections: catalog/search, two API accounts, read-only check, unsupported tabs blocked, exact tab saved, node uses chosen key/model, secrets excluded from workflow, metadata reload/edit/delete, session expiry, mobile layout, keyboard and add from node.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
