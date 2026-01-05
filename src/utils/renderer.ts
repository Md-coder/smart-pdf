import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { IRendererOptions, IPage, IBlock } from '../types/index.js';

export class Renderer {
  private pages: IPage[];
  private options: IRendererOptions;

  constructor(pages: IPage[], options?: IRendererOptions) {
    this.pages = pages;
    this.options = {
      pageWidth: options?.pageWidth ?? 210, // mm (A4)
      pageHeight: options?.pageHeight ?? 297, // mm (A4)
      margin: options?.margin ?? 10,
      scale: options?.scale ?? 2,
    };
  }

  cloneNode(block: IBlock) {
    // Deep clone the node (with all children)
    const clone = block.node.cloneNode(true) as HTMLElement;

    // Find all <canvas> elements in both source and clone
    const sourceCanvases = block.node.querySelectorAll('canvas');
    const clonedCanvases = clone.querySelectorAll('canvas');

    // Copy pixel content from each source canvas into its cloned version
    sourceCanvases.forEach((sourceCanvas, i) => {
      const clonedCanvas = clonedCanvases[i];
      if (clonedCanvas) {
        const dest = clonedCanvas as HTMLCanvasElement;
        const src = sourceCanvas as HTMLCanvasElement;

        dest.width = src.width;
        dest.height = src.height;
        const ctx = dest.getContext('2d');
        if (ctx) ctx.drawImage(src, 0, 0);
      }
    });

    return clone;
  }

  async render(): Promise<jsPDF> {
    const pdf = new jsPDF({
      unit: 'mm',
      format: [this.options.pageWidth!, this.options.pageHeight!],
    });

    const pxToMm = 0.2645833;
    const marginMm = this.options.margin! * pxToMm;

    for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
      const page = this.pages[pageIndex];

      if (!page) continue;

      // Create a temporary page container in memory
      const pageContainer = document.createElement('div');
      pageContainer.style.width = '100%';
      pageContainer.style.background = '#ffffff';
      pageContainer.style.position = 'relative';
      pageContainer.style.padding = `${this.options.margin}px`;

      // Append each block node to the page container
      for (const block of page.blocks) {
        pageContainer.appendChild(this.cloneNode(block));
      }

      //  attach page conatiner to a body
      document.body.appendChild(pageContainer);

      // Render that page as canvas
      // @ts-ignore
      const canvas = await html2canvas(pageContainer, {
        scale: this.options.scale,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const img = canvas.toDataURL('image/png');
      const imgWidth = this.options.pageWidth! - marginMm * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // clean up page container
      document.body.removeChild(pageContainer);

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(img, 'PNG', marginMm, marginMm, imgWidth, imgHeight);
    }

    return pdf;
  }

  async download(fileName: string = 'document.pdf') {
    const pdf = await this.render();
    pdf.save(fileName);
  }
}
