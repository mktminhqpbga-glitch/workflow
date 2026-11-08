'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const annotations=require('../image-annotation.js');

test('local image annotation normalizes pixel points, clamps bounds and rejects invalid dimensions',()=>{
  assert.deepEqual(annotations.normalizePoint(50,30,100,60),{x:0.5,y:0.5});
  assert.deepEqual(annotations.normalizePoint(-20,300,100,100),{x:0,y:1});
  assert.throws(()=>annotations.normalizePoint(5,5,0,100),/kích thước/);
});
test('annotations sanitize malformed saved project values before rendering',()=>{
  const input={strokes:[
    {tool:'pen',color:'#abc123',size:99,points:[{x:0.4,y:0.7},{x:400,y:-3}]},
    {tool:'rect',color:'javascript:evil',size:-5,points:[{x:0,y:0},{x:1,y:1}]},
    {tool:'unknown',points:[{x:0,y:0}]},
    {tool:'text',text:'Mặt trời',points:[{x:0.3,y:0.5}]}
  ],note:'Ghi chú'};
  const clean=annotations.sanitize(input);
  assert.equal(clean.strokes.length,3);
  assert.deepEqual(clean.strokes[0].points,[{x:0.4,y:0.7},{x:1,y:0}]);
  assert.equal(clean.strokes[0].size,20);
  assert.equal(clean.strokes[1].color,'#f97316');
  assert.equal(clean.note,'Ghi chú');
  assert.equal(input.strokes[0].size,99,'sanitize must not mutate saved original');
});
test('image note editor is only offered with real source media, saves vector notes and never sends AI',()=>{
  const root=path.resolve(__dirname,'..');
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
  const panel=fs.readFileSync(path.join(root,'image-annotation.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'app.html'),'utf8');
  const pkg=fs.readFileSync(path.join(root,'tools/package.py'),'utf8');
  assert.match(app,/function editImageAnnotations\(source\)/);
  assert.match(app,/commonAsset\(source\)/);
  assert.match(app,/source\.data\.imageAnnotations=payload/);
  assert.match(app,/createUndoSnapshot\('Lưu đánh dấu ảnh'\)/);
  assert.match(app,/Đánh dấu.*editImageAnnotations\(source\)/);
  assert.match(panel,/canvas\.onpointerdown=/);
  assert.match(panel,/undo\.onclick=/);
  assert.match(panel,/redoButton\.onclick=/);
  assert.doesNotMatch(panel,/generateWithProvider|fetch\(/,'Annotation must never create an AI request');
  assert.match(html,/src="image-annotation\.js"/);
  assert.match(html,/href="image-annotation\.css"/);
  assert.match(pkg,/image-annotation\.js/);
  assert.match(pkg,/image-annotation\.css/);
});
