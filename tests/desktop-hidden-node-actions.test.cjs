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
    /['"`]Hơn['"`]/i,
    /Tách âm thanh\s*(?:và\s*)?video/i,
    /Tách âm\/video/i,
    /Phân tích\s*từng\s*khung\s*hình/i,
    /Phân tích\/tách cảnh\s*từng khung hình/i,
    /分离音视频/,
    /逐帧拉片/,
    /更多/,
    /Mở bàn làm việc 3D/i,
    /Xem không gian 3D/i,
    /Điều khiển camera 3D/i,
    /Timeline chuyên dụng/i,
    /Quảng cáo hàng loạt/i,
    /['"`]Đánh dấu đối tượng['"`]/i
  ];
  for(const filename of files){
    const source=fs.readFileSync(path.join(root,filename),'utf8');
    for(const check of forbidden){
      assert.doesNotMatch(source,check,
        filename+' must not reintroduce a hidden toolbar item '+check);
    }
  }
});
test('F06 Smart Edit is absent from all Canvas node creation surfaces',()=>{
  const forbidden=[
    /Chỉnh sửa thông minh/i,
    /Smart[ -]?Edit/i,
    /智能剪辑/,
    /data-add=[\"'](?:smartEdit|smart-edit|smart_edit|F06)[\"']/i,
    /(?:title|label)\s*:\s*[\"']Smart\s*Edit[\"']/i
  ];
  for(const filename of files){
    const source=fs.readFileSync(path.join(root,filename),'utf8');
    for(const check of forbidden){
      assert.doesNotMatch(source,check,filename+' must not expose hidden F06 Smart Edit '+check);
    }
  }
  const inventory=fs.readFileSync(path.join(root,'docs/NODE_BUTTON_INVENTORY.md'),'utf8');
  assert.match(inventory,/F06[^\n]*ẨN CẢ NODE/);
});

test('F03 and F04 tool inventory explicitly tracks globally hidden actions',()=>{
  const inventory=fs.readFileSync(path.join(root,'docs/NODE_BUTTON_INVENTORY.md'),'utf8');
  for(const id of ['I04','I13','I14','I15','I16','V14','V15','D01','D05','D06','E04','E14']){
    assert.match(inventory,new RegExp('\\| '+id+' \\|[^\\n]*⛔ ẨN \\|'));
  }
});
