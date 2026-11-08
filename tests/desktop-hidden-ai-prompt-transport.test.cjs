'use strict';
const {test,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const tasks=require('../ai-action-presets.js');
require('../ai-providers.js');
const api=globalThis.WorkflowAI.api;
const nativeFetch=globalThis.fetch;
afterEach(()=>{globalThis.fetch=nativeFetch;});
globalThis.FileReader=class{
  readAsDataURL(blob){blob.arrayBuffer().then(bytes=>{
    this.result='data:'+blob.type+';base64,'+Buffer.from(bytes).toString('base64');
    this.onload?.();
  },error=>{this.error=error;this.onerror?.();});}
};
const response=obj=>new Response(JSON.stringify(obj),{headers:{'Content-Type':'application/json'}});
const SOURCE_VIDEO='data:video/mp4;base64,BAUGBwgJ';
const SOURCE_IMAGE='data:image/png;base64,AQIDBA==';
const SOURCE_AUDIO='data:audio/wav;base64,UklGRg==';
function fakeFal(){
  const outgoing=[];
  globalThis.fetch=async(url,opts={})=>{
    if(String(url).startsWith('data:'))return nativeFetch(url,opts);
    assert.ok(String(url).startsWith('https://queue.fal.run/'),'Must not send key elsewhere: '+url);
    if(opts.method==='POST'){
      outgoing.push({url:String(url),input:JSON.parse(opts.body),headers:opts.headers});
      return response({status_url:'https://queue.fal.run/status/example',response_url:'https://queue.fal.run/result/example'});
    }
    if(String(url).includes('/status/'))return response({status:'COMPLETED'});
    return response({video:{url:'https://v3b.fal.media/files/b/verified/result.mp4'}});
  };
  return outgoing;
}
test('V10 depth button transports exact hidden task instruction with both source video and first-frame image',async()=>{
  const sent=fakeFal();
  const prompt=tasks.buildPrompt('videoDepth',{preview:'720P'},'Nhân vật đi về xa, camera giữ nguyên');
  const result=await api('fal',{mediaType:'video',prompt,referenceVideos:[SOURCE_VIDEO],referenceImages:[SOURCE_IMAGE],
    aiTask:{id:'videoDepth',settings:{preview:'720P'}}},'fixture-key');
  assert.equal(sent.length,1);
  assert.match(sent[0].url,/kling-video\/v2\.6\/standard\/motion-control/);
  assert.match(sent[0].input.prompt,/DEPTH MOTION VIDEO/);
  assert.match(sent[0].input.prompt,/parallax/);
  assert.match(sent[0].input.prompt,/camera giữ nguyên/);
  assert.equal(sent[0].input.video_url,SOURCE_VIDEO);
  assert.equal(sent[0].input.image_url,SOURCE_IMAGE);
  assert.equal(sent[0].input.keep_original_sound,true);
  assert.equal(result.url,'https://v3b.fal.media/files/b/verified/result.mp4');
});
test('V12 and V13 send task-specific video editing instructions, not generic text-to-video prompts',async()=>{
  const sent=fakeFal();
  for(const [id,settings,text] of [
    ['videoSubtitles',{},'Xoá tất cả chữ chạy ở dưới'],
    ['videoSegment',{start:1.2,end:3.4},'Thay cảnh sáng hơn']
  ]){
    const prompt=tasks.buildPrompt(id,settings,text);
    await api('fal',{mediaType:'video',prompt,referenceVideos:[SOURCE_VIDEO],
      aiTask:{id,settings}},'fixture-key');
  }
  assert.equal(sent.length,2);
  assert.ok(sent.every(call=>call.url.endsWith('/kling-video/o1/standard/video-to-video/edit')));
  assert.ok(sent.every(call=>call.input.video_url===SOURCE_VIDEO&&call.input.keep_audio===true));
  assert.match(sent[0].input.prompt,/VIDEO INPAINTING/);
  assert.match(sent[1].input.prompt,/1\.20s to 3\.40s/);
  assert.match(sent[1].input.prompt,/Thay cảnh sáng hơn/);
});
test('V11 video upscaler applies actual structured AI operation settings instead of falsely claiming a text-prompt field',async()=>{
  const sent=fakeFal();
  const hiddenInstruction=tasks.buildPrompt('videoHD',{resolution:'4K',interpolate:true,slowdown:1},'');
  assert.match(hiddenInstruction,/4K/);
  await api('fal',{mediaType:'video',prompt:hiddenInstruction,referenceVideos:[SOURCE_VIDEO],
    aiTask:{id:'videoHD',settings:{resolution:'4K',interpolate:true,slowdown:1}}},'fixture-key');
  assert.equal(sent.length,1);
  assert.ok(sent[0].url.endsWith('/bytedance-upscaler/upscale/video'));
  assert.equal(sent[0].input.video_url,SOURCE_VIDEO);
  assert.equal(sent[0].input.target_resolution,'4k');
  assert.equal(sent[0].input.target_fps,60);
  assert.equal(sent[0].input.enhancement_preset,'general');
  assert.equal(sent[0].input.prompt,undefined,'Upscaler schema has no text prompt; action is encoded in typed fields');
});
test('A04/A10 shares audio-to-video adapter, passes actual audio and hidden task prompt',async()=>{
  const sent=fakeFal();
  const config={aspect:'9:16',duration:10};
  const prompt=tasks.buildPrompt('audioToVideo',config,'Video nhảy theo âm nhạc');
  await api('fal',{mediaType:'video',prompt,referenceAudios:[SOURCE_AUDIO],referenceImages:[SOURCE_IMAGE],
    aiTask:{id:'audioToVideo',settings:config}},'fixture-key');
  assert.equal(sent.length,1);
  assert.ok(sent[0].url.endsWith('/ltx-2.3-22b/audio-to-video'));
  assert.equal(sent[0].input.audio_url,SOURCE_AUDIO);
  assert.equal(sent[0].input.image_url,SOURCE_IMAGE);
  assert.equal(sent[0].input.video_size,'portrait_16_9');
  assert.equal(sent[0].input.num_frames,241);
  assert.match(sent[0].input.prompt,/AUDIO-DRIVEN VIDEO/);
});
