'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('shared translation chooses target by prompt language only',()=>{
  const scope={}; vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../shared-node-controls.js'),'utf8'),scope);
  assert.equal(scope.WorkflowSharedNodeControls.targetLanguage('Tạo một video cảnh rừng'),'en');
  assert.equal(scope.WorkflowSharedNodeControls.targetLanguage('A cinematic shot of a forest'),'vi');
  assert.equal(scope.WorkflowSharedNodeControls.targetLanguage('Xin chào'),'en');
});
