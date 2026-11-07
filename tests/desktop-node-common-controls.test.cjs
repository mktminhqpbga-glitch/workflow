'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function actions(){
  const context={};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../node-common-actions.js'),'utf8'),context);
  return context.WorkflowNodeCommonActions;
}
test('shared node actions present only connected providers with choices',()=>{
  const api=actions();
  const available=api.connectedOnly([
    {id:'muse',connected:false,choices:[{value:'muse-unavailable'}]},
    {id:'chatgpt',connected:true,choices:[{value:'tab-12',name:'Open tab'}]},
    {id:'empty',connected:true,choices:[]},
    {id:'openai',connected:true,choices:[{value:'',name:'Invalid'}]}
  ]);
  assert.equal(available.length,1);
  assert.equal(available[0].id,'chatgpt');
  assert.equal(available[0].choices[0].value,'tab-12');
});
test('shared send status labels remain consistent on all nodes',()=>{
  const api=actions();
  assert.equal(api.stateLabel('idle'),'Sẵn sàng');
  assert.equal(api.stateLabel('running'),'Đang xử lý');
  assert.equal(api.stateLabel('waiting'),'Đang xử lý');
  assert.equal(api.stateLabel('queued'),'Đang xử lý');
  assert.equal(api.stateLabel('error'),'Có lỗi');
});

test('context toolbar is absent on empty nodes, including selected nodes',()=>{
  const elements=[];
  const element=(tag)=>({
    tag,children:[],className:'',dataset:{},classList:{add(name){this.last=name;}},
    setAttribute(){},append(...children){this.children.push(...children);},
    get childElementCount(){return this.children.length;},
    querySelectorAll(){return []}
  });
  const context={document:{createElement:tag=>{const el=element(tag);elements.push(el);return el;}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../node-common-actions.js'),'utf8'),context);
  const api=context.WorkflowNodeCommonActions;
  const emptyNode={id:'empty-1',data:{}};
  const emptyRoot=element('section'),emptyBody=element('div');
  api.attach({node:emptyNode,root:emptyRoot,body:emptyBody,hasResult:false,onDuplicate:()=>{}});
  assert.equal(emptyRoot.children.length,0,'even an allowed duplicate action must not create floating toolbar without output');
  const fullRoot=element('section'),fullBody=element('div');
  api.attach({node:emptyNode,root:fullRoot,body:fullBody,hasResult:true,onDuplicate:()=>{}});
  assert.equal(fullRoot.children.length,1,'result node has context toolbar to show when selected');
  assert.equal(fullRoot.children[0].children.length,1,'duplicate control exists only after a result');
});
test('selected-only rule governs floating toolbar in stylesheet',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../node-common-actions.css'),'utf8');
  assert.match(css,/\.node \.node-common-context-tools\{[^}]*display:none/);
  assert.match(css,/\.node\.selected \.node-common-context-tools\{display:flex/);
  const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  assert.match(app,/const hasResult=Boolean\(media\?\.url\|\|scripted\|\|String\(n\.data\.sharedGeneratedText/);
  assert.match(app,/node:n,root:el,body,media,hasResult/);
});
