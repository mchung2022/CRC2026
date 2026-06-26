/* js/slides.js - Reveal.js Controller and Navigation Logic */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Reveal.js
  Reveal.initialize({
    controls: true,
    progress: false, // Hide default progress bar to use custom gradient one
    history: true,
    center: false, // Align content to the top/left for clean readability
    transition: 'slide', // Slide transition
    width: 960,
    height: 700,
    margin: 0.1,
    minScale: 0.2,
    maxScale: 1.5
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
  const navList = document.getElementById('nav-list');
  const navPanel = document.getElementById('nav-panel');
  const navToggle = document.getElementById('nav-panel-toggle');

  // Build the Quick Navigation panel dynamically
  const slides = document.querySelectorAll('.reveal .slides > section');
  slides.forEach((slide, idx) => {
    const slideTitleElement = slide.querySelector('h1, h2');
    let titleText = slideTitleElement ? slideTitleElement.textContent.trim() : `Slide ${idx + 1}`;
    
    // Truncate title if too long
    if (titleText.length > 25) {
      titleText = titleText.substring(0, 22) + '...';
    }

    const bloomType = slide.getAttribute('data-bloom') || 'intro';

    const navItem = document.createElement('div');
    navItem.className = `nav-item`;
    navItem.innerHTML = `<span style="font-weight:700; color:var(--accent-cyan); margin-right:5px;">P${idx + 1}</span> ${titleText}`;
    navItem.setAttribute('data-slide-index', idx);
    
    navItem.addEventListener('click', () => {
      Reveal.slide(idx);
      navPanel.classList.remove('open');
    });

    navList.appendChild(navItem);
  });

  // Toggle navigation panel
  navToggle.addEventListener('click', () => {
    navPanel.classList.toggle('open');
  });

  // Close nav panel if clicking outside
  document.addEventListener('click', (e) => {
    if (!navPanel.contains(e.target) && e.target !== navToggle) {
      navPanel.classList.remove('open');
    }
  });

  // Synchronize top Bloom bar, bottom progress, and active slide in nav list
  Reveal.on('slidechanged', event => {
    const currentSlide = event.currentSlide;
    const index = event.indexh;
    const total = Reveal.getTotalSlides();

    // 1. Update Bloom's Taxonomy indicators
    const currentBloom = currentSlide.getAttribute('data-bloom') || 'intro';
    
    // Reset all
    Object.values(bloomSteps).forEach(step => {
      if (step) step.classList.remove('active');
    });

    // Set active
    if (bloomSteps[currentBloom]) {
      bloomSteps[currentBloom].classList.add('active');
    }

    // 2. Update Custom Progress Bar
    const percent = total > 1 ? (index / (total - 1)) * 100 : 0;
    customProgressBar.style.width = `${percent}%`;

    // 3. Highlight current item in navigation panel
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = navItems[index];
    if (activeNavItem) {
      activeNavItem.classList.add('active');
      // Scroll nav panel to active item
      activeNavItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });

  // Set initial state
  setTimeout(() => {
    const initialSlide = Reveal.getCurrentSlide();
    if (initialSlide) {
      const currentBloom = initialSlide.getAttribute('data-bloom') || 'intro';
      if (bloomSteps[currentBloom]) {
        bloomSteps[currentBloom].classList.add('active');
      }
      
      const total = Reveal.getTotalSlides();
      const percent = total > 1 ? (Reveal.getIndices().h / (total - 1)) * 100 : 0;
      customProgressBar.style.width = `${percent}%`;
      
      const initialNav = document.querySelectorAll('.nav-item')[Reveal.getIndices().h];
      if (initialNav) initialNav.classList.add('active');
    }
  }, 200);
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

  const responseText = textarea.value.trim();
  showStatus(statusDiv, '⏳ 資料傳送中...', 'loading');

  const payload = {
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
