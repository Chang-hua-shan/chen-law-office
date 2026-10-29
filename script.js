/**
 * 陳昭全律師事務所 - 互動腳本
 * Chen Chao-Chuan Law Office - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 自動更新頁尾年份
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. 導航列捲動陰影效果 (Sticky Header Shadow on Scroll)
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. 行動版選單切換 (Mobile Navigation Toggle)
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // 點擊選單連結後自動關閉選單
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // 點擊選單外部自動關閉
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !siteHeader.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 4. 常見問題手風琴展開 / 折疊 (FAQ Accordion)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // 折疊其他已展開項目 (保持單一展開，維持版面俐落簡約)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0px';
          }
        });

        // 切換目前項目
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0px';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });

  // 5. 導航列高亮當前區塊 (ScrollSpy via IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 6. 諮詢預約表單處理與即時反饋 (Consultation Form Handler)
  const consultationForm = document.getElementById('consultationForm');
  const submitBtn = document.getElementById('submitBtn');
  const successToast = document.getElementById('successToast');
  const successToastDetail = document.getElementById('successToastDetail');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const caseType = document.getElementById('caseType').value;
      const preferredTime = document.getElementById('preferredTime').value;

      if (!name || !phone || !caseType) {
        alert('請完整填寫姓名、聯絡電話及諮詢類型。');
        return;
      }

      // 按鈕呈現處理中狀態
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle></svg>
        <span>資料送出中...</span>
      `;

      // 模擬表單提交 (非同步流暢體驗)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // 生成預約參考編號
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refId = `CC-${dateStr}-${randomNum}`;

        if (successToastDetail) {
          successToastDetail.innerHTML = `
            <strong>【預約單號：${refId}】</strong><br>
            您好，${name}！我們已收到您關於「<strong>${caseType}</strong>」的諮詢需求（希望時段：${preferredTime}）。<br>
            事務所助理將盡速以電話（<strong>${phone}</strong>）向您確認確切面談時段與應備書狀資料。
          `;
        }

        if (successToast) {
          successToast.classList.add('show');
          successToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // 重設表單輸入
        consultationForm.reset();
      }, 700);
    });
  }

  // 7. 平滑錨點滾動，適配 Sticky Header 高度
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 8. 專業領域卡片點擊「預約諮詢」自動代入案件類型
  document.querySelectorAll('.service-link[data-case-type]').forEach(link => {
    link.addEventListener('click', () => {
      const caseType = link.getAttribute('data-case-type');
      const caseTypeSelect = document.getElementById('caseType');
      if (caseTypeSelect && caseType) {
        caseTypeSelect.value = caseType;
        caseTypeSelect.style.borderColor = 'var(--gold-500)';
        caseTypeSelect.style.boxShadow = '0 0 0 4px rgba(197, 160, 89, 0.25)';
        setTimeout(() => {
          caseTypeSelect.style.borderColor = '';
          caseTypeSelect.style.boxShadow = '';
        }, 1500);
      }
    });
  });
});
