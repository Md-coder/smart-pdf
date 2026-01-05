import type { IBlock } from '../types/index.js';

export const ExtractBlocks = (root: HTMLElement): IBlock[] => {
  const blocks: IBlock[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  let node = walker.nextNode() as HTMLElement | null;

  while (node) {
    const rect = node.getBoundingClientRect();

    if (rect.height === 0 || rect.width === 0) {
      node = walker.nextNode() as HTMLElement | null;
      continue;
    }

    console.log('tagName', node.tagName);
    if (
      node.tagName === 'P' ||
      node.tagName === 'DIV' ||
      node.tagName === 'SPAN' ||
      /^H[1-6]$/.test(node.tagName)
    ) {
      blocks.push({ type: 'text', node: node, rect });
    } else if (node.tagName === 'IMG') {
      blocks.push({ type: 'image', node, rect });
    } else if (node.tagName === 'TABLE') {
      blocks.push({ type: 'table', node, rect });
    } else if (node.tagName === 'CANVAS' || node.getAttribute('role') === 'chart') {
      blocks.push({ type: 'chart', node, rect });
    }

    node = walker.nextNode() as HTMLElement | null;
  }

  return blocks;
};
