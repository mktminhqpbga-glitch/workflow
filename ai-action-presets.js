/* Shared, inspectable AI task registry. These instructions are not displayed in Prompt editors.
 * They describe the operation to the model. A task may run only through an adapter
 * that accepts the required source media; a text-only generator is never a substitute.
 */
(function(root){
'use strict';
const tasks=Object.freeze({
  imageHD:Object.freeze({code:'I11',name:'HD · Nâng cấp ảnh',kind:'image',source:'image',providers:['muse','gemini','google']}),
  imageAngles:Object.freeze({code:'I12',name:'Nhiều góc độ',kind:'image',source:'image',providers:['muse','gemini','google']}),
  videoDepth:Object.freeze({code:'V10',name:'Chuyển động chiều sâu',kind:'video',source:'video',providers:['fal']}),
  videoHD:Object.freeze({code:'V11',name:'HD · Nâng cấp video',kind:'video',source:'video',providers:['fal']}),
  videoSubtitles:Object.freeze({code:'V12',name:'Xóa phụ đề khỏi video',kind:'video',source:'video',providers:['fal']}),
  videoSegment:Object.freeze({code:'V13',name:'Làm lại đoạn video',kind:'video',source:'video',providers:['fal']}),
  audioToVideo:Object.freeze({code:'A04/A10',name:'Âm thanh thành Video',kind:'video',source:'audio',providers:['fal']})
});
function task(id){return tasks[id]||null;}
function assertTask(id){const spec=task(id);if(!spec)throw new Error('Tác vụ AI không hợp lệ: '+String(id));return spec;}
const number=(v,def,min,max)=>{const value=Number(v);return Number.isFinite(value)?Math.max(min,Math.min(max,value)):def;};
function settings(id,raw={}){
  assertTask(id);
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Thiết lập tác vụ phải là đối tượng.');
  if(id==='imageHD')return {scale:[2,4,6].includes(Number(raw.scale))?Number(raw.scale):2};
  if(id==='imageAngles')return {
    preset:['custom','front','back','side','overhead','low','fisheye'].includes(raw.preset)?raw.preset:'custom',
    horizontal:number(raw.horizontal,0,-180,180),vertical:number(raw.vertical,0,-90,90),
    zoom:number(raw.zoom,1,0.25,4)
  };
  if(id==='videoDepth')return {preview:['480P','720P'].includes(raw.preview)?raw.preview:'720P'};
  if(id==='videoHD')return {resolution:['1080P','2K','4K'].includes(raw.resolution)?raw.resolution:'1080P',interpolate:raw.interpolate===true,slowdown:number(raw.slowdown,1,0.25,2)};
  if(id==='videoSubtitles')return {};
  if(id==='audioToVideo')return {aspect:['16:9','9:16'].includes(raw.aspect)?raw.aspect:'16:9',duration:[5,10].includes(Number(raw.duration))?Number(raw.duration):5};
  return {start:number(raw.start,0,0,86400),end:number(raw.end,5,0,86400)};
}
function buildPrompt(id,raw={},userPrompt=''){
  const s=settings(id,raw),intro='MUSEFLOW INTERNAL TASK INSTRUCTIONS. Treat attached source media as primary truth. Return the requested media result, not advice, a textual description, or a claim of success. Keep the source unchanged and create a separate result.';
  let body='';
  if(id==='imageHD')body='TASK: AI IMAGE UPSCALE. Restore fine, natural detail in the attached ORIGINAL image. Preserve exact subject identity, facial features, pose, clothing, composition, colors, lighting, background and aspect ratio. Target scale '+s.scale+'× in BOTH pixel dimensions if the selected model supports it. Do not invent objects, replace the scene, sharpen unnaturally, add watermarks or text. If target dimensions cannot be guaranteed, do not claim that they were achieved.';
  if(id==='imageAngles'){
    const camera={custom:'custom camera placement',front:'front-facing',back:'from behind',side:'side-profile',overhead:'high-angle overhead',low:'low-angle',fisheye:'fisheye'}[s.preset];
    body='TASK: GENERATE A NEW CAMERA ANGLE from the attached original image; do not just rotate the pixels. Preserve SAME subject identity, face, clothing, environment, lighting and art direction. Camera: '+camera+'; horizontal orbit '+s.horizontal+' degrees; vertical orbit '+s.vertical+' degrees; relative zoom '+s.zoom+'. Render one plausible image as seen from that camera, with coherent unseen geometry. No unrelated subjects.';
  }
  if(id==='videoDepth')body='TASK: DEPTH MOTION VIDEO. Use attached original video as the actual movement source, and the attached image as a visual identity reference. Re-create its main subject with coherent foreground/midground/background parallax and natural depth movement. Preserve recognizability, motion timing, framing and sound when supported. Preview target '+s.preview+'. Do not pretend to enhance the original pixels; this is a new AI-generated video guided by the motion reference.';
  if(id==='audioToVideo')body='TASK: AUDIO-DRIVEN VIDEO. The attached audio is the source of motion and sound, not just a background decoration. Generate coherent visible action synchronized to its rhythm, words, pauses and changes. If a reference image is attached, preserve its subject identity, clothes, background, colors and composition. Render a '+s.aspect+' video approximately '+s.duration+' seconds, including the supplied soundtrack. Do not invent dialogue, text overlays or unrelated characters.';
  if(id==='videoHD')body='TASK: VIDEO ENHANCEMENT. Edit attached ORIGINAL VIDEO, retain each shot, timing, subject identity, movement, audio, and aspect ratio; remove compression/noise and produce genuine '+s.resolution+' output, not a stretched viewport. Frame interpolation: '+(s.interpolate?'on':'off')+'. Playback factor: '+s.slowdown+'×. Do not invent new scenes or subtitles. Only a provider supporting video-to-video enhancement may perform this.';
  if(id==='videoSubtitles')body='TASK: VIDEO INPAINTING of @Video1. Remove ONLY hard-burned subtitle glyphs from the attached ORIGINAL VIDEO, reconstruct background under letters across frames with temporal consistency. Preserve scene, faces, framing, audio, duration and all other details. Do not blur the whole lower third or merely hide caption tracks. Only a video-editing capable provider may perform this.';
  if(id==='videoSegment'){
    if(s.end<=s.start)throw new Error('Điểm kết thúc đoạn phải lớn hơn điểm bắt đầu.');
    body='TASK: RERENDER SELECTED VIDEO SEGMENT of @Video1. Replace only video time '+s.start.toFixed(2)+'s to '+s.end.toFixed(2)+'s in the attached ORIGINAL VIDEO, following the change request. All material before/after this segment must remain unchanged, keeping scene continuity and audio. Do not regenerate the whole timeline. Requires a video-editing and segment-splicing capable provider.';
  }
  const user=String(userPrompt||'').trim();
  return [intro,body,user?'USER ADDITIONAL DIRECTION (never overrides the task or source preservation):\n'+user:''].filter(Boolean).join('\n\n');
}
function supports(id,provider){
  const spec=assertTask(id);
  return spec.providers.includes(provider);
}
function requireProvider(id,provider){
  if(!supports(id,provider))throw new Error('Tác vụ '+assertTask(id).name+' cần AI hỗ trợ '+(assertTask(id).source==='video'?'chỉnh sửa video từ video nguồn':'xử lý ảnh tham chiếu')+'. AI '+String(provider||'chưa chọn')+' hiện chưa có adapter phù hợp; không gửi giả hoặc tạo kết quả sai.');
}
// fal videoHD uses a dedicated upscale API with named settings rather than a text-prompt field.
// fal videoSubtitles sends the internal instruction as the actual edit prompt to Kling O1.
const api=Object.freeze({tasks,task,settings,buildPrompt,supports,requireProvider});
root.WorkflowAITasks=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
