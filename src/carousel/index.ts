import 'flickity';
import './style.css';

import type { HtmlElWithNull } from 'src/types/common';
import { scaleValue } from 'src/utils';

// Variables
const parallaxPercentage = 49;

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

// @ts-expect-error N/A type declarations
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
    const elClientRect = el?.getBoundingClientRect();

    if (!elClientRect) return;

    const parentClientRect = document.querySelector(mainCarouselClass)?.getBoundingClientRect();

    if (!parentClientRect) return;

    const elementOffset = elClientRect.left + elClientRect.width;
    const parentWidth = parentClientRect.width + elClientRect.width;

    const myProgress = elementOffset / parentWidth;
    let slideProgress = parallaxPercentage * myProgress;

    if (slideProgress > parallaxPercentage) {
      slideProgress = parallaxPercentage;
    } else if (slideProgress < 0) {
      slideProgress = 0;
    }

    const imageEl = el?.querySelector('.image') as HtmlElWithNull;

    if (!imageEl) return;

    imageEl.style.transform = `translateX(-${slideProgress}%)`;
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
