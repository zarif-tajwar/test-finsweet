import type { HtmlElWithNull } from 'src/types/common';

// @ts-expect-error No typescript declaration file
import { TypeShuffle } from './type-shuffle';

const clickClass = '.shuffle-click';
const hoverClass = '.shuffle-hover';
const scrollClass = '.shuffle-view';

const clickElements = [...document.querySelectorAll(clickClass)] as HtmlElWithNull[];
const hoverElements = [...document.querySelectorAll(hoverClass)] as HtmlElWithNull[];
const scrollClasses = [...document.querySelectorAll(scrollClass)] as HtmlElWithNull[];

const getTypeShuffleProperties = (el: HtmlElWithNull) => {
  const dataset = { ...el?.dataset };
  return {
    maxCellIters: Number(dataset.shuffleMaxIters),
    freq1: Number(dataset.shuffleFreq1),
    freq2: Number(dataset.shuffleFreq2),
  };
};

clickElements.forEach((el) => {
  if (!el) return;
  const tsClick = new TypeShuffle(el);
  const tsProps = getTypeShuffleProperties(el);
  el.addEventListener('click', () => {
    if (tsClick.isAnimating) return;
    tsClick.trigger('fx3', tsProps);
  });
});

hoverElements.forEach((el) => {
  if (!el) return;
  const tsHover = new TypeShuffle(el);
  const tsProps = getTypeShuffleProperties(el);
  el.addEventListener('mouseenter', () => {
    if (tsHover.isAnimating) return;
    tsHover.trigger('fx3', tsProps);
  });
});

scrollClasses.forEach((el) => {
  if (!el) return;
  const tsView = new TypeShuffle(el);
  const tsProps = getTypeShuffleProperties(el);
  const viewThreshold = Number(el.dataset.shuffleViewThreshold);

  tsView.clearCells();

  const viewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (tsView.isAnimating) return;
          tsView.trigger('fx3', tsProps);
          viewObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: Number.isNaN(viewThreshold) ? 1 : viewThreshold,
    }
  );

  viewObserver.observe(el);
});
