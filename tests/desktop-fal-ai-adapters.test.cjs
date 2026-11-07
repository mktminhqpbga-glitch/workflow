'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const tasks=require('../ai-action-presets.js');
require('../ai-providers.js');
const providers=globalThis.WorkflowAI;
const video='data:video/mp4;base64,QUJDRA==',image='data:image/png;base64,QUJDRA==';
async function withMockQueue(callback){
  const savedFetch=globalThis.fetch,savedReader=globalThis.FileReader;
  const sent=[];
  class Reader {
    readAsDataURL(blob){
      blob.arrayBuffer().then(buffer=>{
        this.result='data:'+blob.type+';base64,'+Buffer.from(buffer).toString('base64');
        this.onload?.();
      }).catch(error=>{this.error=error;this.onerror?.();});
    }
  }
  globalThis.FileReader=Reader;
  globalThis.fetch=async(url,init={})=>{
    if(String(url).startsWith('data:'))return savedFetch(url,init);
    if(String(url).startsWith('https://queue.fal.run/fal-ai/')){
      sent.push({url:String(url),body:JSON.parse(init.body),auth:init.headers.Authorization});
      return new Response(JSON.stringify({
        status_url:'https://queue.fal.run/status/test123',
        response_url:'https://queue.fal.run/result/test123',
        cancel_url:'https://queue.fal.run/cancel/test123'
      }),{status:200,headers:{'Content-Type':'application/json'}});
    }
    if(String(url)==='https://queue.fal.run/status/test123')
      return new Response(JSON.stringify({status:'COMPLETED'}),{status:200});
    if(String(url)==='https://queue.fal.run/result/test123')
      return new Response(JSON.stringify({video:{url:'https://v3b.fal.media/files/example_result.mp4'}}),{status:200});
    throw new Error('Unexpected URL in fake queue: '+url);
  };
  try{await callback(sent);}
  finally{
    globalThis.fetch=savedFetch;
    if(savedReader===undefined)delete globalThis.FileReader;
    else globalThis.FileReader=savedReader;
  }
}

test('fal motion control transmits actual source video, identity image, and hidden depth prompt',async()=>{
  await withMockQueue(async sent=>{
    const prompt=tasks.buildPrompt('videoDepth',{preview:'720P'},'giữ chủ thể chính');
    const result=await providers.api('fal',{mediaType:'video',prompt,
      aiTask:{id:'videoDepth',settings:{preview:'720P'}},
      referenceImages:[image],referenceVideos:[video]},'dummy-key');
    assert.equal(result.ok,true);
    assert.equal(sent.length,1);
    assert.match(sent[0].url,/kling-video\/v2\.6\/standard\/motion-control$/);
    assert.equal(sent[0].body.prompt,prompt);
    assert.match(sent[0].body.image_url,/^data:image\/png;base64,/);
    assert.match(sent[0].body.video_url,/^data:video\/mp4;base64,/);
    assert.equal(sent[0].body.keep_original_sound,true);
    assert.equal(sent[0].auth,'Key dummy-key');
  });
});

test('fal video HD sends true video URL and 4K upscale settings, not motion control fields',async()=>{
  await withMockQueue(async sent=>{
    const prompt=tasks.buildPrompt('videoHD',{resolution:'4K',interpolate:true});
    const result=await providers.api('fal',{mediaType:'video',prompt,
      aiTask:{id:'videoHD',settings:{resolution:'4K',interpolate:true}},
      referenceVideos:[video]},'dummy-key');
    assert.equal(result.ok,true);
    assert.match(sent[0].url,/bytedance-upscaler\/upscale\/video$/);
    assert.equal(sent[0].body.target_resolution,'4k');
    assert.equal(sent[0].body.target_fps,60);
    assert.match(sent[0].body.video_url,/^data:video\/mp4;base64,/);
    assert.ok(!Object.hasOwn(sent[0].body,'image_url'));
    // Fixed-function upscalers take instruction through parameters, not prompt text.
    assert.ok(!Object.hasOwn(sent[0].body,'prompt'));
  });
});

test('fal subtitle removal sends actual hidden editing instruction and preserves source audio request',async()=>{
  await withMockQueue(async sent=>{
    const prompt=tasks.buildPrompt('videoSubtitles',{},'chỉ xóa dòng chữ dưới cùng');
    const result=await providers.api('fal',{mediaType:'video',prompt,
      aiTask:{id:'videoSubtitles',settings:{}},
      referenceVideos:[video]},'dummy-key');
    assert.equal(result.ok,true);
    assert.match(sent[0].url,/kling-video\/o1\/standard\/video-to-video\/edit$/);
    assert.equal(sent[0].body.prompt,prompt);
    assert.match(sent[0].body.prompt,/VIDEO INPAINTING of @Video1/);
    assert.equal(sent[0].body.keep_audio,true);
    assert.match(sent[0].body.video_url,/^data:video\/mp4;base64,/);
  });
});

test('fal V13 edit passes a source-video clip, not the entire original timeline',async()=>{
  await withMockQueue(async sent=>{
    const prompt=tasks.buildPrompt('videoSegment',{start:1,end:5},'thay nền cảnh');
    const response=await providers.api('fal',{mediaType:'video',prompt,
      aiTask:{id:'videoSegment',settings:{start:1,end:5}},
      referenceVideos:[video]},'dummy-key');
    assert.equal(response.ok,true);
    assert.match(sent[0].url,/video-to-video\/edit$/);
    assert.match(sent[0].body.prompt,/RERENDER SELECTED VIDEO SEGMENT/);
    assert.match(sent[0].body.prompt,/@Video1/);
    assert.equal(sent[0].body.keep_audio,true);
  });
});

test('fal A04 and A10 use identical audio-to-video payload with real source audio and image',async()=>{
  await withMockQueue(async sent=>{
    const prompt=tasks.buildPrompt('audioToVideo',{aspect:'16:9',duration:5},'khớp với nhịp trống');
    const result=await providers.api('fal',{mediaType:'video',prompt,
      aiTask:{id:'audioToVideo',settings:{aspect:'16:9',duration:5}},
      referenceAudios:['data:audio/mpeg;base64,QUJDRA=='],
      referenceImages:[image],referenceVideos:[]},'dummy-key');
    assert.equal(result.ok,true);
    assert.equal(sent.length,1);
    assert.match(sent[0].url,/ltx-2\.3-22b\/audio-to-video$/);
    assert.equal(sent[0].body.prompt,prompt);
    assert.match(sent[0].body.audio_url,/^data:audio\/mpeg;base64,/);
    assert.match(sent[0].body.image_url,/^data:image\/png;base64,/);
    assert.equal(sent[0].body.match_audio_length,false);
    assert.equal(sent[0].body.num_frames,121);
    assert.equal(sent[0].body.video_size,'landscape_16_9');
    assert.equal(sent[0].body.fps,24);
  });
});

test('missing motion image or missing source video fails without any paid API call',async()=>{
  await withMockQueue(async sent=>{
    await assert.rejects(()=>providers.api('fal',{mediaType:'video',prompt:'x',
      aiTask:{id:'videoDepth'},referenceVideos:[video]},'dummy-key'),/ảnh nhân vật/);
    await assert.rejects(()=>providers.api('fal',{mediaType:'video',prompt:'x',
      aiTask:{id:'videoHD'},referenceVideos:[]},'dummy-key'),/video nguồn/);
    assert.equal(sent.length,0);
  });
});
