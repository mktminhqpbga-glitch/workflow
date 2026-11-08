/* Provider adapters. Keys remain in session storage, outside exported workflows. */
(() => {
  const providers = {
    muse: {name:'Muse.ai · tab', types:['image','video'], urls:['https://muse.ai/*','https://*.muse.ai/*']},
    chatgpt: {name:'ChatGPT · tab', types:['text','image'], urls:['https://chatgpt.com/*','https://www.chatgpt.com/*','https://chat.openai.com/*']},
    gemini: {name:'Gemini · tab', types:['text','image'], urls:['https://gemini.google.com/*']},
    google: {name:'Google Gemini / Veo · API', types:['text','image','video']},
    openai: {name:'OpenAI · API', types:['text','image']},
    fal: {name:'fal.ai Kling Motion Control · API', types:['video']},
    anthropic: {name:'Claude · API',types:['text'],endpoint:'https://api.anthropic.com/v1',protocol:'anthropic',images:true},
    deepseek: {name:'DeepSeek · API',types:['text'],endpoint:'https://api.deepseek.com/v1',protocol:'chat'},
    qwen: {name:'Qwen · API',types:['text'],endpoint:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',protocol:'chat'},
    grok: {name:'Grok · API',types:['text'],endpoint:'https://api.x.ai/v1',protocol:'chat'},
    mistral: {name:'Mistral · API',types:['text'],endpoint:'https://api.mistral.ai/v1',protocol:'chat'},
    perplexity: {name:'Perplexity · API',types:['text'],endpoint:'https://api.perplexity.ai',protocol:'chat'},
    compatible: {name:'API tương thích OpenAI',types:['text'],protocol:'chat'}
  };
  const models = {google:{text:'gemini-2.5-flash',image:'gemini-2.5-flash-image',video:'veo-3.0-generate-001'},openai:{text:'gpt-4.1-mini',image:'gpt-image-1'},fal:{video:'fal-ai/kling-video/v2.6/standard/motion-control'}};
  const abort = signal => {if(signal?.aborted)throw new DOMException('Đã dừng tạo nội dung.','AbortError');};
  const sleep = (ms,signal) => new Promise((resolve,reject)=>{abort(signal);const cancel=()=>{clearTimeout(timer);reject(new DOMException('Đã dừng.','AbortError'));};const timer=setTimeout(()=>{signal?.removeEventListener('abort',cancel);resolve();},ms);signal?.addEventListener('abort',cancel,{once:true});});
  async function json(url,options={}) {
    const r=await fetch(url,{...options,redirect:'error'});
    if(!r.ok)throw new Error(`API trả về HTTP ${r.status}. Kiểm tra khóa, quyền model, hạn mức và đầu vào.`);
    return r.json();
  }
  async function media(url,signal) {
    const r=await fetch(url,{signal});if(!r.ok)throw new Error('Không đọc được tệp tham chiếu.');const blob=await r.blob();
    if(!/^(image|video|audio)\//.test(blob.type))throw new Error('Tệp API phải là ảnh, video hoặc âm thanh có MIME hợp lệ.');
    if(!blob.size||blob.size>20*1024*1024)throw new Error('Tệp API phải có dung lượng từ 1 byte đến 20 MB.');
    const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
    return {mimeType:blob.type,data:String(data).split(',')[1],dataUrl:data};
  }
  function validate(provider,r) {
    if(!providers[provider]?.types.includes(r.mediaType))throw new Error('AI này không hỗ trợ loại đầu ra đã chọn.');
    const definition=providers[provider];provider=definition.baseProvider||provider;
    if(definition.protocol){
      if(r.referenceVideos?.length||r.referenceAudios?.length)throw new Error('Adapter này chưa hỗ trợ video/âm thanh đầu vào.');
      if(r.referenceImages?.length&&!definition.images)throw new Error('Adapter này chỉ nhận văn bản; chưa hỗ trợ ảnh tham chiếu.');
    }
    if(r.referenceVideos?.length&&provider==='openai')throw new Error('OpenAI adapter chưa hỗ trợ video gốc. Chọn Gemini để phân tích video.');
    if(r.mediaType==='video'&&provider==='google'&&![4,6,8].includes(Number(r.duration)))throw new Error('Veo adapter hỗ trợ clip 4, 6 hoặc 8 giây; không thể bảo đảm một clip 15–60 giây.');
    if(provider==='fal'){
      const action=r.aiTask?.id||'videoDepth';
      const images=r.referenceImages||[],videos=r.referenceVideos||[],audios=r.referenceAudios||[];
      if(action==='audioToVideo'){
        if(audios.length!==1||videos.length||images.length>1)
          throw new Error('Âm thanh thành Video cần đúng một audio nguồn, tối đa một ảnh, không nhận video nguồn.');
      }else if(videos.length!==1)
        throw new Error('Tác vụ fal.ai cần đúng một video nguồn, không được thay bằng văn bản.');
      if(action==='videoDepth'&&images.length!==1)throw new Error('Motion Control cần đúng một ảnh nhân vật và một video chuyển động nguồn.');
      if(action==='videoHD'){
        if(images.length)throw new Error('Nâng video HD không nhận ảnh thay cho video nguồn.');
        if(Number(r.aiTask?.settings?.slowdown||1)!==1)throw new Error('Model nâng cấp video chưa hỗ trợ giảm tốc. Chọn tốc độ 1×.');
      }
      if(action==='videoSubtitles'&&images.length>4)throw new Error('Model edit video chỉ hỗ trợ tối đa 4 ảnh tham chiếu.');
      if(!['videoDepth','videoHD','videoSubtitles','videoSegment','audioToVideo'].includes(action))
        throw new Error('Tác vụ fal.ai này chưa có adapter xử lý video nguồn phù hợp.');
    }
  }
  async function api(provider,r,key,signal) {
    validate(provider,r);if(!key)throw new Error('Chưa nhập API key trong Cài đặt.');abort(signal);
    const definition=providers[provider],model=r.model||models[provider]?.[r.mediaType];
    provider=definition.baseProvider||provider;
    if(definition.protocol){
      if(!model)throw new Error('Nhập model ID trong Kết nối AI trước khi chạy.');
      const base=endpoint(definition.endpoint),headers=apiHeaders(definition,key);
      let body;
      if(definition.protocol==='anthropic'){
        const content=[{type:'text',text:r.prompt}];
        for(const url of r.referenceImages||[]){const image=await media(url,signal);content.push({type:'image',source:{type:'base64',media_type:image.mimeType,data:image.data}});}
        body={model,max_tokens:4096,...(r.rules?{system:r.rules}:{}),messages:[{role:'user',content}]};
      }else body={model,messages:[...(r.rules?[{role:'system',content:r.rules}]:[]),{role:'user',content:r.prompt}],stream:false};
      const result=await json(base+(definition.protocol==='anthropic'?'/messages':'/chat/completions'),{method:'POST',headers,signal,body:JSON.stringify(body)});
      if(result.stop_reason==='max_tokens'||result.choices?.[0]?.finish_reason==='length')throw new Error('AI dừng vì giới hạn đầu ra; chưa nhận được văn bản hoàn chỉnh.');
      const text=definition.protocol==='anthropic'?(result.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n'):result.choices?.[0]?.message?.content;
      if(typeof text!=='string'||!text.trim())throw new Error('AI không trả về văn bản hợp lệ.');
      return {ok:true,text};
    }
    if(provider==='google') {
      const base='https://generativelanguage.googleapis.com/v1beta/';
      const headers={'Content-Type':'application/json','x-goog-api-key':key};
      const parts=[{text:[r.rules,r.prompt].filter(Boolean).join('\n\n')}];
      for(const url of [...(r.referenceImages||[]),...(r.referenceVideos||[])]) {const {mimeType,data}=await media(url,signal);parts.push({inlineData:{mimeType,data}});}
      if(r.mediaType!=='video') {
        const body={contents:[{role:'user',parts}],...(r.mediaType==='image'?{generationConfig:{responseModalities:['TEXT','IMAGE']}}:{})};
        const result=await json(`${base}models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers,body:JSON.stringify(body),signal});
        const out=result.candidates?.[0]?.content?.parts||[];
        const text=out.map(p=>p.text||'').join('\n');const img=out.find(p=>p.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
        if(r.mediaType==='text'&&!text)throw new Error('Gemini không trả về văn bản.');
        if(r.mediaType==='image'&&!img)throw new Error('Model không trả về ảnh. Kiểm tra quyền model tạo ảnh.');
        return {ok:true,text,url:img?`data:${img.mimeType};base64,${img.data}`:undefined};
      }
      if(r.referenceVideos?.length)throw new Error('Veo adapter chưa hỗ trợ Motion Control. Chọn fal.ai.');
      if((r.referenceImages||[]).length>1)throw new Error('Veo adapter chỉ nhận một ảnh khởi đầu.');
      const instance={prompt:r.prompt};if(r.referenceImages?.length){const image=await media(r.referenceImages[0],signal);instance.image={bytesBase64Encoded:image.data,mimeType:image.mimeType};}
      let operation=await json(`${base}models/${encodeURIComponent(model)}:predictLongRunning`,{method:'POST',headers,body:JSON.stringify({instances:[instance],parameters:{aspectRatio:r.size||'16:9',durationSeconds:Number(r.duration)}}),signal});
      const end=Date.now()+600000;
      while(!operation.done&&Date.now()<end){await sleep(4000,signal);if(!/^models\/[\w.-]+\/operations\/[\w.-]+$/.test(operation.name||''))throw new Error('Mã tác vụ Veo không hợp lệ.');operation=await json(base+operation.name,{headers,signal});}
      if(!operation.done)throw new Error('Veo chưa hoàn tất sau 10 phút.');if(operation.error)throw new Error('Tác vụ Veo thất bại.');
      const uri=operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if(!uri||new URL(uri).origin!=='https://generativelanguage.googleapis.com')throw new Error('Veo không trả về video có thể tải an toàn.');
      const video=await fetch(uri,{headers:{'x-goog-api-key':key},signal,redirect:'error'});if(!video.ok)throw new Error('Không tải được video Veo.');
      return {ok:true,url:URL.createObjectURL(await video.blob())};
    }
    if(provider==='openai') {
      const headers={'Content-Type':'application/json',Authorization:`Bearer ${key}`};
      if(r.mediaType==='image') {
        if(r.referenceImages?.length)throw new Error('OpenAI adapter tạo ảnh chưa hỗ trợ ảnh tham chiếu; chọn Gemini hoặc tab AI.');
        const result=await json('https://api.openai.com/v1/images/generations',{method:'POST',headers,signal,body:JSON.stringify({model,prompt:r.prompt,n:1,size:r.size==='16:9'?'1536x1024':r.size==='9:16'?'1024x1536':'1024x1024'})});
        const image=result.data?.[0];if(!image?.b64_json&&!image?.url)throw new Error('OpenAI không trả về ảnh.');return {ok:true,url:image.b64_json?`data:image/png;base64,${image.b64_json}`:image.url};
      }
      const content=[{type:'input_text',text:r.prompt}];for(const url of r.referenceImages||[])content.push({type:'input_image',image_url:(await media(url,signal)).dataUrl});
      const result=await json('https://api.openai.com/v1/responses',{method:'POST',headers,signal,body:JSON.stringify({model,instructions:r.rules||undefined,input:[{role:'user',content}]})});
      const text=(result.output||[]).flatMap(item=>item.content||[]).filter(item=>item.type==='output_text').map(item=>item.text).join('\n');if(!text)throw new Error('OpenAI không trả về văn bản.');return {ok:true,text};
    }
    if(provider==='fal') {
      const action=r.aiTask?.id||'videoDepth';
      const id=action==='audioToVideo'?'fal-ai/ltx-2.3-22b/audio-to-video':
        action==='videoHD'?'fal-ai/bytedance-upscaler/upscale/video':
        ['videoSubtitles','videoSegment'].includes(action)?'fal-ai/kling-video/o1/standard/video-to-video/edit':
        'fal-ai/kling-video/v2.6/standard/motion-control';
      // The AI task selects a verified schema; never use a model from another task.
      const requestedModel=r.aiTask?.id?id:model;
      if(requestedModel!==id||!/^fal-ai\/[a-zA-Z0-9/_.-]+$/.test(id))
        throw new Error('Adapter fal.ai không nhận model không phù hợp tác vụ.');
      const url=action==='audioToVideo'?null:(await media(r.referenceVideos[0],signal)).dataUrl;
      const headers={'Content-Type':'application/json',Authorization:'Key '+key};
      let input;
      if(action==='audioToVideo'){
        const audio=(await media(r.referenceAudios[0],signal)).dataUrl;
        const imgs=r.referenceImages||[];
        const config=r.aiTask?.settings||{};
        const ratio=config.aspect==='9:16'?'portrait_16_9':'landscape_16_9';
        const duration=[5,10].includes(Number(config.duration))?Number(config.duration):5;
        input={prompt:r.prompt,audio_url:audio,match_audio_length:false,
          num_frames:duration*24+1,video_size:ratio,fps:24,
          audio_strength:1};
        if(imgs.length)input.image_url=(await media(imgs[0],signal)).dataUrl;
      }else if(action==='videoDepth'){
        const img=(await media(r.referenceImages[0],signal)).dataUrl;
        input={prompt:r.prompt,image_url:img,video_url:url,
          character_orientation:'video',keep_original_sound:true};
      }else if(action==='videoHD'){
        const settings=r.aiTask.settings||{};
        const resolution=({ '1080P':'1080p','2K':'2k','4K':'4k' })[settings.resolution||'1080P'];
        if(!resolution)throw new Error('Độ phân giải nâng video không hợp lệ.');
        input={video_url:url,target_resolution:resolution,
          target_fps:settings.interpolate===true?60:30,
          enhancement_preset:'general',enhancement_tier:'standard',
          fidelity:'high'};
      }else{
        const images=await Promise.all((r.referenceImages||[]).map(async ref=>(await media(ref,signal)).dataUrl));
        input={prompt:r.prompt,video_url:url,keep_audio:true};
        if(images.length)input.image_urls=images;
      }
      const task=await json('https://queue.fal.run/'+id,{
        method:'POST',headers,signal,body:JSON.stringify(input)
      });
      for(const endpoint of [task.status_url,task.response_url,task.cancel_url].filter(Boolean))
        if(new URL(endpoint).origin!=='https://queue.fal.run')
          throw new Error('fal.ai trả URL hàng đợi không hợp lệ.');
      if(!task.status_url||!task.response_url)throw new Error('fal.ai không trả mã tác vụ để theo dõi.');
      const cancel=()=>{if(task.cancel_url)void fetch(task.cancel_url,{method:'PUT',headers}).catch(()=>{});};
      signal?.addEventListener('abort',cancel,{once:true});
      try{
        const end=Date.now()+600000;
        while(Date.now()<end){
          abort(signal);
          const status=await json(task.status_url,{headers,signal});
          if(status.status==='COMPLETED'){
            const result=await json(task.response_url,{headers,signal});
            if(!result.video?.url)throw new Error('fal.ai chưa trả video kết quả.');
            return {ok:true,url:result.video.url};
          }
          if(status.status==='FAILED')throw new Error('fal.ai không hoàn tất xử lý video.');
          await sleep(4000,signal);
        }
        throw new Error('fal.ai chưa hoàn tất sau 10 phút.');
      }finally{signal?.removeEventListener('abort',cancel);}

    }
  }
  // Explicit public API hosts only. A custom endpoint cannot redirect a stored key
  // to a private address or an unrelated host, including on the desktop bridge.
  const apiHosts=['api.anthropic.com','api.deepseek.com','dashscope-intl.aliyuncs.com','api.x.ai','api.mistral.ai','api.perplexity.ai','api.openai.com','openrouter.ai','api.together.xyz'];
  function endpoint(value){
    let url;try{url=new URL(value);}catch{throw new Error('Nhập địa chỉ API HTTPS hợp lệ.');}
    if(url.protocol!=='https:'||url.port||url.username||url.password||url.search||url.hash||!apiHosts.includes(url.hostname))throw new Error('Địa chỉ API chưa được hỗ trợ. Dùng máy chủ HTTPS trong danh sách hướng dẫn.');
    return url.href.replace(/\/$/,'');
  }
  function apiHeaders(definition,key){return definition.protocol==='anthropic'?{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'}:{'Content-Type':'application/json',Authorization:'Bearer '+key};}
  async function checkAPI(provider,key,signal){
    const definition=providers[provider];if(!definition||definition.urls)throw new Error('Kết nối không phải API.');
    if(!key)throw new Error('Chưa nhập API key.');abort(signal);
    const base=definition.baseProvider||provider;
    if(base==='fal'||base==='perplexity')throw new Error('Nhà cung cấp này chưa có kiểm tra không tạo nội dung trong ứng dụng. Đã lưu, chưa xác thực; hãy kiểm tra khi chạy tác vụ.');
    const url=base==='google'?'https://generativelanguage.googleapis.com/v1beta/models':base==='openai'?'https://api.openai.com/v1/models':endpoint(definition.endpoint)+'/models';
    const headers=base==='google'?{'x-goog-api-key':key}:apiHeaders(definition,key);
    await json(url,{headers,signal});return {ok:true,detail:'API phản hồi danh sách model; chưa thử tạo nội dung.'};
  }
  globalThis.WorkflowAI={providers,models,validate,api,endpoint,apiHosts,checkAPI};
})();
