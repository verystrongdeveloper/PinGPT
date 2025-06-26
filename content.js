// PinGPT Chrome Extension - Content Script
// ChatGPT 대화에 책갈피 기능을 추가하는 컨텐츠 스크립트

// 상수 정의
const CONSTANTS = {
  SELECTORS: {
    MARKDOWN: '.markdown',
    PIN_BTN: '.pingpt-btn',
    NOTIFICATION: '.pingpt-notification',
    QUICK_JUMP: '#pingpt-quickjump'
  },
  STORAGE_KEY: 'chatpins',
  DEBOUNCE_DELAY: 100,
  NOTIFICATION_DURATION: 2500,
  ANIMATION_DELAY: 10
};

let observerTimeout;

// 메인 초기화 함수
function initialize() {
  // 페이지 로드 시 기존 책갈피 모두 삭제
  clearAllBookmarks();
  
  assignUniqueIds();
  injectPinButtons();
  injectQuickJumpButton();
  setupMutationObserver();
  setupMessageListener();
  setupStorageListener();
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
  btn.title = '책갈피 추가';

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
    showNotification("📌 책갈피 추가 완료!", "success");
    scrollToPin(id);
  });
}

// 책갈피 제거
function removePin(btn, id, pins) {
  const updated = pins.filter(pin => pin !== id);
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
    updateButtonVisual(btn, false);
    showNotification("📌 책갈피 제거됨!", "info");
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
    btn.title = '책갈피 제거';
    btn.style.transform = 'scale(1.2)';
    btn.dataset.pinned = 'true';
  } else {
    btn.style.filter = 'hue-rotate(240deg) saturate(1.2)';
    btn.title = '책갈피 추가';
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
  btn.innerText = '🧭 최근 책갈피로 이동';
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
      showNotification("🎯 최근 책갈피로 이동!", "info");
    } else {
      showNotification("😅 책갈피가 없습니다", "info");
    }
  });
}

// 알림 표시
function showNotification(message, type = "info") {
  const existing = document.querySelector(CONSTANTS.SELECTORS.NOTIFICATION);
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'pingpt-notification';
  notification.textContent = message;

  const backgroundColor = '#ffffff';
  const textColor = type === 'success' ? '#059669' : '#1d4ed8';
  const borderColor = type === 'success' ? '#d1fae5' : '#dbeafe';

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${backgroundColor};
    color: ${textColor};
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10000;
    border: 1px solid ${borderColor};
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.3s ease;
    letter-spacing: -0.2px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, CONSTANTS.ANIMATION_DELAY);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
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
    if (namespace === 'sync' && changes[CONSTANTS.STORAGE_KEY]) {
      const newPins = changes[CONSTANTS.STORAGE_KEY].newValue || [];
      updateAllButtonStates(newPins);
    }
  });
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
