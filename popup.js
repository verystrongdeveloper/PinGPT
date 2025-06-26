// PinGPT Chrome Extension - Popup Script
// 책갈피 관리 팝업의 메인 스크립트

// 상수 정의
const CONSTANTS = {
  STORAGE_KEY: 'chatpins',
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

// 메인 초기화
document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
  const pinList = document.getElementById('pin-list');
  const content = document.getElementById('content');
  setInitialHeight();
  loadPins(pinList, content);
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
      <span class="empty-state-icon">💡</span>
      <div class="empty-state-text">아직 책갈피가 없습니다</div>
      <div class="empty-state-subtext">채팅에서 📌 버튼을 클릭하여 시작하세요</div>
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
  const starBtn = createStarButton(id, row);
  
  row.appendChild(pinIcon);
  row.appendChild(label);
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
  const chatNumber = id.split('-')[1] || index + 1;
  label.innerText = `채팅 #${chatNumber}`;
  
  label.onclick = (e) => handlePinClick(e, row, id);
  return label;
}

// 즐겨찾기 버튼 생성
function createStarButton(id, row) {
  const starBtn = document.createElement("button");
  starBtn.className = "star-btn";
  starBtn.innerHTML = "⭐";
  starBtn.title = "최근 책갈피로 설정";
  
  starBtn.onclick = (e) => handleStarClick(e, starBtn, id);
  return starBtn;
}

// 책갈피 클릭 처리
function handlePinClick(e, row, id) {
  e.stopPropagation();
  
  animateClick(row);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'JUMP_TO_PIN', id });
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
      showNotification("✨ 최근 책갈피로 설정!", "success");
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
      showNotification("🗑️ 책갈피 삭제됨", "info");
      
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
              showNotification("📌 책갈피 추가 완료!", "success");
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
  
  const iconMap = {
    success: '✅',
    info: '🗑️',
    default: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="toast-icon">${iconMap[type] || iconMap.default}</div>
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
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 20px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-width: 240px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateX(120%) scale(0.8);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .toast-notification.show {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    
    .toast-notification.fade-out {
      transform: translateX(50px) scale(0.9);
      opacity: 0;
      transition: all 0.3s ease-in;
    }
    
    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .toast-message {
      flex: 1;
      line-height: 1.3;
    }
  `;

  document.head.appendChild(style);
}
