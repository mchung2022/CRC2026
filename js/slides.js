/* js/slides.js - Embedded Reveal.js and Student Login Controller */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Student Login Modal Controller
  const authModal = document.getElementById('auth-modal');
  const authBackdrop = document.getElementById('auth-backdrop');
  const btnStart = document.getElementById('btn-start-presentation');
  const studentNameInput = document.getElementById('student-name');
  const studentDeptInput = document.getElementById('student-dept');
  const userDisplay = document.getElementById('user-display');

  // Check Session Storage for logged in student
  const savedName = sessionStorage.getItem('crc_student_name');
  const savedDept = sessionStorage.getItem('crc_student_dept');

  if (savedName && savedDept) {
    closeAuthModal(savedName, savedDept);
  } else {
    // Prevent keyboard navigation until logged in
    Reveal.configure({ keyboard: false });
  }

  btnStart.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    const dept = studentDeptInput.value.trim();

    if (!name || !dept) {
      alert('請填寫完整姓名與系級後再開始研習！');
      return;
    }

    sessionStorage.setItem('crc_student_name', name);
    sessionStorage.setItem('crc_student_dept', dept);
    
    // Enable keyboard navigation
    Reveal.configure({ keyboard: true });
    
    closeAuthModal(name, dept);
  });

  function closeAuthModal(name, dept) {
    authModal.classList.add('closed');
    authBackdrop.classList.add('closed');
    if (userDisplay) {
      userDisplay.textContent = `使用者：${name} (${dept})`;
      userDisplay.style.color = "var(--accent-cyan)";
    }
  }

  // 2. Initialize Reveal.js in Embedded Mode
  Reveal.initialize({
    embedded: true,
    controls: true,
    progress: false,
    history: true,
    center: true,
    transition: 'slide',
    width: 760,
    height: 520,
    margin: 0.05,
    minScale: 0.2,
    maxScale: 1.2
  });

  const bloomSteps = {
    'intro': document.getElementById('step-intro'),
    'remember': document.getElementById('step-remember'),
    'understand': document.getElementById('step-understand'),
    'apply': document.getElementById('step-apply'),
    'analyze': document.getElementById('step-analyze'),
    'evaluate': document.getElementById('step-evaluate'),
    'create': document.getElementById('step-create')
  };

  const customProgressBar = document.getElementById('custom-progress');
  const sidebarList = document.getElementById('sidebar-nav-list');

  // Build the Left Sidebar Menu dynamically
  const slides = document.querySelectorAll('.reveal .slides > section');
  slides.forEach((slide, idx) => {
    const slideTitleElement = slide.querySelector('h1, h2');
    let titleText = slideTitleElement ? slideTitleElement.textContent.trim() : `簡報 ${idx + 1}`;
    
    // Clean numbers prefix
    titleText = titleText.replace(/^\d+(\.\d+)?\s+/, '');

    // Truncate menu items
    if (titleText.length > 18) {
      titleText = titleText.substring(0, 16) + '...';
    }

    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    navItem.innerHTML = `<span style="font-weight:700; color:var(--accent-cyan);">P${idx + 1}</span> <span>${titleText}</span>`;
    navItem.setAttribute('data-slide-index', idx);
    
    navItem.addEventListener('click', () => {
      // Allow jumping only if logged in
      if (sessionStorage.getItem('crc_student_name')) {
        Reveal.slide(idx);
      } else {
        alert('請先在畫面上登錄姓名與系級！');
      }
    });

    sidebarList.appendChild(navItem);
  });

  // Sync Reveal.js with elements
  Reveal.on('slidechanged', event => {
    const currentSlide = event.currentSlide;
    const index = event.indexh;
    const total = Reveal.getTotalSlides();

    // Sync Bloom Indicators
    const currentBloom = currentSlide.getAttribute('data-bloom') || 'intro';
    Object.values(bloomSteps).forEach(step => {
      if (step) step.classList.remove('active');
    });
    if (bloomSteps[currentBloom]) {
      bloomSteps[currentBloom].classList.add('active');
    }

    // Sync Custom Progress Bar
    const percent = total > 1 ? (index / (total - 1)) * 100 : 0;
    customProgressBar.style.width = `${percent}%`;

    // Sync Left Sidebar Menu active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = navItems[index];
    if (activeItem) {
      activeItem.classList.add('active');
      activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    // Force resize of comparison slider on slide 13 entry (index 12)
    if (index === 12) {
      initComparisonSlider();
    }
  });

  // Initial Sync on load
  setTimeout(() => {
    const index = Reveal.getIndices().h;
    const initialSlide = Reveal.getCurrentSlide();
    if (initialSlide) {
      const currentBloom = initialSlide.getAttribute('data-bloom') || 'intro';
      if (bloomSteps[currentBloom]) bloomSteps[currentBloom].classList.add('active');
      
      const total = Reveal.getTotalSlides();
      const percent = total > 1 ? (index / (total - 1)) * 100 : 0;
      customProgressBar.style.width = `${percent}%`;
      
      const activeNav = document.querySelectorAll('.nav-item')[index];
      if (activeNav) activeNav.classList.add('active');

      if (index === 12) {
        initComparisonSlider();
      }
    }
  }, 300);

  // Comparison Slider Drag Controller
  let sliderInitialized = false;

  function initComparisonSlider() {
    if (sliderInitialized) {
      adjustSliderWidths();
      return;
    }

    const container = document.querySelector('.slider-container');
    const handle = document.getElementById('slider-handle');
    const beforePanel = document.getElementById('slider-before-panel');
    const leftContent = document.getElementById('slider-content-left');

    if (!container || !handle || !beforePanel || !leftContent) return;

    adjustSliderWidths();
    sliderInitialized = true;

    let isDragging = false;

    // Mouse / Touch Event Helpers
    function move(clientX) {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;

      // Restrict percentage between 3% and 97% to keep handles visible
      percentage = Math.max(3, Math.min(97, percentage));

      handle.style.left = `${percentage}%`;
      beforePanel.style.width = `${percentage}%`;
    }

    // Mouse down / Touch start
    function startDragging(e) {
      isDragging = true;
      e.preventDefault();
    }

    // Drag move
    function drag(e) {
      if (!isDragging) return;
      let clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      move(clientX);
    }

    // End drag
    function stopDragging() {
      isDragging = false;
    }

    // Event Listeners
    handle.addEventListener('mousedown', startDragging);
    handle.addEventListener('touchstart', startDragging, { passive: true });

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: true });

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

    // Auto-adjust on window resize
    window.addEventListener('resize', adjustSliderWidths);
  }

  function adjustSliderWidths() {
    const container = document.querySelector('.slider-container');
    const leftContent = document.getElementById('slider-content-left');
    const stableContent = document.getElementById('slider-content-stable');
    if (container) {
      if (leftContent) leftContent.style.width = `${container.clientWidth}px`;
      if (stableContent) stableContent.style.width = `${container.clientWidth}px`;
    }
  }
});

/**
 * Handle submission of reflections to Google Sheets
 */
async function submitReflection(slideNum, slideTitle, textareaId) {
  const textarea = document.getElementById(textareaId);
  const statusDiv = document.getElementById(`status-p${slideNum}`);
  
  if (!textarea || !textarea.value.trim()) {
    showStatus(statusDiv, '⚠️ 請輸入您的看法後再送出。', 'error');
    return;
  }

  const name = sessionStorage.getItem('crc_student_name') || '未登錄';
  const dept = sessionStorage.getItem('crc_student_dept') || '未登錄';

  const responseText = textarea.value.trim();
  showStatus(statusDiv, '⏳ 資料傳送中...', 'loading');

  const payload = {
    PlayerName: name,
    Department: dept,
    SlideNumber: slideNum,
    SlideTitle: slideTitle,
    ResponseText: responseText
  };

  const result = await ConfigManager.sendData('slides_feedback', payload);

  if (result.success) {
    showStatus(statusDiv, '✅ 成功寫入 Google Sheet 試算表！', 'success');
  } else if (result.reason === 'api_url_not_configured') {
    showStatus(statusDiv, 'ℹ️ 已模擬儲存！(若需寫入Google Sheet，請先設定入口網頁的API網址)', 'success');
  } else {
    showStatus(statusDiv, `❌ 傳送失敗: ${result.error || '網路異常'}`, 'error');
  }
}

function showStatus(element, message, type) {
  if (!element) return;
  element.className = 'status-message';
  
  if (type === 'success') {
    element.classList.add('status-success');
  } else if (type === 'error') {
    element.classList.add('status-error');
  } else if (type === 'loading') {
    element.classList.add('status-loading');
  }
  
  element.textContent = message;
}
window.submitReflection = submitReflection;
