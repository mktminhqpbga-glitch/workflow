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
