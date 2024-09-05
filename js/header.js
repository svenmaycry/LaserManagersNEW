const body = document.querySelector('body');
const headerIconMenuButton = document.querySelector('.js-icon-menu');
const overlay = document.querySelector('.js-header-overlay');
const headerMain = document.querySelector('.js-main-header');
const headerTop = document.querySelector('.js-main-header-top');
const headerBot = document.querySelector('.js-main-header-bottom');
const headerLogo = document.querySelector('.js-main-header-logo');
const headerInput = document.querySelector('.js-search-header-input');
const headerMainNavItemLink = document.querySelectorAll('.js-main-nav-item-link');
const headerCatalogBtn = document.querySelector('.js-catalog-btn');
const mobileSearchBtn = document.querySelector('.js-mobile-search-btn');


// Модуль работы с меню (бургер).
let bodyLockStatus = true;

let bodyLockToggle = () => {
  if (body.classList.contains("lock")) bodyUnlock();
  else bodyLock();
};

let bodyUnlock = () => {
  if (bodyLockStatus) {
    body.classList.remove("lock");
    bodyLockStatus = true;
  }
};

let bodyLock = () => {
  if (bodyLockStatus) {
    body.classList.add("lock");
    bodyLockStatus = true;
  }
};

function menuInit() {
  if (headerIconMenuButton)
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest(".js-icon-menu")) {
        bodyLockToggle();
        body.classList.toggle("main-nav-open");
        if (mobileSearchBtn.classList.contains("--spoiler-active")) {
          body.classList.toggle('lock');
        }
      }
    });
}

// Модуль работы со спойлерами.
function spoilersHeader() {
  const spoilers = document.querySelectorAll("[data-spoiler-header]");

  if (spoilers.length > 0) {
    const breakpoint = 1024;
    const matchMedia = window.matchMedia(`(max-width: ${breakpoint}px)`);

    initSpoilers(spoilers, matchMedia);

    matchMedia.addEventListener('change', () => initSpoilers(spoilers, matchMedia));

    function initSpoilers(spoilersArray, matchMedia) {
      spoilersArray.forEach(spoiler => {

        const mainNavItem = spoiler.closest(".js-main-nav-item");

        if (mainNavItem) {
          if (matchMedia.matches || spoiler.dataset.spoilerHeader === "click") {
            spoiler.addEventListener("click", toggleSpoiler);
            spoiler.removeEventListener("mouseover", showSpoiler);
            mainNavItem.removeEventListener("mouseleave", hideSpoiler);
          } else {
            spoiler.removeEventListener("click", toggleSpoiler);
            spoiler.addEventListener("mouseover", showSpoiler);
            mainNavItem.addEventListener("mouseleave", hideSpoiler);
          }
        }
      });
    }

    function showSpoiler(e) {
      const el = e.target.closest("[data-spoiler-header]");
      if (el) {
        const oneSpoiler = el.hasAttribute("data-one-spoiler");

        if (oneSpoiler && !el.classList.contains("--spoiler-active")) {
          hideSpoiler();
        }

        el.classList.add("--spoiler-active");
        if (window.innerWidth >= 1025) {
          overlay.classList.add("--active");
          headerBot.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          headerInput.style.opacity = '0.2';
          headerCatalogBtn.style.opacity = '0.2';
          headerLogo.style.opacity = '0.5';
        }
        if (!body.classList.contains("main-nav-open")) {
          body.classList.add("lock");
        }
        e.preventDefault();
      }
    }

    function toggleSpoiler(e) {
      const el = e.target.closest("[data-spoiler-header]");
      if (el) {
        const oneSpoiler = el.hasAttribute("data-one-spoiler");

        if (oneSpoiler && !el.classList.contains("--spoiler-active")) {
          hideSpoiler();
        }

        el.classList.toggle("--spoiler-active");
        if (window.innerWidth >= 1025) {
          overlay.classList.toggle("--active", el.classList.contains("--spoiler-active"));
        }

        if (window.innerWidth <= 1024 && !body.classList.contains("main-nav-open")) {
          overlay.classList.toggle("--active");
        }

        if (!body.classList.contains("main-nav-open")) {
          body.classList.toggle("lock", el.classList.contains("--spoiler-active"));
        }
        e.preventDefault();
      }
    }

    function hideSpoiler(e) {
      const activeSpoilers = document.querySelectorAll("[data-spoiler-header].--spoiler-active");
      const mobileSearchBtnActive = document.querySelector('.js-mobile-search-btn.--spoiler-active');

      if (activeSpoilers.length > 0 && window.innerWidth >= 1025) {
        activeSpoilers.forEach(activeSpoiler => {
          activeSpoiler.classList.remove("--spoiler-active");
          overlay.classList.remove("--active");
          body.classList.remove("lock");
          headerBot.style.backgroundColor = '';
          headerInput.style.opacity = '';
          headerCatalogBtn.style.opacity = '';
          headerLogo.style.opacity = '';
        });
      }
      // Закрытие кнопки-спойлера поиска
      if (mobileSearchBtnActive && window.innerWidth <= 767) {
        mobileSearchBtnActive.classList.remove("--spoiler-active");
        overlay.classList.remove("--active");
        body.classList.remove("lock");
      }
    }

    function handleClickOutside(e) {
      if (window.innerWidth >= 1025 && !e.target.closest(".js-main-nav-item")) {
        hideSpoiler();
      }
      if (window.innerWidth <= 767 && !e.target.closest(".js-main-nav-item") || e.target.closest(".js-icon-menu")) {
        mobileSearchBtn.classList.remove("--spoiler-active");
      }
      if (window.innerWidth <= 767 && !e.target.closest(".js-main-nav-item") && !e.target.closest(".js-icon-menu") && !body.classList.contains('main-nav-open')) {
        overlay.classList.remove("--active");
        body.classList.remove("lock");
      }
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') {
        hideSpoiler();
      }
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
  }
}

// Модуль работы с табами.
function tabsHeader() {
  const tabsHeaderBlocks = document.querySelectorAll('[data-tabs-header]');

  tabsHeaderBlocks.forEach((tabsHeaderBlock) => {
    const tabsTitles = tabsHeaderBlock.querySelectorAll('[data-tabs-header-titles] > *');
    const tabsContents = tabsHeaderBlock.querySelectorAll('[data-tabs-header-body] > *');

    tabsTitles.forEach((tabTitle, index) => {
      tabTitle.setAttribute('data-tabs-header-title', index);
      tabsContents[index].setAttribute('data-tabs-header-item', index);

      tabsContents[index].hidden = !tabTitle.classList.contains('main-nav-tab-active');

      tabTitle.addEventListener('mouseover', () => {
        activateTab(tabsHeaderBlock, index);
      });
    });
  });

  function activateTab(tabsHeaderBlock, activeIndex) {
    const tabsTitles = tabsHeaderBlock.querySelectorAll('[data-tabs-header-title]');
    const tabsContents = tabsHeaderBlock.querySelectorAll('[data-tabs-header-item]');

    tabsTitles.forEach((tabTitle, index) => {
      if (index === activeIndex) {
        tabTitle.classList.add('main-nav-tab-active');
        tabsContents[index].hidden = false;
      } else {
        tabTitle.classList.remove('main-nav-tab-active');
        tabsContents[index].hidden = true;
      }
    });
  }
}

//  Модуль с Динамическим Адаптивом разметки
function dynamicAdapt() {
  class DynamicAdapt {
    constructor(type) {
      this.type = type;
      this.daClassname = "_dynamic_adapt_";
      this.nodes = document.querySelectorAll("[data-da]");
      this.arrOfObj = [];
      this.mediaQueries = [];
    }

    init() {
      this.arrOfObj = Array.from(this.nodes).map(node => {
        const [destinationSelector, breakpoint = "767", place = "last"] = node.dataset.da.trim().split(",");
        return {
          element: node,
          parent: node.parentNode,
          destination: document.querySelector(destinationSelector.trim()),
          breakpoint: breakpoint.trim(),
          place: place.trim(),
          index: this.indexInParent(node.parentNode, node)
        };
      });

      this.arraySort(this.arrOfObj);

      this.mediaQueries = [...new Set(this.arrOfObj.map(item => `(${this.type}-width: ${item.breakpoint}px),${item.breakpoint}`))];

      this.mediaQueries.forEach(media => {
        const [mediaQuery, mediaBreakpoint] = media.split(",");
        const matchMedia = window.matchMedia(mediaQuery);
        const arrOfObjFilter = this.arrOfObj.filter(item => item.breakpoint === mediaBreakpoint);

        matchMedia.addEventListener('change', () => this.mediaHandler(matchMedia, arrOfObjFilter));
        this.mediaHandler(matchMedia, arrOfObjFilter);
      });
      if (this.nodes.length > 0) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", () => document.dispatchEvent(windowScroll));
      }
    }

    mediaHandler(matchMedia, arrOfObj) {
      if (matchMedia.matches) {
        arrOfObj.forEach(oneObj => {
          oneObj.index = this.indexInParent(oneObj.parent, oneObj.element);
          this.moveTo(oneObj.place, oneObj.element, oneObj.destination);
        });
      } else {
        arrOfObj.reverse().forEach(oneObj => {
          if (oneObj.element.classList.contains(this.daClassname)) {
            this.moveBack(oneObj.parent, oneObj.element, oneObj.index);
          }
        });
      }
    }

    moveTo(place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === "last" || place >= destination.children.length) {
        destination.append(element);
      } else if (place === "first") {
        destination.prepend(element);
      } else {
        destination.children[place].before(element);
      }
    }

    moveBack(parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index]) {
        parent.children[index].before(element);
      } else {
        parent.append(element);
      }
    }

    indexInParent(parent, element) {
      return Array.from(parent.children).indexOf(element);
    }

    arraySort(arr) {
      const order = (a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if (a.place === "first" || b.place === "last") return -1;
          if (a.place === "last" || b.place === "first") return 1;
          return a.place - b.place;
        }
        return this.type === "min" ? a.breakpoint - b.breakpoint : b.breakpoint - a.breakpoint;
      };
      arr.sort(order);
    }
  }

  const da = new DynamicAdapt("max");
  da.init();
}

// Модуль с моим кодом.

// При скролле страницы показ и скрытие шапки.
let prevScrollPos = window.scrollY;
const headerHeight = headerMain.offsetHeight;
const SCROLL_THRESHOLD = 100;

const showAndHideHeader = () => {
  let currentScrollPos = window.scrollY;
  if (prevScrollPos > currentScrollPos) headerMain.style.top = "0px";
  else if (currentScrollPos > SCROLL_THRESHOLD)
    headerMain.style.top = `-${headerHeight}px`;
  prevScrollPos = currentScrollPos;
};

// При клике на поиск закрытие Меню-бургер + Сохранение класса lock.
const closeBurgerMenu = () => {
  if (body.classList.contains("main-nav-open"))
    body.classList.remove("main-nav-open", "lock");
};

// При клике на меню удаление класса --active оверлея.
const overlayClose = () => {
  overlay.classList.remove("--active");
};

// При клике на меню и закрытие спойлеров мобильного меню.
const closeSpoilersContent = () => {
  if (body.classList.contains("main-nav-open")) {
    headerMainNavItemLink.forEach((oneButton) => {
      if (oneButton.classList.contains("--spoiler-active")) {
        oneButton.classList.remove("--spoiler-active");
      }
    });
  }
};

// Закрыть спойлера, оверлея и lock body, при ресайзе страницы.
const closeSpoiler = () => {
  if (!body.classList.contains("main-nav-open") && window.innerWidth <= 1024) {
    headerMainNavItemLink.forEach((spoiler) => {
      if (spoiler.classList.contains("--spoiler-active")) {
        spoiler.classList.remove("--spoiler-active");
        overlay.classList.remove("--active");
        body.classList.remove("lock");
      }
    });
  }

  if (body.classList.contains("main-nav-open") && window.innerWidth >= 1025) {
    body.classList.remove("lock", "main-nav-open");
    headerMainNavItemLink.forEach((spoiler) => {
      spoiler.classList.remove("--spoiler-active");
    });
  }

  if (!body.classList.contains("main-nav-open") && window.innerWidth >= 678) {
    body.classList.remove("lock", "main-nav-open");
    mobileSearchBtn.classList.remove('--spoiler-active');
    overlay.classList.remove("--active");
  }
};

// Менять класс у айтема Каталога
const prodClassChange = () => {
  if (window.innerWidth <= 1024)
    headerCatalogBtn.classList.remove('main-nav-item--catalog');
  else if (window.innerWidth >= 1025)
    headerCatalogBtn.classList.add('main-nav-item--catalog');
};

// Добавление / удаление классов у body и header в зависимости от скроллбара.
const updatePadding = () => {
  if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
    body.classList.add('has-scrollbar');
    headerTop.classList.add('has-scrollbar');
    headerBot.classList.add('has-scrollbar')
  } else {
    body.classList.remove('has-scrollbar');
    headerTop.classList.remove('has-scrollbar');
    headerBot.classList.remove('has-scrollbar')
  }
};

// Показ и скрытие кнопки закрытия в поиске.
function showOrHideCloseBtn() {

  const closeButton = document.querySelector('.js-input-header-close-btn');

  headerInput.addEventListener('input', function () {
    if (headerInput.value.trim() !== '') {
      closeButton.style.display = 'flex';
    } else {
      closeButton.style.display = 'none';
    }
  });

  closeButton.addEventListener('click', function (e) {
    e.preventDefault();
    headerInput.value = '';
    closeButton.style.display = 'none';
    headerInput.focus();
  });
}

// Закрытие main-nav на мобилке при клмке на Поиск.
const mainNavCloseOnMobile = () => {
  if (window.innerWidth <= 767 && body.classList.contains('main-nav-open')) {
    body.classList.remove('main-nav-open');
    headerMainNavItemLink.forEach((oneButton) => {
      if (oneButton.classList.contains("--spoiler-active")) {
        oneButton.classList.remove("--spoiler-active");
      }
    });
  }
};

// Функции-хендлеры.
const onIconMenuClick = (e) => {
  overlayClose(e);
  closeSpoilersContent();
};

const onDocumentScroll = () => {
  showAndHideHeader();
};

const onDocumentResize = () => {
  closeSpoiler();
  prodClassChange();
  updatePadding();
};

const onMobileSearchButtonClick = () => {
  mainNavCloseOnMobile();
};

const onInputClick = (e) => {
  if (window.innerWidth >= 768) {
    overlayClose(e);
    headerMainNavItemLink.forEach((spoiler) => {
      if (spoiler.classList.contains("--spoiler-active")) {
        spoiler.classList.remove("--spoiler-active");
        overlay.classList.remove("--active");
        body.classList.remove("lock");
      }
    })
    closeBurgerMenu();
  }
};


// События на странице.
headerIconMenuButton.addEventListener("click", onIconMenuClick);
document.addEventListener("scroll", onDocumentScroll);
window.addEventListener("resize", onDocumentResize);
window.addEventListener("load", onDocumentResize);
headerInput.addEventListener('click', onInputClick);
mobileSearchBtn.addEventListener('click', onMobileSearchButtonClick);

menuInit();
spoilersHeader();
tabsHeader();
dynamicAdapt();
showOrHideCloseBtn();