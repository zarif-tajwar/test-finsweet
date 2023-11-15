import './style.css';
import 'fslightbox';

// @ts-expect-error No typescript declaration file
import Flickity from 'flickity';
import type { HtmlElWithNull } from 'src/types/common';
import { scaleValue } from 'src/utils';

const mainCarouselClass = '.p-slider-container';
const mainSlidesClass = '.p-slider';

const progressLinesContainer = document.querySelector(
  '.p-slider-progress-container'
) as HtmlElWithNull;

const mainSlides = [...document.querySelectorAll(mainSlidesClass)] as HtmlElWithNull[];

const createProgressLines = () => {
  if (!progressLinesContainer) return;
  progressLinesContainer.innerHTML = '';
  mainSlides.forEach((slideEl, index) => {
    if (!slideEl) return;
    slideEl.dataset.sliderIndex = index.toString();
    progressLinesContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="p-slider-progress" data-slider-index="${index}"></div>`
    );
  });
};

createProgressLines();

const flkty = new Flickity(mainCarouselClass, {
  contain: true,
  freeScroll: true,
  percentPosition: true,
  pageDots: false,
  cellSelector: mainSlidesClass,
  cellAlign: 'left',
  resize: true,
  selectedAttraction: 0.01,
  dragThreshold: 1,
  freeScrollFriction: 0.05,
});

const activeSlideIndex = flkty.selectedIndex;
let scrollActiveIndexPrev = activeSlideIndex;

const scaleProgressLineHeight = (progressLineEl: HtmlElWithNull, scaleInPercentage: number) => {
  if (!progressLineEl) return;
  progressLineEl.style.transform = `scaleY(${scaleInPercentage}%)`;
};

const progressLines = [...document.querySelectorAll('.p-slider-progress')] as HtmlElWithNull[];

const progressInitialScaleY = progressLines[0]
  ? Number.parseFloat(
      window.getComputedStyle(progressLines[0]).getPropertyValue('transform').split(', ')[3]
    ) * 100
  : 0.4;

const setImagePositions = () => {
  mainSlides.forEach((el) => {
    if (!el) return;
    const elClientRect = el.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const elLeftOffset = elClientRect.left;
    const elRightOffset = elClientRect.right;

    const isElementInViewport = elRightOffset >= 0 && elLeftOffset <= viewportWidth;

    if (isElementInViewport) {
      const elWidth = elClientRect.width;

      const maxRightOffset = viewportWidth + elWidth;
      const minRightOffset = 0;

      const imageEL = el.querySelector('.image') as HtmlElWithNull;

      if (!imageEL) return;
      const imageWidth = imageEL.getBoundingClientRect().width;
      const imageX = scaleValue(
        elRightOffset,
        [minRightOffset, maxRightOffset],
        [0, imageWidth - elWidth]
      );

      imageEL.style.transform = `translateX(-${imageX}px)`;
    }
  });
};

const setProgressLines = (activeIndex: number, progress = 100) => {
  for (let i = 0; i < progressLines.length; i++) {
    const progressLine = progressLines[i];
    if (!progressLine) return;
    const relativeDiffIndex = Math.abs(i - activeIndex);
    if (relativeDiffIndex <= 2 && relativeDiffIndex >= 0) {
      const min = relativeDiffIndex * 20;
      scaleProgressLineHeight(
        progressLine,
        scaleValue(progress, [100, 100 - min], [100 - min, 100])
      );
      continue;
    }
    scaleProgressLineHeight(progressLine, progressInitialScaleY);
  }
};

setProgressLines(activeSlideIndex);
setImagePositions();

flkty.on('scroll', function (progress: number) {
  setImagePositions();

  const progressInPercentage = progress * 100;
  const scrollActiveIndex = scaleValue(
    progressInPercentage,
    [0, 100],
    [0, mainSlides.length - 1],
    true
  );

  if (scrollActiveIndex === scrollActiveIndexPrev) return;
  scrollActiveIndexPrev = scrollActiveIndex;

  setProgressLines(scrollActiveIndex);
});

const imgClassName = '.p-slider .image';

// const

const imgSources = [...document.querySelectorAll(imgClassName)].map((el) => el.cloneNode(true));

// @ts-expect-error global iife import
const lightbox = new FsLightbox();
const lightboxNextClass = 'lightbox-next-btn';
const lightboxPrevClass = 'lightbox-prev-btn';

// lightbox.props.slideButtons.next.width = '60px';
lightbox.props.sources = imgSources;
lightbox.props.onOpen = function () {
  const nextArrButton = document
    .querySelector('.fslightbox-slide-btn-container-next')
    ?.querySelector('.fslightbox-slide-btn') as HtmlElWithNull;
  const prevArrButton = document
    .querySelector('.fslightbox-slide-btn-container-previous')
    ?.querySelector('.fslightbox-slide-btn') as HtmlElWithNull;

  [
    nextArrButton,
    prevArrButton,
    ...document.querySelectorAll('.fslightbox-toolbar-button'),
  ].forEach((el) => {
    el?.addEventListener('mouseenter', () => {
      document.querySelector('.cursor_dot')?.classList.add('on-hover');
    });
    el?.addEventListener('mouseleave', () => {
      document.querySelector('.cursor_dot')?.classList.remove('on-hover');
    });
  });

  if (!nextArrButton?.classList.contains(lightboxNextClass)) {
    nextArrButton?.classList.add(lightboxNextClass);
    prevArrButton?.classList.add(lightboxPrevClass);
  }
};

// console.log(lightbox.props);

// @ts-expect-error unable to ignore the unused params
flkty.on('staticClick', function (event, pointer, cellElement, cellIndex: number | undefined) {
  if (cellIndex === undefined) return;
  lightbox.open(cellIndex);
});
