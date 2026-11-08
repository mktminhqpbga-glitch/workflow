/* Task-specific checks for actual output. Never infer quality from a successful HTTP response. */
(function(root){
'use strict';
const positive=value=>Number.isFinite(Number(value))&&Number(value)>0?Number(value):0;
function inspect(task,output){
 const id=task?.id;
 const settings=task?.settings||{};
 const source=task?.sourceDimensions||{};
 const original={width:positive(source.width),height:positive(source.height),duration:positive(source.duration)};
 const actual={width:positive(output?.width),height:positive(output?.height),duration:positive(output?.duration)};
 let status='manual',message='AI đã trả kết quả. Cần xem hình/video để xác nhận đúng nội dung và không đổi chủ thể.';
 const result={id,status,original,actual,message};
 if(!id)return {...result,status:'not-applicable',message:''};
 if(id==='imageHD'){
  const scale=[2,4,6].includes(Number(settings.scale))?Number(settings.scale):2;
  if(original.width&&original.height&&actual.width&&actual.height){
   const good=actual.width>=original.width*scale&&actual.height>=original.height*scale;
   return {...result,status:good?'pass':'warning',
     message:good?'Đã xác nhận kích thước ảnh tăng ít nhất '+scale+'× theo mỗi chiều. Cần xem lại chi tiết hình.':
       'Ảnh AI chỉ có '+actual.width+'×'+actual.height+'; yêu cầu ít nhất '+
       (original.width*scale)+'×'+(original.height*scale)+
       '. Kết quả được giữ lại nhưng CHƯA ĐẠT mức HD đã chọn.'};
  }
  return {...result,status:'warning',message:'Không đo được ảnh nguồn/đầu ra để xác minh '+scale+'×. Không được coi là đã nâng HD.'};
 }
 if(id==='videoHD'){
  const required=({'1080P':1080,'2K':1080,'4K':2160})[settings.resolution||'1080P']||1080;
  if(actual.width&&actual.height){
    const min=Math.min(actual.width,actual.height),ok=min>=required;
    return {...result,status:ok?'manual':'warning',message:ok?
      'Kích thước video phù hợp mức '+(settings.resolution||'1080P')+
      '. Chưa xác minh cải thiện chi tiết thực, tiếng và chuyển động.':
      'Video trả về chỉ '+actual.width+'×'+actual.height+
      ', thấp hơn ngưỡng '+required+'px của mức '+(settings.resolution||'1080P')+'.'};
  }
  return {...result,status:'warning',message:'Không đọc được độ phân giải video trả về, chưa xác minh HD.'};
 }
 if(id==='videoSegment'&&original.duration&&actual.duration){
  const diff=Math.abs(original.duration-actual.duration);
  return {...result,status:diff<=0.6?'manual':'warning',message:diff<=0.6?
    'Thời lượng video sau nối đoạn phù hợp. Cần xem các đoạn trước/sau để xác nhận không thay đổi.':
    'Video sau nối đoạn lệch '+diff.toFixed(2)+' giây so với nguồn; cần kiểm tra lại phần ghép.'};
 }
 if(id==='videoSubtitles')
  return {...result,status:'manual',message:'AI đã trả video. Cần xem khung hình để xác minh phụ đề cháy thực sự bị xóa sạch; không thể kết luận chỉ từ HTTP thành công.'};
 if(id==='imageAngles')
  return {...result,status:'manual',message:'AI đã trả ảnh mới. Cần đối chiếu cùng nhân vật/bối cảnh và góc camera đã chọn; không thể kiểm chứng nhận dạng bằng kích thước.'};
 if(id==='videoDepth')
  return {...result,status:'manual',message:'AI đã trả video chuyển động. Cần xem chiều sâu, chuyển động chủ thể, âm thanh và so với video nguồn.'};
 if(id==='audioToVideo')
  return {...result,status:'manual',message:'Đã nhận video từ audio. Cần xem đồng bộ nhịp/hành động và nghe audio để xác minh yêu cầu.'};
 return result;
}
const api=Object.freeze({inspect});
root.WorkflowAIOutputAudit=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
