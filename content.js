// PinGPT Chrome Extension - Content Script
// ChatGPT 대화에 책갈피 기능을 추가하는 컨텐츠 스크립트

// 번역 객체
const TRANSLATIONS = {
  en: {
    addBookmark: "Add bookmark",
    removeBookmark: "Remove bookmark",
    bookmarkAdded: "Bookmark added!",
    bookmarkRemoved: "Bookmark removed!",
    jumpToRecent: "Jumped to recent bookmark!",
    noBookmarks: "😅 No bookmarks found",
    quickJumpBtn: "🧭 Jump to recent bookmark"
  },
  ko: {
    addBookmark: "책갈피 추가",
    removeBookmark: "책갈피 제거",
    bookmarkAdded: "책갈피 추가 완료!",
    bookmarkRemoved: "책갈피 제거됨!",
    jumpToRecent: "최근 책갈피로 이동!",
    noBookmarks: "😅 책갈피가 없습니다",
    quickJumpBtn: "🧭 최근 책갈피로 이동"
  },
  ja: {
    addBookmark: "ブックマークを追加",
    removeBookmark: "ブックマークを削除",
    bookmarkAdded: "ブックマーク追加完了！",
    bookmarkRemoved: "ブックマーク削除済み！",
    jumpToRecent: "最近のブックマークに移動！",
    noBookmarks: "😅 ブックマークがありません",
    quickJumpBtn: "🧭 最近のブックマークに移動"
  },
  zh: {
    addBookmark: "添加书签",
    removeBookmark: "移除书签",
    bookmarkAdded: "书签添加成功！",
    bookmarkRemoved: "书签已移除！",
    jumpToRecent: "已跳转到最近书签！",
    noBookmarks: "😅 没有找到书签",
    quickJumpBtn: "🧭 跳转到最近书签"
  },
  es: {
    addBookmark: "Añadir marcador",
    removeBookmark: "Eliminar marcador",
    bookmarkAdded: "¡Marcador añadido!",
    bookmarkRemoved: "¡Marcador eliminado!",
    jumpToRecent: "¡Saltado al marcador reciente!",
    noBookmarks: "😅 No se encontraron marcadores",
    quickJumpBtn: "🧭 Saltar al marcador reciente"
  }
};

// 상수 정의
const CONSTANTS = {
  SELECTORS: {
    MARKDOWN: '.markdown',
    PIN_BTN: '.pingpt-btn',
    NOTIFICATION: '.pingpt-notification',
    QUICK_JUMP: '#pingpt-quickjump'
  },
  STORAGE_KEY: 'chatpins',
  LANGUAGE_KEY: 'chatpinLanguage',
  DEBOUNCE_DELAY: 100,
  NOTIFICATION_DURATION: 2500,
  ANIMATION_DELAY: 10
};

let currentLanguage = 'en';

let observerTimeout;

// ChatGPT 페이지 언어 감지 함수
function detectChatGPTLanguage() {
  // HTML lang 속성 확인
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    const langCode = htmlLang.split('-')[0].toLowerCase();
    const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es'];
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }

  // URL에서 언어 감지 (예: chatgpt.com/ko/, chatgpt.com/ja/ 등)
  const pathLang = window.location.pathname.split('/')[1];
  if (pathLang && ['ko', 'ja', 'zh', 'es'].includes(pathLang)) {
    return pathLang;
  }

  // 브라우저 언어로 폴백
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

// 번역 함수
function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

// 언어 로드 함수
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

// 메인 초기화 함수
function initialize() {
  loadLanguage(() => {
    // 페이지 로드 시 기존 책갈피 모두 삭제
    clearAllBookmarks();
    
    assignUniqueIds();
    injectPinButtons();
    injectQuickJumpButton();
    setupMutationObserver();
    setupMessageListener();
    setupStorageListener();
  });
}

// 모든 책갈피 삭제 함수
function clearAllBookmarks() {
  // 페이지 로드 시마다 항상 책갈피 초기화
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: [] }, () => {
    console.log('PinGPT: 새로고침으로 인한 책갈피 초기화');
  });
  
  // 네임스 키도 초기화
  chrome.storage.sync.set({ 'chatpinNames': {} }, () => {
    console.log('PinGPT: 책갈피 이름 초기화');
  });
}

// 고유 ID 할당
function assignUniqueIds() {
  document.querySelectorAll(CONSTANTS.SELECTORS.MARKDOWN).forEach((el, idx) => {
    if (!el.dataset.pingptId) {
      el.dataset.pingptId = `pingpt-${idx}`;
    }
  });
}

// 책갈피 버튼 생성 및 삽입
function injectPinButtons() {
  document.querySelectorAll(CONSTANTS.SELECTORS.MARKDOWN).forEach((el) => {
    if (el.querySelector(CONSTANTS.SELECTORS.PIN_BTN)) return;

    const btn = createPinButton(el);
    el.prepend(btn);
    updateButtonState(btn, el.dataset.pingptId);
  });
}

// 책갈피 버튼 생성
function createPinButton(element) {
  const btn = document.createElement('button');
  btn.innerText = '📌';
  btn.className = 'pingpt-btn';
  btn.style.cssText = `
    margin-bottom: 6px;
    display: block;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
    font-size: 18px;
    transition: all 0.3s ease;
    filter: hue-rotate(240deg) saturate(1.2);
    transform: scale(1);
  `;
  btn.title = t('addBookmark');

  btn.onclick = () => handlePinClick(btn, element);
  return btn;
}

// 책갈피 클릭 처리
function handlePinClick(btn, element) {
  const id = element.dataset.pingptId;
  
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const pins = data[CONSTANTS.STORAGE_KEY];
    const isPinned = pins.includes(id);
    
    if (isPinned) {
      removePin(btn, id, pins);
    } else {
      addPin(btn, id, pins);
    }
  });
}

// 책갈피 추가
function addPin(btn, id, pins) {
  const updated = [...pins, id];
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
    updateButtonVisual(btn, true);
    showNotification(t('bookmarkAdded'), "success");
    scrollToPin(id);
  });
}

// 책갈피 제거
function removePin(btn, id, pins) {
  const updated = pins.filter(pin => pin !== id);
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
    updateButtonVisual(btn, false);
    showNotification(t('bookmarkRemoved'), "info");
  });
}

// 버튼 상태 업데이트
function updateButtonState(btn, id, isPinned = null) {
  if (isPinned !== null) {
    updateButtonVisual(btn, isPinned);
    return;
  }
  
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const pinned = data[CONSTANTS.STORAGE_KEY].includes(id);
    updateButtonVisual(btn, pinned);
  });
}

// 버튼 시각적 상태 업데이트
function updateButtonVisual(btn, isPinned) {
  if (isPinned) {
    btn.style.filter = 'none';
    btn.title = t('removeBookmark');
    btn.style.transform = 'scale(1.2)';
    btn.dataset.pinned = 'true';
  } else {
    btn.style.filter = 'hue-rotate(240deg) saturate(1.2)';
    btn.title = t('addBookmark');
    btn.style.transform = 'scale(1)';
    btn.dataset.pinned = 'false';
  }
}

// 책갈피로 스크롤
function scrollToPin(id) {
  const el = document.querySelector(`[data-pingpt-id="${id}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 빠른 이동 버튼 생성
function injectQuickJumpButton() {
  if (document.getElementById('pingpt-quickjump')) return;
  
  const btn = document.createElement('button');
  btn.id = 'pingpt-quickjump';
  btn.innerText = t('quickJumpBtn');
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    z-index: 9999;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    color: white;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;
  `;

  btn.onmouseover = () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
  };

  btn.onmouseout = () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
  };

  btn.onclick = handleQuickJump;
  document.body.appendChild(btn);
}

// 빠른 이동 처리
function handleQuickJump() {
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const pins = data[CONSTANTS.STORAGE_KEY];
    const lastPin = pins[pins.length - 1];
    
    if (lastPin) {
      scrollToPin(lastPin);
      showNotification(t('jumpToRecent'), "info");
    } else {
      showNotification(t('noBookmarks'), "info");
    }
  });
}

// 알림 표시
function showNotification(message, type = "info") {
  const existing = document.querySelector(CONSTANTS.SELECTORS.NOTIFICATION);
  if (existing) existing.remove();

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

  const notification = document.createElement('div');
  notification.className = 'pingpt-notification';
  
  notification.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
  `;

  notification.style.cssText = `
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
    z-index: 10000;
    max-width: 240px;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.3s ease;
    letter-spacing: -0.2px;
  `;

  // 아이콘 스타일
  const iconEl = notification.querySelector('.toast-icon');
  if (iconEl) {
    iconEl.style.cssText = `
      font-size: 16px;
      flex-shrink: 0;
    `;
  }

  // 메시지 스타일
  const messageEl = notification.querySelector('.toast-message');
  if (messageEl) {
    messageEl.style.cssText = `
      flex: 1;
      line-height: 1.3;
    `;
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, CONSTANTS.ANIMATION_DELAY);

  setTimeout(() => {
    notification.style.transform = 'translateY(-10px)';
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, CONSTANTS.NOTIFICATION_DURATION);
}

// 메시지 리스너 설정
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'JUMP_TO_PIN') {
      scrollToPin(msg.id);
    }
  });
}

// 스토리지 변경 리스너 설정
function setupStorageListener() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      if (changes[CONSTANTS.STORAGE_KEY]) {
        const newPins = changes[CONSTANTS.STORAGE_KEY].newValue || [];
        updateAllButtonStates(newPins);
      }
      
      // 언어 변경 감지
      if (changes[CONSTANTS.LANGUAGE_KEY]) {
        currentLanguage = changes[CONSTANTS.LANGUAGE_KEY].newValue || detectChatGPTLanguage();
        updateAllUILanguage();
      }
    }
  });
}

// 모든 UI 언어 업데이트
function updateAllUILanguage() {
  // 모든 버튼의 타이틀 업데이트
  document.querySelectorAll(CONSTANTS.SELECTORS.PIN_BTN).forEach(btn => {
    const isPinned = btn.dataset.pinned === 'true';
    btn.title = isPinned ? t('removeBookmark') : t('addBookmark');
  });
  
  // 빠른 이동 버튼 텍스트 업데이트
  const quickJumpBtn = document.getElementById('pingpt-quickjump');
  if (quickJumpBtn) {
    quickJumpBtn.innerText = t('quickJumpBtn');
  }
}

// 모든 버튼 상태 업데이트
function updateAllButtonStates(newPins) {
  document.querySelectorAll(CONSTANTS.SELECTORS.PIN_BTN).forEach(btn => {
    const element = btn.parentElement;
    if (element && element.dataset.pingptId) {
      const id = element.dataset.pingptId;
      const isPinned = newPins.includes(id);
      const currentState = btn.dataset.pinned === 'true';
      
      if (isPinned !== currentState) {
        updateButtonVisual(btn, isPinned);
      }
    }
  });
}

// MutationObserver 설정
function setupMutationObserver() {
  const observer = new MutationObserver(() => {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      assignUniqueIds();
      injectPinButtons();
      injectQuickJumpButton();
    }, CONSTANTS.DEBOUNCE_DELAY);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 초기화 실행
initialize();
