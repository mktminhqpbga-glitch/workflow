'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const tasks=require('../ai-action-presets.js');
const frames=require('../video-frame-capture.js');
require('../ai-providers.js');
const providers=globalThis.WorkflowAI;

test('every specialist action has unique task, media type and explicit provider capability',()=>{
  assert.equal(Object.keys(tasks.tasks).length,6);
  for(const [id,spec] of Object.entries(tasks.tasks)){
    assert.equal(tasks.task(id),spec);
    assert.ok(spec.name&&spec.source&&spec.kind);
    assert.equal(spec.source,spec.kind);
    assert.ok(tasks.buildPrompt(id,{}).includes('TASK:'));
  }
  assert.equal(tasks.supports('videoDepth','fal'),true);
  assert.equal(tasks.supports('videoDepth','google'),false);
  assert.equal(tasks.supports('videoHD','fal'),true);
  assert.equal(tasks.supports('videoSubtitles','fal'),true);
  assert.equal(tasks.supports('videoSegment','fal'),false);
  assert.throws(()=>tasks.requireProvider('videoSegment','fal'),/chưa có adapter phù hợp/);
  assert.throws(()=>tasks.requireProvider('videoHD','muse'),/chưa có adapter phù hợp/);
});

test('AI hidden prompts carry task, configuration and user direction independently',()=>{
  const depth=tasks.buildPrompt('videoDepth',{preview:'480P'},'chuyển động nhẹ');
  assert.match(depth,/DEPTH MOTION VIDEO/);
  assert.match(depth,/parallax/);
  assert.match(depth,/480P/);
  assert.match(depth,/chuyển động nhẹ/);
  assert.match(depth,/Keep the source unchanged/);
  const angle=tasks.buildPrompt('imageAngles',{preset:'back',horizontal:70,vertical:-20,zoom:2},'ánh sáng vàng');
  assert.match(angle,/from behind/);
  assert.match(angle,/70 degrees/);
  assert.match(angle,/-20 degrees/);
  assert.match(angle,/relative zoom 2/);
  assert.match(angle,/USER ADDITIONAL DIRECTION/);
  const image=tasks.buildPrompt('imageHD',{scale:6},'');
  assert.match(image,/6×/);
  assert.match(image,/Preserve exact subject identity/);
  const up=tasks.buildPrompt('videoHD',{resolution:'4K',interpolate:true});
  assert.match(up,/4K/);
  assert.match(up,/Frame interpolation: on/);
  const subtitles=tasks.buildPrompt('videoSubtitles');
  assert.match(subtitles,/VIDEO INPAINTING/);
  assert.match(subtitles,/hard-burned subtitle/);
  const segment=tasks.buildPrompt('videoSegment',{start:2,end:3.5},'thay nền');
  assert.match(segment,/2\.00s to 3\.50s/);
  assert.throws(()=>tasks.buildPrompt('videoSegment',{start:8,end:2}),/lớn hơn/);
});

test('task settings clamp values, without mutating the input',()=>{
  const raw={horizontal:500,vertical:-150,zoom:20,preset:'fake'};
  const normal=tasks.settings('imageAngles',raw);
  assert.deepEqual(normal,{preset:'custom',horizontal:180,vertical:-90,zoom:4});
  assert.deepEqual(raw,{horizontal:500,vertical:-150,zoom:20,preset:'fake'});
  assert.deepEqual(tasks.settings('imageHD',{scale:3}),{scale:2});
  assert.throws(()=>tasks.settings('videoHD',[]),/đối tượng/);
});

test('fal adapters refuse missing video sources and unsupported task inputs',()=>{
  const valid={mediaType:'video',referenceVideos:['data:video/mp4;base64,AAA']};
  assert.doesNotThrow(()=>providers.validate('fal',{...valid,aiTask:{id:'videoHD',settings:{resolution:'4K'}}}));
  assert.doesNotThrow(()=>providers.validate('fal',{...valid,aiTask:{id:'videoSubtitles',settings:{}}}));
  assert.doesNotThrow(()=>providers.validate('fal',{...valid,referenceImages:['data:image/png;base64,AAA'],aiTask:{id:'videoDepth'}}));
  assert.throws(()=>providers.validate('fal',{...valid,aiTask:{id:'videoDepth'}}),/ảnh nhân vật/);
  assert.throws(()=>providers.validate('fal',{mediaType:'video',aiTask:{id:'videoHD'}}),/video nguồn/);
  assert.throws(()=>providers.validate('fal',{...valid,referenceImages:['image'],aiTask:{id:'videoHD'}}),/không nhận ảnh/);
  assert.throws(()=>providers.validate('fal',{...valid,aiTask:{id:'videoSegment'}}),/chưa có adapter/);
  assert.throws(()=>providers.validate('fal',{...valid,aiTask:{id:'videoHD',settings:{slowdown:0.5}}}),/tốc độ 1×/);
  assert.throws(()=>providers.validate('openai',{...valid,aiTask:{id:'videoHD'}}),/không hỗ trợ/);
});

test('local video frame picker selects beginning, current and end accurately',()=>{
  assert.equal(frames.frameTime(10,'first',9),0);
  assert.equal(frames.frameTime(10,'current',3.2),3.2);
  assert.equal(frames.frameTime(10,'current',-5),0);
  assert.ok(frames.frameTime(10,'last')>=9.94);
  assert.ok(frames.frameTime(10,'last')<10);
  assert.ok(frames.frameTime(10,'current',999)<10);
  assert.throws(()=>frames.frameTime(0,'first'),/thời lượng/);
  assert.throws(()=>frames.frameTime(10,'not-a-position'),/không hợp lệ/);
});

test('Canvas uses executable shared toolbar callbacks, not only mock text',()=>{
  const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  assert.match(src,/function startSpecialAIAction\(/);
  assert.match(src,/function saveVideoFrame\(/);
  assert.match(src,/renderSpecialTaskSettings/);
  assert.match(src,/onTools:media\?\(\)=>specialResultActions/);
  assert.match(src,/onFrameCapture:media\?\.kind==='video'/);
  assert.match(src,/WorkflowVideoFrameCapture\.capture/);
  assert.match(src,/WorkflowAITasks\.buildPrompt/);
  assert.match(src,/aiTask:n\.data\.aiTask/);
  assert.match(src,/videoFrame: \{title:/);
  const html=fs.readFileSync(path.join(__dirname,'../app.html'),'utf8');
  assert.match(html,/src="ai-action-presets\.js"/);
  assert.match(html,/src="video-frame-capture\.js"/);
  const ext=fs.readFileSync(path.join(__dirname,'../tools/package.py'),'utf8');
  assert.match(ext,/ai-action-presets\.js/);
  assert.match(ext,/video-frame-capture\.js/);
});
