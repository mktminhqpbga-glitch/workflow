'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const files=['app.js','app.html','node-common-actions.js','compact-toolbar.js'];
test('hidden Node toolbar tools must not return in any Canvas UI module',()=>{
  const forbidden=[
    /Phân đoạn lưới/i,/Phân tách lớp/i,
    /Tầm nhìn toàn cảnh\s*720\s*(?:độ|°)/i,
    /Toàn cảnh\s*720\s*(?:độ|°)/i,
    /['"`]Hơn['"`]/i
  ];
  for(const filename of files){
    const source=fs.readFileSync(path.join(root,filename),'utf8');
    for(const check of forbidden){
      assert.doesNotMatch(source,check,
        filename+' must not reintroduce a hidden toolbar item '+check);
    }
  }
});
test('F03 and F04 tool inventory explicitly tracks globally hidden actions',()=>{
  const inventory=fs.readFileSync(path.join(root,'docs/NODE_BUTTON_INVENTORY.md'),'utf8');
  for(const id of ['I13','I14','I15','I16','V15']){
    assert.match(inventory,new RegExp('\\| '+id+' \\|[^\\n]*⛔ ẨN \\|'));
  }
});
