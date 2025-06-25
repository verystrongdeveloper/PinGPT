// ChatPin Chrome Extension - Content Script
// ChatGPT 대화에 북마크 기능을 추가하는 컨텐츠 스크립트

// 상수 정의
const CONSTANTS = {
  SELECTORS: {
    MARKDOWN: '.markdown',
    BOOKMARK_BTN: '.chatpin-btn',
    NOTIFICATION: '.chatpin-notification',
    QUICK_JUMP: '#chatpin-quickjump'
  },
  STORAGE_KEY: 'chatpins',
  DEBOUNCE_DELAY: 100,
  NOTIFICATION_DURATION: 2500,
  ANIMATION_DELAY: 10
};

let observerTimeout;

// 메인 초기화 함수
function initialize() {
  assignUniqueIds();
  injectBookmarkButtons();
  injectQuickJumpButton();
  setupMutationObserver();
  setupMessageListener();
  setupStorageListener();
}

// 고유 ID 할당
function assignUniqueIds() {
  document.querySelectorAll(CONSTANTS.SELECTORS.MARKDOWN).forEach((el, idx) => {
    if (!el.dataset.chatpinId) {
      el.dataset.chatpinId = `chatpin-${idx}`;
    }
  });
}

// 북마크 버튼 생성 및 삽입
function injectBookmarkButtons() {
  document.querySelectorAll(CONSTANTS.SELECTORS.MARKDOWN).forEach((el) => {
    if (el.querySelector(CONSTANTS.SELECTORS.BOOKMARK_BTN)) return;

    const btn = createBookmarkButton(el);
    el.prepend(btn);
    updateButtonState(btn, el.dataset.chatpinId);
  });
}

// 북마크 버튼 생성
function createBookmarkButton(element) {
  const btn = document.createElement('button');
  btn.innerText = '📌';
  btn.className = 'chatpin-btn';
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
  btn.title = '북마크 추가';

  btn.onclick = () => handleBookmarkClick(btn, element);
  return btn;
}

// 북마크 클릭 처리
function handleBookmarkClick(btn, element) {
  const id = element.dataset.chatpinId;
  
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const bookmarks = data[CONSTANTS.STORAGE_KEY];
    const isBookmarked = bookmarks.includes(id);
    
    if (isBookmarked) {
      removeBookmark(btn, id, bookmarks);
    } else {
      addBookmark(btn, id, bookmarks);
    }
  });
}

// 북마크 추가
function addBookmark(btn, id, bookmarks) {
  const updated = [...bookmarks, id];
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
    updateButtonVisual(btn, true);
    showNotification("📌 북마크 추가 완료!", "success");
    scrollToBookmark(id);
  });
}

// 북마크 제거
function removeBookmark(btn, id, bookmarks) {
  const updated = bookmarks.filter(pin => pin !== id);
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY]: updated }, () => {
    updateButtonVisual(btn, false);
    showNotification("📌 북마크 제거됨!", "info");
  });
}

// 버튼 상태 업데이트
function updateButtonState(btn, id, isBookmarked = null) {
  if (isBookmarked !== null) {
    updateButtonVisual(btn, isBookmarked);
    return;
  }
  
  chrome.storage.sync.get({ [CONSTANTS.STORAGE_KEY]: [] }, (data) => {
    const bookmarked = data[CONSTANTS.STORAGE_KEY].includes(id);
    updateButtonVisual(btn, bookmarked);
  });
}

// 버튼 시각적 상태 업데이트
function updateButtonVisual(btn, isBookmarked) {
  if (isBookmarked) {
    btn.style.filter = 'none';
    btn.title = '북마크 제거';
    btn.style.transform = 'scale(1.2)';
    btn.dataset.bookmarked = 'true';
  } else {
    btn.style.filter = 'hue-rotate(240deg) saturate(1.2)';
    btn.title = '북마크 추가';
    btn.style.transform = 'scale(1)';
    btn.dataset.bookmarked = 'false';
  }
}

// 북마크로 스크롤
function scrollToBookmark(id) {
  const el = document.querySelector(`[data-chatpin-id="${id}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 빠른 이동 버튼 생성
function injectQuickJumpButton() {
  if (document.getElementById('chatpin-quickjump')) return;
  
  const btn = document.createElement('button');
  btn.id = 'chatpin-quickjump';
  btn.innerText = '🧭 최근 북마크로 이동';
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
    const bookmarks = data[CONSTANTS.STORAGE_KEY];
    const lastBookmark = bookmarks[bookmarks.length - 1];
    
    if (lastBookmark) {
      scrollToBookmark(lastBookmark);
      showNotification("🎯 최근 북마크로 이동!", "info");
    } else {
      showNotification("😅 북마크가 없습니다", "info");
    }
  });
}

// 알림 표시
function showNotification(message, type = "info") {
  const existing = document.querySelector(CONSTANTS.SELECTORS.NOTIFICATION);
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'chatpin-notification';
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
    if (msg.type === 'JUMP_TO_BOOKMARK') {
      scrollToBookmark(msg.id);
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
  document.querySelectorAll(CONSTANTS.SELECTORS.BOOKMARK_BTN).forEach(btn => {
    const element = btn.parentElement;
    if (element && element.dataset.chatpinId) {
      const id = element.dataset.chatpinId;
      const isBookmarked = newPins.includes(id);
      const currentState = btn.dataset.bookmarked === 'true';
      
      if (isBookmarked !== currentState) {
        updateButtonVisual(btn, isBookmarked);
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
      injectBookmarkButtons();
      injectQuickJumpButton();
    }, CONSTANTS.DEBOUNCE_DELAY);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 초기화 실행
initialize();
