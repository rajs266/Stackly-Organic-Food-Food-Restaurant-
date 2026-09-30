
(function () {
  'use strict';

let isDismissed = false;
  let currentProgress = 0;
  const startTime = Date.now();

const statusMessages = [
    { threshold: 0, text: 'Harvesting fresh goodness...' },
    { threshold: 30, text: 'Selecting 100% organic produce...' },
    { threshold: 65, text: 'Preparing farm to table freshness...' },
    { threshold: 92, text: 'Ready for you!' }
  ];

function cleanDuplicates() {
    const list = document.querySelectorAll('#stackly-preloader, .stackly-preloader');
    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        if (list[i].parentNode) {
          list[i].parentNode.removeChild(list[i]);
        }
      }
    }
  }

function setProgress(val) {
    currentProgress = Math.min(100, Math.max(currentProgress, val));
    const fill = document.getElementById('preloaderProgressFill');
    const percent = document.getElementById('preloaderPercent');
    const status = document.getElementById('preloaderStatusText');

if (fill) fill.style.width = currentProgress + '%';
    if (percent) percent.textContent = Math.round(currentProgress) + '%';

if (status) {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (currentProgress >= statusMessages[i].threshold) {
          if (status.getAttribute('data-text') !== statusMessages[i].text) {
            status.setAttribute('data-text', statusMessages[i].text);
            status.textContent = statusMessages[i].text;
          }
          break;
        }
      }
    }

if (currentProgress >= 100 && !isDismissed) {
      dismissPreloader();
    }
  }

function dismissPreloader() {
    if (isDismissed) return;
    isDismissed = true;
    setProgress(100);

const elements = document.querySelectorAll('#stackly-preloader, .stackly-preloader');
    elements.forEach(function (el) {
      el.classList.add('loaded');
      el.style.pointerEvents = 'none';
    });

if (document.body) document.body.style.overflow = '';
    if (document.documentElement) document.documentElement.style.overflow = '';

setTimeout(function () {
      elements.forEach(function (el) {
        el.style.display = 'none';
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }, 450);
  }

cleanDuplicates();

const ticker = setInterval(function () {
    if (isDismissed) {
      clearInterval(ticker);
      return;
    }
    const elapsed = Date.now() - startTime;
    const ratio = Math.min(1, elapsed / 850);
    const target = ratio * 96 + (Math.random() * 2);
    setProgress(target);

if (elapsed >= 950) {
      clearInterval(ticker);
      dismissPreloader();
    }
  }, 25);

window.addEventListener('load', function () {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(50, 450 - elapsed);
    setTimeout(function () {
      clearInterval(ticker);
      dismissPreloader();
    }, remaining);
  });

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanDuplicates);
  }

setTimeout(function () {
    clearInterval(ticker);
    dismissPreloader();
  }, 1300);

})();


(function () {
  'use strict';

const PATTERNS = {
    name: /^[A-Za-z\s]{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  };


  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');

const wrapper = input.closest('.contact-form-group') ||
                    input.closest('.auth-input-wrapper') || 
                    input.closest('.contact-input-wrap') || 
                    input.closest('.form-group') || 
                    input.closest('.auth-form-group') ||
                    input.closest('.dashboard-form-group') ||
                    input.parentElement;

if (wrapper) {
      const errorEl = wrapper.querySelector('.form-field-error') || 
                      wrapper.parentElement.querySelector(`.form-field-error[data-for="${input.id || input.name}"]`);
      if (errorEl) {
        errorEl.remove();
      }
    }

const customTrigger = input.parentElement ? input.parentElement.querySelector('.custom-select-trigger') : null;
    if (customTrigger) {
      customTrigger.classList.remove('input-error');
    }
  }


  function showFieldError(input, message) {
    if (!input) return;
    clearFieldError(input);

input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');

input.classList.remove('input-shake');

void input.offsetWidth;
    input.classList.add('input-shake');

const customTrigger = input.parentElement ? input.parentElement.querySelector('.custom-select-trigger') : null;
    if (customTrigger) {
      customTrigger.classList.add('input-error');
      customTrigger.classList.remove('input-shake');
      void customTrigger.offsetWidth;
      customTrigger.classList.add('input-shake');
    }

const errorEl = document.createElement('div');
    errorEl.className = 'form-field-error';
    if (input.id || input.name) {
      errorEl.setAttribute('data-for', input.id || input.name);
    }
    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><span>${message}</span>`;

const wrapper = input.closest('.auth-input-wrapper') || 
                    input.closest('.contact-input-wrap') || 
                    input.closest('.input-with-icon') ||
                    input;

if (wrapper && wrapper.parentElement) {

if (wrapper !== input) {
        wrapper.insertAdjacentElement('afterend', errorEl);
      } else {
        input.insertAdjacentElement('afterend', errorEl);
      }
    }
  }


  function validateField(input, form) {
    if (!input) return { valid: true };

const value = input.value !== undefined ? input.value.trim() : '';
    const type = (input.type || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const isRequired = input.hasAttribute('required') || input.required;

if (type === 'checkbox') {
      if (isRequired && !input.checked) {
        return { valid: false, message: 'You must agree to continue.' };
      }
      return { valid: true };
    }

if (isRequired && value === '') {
      if (type === 'select-one' || input.tagName.toLowerCase() === 'select') {
        return { valid: false, message: 'Please select an option.' };
      }
      if (id.includes('confirm') || name.includes('confirm')) {
        return { valid: false, message: 'Please confirm your password.' };
      }
      if (id.includes('password') || name.includes('password')) {
        return { valid: false, message: 'Password cannot be left empty.' };
      }
      if (id.includes('email') || name.includes('email')) {
        return { valid: false, message: 'Email address is required.' };
      }
      if (id.includes('name') || name.includes('name')) {
        return { valid: false, message: 'Name is required.' };
      }
      if (input.tagName.toLowerCase() === 'textarea' || id.includes('message') || name.includes('message')) {
        return { valid: false, message: 'Message cannot be left empty.' };
      }
      return { valid: false, message: 'This field is required.' };
    }

if (!isRequired && value === '') {
      return { valid: true };
    }

if (id.includes('name') || name.includes('name') || input.dataset.validate === 'name') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        return {
          valid: false,
          message: 'Name must only contain alphabets and spaces (no numbers or special characters).'
        };
      }
      if (value.length < 2) {
        return {
          valid: false,
          message: 'Name must be at least 2 characters long.'
        };
      }
      return { valid: true };
    }

if (type === 'email' || id.includes('email') || name.includes('email')) {
      if (!PATTERNS.email.test(value)) {
        return {
          valid: false,
          message: 'Please enter a valid email address (e.g. name@example.com).'
        };
      }
      return { valid: true };
    }

if (type === 'password' && !id.includes('confirm') && !name.includes('confirm')) {
      if (value.length < 6) {
        return {
          valid: false,
          message: 'Password must be at least 6 characters long.'
        };
      }
      return { valid: true };
    }

if (id.includes('confirm') || name.includes('confirm') || input.dataset.validate === 'confirm-password') {
      const passwordInput = form ? (
        form.querySelector('input[type="password"]:not([id*="confirm"]):not([name*="confirm"])') ||
        form.querySelector('#signupPassword') ||
        form.querySelector('#newPassword')
      ) : null;

if (passwordInput && value !== passwordInput.value.trim()) {
        return {
          valid: false,
          message: 'Passwords do not match. Please verify.'
        };
      }
      return { valid: true };
    }

if (input.tagName.toLowerCase() === 'select') {
      if (isRequired && (!value || value === '')) {
        return {
          valid: false,
          message: 'Please select a service type.'
        };
      }
      return { valid: true };
    }

if (input.tagName.toLowerCase() === 'textarea' || id.includes('message') || name.includes('message')) {
      if (value.length < 10) {
        return {
          valid: false,
          message: 'Message must be at least 10 characters long.'
        };
      }
      return { valid: true };
    }

return { valid: true };
  }


  function setupFormValidation(form, options = {}) {
    if (!form) return;

form.setAttribute('novalidate', 'true');

const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');

inputs.forEach(input => {
      const eventType = (input.type === 'checkbox' || input.type === 'radio' || input.tagName.toLowerCase() === 'select') ? 'change' : 'input';

input.addEventListener(eventType, () => {
        if (input.classList.contains('input-error')) {
          const res = validateField(input, form);
          if (res.valid) {
            clearFieldError(input);
          } else {
            showFieldError(input, res.message);
          }
        }
      });

input.addEventListener('blur', () => {
        if (input.value && input.value.trim().length > 0) {
          const res = validateField(input, form);
          if (!res.valid) {
            showFieldError(input, res.message);
          } else {
            clearFieldError(input);
          }
        }
      });
    });

form.addEventListener('submit', (e) => {
      let isFormValid = true;
      let firstInvalidInput = null;

inputs.forEach(input => {
        const res = validateField(input, form);
        if (!res.valid) {
          showFieldError(input, res.message);
          isFormValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = input;
          }
        } else {
          clearFieldError(input);
        }
      });

if (!isFormValid) {
        e.preventDefault();
        e.stopPropagation();

if (firstInvalidInput) {
          firstInvalidInput.focus();
          const rect = firstInvalidInput.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return false;
      }

if (options.onValidSubmit) {
        e.preventDefault();
        options.onValidSubmit(form, e);
      }
    });
  }

window.OrganicValidation = {
    validateField,
    showFieldError,
    clearFieldError,
    setupFormValidation,
    PATTERNS
  };

})();

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

if (window.__STACKLY_APP_INITIALIZED__) return;
  window.__STACKLY_APP_INITIALIZED__ = true;

const navbar = document.getElementById('navbar') || document.getElementById('mainNavbar') || document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

function handleNavbarScroll() {
    const scrollPos = window.scrollY;

if (navbar) {
      if (scrollPos > 15) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    }

if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }

handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

function openMobileDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    checkAndHideOverlay();
  }

function checkAndHideOverlay() {
    const isCartOpen = cartDrawer && cartDrawer.classList.contains('active');
    const isMobileOpen = mobileDrawer && mobileDrawer.classList.contains('active');
    const isWishlistOpen = document.getElementById('wishlistDrawer')?.classList.contains('active');
    if (!isCartOpen && !isMobileOpen && !isWishlistOpen) {
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      closeMobileDrawer();
      closeCartDrawer();
      if (typeof closeWishlistDrawer === 'function') closeWishlistDrawer();
    });
  }

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      }
      const isCartOpen = cartDrawer && cartDrawer.classList.contains('active');
      const isWishlistOpen = document.getElementById('wishlistDrawer')?.classList.contains('active');
      if (!isCartOpen && !isWishlistOpen) {
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

const cartToggleBtn = document.getElementById('cartToggleBtn');
  const footerCartLink = document.getElementById('footerCartLink');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalAmount = document.getElementById('cartSubtotalAmount');
  const cartBadgeCounts = document.querySelectorAll('.cart-count, #cartDrawerCount');
  const shippingNoticeText = document.getElementById('shippingNoticeText');
  const shippingProgressFill = document.querySelector('.shipping-progress-fill');
  const checkoutBtn = document.getElementById('checkoutBtn');

function openCartDrawer() {
    cartDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

function closeCartDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    checkAndHideOverlay();
  }

if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (footerCartLink) {
    footerCartLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

function updateCartTotals(animateBadge = false) {
    if (!cartItemsList) return;
    const items = cartItemsList.querySelectorAll('.cart-item');
    let subtotal = 0;
    let totalQty = 0;

items.forEach(item => {
      const price = parseFloat(item.dataset.price) || 0;
      const qty = parseInt(item.querySelector('.qty-val').textContent) || 1;
      subtotal += price * qty;
      totalQty += qty;
    });

cartBadgeCounts.forEach(el => {
      el.textContent = totalQty;
      if (animateBadge && el.classList.contains('cart-count')) {
        el.classList.remove('badge-bounce');
        void el.offsetWidth; 
        el.classList.add('badge-bounce');
      }
    });

cartSubtotalAmount.textContent = `$${subtotal.toFixed(2)}`;

const freeShippingThreshold = 50.00;
    if (subtotal >= freeShippingThreshold) {
      shippingNoticeText.innerHTML = `<strong>Congratulations!</strong> You unlocked <strong>FREE Shipping!</strong>`;
      if (shippingProgressFill) shippingProgressFill.style.width = '100%';
    } else {
      const diff = (freeShippingThreshold - subtotal).toFixed(2);
      const percentage = Math.min(100, Math.max(5, (subtotal / freeShippingThreshold) * 100));
      shippingNoticeText.innerHTML = `You are <strong>$${diff}</strong> away from <strong>FREE Shipping!</strong>`;
      if (shippingProgressFill) shippingProgressFill.style.width = `${percentage}%`;
    }

if (items.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--color-text-muted);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--color-border); margin-bottom: 12px; display: block;"></i>
          <p style="font-weight: 600; font-size: 1.1rem; color: var(--color-dark);">Your cart is currently empty</p>
          <p style="font-size: 0.9rem; margin-top: 4px;">Discover our fresh farm-picked organic foods!</p>
        </div>
      `;
    }
  }

if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      if (!item) return;

const qtyVal = item.querySelector('.qty-val');

if (e.target.closest('.qty-plus')) {
        let count = parseInt(qtyVal.textContent) || 1;
        count++;
        qtyVal.textContent = count;
        updateCartTotals();
      }

if (e.target.closest('.qty-minus')) {
        let count = parseInt(qtyVal.textContent) || 1;
        if (count > 1) {
          count--;
          qtyVal.textContent = count;
          updateCartTotals();
        } else {
          item.remove();
          updateCartTotals();
          showToast('Item removed from cart');
        }
      }

if (e.target.closest('.cart-item-remove')) {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateX(50px)';
        setTimeout(() => {
          item.remove();
          updateCartTotals();
          showToast('Item removed from cart');
        }, 300);
      }
    });
  }

function addToCart(title, price, img, quantity = 1) {
    if (!cartItemsList) return;
    const existingItems = cartItemsList.querySelectorAll('.cart-item');
    let found = false;

existingItems.forEach(item => {
      const itemTitle = item.querySelector('.cart-item-title').textContent.trim();
      if (itemTitle === title.trim()) {
        const qtyVal = item.querySelector('.qty-val');
        const currentQty = parseInt(qtyVal.textContent) || 1;
        qtyVal.textContent = currentQty + quantity;
        found = true;
      }
    });

if (!found) {

const emptyMsg = cartItemsList.querySelector('div[style*="text-align: center"]');
      if (emptyMsg) emptyMsg.remove();

const newItem = document.createElement('div');
      newItem.className = 'cart-item';
      newItem.dataset.price = price;
      newItem.innerHTML = `
        <img src="${img}" alt="${title}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${title}</h4>
          <span class="cart-item-price">$${parseFloat(price).toFixed(2)}</span>
          <div class="cart-qty-ctrl">
            <button class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${quantity}</span>
            <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>
      `;
      cartItemsList.appendChild(newItem);
    }

updateCartTotals(true);
    showToast(`Added to cart: ${title}`);
  }

document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.title;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      addToCart(title, price, img, 1);
    });
  });

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

if (cartItemsList) updateCartTotals();

const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');

function openSearchModal() {
    searchModal.classList.add('active');
    setTimeout(() => { if (searchInput) searchInput.focus(); }, 150);
  }

function closeSearchModal() {
    searchModal.classList.remove('active');
  }

if (searchToggleBtn) searchToggleBtn.addEventListener('click', openSearchModal);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent;
        showToast(`Searching for "${tag.textContent}"`);
        setTimeout(closeSearchModal, 600);
      }
    });
  });

const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('#heroDots .carousel-dot');
  let currentHeroSlide = 0;
  let heroAutoPlayTimer = null;

function switchHeroSlide(targetIndex) {
    if (targetIndex === currentHeroSlide) return;

heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === targetIndex);
    });

heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });

currentHeroSlide = targetIndex;
  }

heroDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      switchHeroSlide(idx);
      restartHeroAutoPlay();
    });
  });

function startHeroAutoPlay() {
    heroAutoPlayTimer = setInterval(() => {
      const nextIndex = (currentHeroSlide + 1) % heroSlides.length;
      switchHeroSlide(nextIndex);
    }, 3800); 
  }

function restartHeroAutoPlay() {
    clearInterval(heroAutoPlayTimer);
    startHeroAutoPlay();
  }

startHeroAutoPlay();

const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(heroAutoPlayTimer));
    heroSection.addEventListener('mouseleave', () => startHeroAutoPlay());
  }

const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    const galleryGroups = galleryTrack.querySelectorAll('.marquee-group');
    galleryTrack.addEventListener('mouseenter', () => {
      galleryGroups.forEach(g => g.style.animationPlayState = 'paused');
    });
    galleryTrack.addEventListener('mouseleave', () => {
      galleryGroups.forEach(g => g.style.animationPlayState = 'running');
    });
    galleryTrack.addEventListener('touchstart', () => {
      galleryGroups.forEach(g => g.style.animationPlayState = 'paused');
    }, { passive: true });
    galleryTrack.addEventListener('touchend', () => {
      galleryGroups.forEach(g => g.style.animationPlayState = 'running');
    }, { passive: true });
  }

const filterTabs = document.querySelectorAll('#productFilterTabs .filter-tab');
  const productCards = Array.from(document.querySelectorAll('#mainProductsGrid .product-card'));
  const productDotsWrap = document.getElementById('productDots');
  const productDots = document.querySelectorAll('#productDots .carousel-dot');

let currentProductFilter = 'all';
  let currentProductPage = 0;
  const productsPerPage = 8;

function renderHomeProducts() {
    if (currentProductFilter === 'all') {

if (productDotsWrap) productDotsWrap.style.display = 'flex';

const startIndex = currentProductPage * productsPerPage;
      const endIndex = startIndex + productsPerPage;

productCards.forEach((card, idx) => {
        if (idx >= startIndex && idx < endIndex) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          card.style.display = 'none';
        }
      });

productDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentProductPage);
      });

} else {

if (productDotsWrap) productDotsWrap.style.display = 'none';

productCards.forEach(card => {
        const category = card.dataset.category;
        if (category === currentProductFilter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          card.style.display = 'none';
        }
      });
    }
  }

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

currentProductFilter = tab.dataset.filter;
      currentProductPage = 0; 
      renderHomeProducts();
    });
  });

productDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentProductPage = idx;
      renderHomeProducts();
      const grid = document.getElementById('mainProductsGrid');
      if (grid) {
        window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
      }
    });
  });

if (productCards.length > 0) {
    renderHomeProducts();
  }

const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minsEl = document.getElementById('timerMins');
  const secsEl = document.getElementById('timerSecs');

const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14);
  targetDate.setHours(targetDate.getHours() + 8);

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

if (daysEl || hoursEl || minsEl || secsEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

const testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack) {
    const testimonialGroups = testimonialTrack.querySelectorAll('.marquee-group');
    testimonialTrack.addEventListener('mouseenter', () => {
      testimonialGroups.forEach(g => g.style.animationPlayState = 'paused');
    });
    testimonialTrack.addEventListener('mouseleave', () => {
      testimonialGroups.forEach(g => g.style.animationPlayState = 'running');
    });
    testimonialTrack.addEventListener('touchstart', () => {
      testimonialGroups.forEach(g => g.style.animationPlayState = 'paused');
    }, { passive: true });
    testimonialTrack.addEventListener('touchend', () => {
      testimonialGroups.forEach(g => g.style.animationPlayState = 'running');
    }, { passive: true });
  }

const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoModal = document.getElementById('videoModal');
  const videoCloseBtn = document.getElementById('videoCloseBtn');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  const storyVideoPlayer = document.getElementById('storyVideoPlayer');

function openVideoModal() {
    if (videoModal) videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (storyVideoPlayer) {
      storyVideoPlayer.muted = true;
      storyVideoPlayer.volume = 0;
      storyVideoPlayer.currentTime = 0;
      storyVideoPlayer.play().catch(e => console.log('Autoplay handled:', e));
    }
  }

function closeVideoModal() {
    if (videoModal) videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (storyVideoPlayer) {
      storyVideoPlayer.pause();
      storyVideoPlayer.currentTime = 0;
    }
  }

if (videoPlayBtn) videoPlayBtn.addEventListener('click', openVideoModal);
  if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

const quickViewModal = document.getElementById('quickViewModal');
  const quickViewBackdrop = document.getElementById('quickViewBackdrop');
  const quickViewCloseBtn = document.getElementById('quickViewCloseBtn');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const modalProductOldPrice = document.getElementById('modalProductOldPrice');
  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  const modalQtyVal = document.getElementById('modalQtyVal');
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

let currentModalData = null;

function openQuickView(data) {
    if (!data) return;
    currentModalData = data;
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

const imgEl = modal.querySelector('#modalProductImg, .modal-img');
    const titleEl = modal.querySelector('#modalProductTitle, .modal-title');
    const priceEl = modal.querySelector('#modalProductPrice, .modal-price');
    const oldPriceEl = modal.querySelector('#modalProductOldPrice, .modal-price-old, .modal-old-price');
    const qtyValEl = modal.querySelector('#modalQtyVal, .qty-val, .qty-value');

if (imgEl && data.img) imgEl.src = data.img;
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (priceEl && !isNaN(data.price)) priceEl.textContent = String.fromCharCode(36) + data.price.toFixed(2);
    if (oldPriceEl && !isNaN(data.old)) oldPriceEl.textContent = String.fromCharCode(36) + data.old.toFixed(2);
    if (qtyValEl) qtyValEl.textContent = '1';

modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-view-btn');
    if (!btn) return;
    e.preventDefault();

const card = btn.closest('.product-card');
    const title = btn.dataset.title || card?.querySelector('.product-title a, .product-title')?.textContent.trim() || 'Organic Food';
    const priceText = card?.querySelector('.price-current, .product-price')?.textContent || '15';
    const price = parseFloat(btn.dataset.price) || parseFloat(priceText.replace(/[^0-9.]/g, '')) || 15.00;
    const oldPriceText = card?.querySelector('.price-old')?.textContent || '';
    const oldPrice = parseFloat(btn.dataset.old) || (oldPriceText ? parseFloat(oldPriceText.replace(/[^0-9.]/g, '')) : (price * 1.25));
    const img = btn.dataset.img || card?.querySelector('.product-img, img')?.src || './assets/4a40f7dfa68f5920d1fa7aba2bda0f7885d94b2f.webp';

openQuickView({ title, price, old: oldPrice, img });
  });

document.addEventListener('click', (e) => {
    if (e.target.closest('#quickViewCloseBtn, .modal-close-btn, #quickViewBackdrop, .product-modal-backdrop, .quick-view-backdrop')) {
      closeQuickView();
    }
  });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
    }
  });

document.addEventListener('click', (e) => {
    if (e.target.closest('#modalQtyMinus, .modal-qty-ctrl #modalQtyMinus')) {
      const qVal = document.querySelector('#modalQtyVal, .qty-val, .qty-value');
      if (qVal) {
        let qty = parseInt(qVal.textContent) || 1;
        if (qty > 1) qVal.textContent = --qty;
      }
    }
    if (e.target.closest('#modalQtyPlus, .modal-qty-ctrl #modalQtyPlus')) {
      const qVal = document.querySelector('#modalQtyVal, .qty-val, .qty-value');
      if (qVal) {
        let qty = parseInt(qVal.textContent) || 1;
        qVal.textContent = ++qty;
      }
    }
    if (e.target.closest('#modalAddToCartBtn, .modal-add-btn')) {
      if (currentModalData) {
        const qVal = document.querySelector('#modalQtyVal, .qty-val, .qty-value');
        const qty = parseInt(qVal?.textContent) || 1;
        if (typeof addToCart === 'function') {
          addToCart(currentModalData.title, currentModalData.price, currentModalData.img, qty);
        }
        closeQuickView();
      }
    }
  });

const wishlistDrawer = document.getElementById('wishlistDrawer');
  const wishlistCloseBtn = document.getElementById('wishlistCloseBtn');
  const closeWishlistBtn = document.getElementById('closeWishlistBtn');
  const addAllWishlistToCartBtn = document.getElementById('addAllWishlistToCartBtn');
  const wishlistItemsList = document.getElementById('wishlistItemsList');
  const wishlistDrawerCount = document.getElementById('wishlistDrawerCount');
  const wishlistToggleBtn = document.getElementById('wishlistToggleBtn');
  const wishlistCountBadges = document.querySelectorAll('.wishlist-count');

let likedProducts = [];

function updateWishlistBadges() {
    const count = likedProducts.length;
    wishlistCountBadges.forEach(badge => {
      badge.textContent = count;
    });
    if (wishlistDrawerCount) wishlistDrawerCount.textContent = count;
  }

function openWishlistDrawer() {
    closeCartDrawer();
    closeMobileDrawer();
    renderWishlistDrawer();
    if (wishlistDrawer) wishlistDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

function closeWishlistDrawer() {
    if (wishlistDrawer) wishlistDrawer.classList.remove('active');
    checkAndHideOverlay();
  }

if (wishlistToggleBtn) {
    wishlistToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishlistDrawer();
    });
  }

['footerWishlistLink', 'footerCareWishlistLink'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openWishlistDrawer();
      });
    }
  });

if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
  if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlistDrawer);

function renderWishlistDrawer() {
    if (!wishlistItemsList) return;

if (likedProducts.length === 0) {
      wishlistItemsList.innerHTML = `
        <div class="wishlist-empty-state" style="text-align: center; padding: 50px 15px; color: var(--color-text-muted);">
          <i class="fa-regular fa-heart" style="font-size: 3.2rem; color: var(--color-border); margin-bottom: 14px; display: block;"></i>
          <p style="font-weight: 700; font-size: 1.15rem; color: var(--color-dark); margin-bottom: 6px;">Your Wishlist is Empty</p>
          <p style="font-size: 0.92rem;">Explore products and tap the heart icon on any card to save favorites here!</p>
        </div>
      `;
      return;
    }

wishlistItemsList.innerHTML = '';
    likedProducts.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'cart-item wishlist-item';
      el.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</span>
          <div>
            <button class="btn btn-primary wishlist-add-cart-btn" data-index="${index}" style="margin-top: 6px; padding: 4px 12px; font-size: 0.8rem; border-radius: 20px;">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
        <button class="cart-item-remove wishlist-remove-btn" data-index="${index}" aria-label="Remove item">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      `;
      wishlistItemsList.appendChild(el);
    });
  }

if (wishlistItemsList) {
    wishlistItemsList.addEventListener('click', (e) => {

const removeBtn = e.target.closest('.wishlist-remove-btn');
      if (removeBtn) {
        const idx = parseInt(removeBtn.dataset.index);
        const removed = likedProducts.splice(idx, 1)[0];
        updateWishlistBadges();
        renderWishlistDrawer();
        syncCardHearts(removed.title, false);
        showToast(`Removed from Wishlist: ${removed.title}`);
        return;
      }

const addCartBtn = e.target.closest('.wishlist-add-cart-btn');
      if (addCartBtn) {
        const idx = parseInt(addCartBtn.dataset.index);
        const item = likedProducts[idx];
        if (item) {
          addToCart(item.title, item.price, item.img, 1);
        }
      }
    });
  }

if (addAllWishlistToCartBtn) {
    addAllWishlistToCartBtn.addEventListener('click', () => {
      if (likedProducts.length === 0) {
        showToast('Your wishlist is empty!', 'info');
        return;
      }
      likedProducts.forEach(item => {
        addToCart(item.title, item.price, item.img, 1);
      });
      showToast(`Added ${likedProducts.length} item(s) to Cart!`, 'success');
      closeWishlistDrawer();
      openCartDrawer();
    });
  }

function syncCardHearts(title, isActive) {
    document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      const card = btn.closest('.product-card');
      const cardTitle = btn.dataset.title || card?.querySelector('.product-title a')?.textContent.trim();
      if (cardTitle && cardTitle.toLowerCase() === title.toLowerCase()) {
        btn.classList.toggle('active', isActive);
        const icon = btn.querySelector('i');
        if (icon) {
          if (isActive) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
          } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
          }
        }
      }
    });
  }

document.addEventListener('click', (e) => {
    const heartBtn = e.target.closest('.card-wishlist-btn');
    if (!heartBtn) return;

e.preventDefault();
    e.stopPropagation();

const card = heartBtn.closest('.product-card');
    const title = heartBtn.dataset.title || card?.querySelector('.product-title a')?.textContent.trim() || 'Organic Food';
    const price = parseFloat(heartBtn.dataset.price) || parseFloat(card?.querySelector('.price-current')?.textContent.replace(/[^0-9.]/g, '')) || 15.00;
    const img = heartBtn.dataset.img || card?.querySelector('.product-img')?.src || './assets/4a40f7dfa68f5920d1fa7aba2bda0f7885d94b2f.webp';

const existingIdx = likedProducts.findIndex(p => p.title.trim().toLowerCase() === title.trim().toLowerCase());

if (existingIdx > -1) {

likedProducts.splice(existingIdx, 1);
      heartBtn.classList.remove('active');
      const icon = heartBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
      showToast(`Removed from Wishlist: ${title}`);
    } else {

likedProducts.push({ title, price, img });
      heartBtn.classList.add('active');
      const icon = heartBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      }
      showToast(`Added to Wishlist: ${title}`);
    }

updateWishlistBadges();
  });

updateWishlistBadges();

const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : '';
      if (email) {
        window.location.href = '404.html';
      }
    });
  }

const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'info') {
    if (!toastContainer) return;

const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-bell';
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

setTimeout(() => { toast.classList.add('show'); }, 20);

setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.remove(); }, 400);
    }, 3500);
  }

const animatedElements = document.querySelectorAll('[data-aos]');

if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;

setTimeout(() => {
            el.classList.add('aos-animate');
          }, delay);

observer.unobserve(el);
        }
      });
    }, observerOptions);

animatedElements.forEach(el => {
      scrollObserver.observe(el);
    });
  } else {

animatedElements.forEach(el => el.classList.add('aos-animate'));
  }

const faqItems = document.querySelectorAll('#faqAccordion .accordion-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          const isCurrentlyActive = item.classList.contains('active');

faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const h = otherItem.querySelector('.accordion-header');
            const icon = otherItem.querySelector('.accordion-icon i');
            if (h) h.setAttribute('aria-expanded', 'false');
            if (icon) {
              icon.classList.remove('fa-minus');
              icon.classList.add('fa-plus');
            }
          });

if (!isCurrentlyActive) {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            const icon = item.querySelector('.accordion-icon i');
            if (icon) {
              icon.classList.remove('fa-plus');
              icon.classList.add('fa-minus');
            }
          }
        });
      }
    });
  }

const faqVideoPlayTrigger = document.getElementById('faqVideoPlayTrigger');
  if (faqVideoPlayTrigger) {
    faqVideoPlayTrigger.addEventListener('click', () => {
      openVideoModal();
    });
  }

const aboutNewsletterForm = document.getElementById('aboutNewsletterForm');
  if (aboutNewsletterForm) {
    aboutNewsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = aboutNewsletterForm.querySelector('input[type="email"]');
      const val = emailInput ? emailInput.value.trim() : '';
      if (val) {
        window.location.href = '404.html';
      }
    });
  }

const shopProductsGrid = document.getElementById('shopProductsGrid');

if (shopProductsGrid) {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const shopSortSelect = document.getElementById('shopSortSelect');
    const shopResultsCount = document.getElementById('shopResultsCount');
    const categoryLinks = document.querySelectorAll('#sidebarCategoryList .category-item-link');
    const priceRangeInput = document.getElementById('priceRangeInput');
    const priceRangeValue = document.getElementById('priceRangeValue');
    const priceFilterApplyBtn = document.getElementById('priceFilterApplyBtn');
    const sidebarSearchForm = document.getElementById('sidebarSearchForm');
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');
    const tagPills = document.querySelectorAll('.popular-tags-wrap .tag-pill');
    const paginationContainer = document.getElementById('shopPagination');

const allShopCards = Array.from(shopProductsGrid.querySelectorAll('.product-card'));
    let activeCategory = 'all';
    let activeTag = 'all';
    let searchQuery = '';
    let maxPriceFilter = 180;

const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const shopSidebar = document.getElementById('shopSidebar');
    const sidebarDrawerClose = document.getElementById('sidebarDrawerClose');
    const shopFilterBackdrop = document.getElementById('shopFilterBackdrop');

function openFilterDrawer() {
      if (shopSidebar) {
        shopSidebar.scrollTop = 0;
        shopSidebar.classList.add('active');
      }
      if (shopFilterBackdrop) shopFilterBackdrop.classList.add('active');
      document.documentElement.classList.add('filter-drawer-open');
      document.body.classList.add('filter-drawer-open');
      document.body.style.overflow = 'hidden';
    }

function closeFilterDrawer() {
      if (shopSidebar) shopSidebar.classList.remove('active');
      if (shopFilterBackdrop) shopFilterBackdrop.classList.remove('active');
      document.documentElement.classList.remove('filter-drawer-open');
      document.body.classList.remove('filter-drawer-open');
      document.body.style.overflow = '';
    }

window.closeFilterDrawer = closeFilterDrawer;

if (mobileFilterBtn) {
      mobileFilterBtn.addEventListener('click', openFilterDrawer);
    }
    if (sidebarDrawerClose) {
      sidebarDrawerClose.addEventListener('click', closeFilterDrawer);
    }
    if (shopFilterBackdrop) {
      shopFilterBackdrop.addEventListener('click', closeFilterDrawer);
    }

window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        closeFilterDrawer();
      }
    });

document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && shopSidebar && shopSidebar.classList.contains('active')) {
        closeFilterDrawer();
      }
    });

if (gridViewBtn && listViewBtn) {
      gridViewBtn.addEventListener('click', () => {
        shopProductsGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
      });

listViewBtn.addEventListener('click', () => {
        shopProductsGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
      });
    }

function updateShopDisplay() {
      let filteredCards = allShopCards.filter(card => {
        const cat = card.dataset.category || '';
        const price = parseFloat(card.dataset.price) || 0;
        const titleEl = card.querySelector('.product-title a');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';

const matchCategory = (activeCategory === 'all') || (cat === activeCategory);

const matchTag = (activeTag === 'all') || (cat === activeTag) || title.includes(activeTag.toLowerCase());

const matchPrice = price <= maxPriceFilter;

const matchSearch = (!searchQuery) || title.includes(searchQuery.toLowerCase());

return matchCategory && matchTag && matchPrice && matchSearch;
      });

if (shopSortSelect) {
        const sortVal = shopSortSelect.value;
        if (sortVal === 'price-asc') {
          filteredCards.sort((a, b) => parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0));
        } else if (sortVal === 'price-desc') {
          filteredCards.sort((a, b) => parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0));
        } else if (sortVal === 'rating') {
          filteredCards.sort((a, b) => parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0));
        }
      }

const totalMatching = filteredCards.length;

allShopCards.forEach(card => {
        card.style.display = 'none';
      });

if (totalMatching === 0) {

let noProductsMsg = document.getElementById('shopNoProductsMsg');
        if (!noProductsMsg) {
          noProductsMsg = document.createElement('div');
          noProductsMsg.id = 'shopNoProductsMsg';
          noProductsMsg.style.gridColumn = '1 / -1';
          noProductsMsg.style.textAlign = 'center';
          noProductsMsg.style.padding = '50px 20px';
          noProductsMsg.innerHTML = `
            <i class="fa-solid fa-seedling" style="font-size: 3rem; color: var(--color-border); margin-bottom: 12px; display: block;"></i>
            <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No products match your selection</h3>
            <p style="color: var(--color-text-muted);">Try adjusting your category, price range, or search keyword.</p>
          `;
          shopProductsGrid.appendChild(noProductsMsg);
        }
        noProductsMsg.style.display = 'block';
        if (shopResultsCount) shopResultsCount.innerHTML = `Showing <strong>0</strong> results`;
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
      } else {
        const noProductsMsg = document.getElementById('shopNoProductsMsg');
        if (noProductsMsg) noProductsMsg.style.display = 'none';
      }

filteredCards.forEach(card => {
        card.style.display = 'flex';
        shopProductsGrid.appendChild(card);
      });

if (shopResultsCount) {
        shopResultsCount.innerHTML = `Showing <strong>1–${totalMatching}</strong> of <strong>${totalMatching}</strong> results`;
      }
      if (paginationContainer) {
        paginationContainer.style.display = 'flex';
      }
    }

categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        activeCategory = link.dataset.cat || 'all';
        updateShopDisplay();
        if (window.innerWidth <= 992) {
          closeFilterDrawer();
        }
      });
    });

if (priceRangeInput && priceRangeValue) {
      priceRangeInput.addEventListener('input', () => {
        priceRangeValue.textContent = `$10 - $${priceRangeInput.value}`;
      });
    }

if (priceFilterApplyBtn) {
      priceFilterApplyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (priceRangeInput) {
          maxPriceFilter = parseFloat(priceRangeInput.value) || 180;
        }
        updateShopDisplay();
        if (window.innerWidth <= 992) {
          closeFilterDrawer();
        }
      });
    }

if (sidebarSearchForm && sidebarSearchInput) {
      sidebarSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchQuery = sidebarSearchInput.value.trim();
        updateShopDisplay();
        if (window.innerWidth <= 992) {
          closeFilterDrawer();
        }
      });

sidebarSearchInput.addEventListener('input', () => {
        searchQuery = sidebarSearchInput.value.trim();
        updateShopDisplay();
      });
    }

tagPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        tagPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTag = pill.dataset.tag || 'all';
        updateShopDisplay();
        if (window.innerWidth <= 992) {
          closeFilterDrawer();
        }
      });
    });

if (shopSortSelect) {
      shopSortSelect.addEventListener('change', () => {
        updateShopDisplay();
      });
    }

if (paginationContainer) {
      const pageBtns = paginationContainer.querySelectorAll('.page-btn');
      pageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const href = btn.getAttribute('href');
          const page = btn.dataset.page;
          if (page === '1' || (href && href.includes('shop.html') && !btn.classList.contains('page-nav-btn'))) {
            e.preventDefault();
            window.scrollTo({ top: shopProductsGrid.offsetTop - 120, behavior: 'smooth' });
          } else if (href === '404.html' || (page && parseInt(page) > 1) || (btn.classList.contains('page-nav-btn') && href === '404.html')) {
            e.preventDefault();
            window.location.href = '404.html';
          }
        });
      });
    }

updateShopDisplay();
  }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeWishlistDrawer();
      closeMobileDrawer();
      closeSearchModal();
      closeQuickView();
      closeVideoModal();
      if (typeof window.closeFilterDrawer === 'function') window.closeFilterDrawer();
      if (typeof closeGalleryLightbox === 'function') closeGalleryLightbox();
    }
  });

const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');
  const galleryLightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxModalImg = document.getElementById('lightboxModalImg');
  const lightboxModalTitle = document.getElementById('lightboxModalTitle');
  const lightboxModalTag = document.getElementById('lightboxModalTag');

if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

const filter = (btn.dataset.filter || 'all').toLowerCase();

galleryItems.forEach(item => {
          const itemCat = (item.dataset.category || '').toLowerCase();
          if (filter === 'all' || itemCat === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

function openGalleryLightbox(src, title, tag) {
    if (!galleryLightboxModal) return;
    if (lightboxModalImg) lightboxModalImg.src = src;
    if (lightboxModalTitle) lightboxModalTitle.textContent = title || '';
    if (lightboxModalTag) lightboxModalTag.textContent = tag || '';

galleryLightboxModal.classList.add('active');
    galleryLightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

function closeGalleryLightbox() {
    if (!galleryLightboxModal) return;
    galleryLightboxModal.classList.remove('active');
    galleryLightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

if (galleryLightboxModal) {

document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.gallery-zoom-trigger');
      const wrap = e.target.closest('.gallery-item-img-wrap');
      if (trigger || (wrap && !e.target.closest('a'))) {
        const itemWrap = trigger ? trigger.closest('.gallery-item-img-wrap') : wrap;
        if (itemWrap) {
          const src = itemWrap.dataset.src || itemWrap.querySelector('img')?.src;
          const title = itemWrap.dataset.title || itemWrap.querySelector('.gallery-item-title')?.textContent;
          const tag = itemWrap.dataset.tag || itemWrap.querySelector('.gallery-item-tag')?.textContent;
          if (src) {
            openGalleryLightbox(src, title, tag);
          }
        }
      }
    });

if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeGalleryLightbox);
    }

galleryLightboxModal.addEventListener('click', (e) => {
      if (e.target === galleryLightboxModal) {
        closeGalleryLightbox();
      }
    });
  }

const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioProgress = document.getElementById('audioProgress');
  let audioPlaying = false;
  let audioProgressTimer = null;
  let audioCurrentProgress = 38; 

if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioPlaying = !audioPlaying;
      if (audioPlaying) {
        if (audioIcon) {
          audioIcon.classList.remove('fa-play');
          audioIcon.classList.add('fa-pause');
        }
        showToast('Playing episode: Organic Permaculture & Soil...', 'info');
        audioProgressTimer = setInterval(() => {
          audioCurrentProgress += 1;
          if (audioCurrentProgress > 100) {
            audioCurrentProgress = 0;
            audioPlaying = false;
            clearInterval(audioProgressTimer);
            if (audioIcon) {
              audioIcon.classList.remove('fa-pause');
              audioIcon.classList.add('fa-play');
            }
          }
          if (audioProgress) audioProgress.style.width = `${audioCurrentProgress}%`;
        }, 300);
      } else {
        if (audioIcon) {
          audioIcon.classList.remove('fa-pause');
          audioIcon.classList.add('fa-play');
        }
        clearInterval(audioProgressTimer);
        showToast('Audio paused', 'info');
      }
    });
  }

const blogVideoBtn = document.getElementById('blogVideoBtn');
  if (blogVideoBtn) {
    blogVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal();
    });
  }

const newsFeedCol = document.getElementById('newsFeedCol');
  const newsFeedCards = Array.from(document.querySelectorAll('.blog-feed-card'));
  const newsNoResults = document.getElementById('newsNoResults');
  const resetNewsFiltersBtn = document.getElementById('resetNewsFiltersBtn');
  const blogCategoryLinks = document.querySelectorAll('.blog-cat-filter');
  const blogTagLinks = document.querySelectorAll('.blog-tag-filter');
  const newsSearchForm = document.getElementById('newsSidebarSearchForm');
  const newsSearchInput = document.getElementById('newsSearchInput');

if (newsFeedCards.length > 0) {
    let currentBlogCat = 'all';
    let currentBlogTag = 'all';
    let currentBlogSearch = '';

function applyNewsFilters(notify = false) {
      let visibleCount = 0;

newsFeedCards.forEach(card => {
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();
        const cardText = card.textContent.toLowerCase();

const matchesCategory = (currentBlogCat === 'all') || (cardCat === currentBlogCat);

const matchesTag = (currentBlogTag === 'all') || cardTags.includes(currentBlogTag);

const matchesSearch = !currentBlogSearch || cardText.includes(currentBlogSearch);

if (matchesCategory && matchesTag && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

if (newsNoResults) {
        newsNoResults.style.display = (visibleCount === 0) ? 'block' : 'none';
      }

if (notify) {
        if (visibleCount === 0) {
          showToast('No articles found matching your criteria', 'warning');
        } else if (currentBlogSearch) {
          showToast(`Found ${visibleCount} article${visibleCount > 1 ? 's' : ''} for "${currentBlogSearch}"`, 'info');
        } else if (currentBlogTag !== 'all') {
          showToast(`Filtered by tag: #${currentBlogTag} (${visibleCount})`, 'info');
        } else if (currentBlogCat !== 'all') {
          showToast(`Filtered by category (${visibleCount})`, 'info');
        }
      }
    }

blogCategoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        blogCategoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentBlogCat = (link.getAttribute('data-category') || 'all').toLowerCase();
        applyNewsFilters(true);

if (window.innerWidth <= 992 && newsFeedCol) {
          newsFeedCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

blogTagLinks.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = (pill.getAttribute('data-tag') || '').toLowerCase();

if (pill.classList.contains('active')) {
          pill.classList.remove('active');
          currentBlogTag = 'all';
          showToast('Tag filter cleared', 'info');
        } else {
          blogTagLinks.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentBlogTag = tag;
        }

applyNewsFilters(true);

if (window.innerWidth <= 992 && newsFeedCol) {
          newsFeedCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

if (newsSearchInput) {
      newsSearchInput.addEventListener('input', () => {
        currentBlogSearch = newsSearchInput.value.trim().toLowerCase();
        applyNewsFilters(false);
      });
    }

if (newsSearchForm) {
      newsSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (newsSearchInput) {
          currentBlogSearch = newsSearchInput.value.trim().toLowerCase();
        }
        applyNewsFilters(true);
      });
    }

if (resetNewsFiltersBtn) {
      resetNewsFiltersBtn.addEventListener('click', () => {
        currentBlogCat = 'all';
        currentBlogTag = 'all';
        currentBlogSearch = '';
        if (newsSearchInput) newsSearchInput.value = '';
        blogCategoryLinks.forEach(l => l.classList.remove('active'));
        const allCatLink = document.querySelector('.blog-cat-filter[data-category="all"]');
        if (allCatLink) allCatLink.classList.add('active');
        blogTagLinks.forEach(p => p.classList.remove('active'));
        applyNewsFilters(false);
        showToast('All filters cleared. Showing all articles.', 'success');
      });
    }
  }

const contactQuoteForm = document.getElementById('contactQuoteForm');
  if (contactQuoteForm) {
    if (window.OrganicValidation) {
      window.OrganicValidation.setupFormValidation(contactQuoteForm, {
        onValidSubmit: (form) => {
          window.location.href = '404.html';
        }
      });
    } else {
      contactQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('quoteName');
        const emailInput = document.getElementById('quoteEmail');
        const serviceInput = document.getElementById('quoteService');
        const messageInput = document.getElementById('quoteMessage');

const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const service = serviceInput ? serviceInput.value : '';
        const message = messageInput ? messageInput.value.trim() : '';

if (!name || !email || !service || !message) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }

if (!/^[A-Za-z\s]+$/.test(name)) {
          showToast('Name must only contain alphabets and spaces.', 'error');
          return;
        }

window.location.href = '404.html';
      });
    }
  }

function setupPasswordToggle(toggleBtnId, inputId, iconId) {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (btn && input && !btn.dataset.pwdBound) {
      btn.dataset.pwdBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        if (icon) {
          if (isPassword) {
            icon.className = 'fa-solid fa-eye-slash';
          } else {
            icon.className = 'fa-regular fa-eye';
          }
        }
      });
    }
  }

setupPasswordToggle('loginPwdToggle', 'loginPassword', 'loginPwdIcon');
  setupPasswordToggle('signupPwdToggle', 'signupPassword', 'signupPwdIcon');
  setupPasswordToggle('signupConfirmPwdToggle', 'signupConfirmPassword', 'signupConfirmPwdIcon');

const socialAuthBtns = document.querySelectorAll('.btn-social-auth');
  socialAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    }
  });

if (document.body.classList.contains('dashboard-body') || 
      document.querySelector('.dashboard-container') || 
      document.getElementById('dashSidebar')) {
'use strict';

function showDashToast(message, type = 'success') {
    let container = document.getElementById('dashToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'dashToastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : type === 'error' 
        ? 'fa-solid fa-triangle-exclamation' 
        : 'fa-solid fa-bell';

toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

setTimeout(() => { toast.classList.add('show'); }, 20);

setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.remove(); }, 350);
    }, 3200);
  }

window.showDashToast = showDashToast;

const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
  const sections = document.querySelectorAll('.dash-section');
  const headerTitle = document.getElementById('dashHeaderTitle');
  const headerPath = document.getElementById('dashHeaderPath');
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('dashSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

function switchSection(targetId, updateHash = true, scrollTop = true) {
    if (!targetId) return;

sections.forEach(sec => sec.classList.remove('active'));
    sidebarLinks.forEach(link => link.classList.remove('active'));

const targetSection = document.getElementById(targetId);
    const activeLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);

if (targetSection) {
      targetSection.classList.add('active');

if (activeLink) {
        activeLink.classList.add('active');
        const sectionName = activeLink.querySelector('.sidebar-label')?.textContent.trim() || 'Dashboard';

if (headerTitle) headerTitle.textContent = sectionName;
        if (headerPath) {
          const roleName = document.body.dataset.dashboardRole === 'farmer' ? 'Farmer Portal' : 'Customer Portal';
          headerPath.innerHTML = `<span>${roleName}</span> <i class="fa-solid fa-chevron-right" style="font-size: 0.65rem;"></i> <span style="color: var(--dash-dark); font-weight: 600;">${sectionName}</span>`;
        }
      }

triggerAOS(targetSection);

if (typeof window.renderFarmerCharts === 'function') {
        setTimeout(window.renderFarmerCharts, 100);
      }

if (updateHash) {
        history.replaceState(null, null, `#${targetId}`);
      }

closeMobileSidebar();

if (scrollTop) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }

sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      switchSection(targetId, true, true);
    });
  });

const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    switchSection(currentHash, false, false);
  } else if (sidebarLinks.length > 0) {
    const firstTarget = sidebarLinks[0].getAttribute('data-target');
    switchSection(firstTarget, false, false);
  }

function syncDashboardUserAuth() {
    const email = localStorage.getItem('organic_user_email') || '';
    let username = localStorage.getItem('organic_user_name') || '';
    if (!username && email) {
      username = email.split('@')[0];
      localStorage.setItem('organic_user_name', username);
    }

if (username) {
      document.querySelectorAll('.sidebar-user-name, .header-user-name').forEach(el => {
        el.textContent = username;
      });

const greetingTitle = document.querySelector('.greeting-title');
      if (greetingTitle) {
        greetingTitle.innerHTML = `Welcome back, ${username}! <span class="greeting-emoji">&#127807;</span>`;
      }

const settingsName = document.getElementById('settingsName');
      if (settingsName) {
        settingsName.value = username;
      }
    }

if (email) {
      document.querySelectorAll('.sidebar-user-email, .header-user-email').forEach(el => {
        el.textContent = email;
      });
      const settingsEmail = document.getElementById('settingsEmail');
      if (settingsEmail) {
        settingsEmail.value = email;
      }
    }
  }

syncDashboardUserAuth();

const searchInput = document.querySelector('.header-search-input');
  if (searchInput) {
    const searchWrapper = searchInput.closest('.header-search');
    let resultsDropdown = searchWrapper ? searchWrapper.querySelector('.header-search-dropdown') : null;
    if (!resultsDropdown && searchWrapper) {
      resultsDropdown = document.createElement('div');
      resultsDropdown.className = 'header-search-dropdown';
      resultsDropdown.style.display = 'none';
      searchWrapper.appendChild(resultsDropdown);
    }

function performDashboardSearch(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        if (resultsDropdown) {
          resultsDropdown.style.display = 'none';
          resultsDropdown.innerHTML = '';
        }
        document.querySelectorAll('.dashboard-table tbody tr, .wishlist-card, .crop-card').forEach(el => {
          el.style.display = '';
        });
        return;
      }

const isFarmer = document.body.dataset.dashboardRole === 'farmer';
      const results = [];

if (!isFarmer) {

document.querySelectorAll('#ordersSection tbody tr, #overviewSection .dashboard-table tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          if (text.includes(q)) {
            const orderId = row.querySelector('strong')?.textContent.trim() || 'Order';
            results.push({
              title: orderId,
              subtitle: row.querySelector('.status-badge')?.textContent.trim() || 'Order record',
              section: 'ordersSection',
              icon: 'fa-solid fa-box-open'
            });
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });

document.querySelectorAll('.wishlist-card').forEach(card => {
          const title = card.querySelector('.wishlist-title')?.textContent.trim() || '';
          if (title.toLowerCase().includes(q)) {
            results.push({
              title: title,
              subtitle: card.querySelector('.wishlist-price')?.textContent.trim() || 'Wishlist item',
              section: 'wishlistSection',
              icon: 'fa-solid fa-heart'
            });
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

document.querySelectorAll('.perk-card').forEach(card => {
          const title = card.querySelector('.perk-title')?.textContent.trim() || '';
          if (title.toLowerCase().includes(q)) {
            results.push({
              title: title,
              subtitle: 'Loyalty Reward Perk',
              section: 'rewardsSection',
              icon: 'fa-solid fa-gift'
            });
          }
        });

sidebarLinks.forEach(link => {
          const label = link.querySelector('.sidebar-label')?.textContent.trim() || '';
          if (label.toLowerCase().includes(q)) {
            results.push({
              title: label,
              subtitle: 'Switch to ' + label + ' view',
              section: link.getAttribute('data-target'),
              icon: link.querySelector('i')?.className || 'fa-solid fa-folder'
            });
          }
        });
      } else {

document.querySelectorAll('.crop-card').forEach(card => {
          const title = card.querySelector('.crop-title')?.textContent.trim() || '';
          if (title.toLowerCase().includes(q)) {
            results.push({
              title: title,
              subtitle: card.querySelector('.crop-variety')?.textContent.trim() || 'Harvest crop',
              section: 'cropsSection',
              icon: 'fa-solid fa-wheat-awn'
            });
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

document.querySelectorAll('#distributionSection tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          if (text.includes(q)) {
            const buyer = row.querySelector('strong')?.textContent.trim() || 'Bulk Order';
            results.push({
              title: buyer,
              subtitle: row.querySelector('.status-badge')?.textContent.trim() || 'Distribution order',
              section: 'distributionSection',
              icon: 'fa-solid fa-truck-ramp-box'
            });
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });

sidebarLinks.forEach(link => {
          const label = link.querySelector('.sidebar-label')?.textContent.trim() || '';
          if (label.toLowerCase().includes(q)) {
            results.push({
              title: label,
              subtitle: 'Open ' + label + ' operations',
              section: link.getAttribute('data-target'),
              icon: link.querySelector('i')?.className || 'fa-solid fa-chart-line'
            });
          }
        });
      }

const seen = new Set();
      const uniqueResults = results.filter(r => {
        const key = r.title + '|' + r.section;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 5);

if (resultsDropdown) {
        if (uniqueResults.length > 0) {
          resultsDropdown.innerHTML = uniqueResults.map(r => `
            <div class="search-result-item" data-target="${r.section}">
              <i class="${r.icon} search-result-icon"></i>
              <div class="search-result-info">
                <span class="search-result-title">${r.title}</span>
                <span class="search-result-sub">${r.subtitle}</span>
              </div>
              <i class="fa-solid fa-arrow-right search-result-arrow"></i>
            </div>
          `).join('');
          resultsDropdown.style.display = 'block';

resultsDropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
              const sec = item.dataset.target;
              if (sec) switchSection(sec);
              resultsDropdown.style.display = 'none';
              searchInput.value = '';
              document.querySelectorAll('.dashboard-table tbody tr, .wishlist-card, .crop-card').forEach(el => el.style.display = '');
            });
          });
        } else {
          resultsDropdown.innerHTML = `
            <div class="search-no-results">
              <i class="fa-solid fa-circle-info"></i>
              <span>No matching records found</span>
            </div>
          `;
          resultsDropdown.style.display = 'block';
        }
      }
    }

searchInput.addEventListener('input', (e) => {
      performDashboardSearch(e.target.value);
    });

searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = resultsDropdown ? resultsDropdown.querySelector('.search-result-item') : null;
        if (first) {
          first.click();
        }
      } else if (e.key === 'Escape') {
        if (resultsDropdown) resultsDropdown.style.display = 'none';
      }
    });

document.addEventListener('click', (e) => {
      if (searchWrapper && !searchWrapper.contains(e.target)) {
        if (resultsDropdown) resultsDropdown.style.display = 'none';
      }
    });
  }

function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('show');
    document.body.classList.add('dash-sidebar-open');
    document.documentElement.classList.add('dash-sidebar-open');
  }

function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    document.body.classList.remove('dash-sidebar-open');
    document.documentElement.classList.remove('dash-sidebar-open');
  }

if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', openMobileSidebar);
  }

const mobileSidebarCloseBtn = document.getElementById('mobileSidebarCloseBtn');
  if (mobileSidebarCloseBtn) {
    mobileSidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (window.innerWidth > 992) {
        document.body.classList.toggle('sidebar-collapsed');
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        const icon = sidebarToggleBtn.querySelector('i');
        if (icon) {
          icon.className = isCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
        }
      } else {
        closeMobileSidebar();
      }
    });
  }

const notificationBellBtn = document.getElementById('notificationBellBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const markReadBtn = document.getElementById('markAllReadBtn');
  const notifBadge = document.getElementById('headerNotifBadge');

if (notificationBellBtn && notificationDropdown) {
    notificationBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('show');
    });

document.addEventListener('click', (e) => {
      if (!notificationDropdown.contains(e.target) && !notificationBellBtn.contains(e.target)) {
        notificationDropdown.classList.remove('show');
      }
    });
  }

if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const unreadItems = document.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => item.classList.remove('unread'));
      if (notifBadge) {
        notifBadge.style.display = 'none';
      }
      showDashToast('All notifications marked as read', 'info');
    });
  }

const logoutModal = document.getElementById('logoutConfirmModal');
  const logoutTriggers = document.querySelectorAll('#sidebarLogoutBtn, #headerLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

function openLogoutModal() {
    if (logoutModal) {
      logoutModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

function closeLogoutModal() {
    if (logoutModal) {
      logoutModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

logoutTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLogoutModal();
    });
  });

if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);
  }

if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
      confirmLogoutBtn.disabled = true;
      confirmLogoutBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Logging out...</span>';

localStorage.removeItem('organic_user_email');
      localStorage.removeItem('organic_user_name');
      sessionStorage.clear();
      setTimeout(() => {

window.location.replace('login.html');
      }, 700);
    });
  }

if (logoutModal) {
    logoutModal.addEventListener('click', (e) => {
      if (e.target === logoutModal) {
        closeLogoutModal();
      }
    });
  }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLogoutModal();
      if (notificationDropdown) notificationDropdown.classList.remove('show');
    }
  });

function triggerAOS(container = document) {
    if (!container || !container.querySelectorAll) return;
    const animEls = container.querySelectorAll('[data-dash-aos]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay) || 0;
            setTimeout(() => {
              el.classList.add('dash-aos-visible');
            }, delay);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.1 });

animEls.forEach(el => observer.observe(el));
    } else {
      animEls.forEach(el => el.classList.add('dash-aos-visible'));
    }
  }

triggerAOS();

document.querySelectorAll('.btn-reorder:not(.btn-accept-order):not(.btn-dispatch-order)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code || 'FRESH25';
      navigator.clipboard.writeText(code).then(() => {
        showDashToast(`Coupon code "${code}" copied to clipboard!`, 'success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2000);
      }).catch(() => {
        showDashToast(`Coupon code: ${code}`, 'info');
      });
    });
  });

document.querySelectorAll('.btn-redeem-perk').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

document.querySelectorAll('.btn-move-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.wishlist-card');
      const title = btn.dataset.title || 'Product';
      if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'scale(0.85)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          showDashToast(`"${title}" removed from wishlist`, 'info');

const badge = document.querySelector('.sidebar-badge-wishlist');
          if (badge) {
            const current = Math.max(0, parseInt(badge.textContent) - 1);
            badge.textContent = current;
          }
        }, 300);
      }
    });
  });

document.querySelectorAll('.btn-delete-address').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.address-card');
      if (card) {
        if (confirm('Are you sure you want to remove this delivery address?')) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.remove();
            showDashToast('Address deleted successfully', 'info');
          }, 250);
        }
      }
    });
  });

document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      if (item) {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      }
    });
  });

const avatarInput = document.getElementById('profileAvatarInput');
  const avatarPreview = document.getElementById('profileAvatarPreview');
  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.src = e.target.result;
          showDashToast('Profile avatar preview updated!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

const profileForm = document.getElementById('profileSettingsForm');
  if (profileForm && window.OrganicValidation) {
    window.OrganicValidation.setupFormValidation(profileForm, {
      onValidSubmit: () => {
        window.location.href = '404.html';
      }
    });
  } else if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

const supportTicketForm = document.getElementById('supportTicketForm');
  if (supportTicketForm && window.OrganicValidation) {
    window.OrganicValidation.setupFormValidation(supportTicketForm, {
      onValidSubmit: () => {
        window.location.href = '404.html';
      }
    });
  } else if (supportTicketForm) {
    supportTicketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

document.querySelectorAll('.btn-accept-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const badge = row ? row.querySelector('.status-badge') : null;
      const orderId = btn.dataset.orderId || '#BLK-1049';

if (badge) {
        badge.className = 'status-badge badge-ready';
        badge.innerHTML = '<i class="fa-solid fa-check"></i> Accepted';
      }

btn.outerHTML = `<button type="button" class="btn-table-action btn-reorder btn-dispatch-order" data-order-id="${orderId}">
        <i class="fa-solid fa-truck-fast"></i> Dispatch
      </button>`;

showDashToast(`Bulk Order ${orderId} accepted! Staging for cold packing.`, 'success');

const newDispatchBtn = document.querySelector(`.btn-dispatch-order[data-order-id="${orderId}"]`);
      if (newDispatchBtn) {
        newDispatchBtn.addEventListener('click', () => {
          if (badge) {
            badge.className = 'status-badge badge-transit';
            badge.innerHTML = '<i class="fa-solid fa-truck"></i> Dispatched';
          }
          newDispatchBtn.disabled = true;
          newDispatchBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> En Route';
          showDashToast(`Order ${orderId} dispatched with refrigerated van fleet!`, 'success');
        });
      }
    });
  });

document.querySelectorAll('.btn-download-inv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

function renderHarvestVolumeChart() {
    const canvas = document.getElementById('harvestVolumeCanvas');
    if (!canvas) return;

const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [1850, 2400, 1950, 3100, 2800, 3950, 2200]; 
    const maxValue = 4500;

ctx.clearRect(0, 0, width, height);

ctx.strokeStyle = '#F0EDE6';
    ctx.lineWidth = 1;
    const gridRows = 4;
    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / gridRows);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

const labelVal = Math.round(maxValue * (1 - i / gridRows));
      ctx.fillStyle = '#A0AEC0';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${labelVal}kg`, padding.left - 8, y + 3);
    }

const chartW = width - padding.left - padding.right;
    const barWidth = Math.min(36, chartW / days.length - 16);

days.forEach((day, idx) => {
      const x = padding.left + (idx + 0.5) * (chartW / days.length) - barWidth / 2;
      const barH = (values[idx] / maxValue) * (height - padding.top - padding.bottom);
      const y = height - padding.bottom - barH;

const grad = ctx.createLinearGradient(0, y, 0, height - padding.bottom);
      grad.addColorStop(0, '#79A206');
      grad.addColorStop(1, '#A3D428');

ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

ctx.fillStyle = '#718096';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barWidth / 2, height - padding.bottom + 20);

ctx.fillStyle = '#193820';
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      ctx.fillText(values[idx], x + barWidth / 2, y - 6);
    });
  }

function renderRevenueTrendChart() {
    const canvas = document.getElementById('revenueTrendCanvas');
    if (!canvas) return;

const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

const width = rect.width;
    const height = rect.height;
    const padding = { top: 25, right: 25, bottom: 40, left: 55 };

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const revenue = [21500, 24800, 29100, 31400, 35800, 38420];
    const maxRev = 45000;

ctx.clearRect(0, 0, width, height);

ctx.strokeStyle = '#F0EDE6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

const label = `$${Math.round((maxRev * (1 - i / 4)) / 1000)}k`;
      ctx.fillStyle = '#A0AEC0';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, padding.left - 8, y + 3);
    }

const chartW = width - padding.left - padding.right;
    const points = months.map((m, idx) => {
      const x = padding.left + (idx / (months.length - 1)) * chartW;
      const y = height - padding.bottom - (revenue[idx] / maxRev) * (height - padding.top - padding.bottom);
      return { x, y, month: m, val: revenue[idx] };
    });

ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

ctx.strokeStyle = '#79A206';
    ctx.lineWidth = 3;
    ctx.stroke();

ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();

const areaGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    areaGrad.addColorStop(0, 'rgba(121, 162, 6, 0.28)');
    areaGrad.addColorStop(1, 'rgba(121, 162, 6, 0.01)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

points.forEach(pt => {

ctx.fillStyle = '#718096';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.month, pt.x, height - padding.bottom + 20);

ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#193820';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
  }

window.renderFarmerCharts = () => {
    renderHarvestVolumeChart();
    renderRevenueTrendChart();
  };

window.renderFarmerCharts();
  window.addEventListener('resize', () => {
    window.renderFarmerCharts();
  });
  }

function initCustomSelect(selectEl) {
    if (!selectEl || selectEl.dataset.customized === 'true') return;
    selectEl.dataset.customized = 'true';

const parent = selectEl.parentElement;
    if (parent) {
      if (parent.classList.contains('contact-input-wrap')) {
        parent.classList.add('has-custom-select');
      }
      if (parent.classList.contains('sort-select-wrap')) {
        parent.classList.add('has-custom-select');
      }
      if (parent.classList.contains('dashboard-form-group')) {
        parent.classList.add('has-custom-select');
      }
    }

selectEl.classList.add('visually-hidden-select');
    selectEl.setAttribute('tabindex', '-1');

const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-container';
    if (selectEl.id) {
      wrapper.classList.add(`custom-select-${selectEl.id}`);
    }

selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);

const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

if (selectEl.classList.contains('contact-input-field')) {
      trigger.classList.add('contact-input-field');
    }
    if (selectEl.classList.contains('sort-select')) {
      trigger.classList.add('sort-select');
    }
    if (selectEl.classList.contains('dashboard-input')) {
      trigger.classList.add('dashboard-input');
    }

const selectedOption = selectEl.options[selectEl.selectedIndex] || selectEl.options[0];
    const triggerText = document.createElement('span');
    triggerText.className = 'custom-select-text';
    triggerText.textContent = selectedOption ? selectedOption.textContent : '';
    if (selectedOption && selectedOption.disabled) {
      triggerText.classList.add('is-placeholder');
    }

const triggerIcon = document.createElement('i');
    triggerIcon.className = 'fa-solid fa-chevron-down custom-select-arrow';

trigger.appendChild(triggerText);
    trigger.appendChild(triggerIcon);
    wrapper.appendChild(trigger);

const dropdown = document.createElement('ul');
    dropdown.className = 'custom-select-dropdown';
    dropdown.setAttribute('role', 'listbox');

function renderOptions() {
      dropdown.innerHTML = '';
      Array.from(selectEl.options).forEach((opt, idx) => {
        const li = document.createElement('li');
        li.className = 'custom-select-option';
        li.setAttribute('role', 'option');
        li.dataset.value = opt.value;

const labelSpan = document.createElement('span');
        labelSpan.textContent = opt.textContent;
        li.appendChild(labelSpan);

if (opt.disabled) {
          li.classList.add('is-disabled');
        } else {
          if (idx === selectEl.selectedIndex) {
            li.classList.add('is-selected');
            const check = document.createElement('i');
            check.className = 'fa-solid fa-check option-check-icon';
            li.appendChild(check);
          }

li.addEventListener('click', (e) => {
            e.stopPropagation();
            selectEl.value = opt.value;
            triggerText.textContent = opt.textContent;
            triggerText.classList.remove('is-placeholder');

dropdown.querySelectorAll('.custom-select-option').forEach(o => {
              o.classList.remove('is-selected');
              const icon = o.querySelector('.option-check-icon');
              if (icon) icon.remove();
            });
            li.classList.add('is-selected');
            const newCheck = document.createElement('i');
            newCheck.className = 'fa-solid fa-check option-check-icon';
            li.appendChild(newCheck);

setDropdownOpenState(wrapper, false);

selectEl.classList.remove('input-error');
            trigger.classList.remove('input-error');
            if (window.OrganicValidation) {
              window.OrganicValidation.clearFieldError(selectEl);
            }

selectEl.dispatchEvent(new Event('change', { bubbles: true }));
            selectEl.dispatchEvent(new Event('input', { bubbles: true }));
          });
        }

dropdown.appendChild(li);
      });
    }

function setDropdownOpenState(wrap, isOpen) {
      const trig = wrap.querySelector('.custom-select-trigger');
      if (isOpen) {
        wrap.classList.add('is-open');
        if (trig) trig.setAttribute('aria-expanded', 'true');
      } else {
        wrap.classList.remove('is-open');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }

const toolbar = wrap.closest('.shop-toolbar');
      if (toolbar) toolbar.classList.toggle('is-dropdown-open', isOpen);
      const sortWrap = wrap.closest('.sort-select-wrap');
      if (sortWrap) sortWrap.classList.toggle('is-dropdown-open', isOpen);
      const contactGroup = wrap.closest('.contact-form-group');
      if (contactGroup) contactGroup.classList.toggle('is-dropdown-open', isOpen);
      const dashGroup = wrap.closest('.dashboard-form-group');
      if (dashGroup) dashGroup.classList.toggle('is-dropdown-open', isOpen);
      const inputWrap = wrap.closest('.contact-input-wrap');
      if (inputWrap) inputWrap.classList.toggle('is-dropdown-open', isOpen);
    }

renderOptions();
    wrapper.appendChild(dropdown);

trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

const isOpen = wrapper.classList.contains('is-open');
      document.querySelectorAll('.custom-select-container.is-open').forEach(c => {
        if (c !== wrapper) {
          setDropdownOpenState(c, false);
        }
      });

setDropdownOpenState(wrapper, !isOpen);
    });

trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setDropdownOpenState(wrapper, true);
      } else if (e.key === 'Escape') {
        setDropdownOpenState(wrapper, false);
      }
    });

selectEl.addEventListener('change', () => {
      const curOpt = selectEl.options[selectEl.selectedIndex];
      if (curOpt) {
        triggerText.textContent = curOpt.textContent;
        if (curOpt.disabled) {
          triggerText.classList.add('is-placeholder');
        } else {
          triggerText.classList.remove('is-placeholder');
        }
        dropdown.querySelectorAll('.custom-select-option').forEach(o => {
          if (o.dataset.value === curOpt.value) {
            o.classList.add('is-selected');
            if (!o.querySelector('.option-check-icon')) {
              const icon = document.createElement('i');
              icon.className = 'fa-solid fa-check option-check-icon';
              o.appendChild(icon);
            }
          } else {
            o.classList.remove('is-selected');
            const icon = o.querySelector('.option-check-icon');
            if (icon) icon.remove();
          }
        });
      }
    });
  }

function closeAllCustomSelects() {
    document.querySelectorAll('.custom-select-container.is-open').forEach(c => {
      c.classList.remove('is-open');
      const t = c.querySelector('.custom-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
      const toolbar = c.closest('.shop-toolbar');
      if (toolbar) toolbar.classList.remove('is-dropdown-open');
      const sortWrap = c.closest('.sort-select-wrap');
      if (sortWrap) sortWrap.classList.remove('is-dropdown-open');
      const contactGroup = c.closest('.contact-form-group');
      if (contactGroup) contactGroup.classList.remove('is-dropdown-open');
      const inputWrap = c.closest('.contact-input-wrap');
      if (inputWrap) inputWrap.classList.remove('is-dropdown-open');
    });
  }

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-container')) {
      closeAllCustomSelects();
    }
  });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCustomSelects();
    }
  });

const shopSortSelectEl = document.getElementById('shopSortSelect');
  if (shopSortSelectEl) {
    initCustomSelect(shopSortSelectEl);
  }

const quoteServiceEl = document.getElementById('quoteService');
  if (quoteServiceEl) {
    initCustomSelect(quoteServiceEl);
  }

const ticketCategoryEl = document.getElementById('ticketCategory');
  if (ticketCategoryEl) {
    initCustomSelect(ticketCategoryEl);
  }

window.addEventListener('pageshow', () => {
    document.querySelectorAll('.auth-success-toast.show').forEach(el => el.classList.remove('show'));
    const loginBtn = document.getElementById('loginSubmitBtn');
    if (loginBtn && loginBtn.disabled) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<span>Login</span>';
    }
    const signupBtn = document.getElementById('signupSubmitBtn');
    if (signupBtn && signupBtn.disabled) {
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<span>Create Account</span>';
    }
  });

});

