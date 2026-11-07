'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
test('all shared Canvas UI assets are loaded in both desktop and packaged extension',()=>{
  const html=read('app.html'),pkg=read('tools/package.py');
  for(const file of ['shared-node-controls.js','shared-node-controls.css','node-common-actions.js','node-common-actions.css']){
    assert.ok(html.includes('"'+file+'"'),'Canvas HTML must load '+file);
    assert.ok(pkg.includes("'"+file+"'"),'Extension archive must include '+file);
    assert.ok(fs.statSync(path.join(root,file)).size>200,'Shared asset should exist: '+file);
  }
});
test('generation nodes preserve local Prompt alongside connected Prompt and shared controls',()=>{
  const app=read('app.js');
  assert.match(app,/className='node-local-prompt'/);
  assert.match(app,/\.data\.localPrompt/);
  assert.match(app,/inputs\.push\(local\)/);
  assert.match(app,/WorkflowSharedNodeControls\.attach/);
  assert.match(app,/WorkflowNodeCommonActions\.attach/);
  assert.match(app,/commonReferenceActions\(n,el\)/);
  assert.match(app,/commonConnectedModels\(n\)/);
  assert.match(app,/commonSendAction\(n\)/);
});
test('expanded Prompt moves the same live model and send controls and restores on close',()=>{
  const code=read('shared-node-controls.js');
  assert.match(code,/commonPlaceholder = document\.createComment/);
  assert.match(code,/footer\.prepend\(common\)/);
  assert.match(code,/commonPlaceholder\.replaceWith\(movedCommon\)/);
  assert.match(code,/editor\.oninput = \(\) => commit\(editor\.value\)/);
});
