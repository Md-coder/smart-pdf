import type { IBlock, IPage } from '../types/index.js';

export const Paginate = (blocks: IBlock[], pageHeight: number): IPage[] => {
  const pages: IPage[] = [];
  let currentPage: IPage = { blocks: [], heightUsed: 0 };

  for (const block of blocks) {
    const blockHeight = block.rect.height;

    if (blockHeight + currentPage.heightUsed > pageHeight) {
      // move to the next page
      switch (block.type) {
        case 'text':
          if (currentPage.blocks.length > 0) {
            pages.push(currentPage);
          }

          currentPage = { blocks: [], heightUsed: 0 };
          currentPage.blocks.push(block);
          currentPage.heightUsed += block.rect.height;
          break;
        case 'table':
          if (currentPage.blocks.length > 0) {
            pages.push(currentPage);
          }

          currentPage = { blocks: [], heightUsed: 0 };
          currentPage.blocks.push(block);
          currentPage.heightUsed += block.rect.height;
          break;

        case 'image':
          if (currentPage.blocks.length > 0) {
            pages.push(currentPage);
          }

          currentPage = { blocks: [], heightUsed: 0 };
          currentPage.blocks.push(block);
          currentPage.heightUsed += block.rect.height;
          break;

        case 'chart':
          if (currentPage.blocks.length > 0) {
            pages.push(currentPage);
          }

          currentPage = { blocks: [], heightUsed: 0 };
          currentPage.blocks.push(block);
          currentPage.heightUsed += block.rect.height;
          break;
        default:
          break;
      }
    } else {
      currentPage.blocks.push(block);
      currentPage.heightUsed += block.rect.height;
    }
  }

  if (currentPage.blocks.length > 0) {
    pages.push(currentPage);
  }

  console.log('pages length', pages.length);
  console.log('pages', pages);
  return pages;
};
