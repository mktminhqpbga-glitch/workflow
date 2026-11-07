(function (root) {
  'use strict';
  // Shared, optional prompt controls; no provider request is made until Translate is clicked.
  const active = new Map();
  const vi = /[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/u;
  const commonVi = /(?:^|[^\p{L}])(?:tôi|bạn|chúng|của|trong|với|được|không|hãy|tạo|viết|một|những|đây|tiếng)(?=$|[^\p{L}])/iu;
  function targetLanguage(text) { return vi.test(text) || commonVi.test(text) ? 'en' : 'vi'; }
  function control(label, className, title) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.className = className;
    b.title = title; b.setAttribute('aria-label', title); return b;
  }
  function attach({node, body, canTranslate = false, translate, onChange, onError}) {
    if (!node || !body) return;
    const field = [...body.querySelectorAll('textarea')].find(el => !el.readOnly && !el.disabled);
    if (!field || field.dataset.sharedPromptControls) return;
    field.dataset.sharedPromptControls = 'true';
    const controls = document.createElement('div');
    controls.className = 'shared-prompt-actions';
    const translation = control('文A', 'shared-prompt-translate', 'Dịch nội dung Prompt Việt ↔ Anh');
    translation.textContent = '文A';
    const expand = control('⤢', 'shared-prompt-expand', 'Mở rộng ô nhập Prompt');
    if (canTranslate) controls.append(translation);
    controls.append(expand);
    field.insertAdjacentElement('afterend', controls);
    const text = () => field.value;
    const commit = value => {
      field.value = value;
      field.dispatchEvent(new Event('input', {bubbles: true}));
      onChange?.();
    };
    let enlarged = null;
    let busy = false;
    async function doTranslate(editor, button, status) {
      if (busy) return;
      const starting = editor.value;
      if (!starting.trim()) { status.textContent = 'Hãy nhập Prompt trước khi dịch.'; return; }
      if (typeof translate !== 'function') { status.textContent = 'Node này chưa được cấu hình dịch.'; return; }
      busy = true; button.disabled = true; button.classList.add('is-busy');
      const previous = button.textContent; button.textContent = '◌';
      status.textContent = 'Đang dịch Prompt…';
      try {
        const result = await translate(starting, targetLanguage(starting));
        if (typeof result !== 'string' || !result.trim()) throw new Error('AI không trả về bản dịch.');
        if (editor.value !== starting || !editor.isConnected) throw new Error('Prompt đã thay đổi khi dịch; không ghi đè nội dung mới.');
        commit(result.trim());
        editor.value = result.trim();
        status.textContent = 'Đã dịch Prompt. Có thể hoàn tác bằng Ctrl+Z.';
      } catch (error) {
        status.textContent = error.message || 'Không thể dịch Prompt.';
        onError?.(error);
      } finally { busy = false; button.disabled = false; button.classList.remove('is-busy'); button.textContent = previous; }
    }
    if (canTranslate) {
      const status = document.createElement('span'); status.className = 'shared-prompt-status';
      controls.append(status);
      translation.onclick = event => { event.stopPropagation(); void doTranslate(field, translation, status); };
    }
    function close() {
      if (!enlarged) return;
      const dialog = enlarged;
      enlarged = null; active.delete(node.id);
      dialog.remove();
      expand.setAttribute('aria-expanded', 'false');
      field.focus();
    }
    function open() {
      if (active.has(node.id)) { active.get(node.id)(); return; }
      const backdrop = document.createElement('div'); backdrop.className = 'shared-prompt-backdrop';
      backdrop.dataset.sharedPromptNode = node.id;
      const panel = document.createElement('div'); panel.className = 'shared-prompt-expanded';
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'Soạn Prompt mở rộng');
      const head = document.createElement('div'); head.className = 'shared-prompt-expanded-head';
      const heading = document.createElement('span'); heading.textContent = 'Prompt — ' + (node.data?.customName || node.type || 'Node');
      const shrink = control('⤡', 'shared-prompt-shrink', 'Thu về khung Prompt thường');
      head.append(heading, shrink);
      const editor = document.createElement('textarea'); editor.className = 'shared-prompt-expanded-editor';
      editor.setAttribute('aria-label', 'Nội dung Prompt mở rộng');
      editor.value = text();
      editor.oninput = () => commit(editor.value);
      const footer = document.createElement('div'); footer.className = 'shared-prompt-expanded-footer';
      const status = document.createElement('span'); status.className = 'shared-prompt-status';
      if (canTranslate) {
        const translateButton = control('文A  Dịch Việt ↔ Anh', 'shared-prompt-translate', 'Dịch nội dung Prompt');
        translateButton.onclick = () => void doTranslate(editor, translateButton, status);
        footer.append(translateButton);
      }
      footer.append(status);
      panel.append(head, editor, footer); backdrop.append(panel);
      backdrop.addEventListener('pointerdown', event => { if (event.target === backdrop) close(); });
      shrink.onclick = close;
      const keydown = event => { if (event.key === 'Escape') { event.stopPropagation(); event.preventDefault(); close(); } };
      backdrop.addEventListener('keydown', keydown);
      document.body.append(backdrop);
      enlarged = backdrop; active.set(node.id, close);
      expand.setAttribute('aria-expanded', 'true');
      editor.focus(); editor.setSelectionRange(editor.value.length, editor.value.length);
    }
    expand.setAttribute('aria-expanded', 'false');
    expand.onclick = event => { event.stopPropagation(); enlarged ? close() : open(); };
    return {close};
  }
  root.WorkflowSharedNodeControls = Object.freeze({attach, targetLanguage});
})(typeof globalThis !== 'undefined' ? globalThis : window);
