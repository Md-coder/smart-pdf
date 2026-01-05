import { PAGE_SIZES } from './constants/index.js';
import type { IRendererOptions } from './types/index.js';
import { ExtractBlocks } from './utils/domWalker.js';
import { Paginate } from './utils/paginator.js';
import { Renderer } from './utils/renderer.js';

export const generatePdf = async (
  element: HTMLElement,
  fileOptions: IRendererOptions = {},
): Promise<void> => {
  if (!element) {
    console.error('Element error', 'Invalid or missing element');
    return;
  }

  const blocks = ExtractBlocks(element);

  const pageHeight = !!fileOptions.margin
    ? PAGE_SIZES.A4.height - fileOptions.margin * 2
    : PAGE_SIZES.A4.height - 10 * 2;

  const pages = Paginate(blocks, pageHeight);

  const render = new Renderer(pages, fileOptions);

  await render.download(fileOptions.fileName);

  console.log('generatePdf', element, fileOptions);
};
