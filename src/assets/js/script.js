(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  const switchViewport = () => {
    const value = window.outerWidth > 360 ? "width=device-width,initial-scale=1" : "width=360";
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  };
  addEventListener("resize", switchViewport, false);
  switchViewport();
})();

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================ */
  // 読み込み
  /* ============================================================ */

  const body = document.body;
  const header = document.getElementById("js-header");

  /* ============================================================ */
  // ハンバーガーボタン
  /* ============================================================ */

  const headerToggle = document.getElementById("js-header__toggle");
  const headerNav = document.getElementById("js-header__nav");

  const toggleHeaderNav = () => {
    const isClose = headerToggle.getAttribute("aria-expanded") === "false";
    headerToggle.setAttribute("aria-expanded", isClose ? "true" : "false");
    headerToggle.setAttribute("aria-label", isClose ? "閉じる" : "メニュー");
    headerNav.setAttribute("aria-hidden", isClose ? "false" : "true");
    body.classList.toggle("is-no-scroll", isClose);
  };

  const updateHeaderNav = () => {
    if (window.innerWidth >= 992) {
      headerToggle.setAttribute("aria-expanded", "false");
      headerToggle.setAttribute("aria-label", "メニュー");
      headerNav.removeAttribute("aria-hidden");
      body.classList.remove("is-no-scroll");
      headerToggle.removeEventListener("click", toggleHeaderNav);
    } else {
      headerToggle.addEventListener("click", toggleHeaderNav);
    }
  };

  window.addEventListener("resize", updateHeaderNav);
  updateHeaderNav();

  /* ============================================================ */
  // スムーズスクロール
  /* ============================================================ */

  const headerHeight = header ? header.offsetHeight : 0;
  const anchorSelectors = ['a[href^="#"]', `a[href^="${window.location.pathname}#"]`, `a[href^="${window.location.origin}${window.location.pathname}#"]`];
  const anchors = document.querySelectorAll(anchorSelectors.join(","));

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      const id = href.includes("#") ? href.substring(href.indexOf("#")) : href;
      const targetElement = document.querySelector(id === "#" ? "html" : id);

      if (targetElement) {
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  /* ============================================================ */
  // headerコントラスト
  /* ============================================================ */

  const headerContrast = () => header.classList.toggle("is-change", window.scrollY > 1);
  window.addEventListener("scroll", headerContrast);
  headerContrast();

  /* ============================================================ */
  // gallery
  /* ============================================================ */
  const galleryCardList = document.getElementById("js-gallery__card-list");
  const galleryCards = Array.from(galleryCardList.children);
  const galleryNav = document.getElementById("js-gallery__linear-nav__br");

  const cardWeight = 312;
  const galleryCardQty = 12;

  // gapの取得
  const getGalleryCardGap = () => parseFloat(window.getComputedStyle(galleryCardList).getPropertyValue("gap").trim());

  // オフセット計算
  const galleryCardListGutter = () => {
    const m = getGalleryCardGap();
    const a = Math.floor(window.innerWidth / (cardWeight + m));
    const b = a % 2 === 0 ? a + 1 : a + 2;
    const c = (window.innerWidth - ((cardWeight + m) * b - m)) / 2;
    return c;
  };

  galleryCardList.style.margin = `0 ${galleryCardListGutter()}px`;

  // loop処理
  const temporarilyDisableSnap = (p) => {
    setTimeout(() => {
      galleryCardList.style.scrollSnapType = "none";
      setTimeout(() => {
        galleryCardList.scrollLeft = p;
        setTimeout(() => {
          galleryCardList.style.scrollSnapType = "x mandatory";
        }, 10);
      }, 10);
    }, 10);
  };

  // loopトリガー
  const handleScroll = () => {
    const n = getGalleryCardGap();
    const a = (cardWeight + n) * galleryCardQty - n;

    const { scrollLeft, scrollWidth, offsetWidth } = galleryCardList;
    if (scrollLeft <= 0) temporarilyDisableSnap(scrollLeft + a);
    if (scrollLeft >= scrollWidth - offsetWidth) temporarilyDisableSnap(scrollLeft - a);
  };

  // カード複製
  galleryCardList.append(...galleryCards.map((child) => child.cloneNode(true)));
  galleryCardList.prepend(...galleryCards.map((child) => child.cloneNode(true)));

  galleryCardList.addEventListener("scroll", handleScroll);
  handleScroll();

  /* ============================================================ */
  // gallery ナビゲーション
  /* ============================================================ */
  const galleryPrevButton = document.getElementById("js-gallery__btn--prev");
  const galleryNextButton = document.getElementById("js-gallery__btn--next");

  galleryPrevButton.style.width = `${cardWeight + galleryCardListGutter()}px`;
  galleryNextButton.style.width = `${cardWeight + galleryCardListGutter()}px`;

  const scrollToCard = (offset) => {
    galleryCardList.scrollTo({
      left: galleryCardList.scrollLeft + offset,
      behavior: "smooth",
    });
  };

  const scrollToPrevCard = () => scrollToCard(-(cardWeight + getGalleryCardGap()));
  const scrollToNextCard = () => scrollToCard(cardWeight + getGalleryCardGap());

  galleryPrevButton.addEventListener("click", scrollToPrevCard);
  galleryNextButton.addEventListener("click", scrollToNextCard);

  /* ============================================================ */
  // gallery オートスクロール
  /* ============================================================ */

  // setInterval(function () {
  //   scrollToNextCard();
  // }, 2000);

  /* ============================================================ */
  // gallery スクロールバー
  /* ============================================================ */

  const galleryNavAnimation = () => {
    const n = getGalleryCardGap();

    const a = Math.floor(window.innerWidth / (cardWeight + n));
    const b = a % 2 === 0 ? a : a + 1;
    const { scrollLeft, scrollWidth, offsetWidth } = galleryCardList;
    const c = (scrollWidth - offsetWidth) / ((galleryCardQty * 3 - b - 1) / galleryCardQty);
    const d = ((scrollLeft % c) / c) * 100;
    galleryNav.style.width = `${d}%`;
  };

  galleryCardList.addEventListener("scroll", galleryNavAnimation);
  galleryNavAnimation();

  /* ============================================================ */
  // worksメニュートグル
  /* ============================================================ */

  const worksFilterOpen = document.querySelectorAll(".js-works__filter-open");
  const worksFilterClose = document.querySelectorAll(".js-works__filter-close");

  const toggleWorksMenu = (btn, isVisible) => {
    const targetElement = isVisible ? btn.nextElementSibling : btn.parentNode;
    targetElement.setAttribute("aria-hidden", isVisible ? "false" : "true");
    body.classList.toggle("is-no-scroll", isVisible);
  };

  const updateWorksMenu = () => {
    if (window.innerWidth >= 992) {
      body.classList.remove("is-no-scroll");
      worksFilterOpen.forEach((btn) => {
        btn.nextElementSibling.removeAttribute("aria-hidden");
      });
    } else {
      worksFilterOpen.forEach((btn) => {
        btn.addEventListener("click", () => toggleWorksMenu(btn, true));
      });
      worksFilterClose.forEach((btn) => {
        btn.addEventListener("click", () => toggleWorksMenu(btn, false));
      });
    }
  };

  window.addEventListener("resize", updateWorksMenu);
  updateWorksMenu();

  /* ============================================================ */
  // works masonry レイアウト
  /* ============================================================ */

  const worksCardList = document.getElementById("js-works__cards");

  [...worksCardList.children].forEach((card) => (card.style.gridRowEnd = `span ${card.offsetHeight + 32}`));

  const updateMasonryLayout = (n) => {
    const a = n < 688 ? 1 : n < 1064 ? 2 : 3;
    worksCardList.style.gridTemplateColumns = `repeat(${a}, ${cardWeight}px)`;
    worksCardList.style.gridAutoRows = "1px";
  };

  const buildMasonry = async () => {
    await updateMasonryLayout(window.innerWidth);
    updateCardDisplay();
  };

  window.addEventListener("load", buildMasonry);
  window.addEventListener("resize", buildMasonry);

  /* ============================================================ */
  // works filter
  /* ============================================================ */
  const categoryCheckboxList = document.querySelector(".js-filter__list--categories");
  const allCheckboxes = [...categoryCheckboxList.querySelectorAll("input")];
  const categoryCheckboxes = [...document.querySelectorAll(".js-works__category-btn")];
  const worksCards = [...worksCardList.children];
  const selectAllCheckbox = document.getElementById("js-works__select-all");

  let previousCategoryStates = [];
  let displayedCardsCount = 0;

  const calculateCardsToShow = () => {
    if (window.innerWidth < 688) {
      return 3;
    } else if (window.innerWidth < 1064) {
      return 4;
    } else {
      return 12;
    }
  };

  const getSelectedCategoryValues = () => categoryCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);

  const shouldDisplayCard = (card, selectedCategories) => {
    const cardCategories = card.getAttribute("data-filter").split(" ");
    return selectAllCheckbox.checked || selectedCategories.some((category) => cardCategories.includes(category));
  };

  const updateCardDisplay = () => {
    const selectedCategories = getSelectedCategoryValues();
    displayedCardsCount = 0;
    const cardsToShow = calculateCardsToShow();

    worksCards.forEach((card) => {
      const display = shouldDisplayCard(card, selectedCategories) && displayedCardsCount < cardsToShow;
      card.style.display = display ? "block" : "none";
      if (display) displayedCardsCount++;
    });
  };

  const saveCategoryStates = () => {
    previousCategoryStates = categoryCheckboxes.map((checkbox) => checkbox.checked);
  };

  const restoreCategoryStates = () => {
    categoryCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = previousCategoryStates[index] || false;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAllCheckbox.checked) {
      saveCategoryStates();
      categoryCheckboxes.forEach((checkbox) => (checkbox.checked = false));
    } else {
      restoreCategoryStates();
    }
    updateCardDisplay();
  };

  const handleCategoryChange = () => {
    if (selectAllCheckbox.checked) selectAllCheckbox.checked = false;

    const allChecked = categoryCheckboxes.every((checkbox) => checkbox.checked);
    if (allChecked) {
      selectAllCheckbox.checked = true;
      categoryCheckboxes.forEach((checkbox) => (checkbox.checked = false));
    } else {
      saveCategoryStates();
    }
    updateCardDisplay();
  };

  selectAllCheckbox.addEventListener("change", handleSelectAllChange);
  categoryCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", handleCategoryChange));
  allCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", updateCardDisplay));
});
