/* Real V3 app: persistent browser storage, real media files, simulated provider boundary. */
const {chromium}=require('playwright');
const {createServer}=require('node:http');
const {readFile}=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {toolbarAction}=require('./toolbar-actions.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
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


 const fs=require('node:fs'),os=require('node:os'),{execFileSync}=require('node:child_process');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-v3-'));
 try{
 const out=process.env.V3_SCREENSHOTS; if(out)fs.mkdirSync(out,{recursive:true});
 const shot=async name=>{if(out)await page.screenshot({path:path.join(out,name+'.png')});};
 const importGraph=async graph=>{await page.locator('#workflowFileInput').setInputFiles({name:'v3-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(graph))});await page.waitForSelector('.node[data-id="'+graph.nodes[0].id+'"]');await page.click('#fitCanvas');};
 const graph={nodes:[{id:'text',type:'generateText',x:80,y:120,data:{provider:'gemini',text:'Nội dung dự án',localPrompt:'Viết lời giới thiệu ngắn',status:'idle'}},{id:'image',type:'generateImage',x:580,y:120,data:{provider:'gemini',localPrompt:'Ánh sáng buổi sáng',size:'16:9'}},{id:'script',type:'masterScript',x:1080,y:120,data:{script:'CẢNH 1: Mở đầu'}}],edges:[],notes:[{id:'note',x:80,y:850,width:280,height:160,text:'Ghi chú cần lưu nguyên vẹn'}]};
 await importGraph(graph);
 assert.equal(await page.locator('.v3-main-dock .compact-toggle').count(),6);
 assert.equal(await page.locator('.node-common-context-tools:visible').count(),0);
 await toolbarAction(page,'#addNodeMenuBtn');assert.equal(await page.locator('#addNodeMenu [data-add]:visible').count(),8);await page.keyboard.press('Escape');
 const prompt=page.locator('.node[data-id="text"] .node-local-prompt');await prompt.fill('Prompt gốc được giữ nguyên');
 await page.locator('.node[data-id="text"] .shared-prompt-expand').click();await page.getByRole('textbox',{name:'Nội dung Prompt mở rộng',exact:true}).fill('Prompt gốc được giữ nguyên');assert.equal(await page.locator('.shared-prompt-expanded .node-common-model-picker:visible').count(),1);assert.equal(await page.locator('.shared-prompt-expanded .node-common-send:visible').count(),1);await page.locator('.shared-prompt-shrink').click();assert.equal(await prompt.inputValue(),'Prompt gốc được giữ nguyên');
 const width=await prompt.evaluate(e=>e.getBoundingClientRect().width);await page.click('#zoomOut');await page.click('#zoomOut');const zoomWidth=await prompt.evaluate(e=>e.getBoundingClientRect().width);assert.ok(Math.abs(width-zoomWidth)<2,`Prompt width ${width} -> ${zoomWidth}`);
 await page.locator('.node[data-id="text"] .v3-composer-toggle').click();assert.equal(await prompt.isVisible(),false);await page.locator('.node[data-id="text"] .v3-composer-toggle').click();assert.equal(await prompt.inputValue(),'Prompt gốc được giữ nguyên');
 await page.locator('.node[data-id="text"] .v3-text-editor').fill('Văn bản sửa trên thẻ');
 await page.locator('.node[data-id="text"] .v3-text-editor').press('ControlOrMeta+a');await page.locator('.node[data-id="text"] .v3-format-bar button[title="Chữ đậm"]').click();assert.ok(await page.locator('.node[data-id="text"] .v3-text-editor b,.node[data-id="text"] .v3-text-editor strong').count());
 await page.locator('.node[data-id="text"] button').filter({hasText:'Văn bản → Video'}).click();await toolbarAction(page,'#saveBtn');await page.waitForFunction(()=>{const graph=JSON.parse(localStorage.getItem('fixtureAI')).museflow;return graph.edges.some(e=>e.source==='text'&&graph.nodes.find(n=>n.id===e.target)?.type==='generateVideo'&&e.targetPort==='prompt');});

 await page.locator('.node[data-id="script"] button').filter({hasText:'Bảng phân cảnh'}).click();await page.getByRole('textbox',{name:'title cảnh 1',exact:true}).fill('Mở cửa');await page.getByRole('textbox',{name:'image cảnh 1',exact:true}).fill('Khu vườn buổi sáng');await page.getByRole('button',{name:'Lưu phân cảnh',exact:true}).click();
 await page.locator('[aria-label="Thêm ghi chú Canvas"]').click();assert.equal(await page.locator('.canvas-note').count(),2);
 await toolbarAction(page,'#saveBtn');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('fixtureAI')).museflow.nodes.find(n=>n.id==='text').data.text==='Văn bản sửa trên thẻ');
 await page.reload();await page.waitForSelector('.node[data-id="text"]');assert.equal(await page.locator('.node[data-id="text"] .node-local-prompt').inputValue(),'Prompt gốc được giữ nguyên');assert.equal(await page.locator('.node[data-id="text"] .v3-text-editor').innerText(),'Văn bản sửa trên thẻ');assert.equal(await page.locator('.canvas-note').count(),2);await page.click('#fitCanvas');await shot('01-canvas-va-note');
 await page.click('#v3SharePrompts');assert.ok((await page.getByRole('textbox',{name:'Prompt tổng và sơ đồ kết nối'}).inputValue()).includes('Prompt gốc được giữ nguyên'));await shot('02-chia-se-prompt');await page.getByRole('button',{name:'Đóng',exact:true}).click();
 await page.click('#v3Appearance');await page.getByLabel('Chế độ giao diện',{exact:true}).selectOption('light');await page.getByRole('button',{name:'Lưu giao diện',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.getByRole('button',{name:'Đóng Cài đặt giao diện'}).click();await shot('03-che-do-sang');await page.click('#v3Appearance');await page.getByLabel('Chế độ giao diện',{exact:true}).selectOption('dark');await page.getByRole('button',{name:'Lưu giao diện',exact:true}).click();await page.getByRole('button',{name:'Đóng Cài đặt giao diện'}).click();
 await page.click('#v3MinimapToggle');assert.equal(await page.locator('#v3Minimap').isVisible(),true);await page.click('#v3Minimap',{position:{x:100,y:60}});await page.click('#v3EdgesToggle');assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('v3-hide-edges')),true);await page.click('#v3EdgesToggle');
 await page.click('#v3WorkflowPicker');await page.getByRole('button',{name:'＋ Workflow mới',exact:true}).click();assert.equal(await page.locator('.node').count(),0);const row=page.locator('.v3-workflow-row').filter({has:page.locator('input[value="Khung vẽ 1"]')});
 await page.locator('#v3WorkflowDialog').getByRole('button',{name:'Mở',exact:true}).first().click();await page.waitForSelector('.node[data-id="text"]');assert.equal(await page.locator('.canvas-note').count(),2);
 const video=path.join(temp,'real.webm');execFileSync('ffmpeg',['-v','error','-f','lavfi','-i','color=c=blue:s=160x90:r=24:d=1','-c:v','libvpx','-deadline','realtime','-y',video]);
 await page.click('#v3Assets');await page.getByLabel('Nhập tài nguyên',{exact:true}).setInputFiles(video);await page.waitForSelector('.v3-asset-card video');const card=page.locator('.v3-asset-card').filter({hasText:'real.webm'});await card.getByRole('button',{name:'Yêu thích real.webm'}).click();assert.equal(await card.getByRole('button',{name:'Yêu thích real.webm'}).getAttribute('aria-pressed'),'true');await shot('04-kho-tai-nguyen');await card.getByRole('button',{name:'Dùng real.webm',exact:true}).click();const added=page.locator('.node[data-v3-role="videoInput"]');await added.waitFor();await toolbarAction(page,'#saveBtn');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('fixtureAI')).museflow.nodes.some(n=>n.type==='videoInput'&&n.data.fileName==='real.webm'));await page.reload();await page.waitForSelector('.node[data-v3-role="videoInput"] video');assert.ok(await page.locator('.node[data-v3-role="videoInput"] video').evaluate(v=>v.src.startsWith('blob:')));await page.click('#fitCanvas');
 const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
 await importGraph({nodes:[{id:'result',type:'generateImage',x:150,y:150,data:{status:'success',provider:'gemini',asset:{id:'actual-image',kind:'image',url:image}}}],edges:[]});await page.locator('.node-title').click();await page.waitForSelector('.node-common-context-tools:visible');const toolbar=await page.locator('.node-common-context-tools').boundingBox();assert.ok(toolbar.x>=0&&toolbar.y>=0&&toolbar.x+toolbar.width<=1440);await page.click('#zoomOut');const toolbar2=await page.locator('.node-common-context-tools').boundingBox();assert.ok(Math.abs(toolbar.width-toolbar2.width)<2);await shot('05-toolbar-ket-qua');await page.mouse.click(1350,850);assert.equal(await page.locator('.node-common-context-tools:visible').count(),0);
 await importGraph({nodes:[{id:'old-node',type:'legacy-external-node',x:100,y:100,data:{privateSetting:'keep this',text:'Nội dung cũ'}},{id:'old-prompt',type:'prompt',x:500,y:100,data:{text:'Prompt cũ'}}],edges:[{id:'old-edge',source:'old-node',sourcePort:'legacy-out',target:'old-prompt',targetPort:'legacy-in'}]});await toolbarAction(page,'#saveBtn');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('fixtureAI')).museflow.nodes.some(n=>n.id==='old-node'));const legacy=await page.evaluate(()=>JSON.parse(localStorage.getItem('fixtureAI')).museflow);assert.equal(legacy.nodes.find(n=>n.id==='old-node').data.privateSetting,'keep this');assert.equal(legacy.edges[0].sourcePort,'legacy-out');await page.reload();await page.waitForSelector('.node[data-id="old-node"] .v3-unsupported');
 assert.deepEqual(errors,[]);console.log('PASS V3: 8-node palette, stable prompt zoom/collapse, text editing, shot table, notes/reload, workflow switching, sharing, appearance, minimap/edges, real video library upload/favorite/use/reload, selected result toolbar; no page errors. AI boundary is simulated.');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
