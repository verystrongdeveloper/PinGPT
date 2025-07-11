// PinGPT Chrome Extension - Popup Script
// 책갈피 관리 팝업의 메인 스크립트

const TRANSLATIONS = {
  en: {
    title: "📌 PinGPT",
    subtitle: "Quick access to saved conversations",
    emptyTitle: "No bookmarks yet",
    emptySubtitle: "Click the 📌 button in chat to get started",
    refreshCleared: "Bookmarks cleared on refresh",
    chatLabel: "Chat #",
    setRecent: "Set as recent bookmark",
    rename: "Rename",
    recentSet: "Set as recent bookmark!",
    nameChanged: "Name changed!",
    bookmarkAdded: "Bookmark added!",
    bookmarkRemoved: "Bookmark removed",
    jumpToRecent: "Jumped to recent bookmark!",
    noBookmarks: "😅 No bookmarks found",
    quickJump: "🧭 Jump to recent bookmark",
    // 프리셋 관련 번역
    presets: "🎯 Presets",
    addPreset: "➕ Add",
    currentSession: "📌 Current Session",
    createPreset: "Create Preset",
    presetName: "Enter preset name",
    presetUrl: "Enter chat link (e.g., https://chatgpt.com/c/...)",
    currentUrl: "Current URL",
    cancel: "Cancel",
    create: "Create",
    presetCreated: "Preset created!",
    presetDeleted: "Preset deleted!",
    presetLoaded: "Preset loaded!",
    invalidUrl: "Invalid URL format",
    presetNameRequired: "Preset name is required",
    presetUrlRequired: "Chat URL is required"
  },
  ko: {
    title: "📌 PinGPT",
    subtitle: "저장된 대화에 빠르게 접근",
    emptyTitle: "아직 책갈피가 없습니다",
    emptySubtitle: "채팅에서 📌 버튼을 클릭하여 시작하세요",
    refreshCleared: "새로고침으로 책갈피 초기화됨",
    chatLabel: "채팅 #",
    setRecent: "최근 책갈피로 설정",
    rename: "이름 변경",
    recentSet: "최근 책갈피로 설정!",
    nameChanged: "이름이 변경되었습니다!",
    bookmarkAdded: "책갈피 추가 완료!",
    bookmarkRemoved: "책갈피 삭제됨",
    jumpToRecent: "최근 책갈피로 이동!",
    noBookmarks: "😅 책갈피가 없습니다",
    quickJump: "🧭 최근 책갈피로 이동",
    // 프리셋 관련 번역
    presets: "🎯 프리셋",
    addPreset: "➕ 추가",
    currentSession: "📌 현재 세션",
    createPreset: "프리셋 생성",
    presetName: "프리셋 이름을 입력하세요",
    presetUrl: "채팅 링크를 입력하세요 (예: https://chatgpt.com/c/...)",
    currentUrl: "현재 주소",
    cancel: "취소",
    create: "생성",
    presetCreated: "프리셋이 생성되었습니다!",
    presetDeleted: "프리셋이 삭제되었습니다!",
    presetLoaded: "프리셋이 로드되었습니다!",
    invalidUrl: "잘못된 URL 형식입니다",
    presetNameRequired: "프리셋 이름을 입력해주세요",
    presetUrlRequired: "채팅 URL을 입력해주세요"
  },
  ja: {
    title: "📌 PinGPT",
    subtitle: "保存された会話に素早くアクセス",
    emptyTitle: "まだブックマークがありません",
    emptySubtitle: "チャットで📌ボタンをクリックして始めましょう",
    refreshCleared: "リフレッシュでブックマークがクリアされました",
    chatLabel: "チャット #",
    setRecent: "最近のブックマークに設定",
    rename: "名前を変更",
    recentSet: "最近のブックマークに設定しました！",
    nameChanged: "名前が変更されました！",
    bookmarkAdded: "ブックマーク追加完了！",
    bookmarkRemoved: "ブックマーク削除済み！",
    jumpToRecent: "最近のブックマークに移動！",
    noBookmarks: "😅 ブックマークがありません",
    quickJump: "🧭 最近のブックマークに移動",
    // 프리셋 관련 번역
    presets: "🎯 プリセット",
    addPreset: "➕ 追加",
    currentSession: "📌 現在のセッション",
    createPreset: "プリセット作成",
    presetName: "プリセット名を入力してください",
    presetUrl: "チャットリンクを入力してください (例: https://chatgpt.com/c/...)",
    currentUrl: "現在のURL",
    cancel: "キャンセル",
    create: "作成",
    presetCreated: "プリセットが作成されました！",
    presetDeleted: "プリセットが削除されました！",
    presetLoaded: "プリセットがロードされました！",
    invalidUrl: "無効なURL形式です",
    presetNameRequired: "プリセット名を入力してください",
    presetUrlRequired: "チャットURLを入力してください"
  },
  zh: {
    title: "📌 PinGPT",
    subtitle: "快速访问保存的对话",
    emptyTitle: "还没有书签",
    emptySubtitle: "在聊天中点击📌按钮开始使用",
    refreshCleared: "刷新后书签已清除",
    chatLabel: "聊天 #",
    setRecent: "设为最近书签",
    rename: "重命名",
    recentSet: "已设为最近书签！",
    nameChanged: "名称已更改！",
    bookmarkAdded: "书签添加成功！",
    bookmarkRemoved: "书签已移除！",
    jumpToRecent: "已跳转到最近书签！",
    noBookmarks: "😅 没有找到书签",
    quickJump: "🧭 跳转到最近书签",
    // 프리셋 관련 번역
    presets: "🎯 预设",
    addPreset: "➕ 添加",
    currentSession: "📌 当前会话",
    createPreset: "创建预设",
    presetName: "请输入预设名称",
    presetUrl: "请输入聊天链接 (例: https://chatgpt.com/c/...)",
    currentUrl: "当前地址",
    cancel: "取消",
    create: "创建",
    presetCreated: "预设已创建！",
    presetDeleted: "预设已删除！",
    presetLoaded: "预设已加载！",
    invalidUrl: "无效的URL格式",
    presetNameRequired: "请输入预设名称",
    presetUrlRequired: "请输入聊天URL"
  },
  es: {
    title: "📌 PinGPT",
    subtitle: "Acceso rápido a conversaciones guardadas",
    emptyTitle: "Aún no hay marcadores",
    emptySubtitle: "Haz clic en el botón 📌 en el chat para comenzar",
    refreshCleared: "Marcadores eliminados al actualizar",
    chatLabel: "Chat #",
    setRecent: "Establecer como marcador reciente",
    rename: "Renombrar",
    recentSet: "¡Establecido como marcador reciente!",
    nameChanged: "¡Nombre cambiado!",
    bookmarkAdded: "¡Marcador añadido!",
    bookmarkRemoved: "¡Marcador eliminado!",
    jumpToRecent: "¡Saltado al marcador reciente!",
    noBookmarks: "😅 No se encontraron marcadores",
    quickJump: "🧭 Saltar al marcador reciente",
    // 프리셋 관련 번역
    presets: "🎯 Presets",
    addPreset: "➕ Añadir",
    currentSession: "📌 Sesión Actual",
    createPreset: "Crear Preset",
    presetName: "Ingrese el nombre del preset",
    presetUrl: "Ingrese el enlace del chat (ej: https://chatgpt.com/c/...)",
    currentUrl: "URL Actual",
    cancel: "Cancelar",
    create: "Crear",
    presetCreated: "¡Preset creado!",
    presetDeleted: "¡Preset eliminado!",
    presetLoaded: "¡Preset cargado!",
    invalidUrl: "Formato de URL inválido",
    presetNameRequired: "Se requiere el nombre del preset",
    presetUrlRequired: "Se requiere la URL del chat"
  }
};

// 상수 정의
const CONSTANTS = {
  STORAGE_KEY: 'chatpins',
  NAMES_KEY: 'chatpinNames',
  PRESETS_KEY: 'chatpinPresets',
  LANGUAGE_KEY: 'chatpinLanguage',
  DIMENSIONS: {
    MIN_HEIGHT: 260,
    MAX_HEIGHT: 450,
    ITEM_HEIGHT: 54,
    HEADER_HEIGHT: 70,
    CONTENT_PADDING: 40,
    MAX_VISIBLE_ITEMS: 6,
    EMPTY_STATE_HEIGHT: 160
  },
  ANIMATION: {
    STAGGER_DELAY: 80,
    RELOAD_DELAY: 1200,
    DELETE_DURATION: 400,
    NOTIFICATION_DURATION: 2800,
    FADE_DURATION: 300
  },
  SWIPE: {
    THRESHOLD: 80,
    MIN_MOVE_DISTANCE: 5
  }
};

// 전역 변수
let isDragScrolling = false;
let isTouchScrolling = false;
let currentLanguage = 'en';

// ChatGPT 페이지 언어 감지 함수 (popup에서는 브라우저 언어 사용)
function detectChatGPTLanguage() {
  return detectBrowserLanguage();
}

// 브라우저 언어 감지 함수
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // 지원하는 언어 목록
  const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es'];
  
  return supportedLanguages.includes(langCode) ? langCode : 'en';
}

// 메인 초기화
document.addEventListener('DOMContentLoaded', initializePopup);

function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

function initializePopup() {
  loadLanguage(() => {
    updateUILanguage();
    const pinList = document.getElementById('pin-list');
    const content = document.getElementById('content');
    setInitialHeight();
    loadPins(pinList, content);
    loadPresets(); // 프리셋 로드 추가
    setupLanguageSelector();
    setupPresetEventListeners(); // 프리셋 이벤트 리스너 설정
  });
}

function loadLanguage(callback) {
  // 먼저 저장된 언어 설정이 있는지 확인
  chrome.storage.sync.get([CONSTANTS.LANGUAGE_KEY], (data) => {
    if (data[CONSTANTS.LANGUAGE_KEY]) {
      // 이미 설정된 언어가 있으면 그것을 사용
      currentLanguage = data[CONSTANTS.LANGUAGE_KEY];
      callback();
    } else {
      // 설정된 언어가 없으면 자동 감지
      const detectedLang = detectChatGPTLanguage();
      chrome.storage.sync.set({ [CONSTANTS.LANGUAGE_KEY]: detectedLang }, () => {
        currentLanguage = detectedLang;
        callback();
      });
    }
  });
}

function changeLanguage(languageCode) {
  currentLanguage = languageCode;
  chrome.storage.sync.set({ [CONSTANTS.LANGUAGE_KEY]: languageCode }, () => {
    location.reload();
  });
}

function updateUILanguage() {
  document.querySelector('.title').textContent = t('title');
  document.querySelector('.subtitle').textContent = t('subtitle');
  
  // 프리셋 관련 UI 업데이트
  document.querySelector('.presets-title').textContent = t('presets');
  document.querySelector('.add-preset-btn').textContent = t('addPreset');
  document.querySelector('.pins-section-title').textContent = t('currentSession');
  document.querySelector('.modal-title').textContent = t('createPreset');
  document.querySelector('#preset-name').placeholder = t('presetName');
  document.querySelector('#preset-url').placeholder = t('presetUrl');
  document.querySelector('#current-url-btn').textContent = t('currentUrl');
  document.querySelector('#cancel-preset-btn').textContent = t('cancel');
  document.querySelector('#create-preset-btn').textContent = t('create');
  
  // 모든 버튼의 title 업데이트
  document.querySelectorAll('.rename-btn').forEach(btn => {
    btn.title = t('rename');
  });
  
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.title = t('setRecent');
  });
}

function setInitialHeight() {
  document.body.style.height = `${CONSTANTS.DIMENSIONS.MIN_HEIGHT}px`;
}

// 책갈피 데이터 로드 및 렌더링
function loadPins(pinList, content) {
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const pins = data[CONSTANTS.STORAGE_KEY] || [];
    
    if (pins.length === 0) {
      renderEmptyState(pinList);
      return;
    }
    
    adjustPopupHeight(pins.length);
    setupDragScroll(content);
    renderPins(pinList, pins);
    addDynamicStyles();
  });
}

// 빈 상태 렌더링
function renderEmptyState(pinList) {
  document.body.style.height = `${CONSTANTS.DIMENSIONS.MIN_HEIGHT}px`;
  pinList.innerHTML = `
    <div class="empty-state">
      <span class="empty-state-icon">🔄</span>
      <div class="empty-state-text">${t('refreshCleared')}</div>
      <div class="empty-state-subtext">${t('emptySubtitle')}</div>
    </div>
  `;
}

// 팝업 높이 조정
function adjustPopupHeight(pinCount) {
  const { ITEM_HEIGHT, HEADER_HEIGHT, CONTENT_PADDING, MAX_VISIBLE_ITEMS, MIN_HEIGHT, MAX_HEIGHT } = CONSTANTS.DIMENSIONS;
  const visibleItems = Math.min(pinCount, MAX_VISIBLE_ITEMS);
  const dynamicHeight = HEADER_HEIGHT + (visibleItems * ITEM_HEIGHT) + CONTENT_PADDING;
  const finalHeight = Math.min(Math.max(dynamicHeight, MIN_HEIGHT), MAX_HEIGHT);
  
  document.body.style.height = `${finalHeight}px`;
}

// 책갈피 목록 렌더링
function renderPins(pinList, pins) {
  pins.forEach((id, index) => {
    const pinElement = createPinElement(id, index);
    pinList.appendChild(pinElement);
  });
}

// 책갈피 요소 생성
function createPinElement(id, index) {
  const row = document.createElement("div");
  row.className = "pin";
  row.dataset.pinId = id;
  
  setupPinAnimation(row, index);
  setupSwipeToDelete(row, id);
  
  const pinIcon = createPinIcon();
  const label = createPinLabel(id, index, row);
  const renameBtn = createRenameButton(id, label);
  const starBtn = createStarButton(id, row);
  
  row.appendChild(pinIcon);
  row.appendChild(label);
  row.appendChild(renameBtn);
  row.appendChild(starBtn);
  
  return row;
}

// 책갈피 아이콘 생성
function createPinIcon() {
  const icon = document.createElement("span");
  icon.className = "pin-icon";
  icon.innerHTML = "💬";
  return icon;
}

// 책갈피 라벨 생성
function createPinLabel(id, index, row) {
  const label = document.createElement("span");
  label.className = "pin-text";
  
  // 저장된 이름이 있는지 확인
  chrome.storage.sync.get({ 'chatpinNames': {} }, (data) => {
    const names = data.chatpinNames || {};
    if (names[id]) {
      label.innerText = names[id];
    } else {
      const chatNumber = id.split('-')[1] || index + 1;
      label.innerText = `${t('chatLabel')}${chatNumber}`;
    }
  });
  
  label.onclick = (e) => handleLabelClick(e, row, id, label);
  return label;
}

// Rename 버튼 생성
function createRenameButton(id, label) {
  const renameBtn = document.createElement("button");
  renameBtn.className = "rename-btn";
  renameBtn.innerHTML = "✏️";
  renameBtn.title = t('rename');
  
  renameBtn.onclick = (e) => handleRenameClick(e, id, label);
  return renameBtn;
}

// 즐겨찾기 버튼 생성
function createStarButton(id, row) {
  const starBtn = document.createElement("button");
  starBtn.className = "star-btn";
  starBtn.innerHTML = "⭐";
  starBtn.title = t('setRecent');
  
  starBtn.onclick = (e) => handleStarClick(e, starBtn, id);
  return starBtn;
}

// 라벨 클릭 처리 - 클릭 위치에 따라 분기
function handleLabelClick(e, row, id, label) {
  e.stopPropagation();
  
  // 실제 텍스트 너비 계산
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const computedStyle = window.getComputedStyle(label);
  context.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
  const textWidth = context.measureText(label.innerText).width;
  
  // 마지막 글자 예상 너비 계산 (평균 글자 크기)
  const avgCharWidth = textWidth / label.innerText.length;
  const lastCharZone = Math.max(avgCharWidth, 12); // 최소 12px
  
  // 클릭 위치 확인
  const clickPosition = e.offsetX;
  const rightEndZone = 20; // 텍스트 끝에서 20px 영역
  
  if (clickPosition > textWidth - lastCharZone && clickPosition <= textWidth + rightEndZone) {
    // 마지막 글자 ~ 끝+20px 영역 클릭 -> 이름 변경
    handleRenameClick(e, id, label);
  } else {
    // 나머지 영역 클릭 -> 채팅으로 이동
    handlePinClick(e, row, id);
  }
}

// 책갈피 클릭 처리
function handlePinClick(e, row, id) {
  e.stopPropagation();
  
  animateClick(row);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'JUMP_TO_PIN', id });
  });
}

// Rename 클릭 처리
function handleRenameClick(e, id, label) {
  e.stopPropagation();
  
  const currentText = label.innerText;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'rename-input';
  input.value = currentText;
  input.maxLength = 20; // 최대 20글자 제한
  input.style.cssText = `
    background: transparent;
    border: 1px solid #6366f1;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    outline: none;
    width: 100%;
  `;
  
  // 기존 라벨을 input으로 교체
  label.style.display = 'none';
  label.parentNode.insertBefore(input, label.nextSibling);
  
  input.focus();
  input.select();
  
  const saveRename = () => {
    const newName = input.value.trim();
    if (newName && newName !== currentText && newName.length <= 20) {
      chrome.storage.sync.get({ 'chatpinNames': {} }, (data) => {
        const names = data.chatpinNames || {};
        names[id] = newName;
        chrome.storage.sync.set({ 'chatpinNames': names }, () => {
          label.innerText = newName;
          showNotification(t('nameChanged'), "success");
        });
      });
    } else {
      label.innerText = currentText;
    }
    
    // input 제거하고 라벨 다시 표시
    input.remove();
    label.style.display = '';
  };
  
  const cancelRename = () => {
    input.remove();
    label.style.display = '';
  };
  
  input.addEventListener('blur', saveRename);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  });
}

// 즐겨찾기 클릭 처리
function handleStarClick(e, starBtn, id) {
  e.stopPropagation();
  
  animateStar(starBtn);
  moveToTop(id);
}

// 책갈피 애니메이션 설정
function setupPinAnimation(row, index) {
  row.style.opacity = "0";
  row.style.transform = "translateY(20px)";
  
  setTimeout(() => {
    row.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.320, 1)";
    row.style.opacity = "1";
    row.style.transform = "translateY(0)";
  }, index * CONSTANTS.ANIMATION.STAGGER_DELAY);
}

// 클릭 애니메이션
function animateClick(element) {
  element.style.transform = "scale(0.96)";
  setTimeout(() => {
    element.style.transform = "";
  }, 150);
}

// 별 버튼 애니메이션
function animateStar(starBtn) {
  starBtn.style.transform = "scale(0.8) rotate(360deg)";
  setTimeout(() => {
    starBtn.style.transform = "";
  }, 500);
}

// 책갈피를 맨 위로 이동
function moveToTop(id) {
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const reordered = data[CONSTANTS.STORAGE_KEY].filter((x) => x !== id).concat(id);
    chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: reordered }, () => {
      showNotification(t('recentSet'), "success");
      setTimeout(() => location.reload(), CONSTANTS.ANIMATION.RELOAD_DELAY);
    });
  });
}

// 드래그 스크롤 설정
function setupDragScroll(element) {
  let isDown = false;
  let startY = 0;
  let scrollTop = 0;

  element.style.overflowY = 'auto';
  element.style.scrollbarWidth = 'none';
  element.style.msOverflowStyle = 'none';

  // 마우스 이벤트
  element.addEventListener('mousedown', (e) => handleMouseDown(e, element));
  element.addEventListener('mouseleave', () => resetCursor(element));
  element.addEventListener('mouseup', () => handleMouseUp(element));
  element.addEventListener('mousemove', (e) => handleMouseMove(e, element));

  // 터치 이벤트
  element.addEventListener('touchstart', (e) => handleTouchStart(e, element));
  element.addEventListener('touchmove', (e) => handleTouchMove(e, element));
  element.addEventListener('touchend', () => handleTouchEnd());

  function handleMouseDown(e, el) {
    if (e.target.closest('.bookmark') || e.target.closest('.star-btn')) return;
    
    isDown = true;
    isDragScrolling = false;
    startY = e.pageY - el.offsetTop;
    scrollTop = el.scrollTop;
    el.style.cursor = 'grabbing';
  }

  function resetCursor(el) {
    isDown = false;
    el.style.cursor = 'grab';
  }

  function handleMouseUp(el) {
    isDown = false;
    el.style.cursor = 'grab';
    
    if (isDragScrolling) {
      setTimeout(() => { isDragScrolling = false; }, 10);
    }
  }

  function handleMouseMove(e, el) {
    if (!isDown) return;
    e.preventDefault();
    
    const y = e.pageY - el.offsetTop;
    const walk = (y - startY) * 1.5;
    
    if (Math.abs(walk) > 3) {
      isDragScrolling = true;
    }
    
    el.scrollTop = scrollTop - walk;
  }

  function handleTouchStart(e, el) {
    const touchStartY = e.touches[0].pageY;
    el.dataset.touchStartY = touchStartY;
    el.dataset.touchScrollTop = el.scrollTop;
    isTouchScrolling = false;
  }

  function handleTouchMove(e, el) {
    const touchY = e.touches[0].pageY;
    const touchStartY = parseFloat(el.dataset.touchStartY);
    const touchScrollTop = parseFloat(el.dataset.touchScrollTop);
    const walk = (touchStartY - touchY) * 1.2;
    
    if (Math.abs(walk) > 5) {
      isTouchScrolling = true;
      e.preventDefault();
    }
    
    el.scrollTop = touchScrollTop + walk;
  }

  function handleTouchEnd() {
    if (isTouchScrolling) {
      setTimeout(() => { isTouchScrolling = false; }, 10);
    }
  }
}

// 스와이프 삭제 기능 설정
function setupSwipeToDelete(element, bookmarkId) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let hasMoved = false;

  // 터치 이벤트
  element.addEventListener('touchstart', (e) => handleSwipeStart(e));
  element.addEventListener('touchmove', (e) => handleSwipeMove(e));
  element.addEventListener('touchend', () => handleSwipeEnd());

  // 마우스 이벤트
  element.addEventListener('mousedown', (e) => handleMouseSwipeStart(e));
  element.addEventListener('contextmenu', (e) => {
    if (hasMoved) e.preventDefault();
  });

  function handleSwipeStart(e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    hasMoved = false;
    element.style.transition = 'none';
  }

  function handleSwipeMove(e) {
    if (!isDragging) return;
    
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    hasMoved = true;
    
    updateSwipeVisual(element, deltaX);
  }

  function handleSwipeEnd() {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    isDragging = false;
    
    if (hasMoved && Math.abs(deltaX) > CONSTANTS.SWIPE.THRESHOLD) {
      deletePin(element, bookmarkId);
    } else {
      resetSwipeVisual(element);
    }
  }

  function handleMouseSwipeStart(e) {
    if (e.button !== 0) return;
    
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    hasMoved = false;
    element.style.transition = 'none';
    element.style.cursor = 'grabbing';
    
    const mouseMoveHandler = (e) => handleMouseSwipeMove(e);
    const mouseUpHandler = () => handleMouseSwipeEnd();
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    function handleMouseSwipeMove(e) {
      if (!isDragging) return;
      
      currentX = e.clientX;
      const deltaX = currentX - startX;
      
      if (Math.abs(deltaX) > CONSTANTS.SWIPE.MIN_MOVE_DISTANCE) {
        hasMoved = true;
        updateSwipeVisual(element, deltaX);
      }
    }

    function handleMouseSwipeEnd() {
      if (!isDragging) return;
      
      const deltaX = currentX - startX;
      isDragging = false;
      element.style.cursor = 'pointer';
      
      if (hasMoved && Math.abs(deltaX) > CONSTANTS.SWIPE.THRESHOLD) {
        deletePin(element, bookmarkId);
      } else {
        resetSwipeVisual(element);
      }
      
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
  }
}

// 스와이프 시각적 피드백 업데이트
function updateSwipeVisual(element, deltaX) {
  element.style.transform = `translateX(${deltaX}px)`;
  
  if (Math.abs(deltaX) > CONSTANTS.SWIPE.THRESHOLD) {
    element.style.background = 'linear-gradient(135deg, #fecaca, #fca5a5)';
  } else {
    element.style.background = '';
  }
}

// 스와이프 시각적 상태 리셋
function resetSwipeVisual(element) {
  element.style.transition = 'all 0.3s ease';
  element.style.transform = 'translateX(0)';
  element.style.background = '';
}

// 책갈피 삭제
function deletePin(element, bookmarkId) {
  element.style.transition = 'all 0.4s ease';
  element.style.transform = 'translateX(100%) scale(0.8)';
  element.style.opacity = '0';
  
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const updated = data[CONSTANTS.STORAGE_KEY].filter(pin => pin !== bookmarkId);
    chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
      showNotification(t('bookmarkRemoved'), "info");
      
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
          
          if (updated.length === 0) {
            setTimeout(() => location.reload(), 500);
          }
        }
      }, CONSTANTS.ANIMATION.DELETE_DURATION);
    });
  });
}

// 스토리지 변경 감지
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[CONSTANTS.STORAGE_KEY]) {
    const oldPins = changes[CONSTANTS.STORAGE_KEY].oldValue || [];
    const newPins = changes[CONSTANTS.STORAGE_KEY].newValue || [];
    
    if (newPins.length > oldPins.length) {
              showNotification(t('bookmarkAdded'), "success");
    }
  }
});

// 알림 표시
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector('.toast-notification');
  if (existingNotification) existingNotification.remove();

  const notification = createNotificationElement(message, type);
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, CONSTANTS.ANIMATION.FADE_DURATION);
  }, CONSTANTS.ANIMATION.NOTIFICATION_DURATION);
}

// 알림 요소 생성
function createNotificationElement(message, type) {
  const notification = document.createElement("div");
  notification.className = "toast-notification";
  
  // 메시지 유형에 따른 아이콘 매핑
  let icon = '';
  if (message.includes('추가') || message.includes('added') || message.includes('追加') || message.includes('添加') || message.includes('añadido')) {
    icon = '📌';
  } else if (message.includes('삭제') || message.includes('removed') || message.includes('削除') || message.includes('移除') || message.includes('eliminado')) {
    icon = '🗑️';
  } else if (message.includes('설정') || message.includes('bookmark') || message.includes('設定') || message.includes('设为') || message.includes('Establecido')) {
    icon = '⭐';
  } else if (message.includes('이동') || message.includes('Jumped') || message.includes('移動') || message.includes('跳转') || message.includes('Saltado')) {
    icon = '🎯';
  } else if (message.includes('변경') || message.includes('changed') || message.includes('変更') || message.includes('更改') || message.includes('cambiado')) {
    icon = '✏️';
  } else {
    icon = 'ℹ️';
  }
  
  notification.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
  `;
  
  return notification;
}

// 동적 스타일 추가
function addDynamicStyles() {
  if (document.querySelector('#toast-styles')) return;

  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .toast-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ffffff;
      color: #1f2937;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      z-index: 1000;
      max-width: 240px;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateY(-10px);
      opacity: 0;
      transition: all 0.3s ease;
      letter-spacing: -0.2px;
    }
    
    .toast-notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .toast-notification.fade-out {
      transform: translateY(-10px);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .toast-icon {
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .toast-message {
      flex: 1;
      line-height: 1.3;
    }
  `;

  document.head.appendChild(style);
}

function setupLanguageSelector() {
  const header = document.querySelector('.header');
  if (!header) return;

  const selector = document.createElement('select');
  selector.className = 'language-selector';
  selector.innerHTML = `
    <option value="en">🇺🇸 English</option>
    <option value="ko">🇰🇷 한국어</option>
    <option value="ja">🇯🇵 日本語</option>
    <option value="zh">🇨🇳 中文</option>
    <option value="es">🇪🇸 Español</option>
  `;
  selector.value = currentLanguage;

  selector.addEventListener('change', (e) => changeLanguage(e.target.value));
  selector.title = 'Change language';
  header.appendChild(selector);
}

// ============= 프리셋 관련 함수들 =============

// 프리셋 로드
function loadPresets() {
  chrome.storage.sync.get({ [CONSTANTS.PRESETS_KEY]: [] }, (data) => {
    const presets = data[CONSTANTS.PRESETS_KEY] || [];
    renderPresets(presets);
  });
}

// 프리셋 렌더링
function renderPresets(presets) {
  const presetsList = document.getElementById('presets-list');
  presetsList.innerHTML = '';
  
  if (presets.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.style.height = '60px';
    emptyState.style.padding = '20px';
    emptyState.innerHTML = `
      <div style="font-size: 12px; color: var(--text-secondary); opacity: 0.7;">
        아직 프리셋이 없습니다
      </div>
    `;
    presetsList.appendChild(emptyState);
    return;
  }
  
  presets.forEach(preset => {
    const presetElement = createPresetElement(preset);
    presetsList.appendChild(presetElement);
  });
}

// 프리셋 요소 생성
function createPresetElement(preset) {
  const element = document.createElement('div');
  element.className = 'preset-item';
  element.dataset.presetId = preset.id;
  
  const shortUrl = preset.chatUrl.replace(/^https?:\/\//, '').substring(0, 30) + '...';
  
  element.innerHTML = `
    <span class="preset-icon">🎯</span>
    <div style="flex: 1;">
      <div class="preset-name">${preset.name}</div>
      <div class="preset-url">${shortUrl}</div>
    </div>
    <button class="delete-preset-btn" title="삭제">×</button>
  `;
  
  // 프리셋 클릭 이벤트
  element.addEventListener('click', (e) => {
    if (!e.target.classList.contains('delete-preset-btn')) {
      loadPresetAndNavigate(preset);
    }
  });
  
  // 삭제 버튼 이벤트
  element.querySelector('.delete-preset-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deletePreset(preset.id);
  });
  
  return element;
}

// 프리셋 이벤트 리스너 설정
function setupPresetEventListeners() {
  const addPresetBtn = document.getElementById('add-preset-btn');
  const presetModal = document.getElementById('preset-modal');
  const cancelBtn = document.getElementById('cancel-preset-btn');
  const createBtn = document.getElementById('create-preset-btn');
  const currentUrlBtn = document.getElementById('current-url-btn');
  
  // 프리셋 추가 버튼
  addPresetBtn.addEventListener('click', () => {
    showPresetModal();
  });
  
  // 모달 닫기 (배경 클릭)
  presetModal.addEventListener('click', (e) => {
    if (e.target === presetModal) {
      hidePresetModal();
    }
  });
  
  // 취소 버튼
  cancelBtn.addEventListener('click', () => {
    hidePresetModal();
  });
  
  // 생성 버튼
  createBtn.addEventListener('click', () => {
    createPreset();
  });
  
  // 현재 주소 버튼
  currentUrlBtn.addEventListener('click', () => {
    getCurrentTabUrl();
  });
  
  // Enter 키 처리
  document.getElementById('preset-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      createPreset();
    }
  });
  
  document.getElementById('preset-url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      createPreset();
    }
  });
}

// 프리셋 모달 표시
function showPresetModal() {
  const modal = document.getElementById('preset-modal');
  const nameInput = document.getElementById('preset-name');
  const urlInput = document.getElementById('preset-url');
  
  nameInput.value = '';
  urlInput.value = '';
  modal.classList.remove('hidden');
  nameInput.focus();
}

// 프리셋 모달 숨기기
function hidePresetModal() {
  const modal = document.getElementById('preset-modal');
  modal.classList.add('hidden');
}

// 현재 탭 URL 가져오기
function getCurrentTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      if (url.includes('chatgpt.com/c/') || url.includes('chat.openai.com/c/')) {
        document.getElementById('preset-url').value = url;
      } else {
        showNotification('ChatGPT 채팅 페이지에서만 사용할 수 있습니다', 'error');
      }
    }
  });
}

// 프리셋 생성
function createPreset() {
  const nameInput = document.getElementById('preset-name');
  const urlInput = document.getElementById('preset-url');
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  
  // 유효성 검사
  if (!name) {
    showNotification(t('presetNameRequired'), 'error');
    nameInput.focus();
    return;
  }
  
  if (!url) {
    showNotification(t('presetUrlRequired'), 'error');
    urlInput.focus();
    return;
  }
  
  if (!isValidChatUrl(url)) {
    showNotification(t('invalidUrl'), 'error');
    urlInput.focus();
    return;
  }
  
  // 현재 핀 데이터 가져오기
  chrome.storage.sync.get({ 
    [CONSTANTS.STORAGE_KEY]: [], 
    [CONSTANTS.NAMES_KEY]: {},
    [CONSTANTS.PRESETS_KEY]: [] 
  }, (data) => {
    const currentPins = data[CONSTANTS.STORAGE_KEY] || [];
    const currentNames = data[CONSTANTS.NAMES_KEY] || {};
    const presets = data[CONSTANTS.PRESETS_KEY] || [];
    
    const newPreset = {
      id: `preset_${Date.now()}`,
      name: name,
      chatUrl: url,
      pins: [...currentPins],
      pinNames: { ...currentNames },
      createdAt: Date.now()
    };
    
    const updatedPresets = [...presets, newPreset];
    
    chrome.storage.sync.set({ 
      [CONSTANTS.PRESETS_KEY]: updatedPresets 
    }, () => {
      hidePresetModal();
      loadPresets();
      showNotification(t('presetCreated'), 'success');
    });
  });
}

// 프리셋 삭제
function deletePreset(presetId) {
  chrome.storage.sync.get({ [CONSTANTS.PRESETS_KEY]: [] }, (data) => {
    const presets = data[CONSTANTS.PRESETS_KEY] || [];
    const updatedPresets = presets.filter(preset => preset.id !== presetId);
    
    chrome.storage.sync.set({ 
      [CONSTANTS.PRESETS_KEY]: updatedPresets 
    }, () => {
      loadPresets();
      showNotification(t('presetDeleted'), 'success');
    });
  });
}

// 프리셋 로드 및 이동
function loadPresetAndNavigate(preset) {
  // 프리셋의 핀 데이터를 현재 저장소에 저장
  chrome.storage.sync.set({
    [CONSTANTS.STORAGE_KEY]: preset.pins || [],
    [CONSTANTS.NAMES_KEY]: preset.pinNames || {}
  }, () => {
    // 채팅 페이지로 이동
    chrome.tabs.create({ url: preset.chatUrl }, () => {
      showNotification(t('presetLoaded'), 'success');
      // 팝업 닫기
      window.close();
    });
  });
}

// URL 유효성 검사
function isValidChatUrl(url) {
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.hostname === 'chatgpt.com' || urlObj.hostname === 'chat.openai.com') &&
      urlObj.pathname.includes('/c/')
    );
  } catch {
    return false;
  }
}
