'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const audit=require('../ai-output-audit.js');

test('image HD is not marked verified if requested dimensions were not achieved',()=>{
 const source={id:'imageHD',settings:{scale:4},sourceDimensions:{width:400,height:300}};
 const low=audit.inspect(source,{width:800,height:600});
 assert.equal(low.status,'warning');assert.match(low.message,/1600×1200/);
 const good=audit.inspect(source,{width:1600,height:1200});
 assert.equal(good.status,'pass');assert.match(good.message,/4×/);
 const unknown=audit.inspect({id:'imageHD',settings:{scale:2}}, {width:1024,height:1024});
 assert.equal(unknown.status,'warning');
});

test('video HD evaluates actual output resolution; quality still needs review',()=>{
 const good=audit.inspect({id:'videoHD',settings:{resolution:'4K'}},{width:3840,height:2160,duration:5});
 assert.equal(good.status,'manual');
 assert.match(good.message,/Chưa xác minh/);
 const low=audit.inspect({id:'videoHD',settings:{resolution:'4K'}},{width:1280,height:720,duration:5});
 assert.equal(low.status,'warning');
 const standard=audit.inspect({id:'videoHD',settings:{resolution:'1080P'}},{width:1920,height:1080});
 assert.equal(standard.status,'manual');
});

test('video segment warns if output duration differs from original',()=>{
 const info={id:'videoSegment',settings:{start:1,end:4},sourceDimensions:{duration:10,width:1280,height:720}};
 assert.equal(audit.inspect(info,{duration:10.15}).status,'manual');
 assert.equal(audit.inspect(info,{duration:12}).status,'warning');
});

test('AI results requiring visual review are not silently marked fully verified',()=>{
 for(const id of ['imageAngles','videoSubtitles','videoDepth','audioToVideo']){
   const result=audit.inspect({id,settings:{}},{width:1080,height:1920,duration:5});
   assert.equal(result.status,'manual');assert.ok(result.message.length>30);
 }
 assert.equal(audit.inspect(null,{width:10,height:10}).status,'not-applicable');
});

test('AI result dimensions audit is connected to the generated Canvas node and bundle',()=>{
 const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'..','app.html'),'utf8');
 const pkg=fs.readFileSync(path.join(__dirname,'..','tools','package.py'),'utf8');
 assert.match(src,/WorkflowAIOutputAudit\.inspect/);
 assert.match(src,/sourceDimensions:dimensions\?/);
 assert.match(src,/n\.data\.outputAudit=audit/);
 assert.match(src,/node-output-audit/);
 assert.match(html,/src="ai-output-audit\.js"/);
 assert.match(pkg,/ai-output-audit\.js/);
});
