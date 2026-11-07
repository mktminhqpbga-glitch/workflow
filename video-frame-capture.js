/* A precise, local (no AI) video-frame capture shared by uploaded and AI videos. */
(function(root){
'use strict';
function frameTime(duration,mode,position=0){
  const length=Number(duration);
  if(!Number.isFinite(length)||length<=0)throw new Error('Video không có thời lượng xác định để chụp.');
  if(mode==='first')return 0;
  if(mode==='last')return Math.max(0,length-Math.min(0.05,length/100));
  if(mode==='current')return Math.max(0,Math.min(length-Math.min(0.01,length/1000),Number(position)||0));
  throw new Error('Vị trí khung hình không hợp lệ.');
}
function capture(url,mode='current',playhead=0,{timeoutMs=18000}={}){
  if(typeof url!=='string'||!url.trim())return Promise.reject(new Error('Chưa có video để trích khung hình.'));
  return new Promise((resolve,reject)=>{
    const video=document.createElement('video');
    if(/^https?:/i.test(url))video.crossOrigin='anonymous';
    video.muted=true;video.playsInline=true;video.preload='auto';
    let settled=false,ready=false,waitingSeek=false;
    const finish=(error,value)=>{
      if(settled)return;settled=true;clearTimeout(timer);
      video.onloadedmetadata=video.onloadeddata=video.onseeked=video.onerror=null;
      video.removeAttribute('src');video.load();
      if(error)reject(error);else resolve(value);
    };
    const timer=setTimeout(()=>finish(new Error('Hết thời gian chờ khung hình video.')),timeoutMs);
    const draw=()=>{
      if(settled||!ready||waitingSeek||video.readyState<2)return;
      try{
        const width=video.videoWidth,height=video.videoHeight;
        if(!width||!height)throw Error('Không nhận được độ phân giải video.');
        const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
        const ctx=canvas.getContext('2d');
        if(!ctx)throw Error('Canvas không hỗ trợ kết xuất ảnh.');
        ctx.drawImage(video,0,0,width,height);
        const image=canvas.toDataURL('image/png');
        if(!image.startsWith('data:image/png;'))throw Error('Không thể mã hóa ảnh PNG.');
        finish(null,{url:image,width,height,time:video.currentTime});
      }catch(error){finish(new Error('Không thể trích khung hình chính xác. Kiểm tra quyền đọc video: '+error.message));}
    };
    video.onloadedmetadata=()=>{
      let at;
      try{at=frameTime(video.duration,mode,playhead);}catch(e){finish(e);return;}
      ready=true;waitingSeek=at>0.002;
      if(waitingSeek)video.currentTime=at;
      else if(video.readyState>=2)draw();
    };
    video.onloadeddata=()=>{if(!waitingSeek)draw();};
    video.onseeked=()=>{waitingSeek=false;draw();};
    video.onerror=()=>finish(new Error('Không mở được video để chụp khung hình.'));
    video.src=url;video.load();
  });
}
const api=Object.freeze({frameTime,capture});
root.WorkflowVideoFrameCapture=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
