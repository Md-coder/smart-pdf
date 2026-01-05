export interface IBlock {
  type: 'text' | 'image' | 'table' | 'chart';
  node: HTMLElement;
  rect: DOMRect; //this gives us information about node details in terms of heights widths and positions
}

export interface IPage {
  blocks: IBlock[];
  heightUsed: number;
}

export interface IRendererOptions {
  pageWidth?: number; // in mm
  pageHeight?: number;
  margin?: number; // in px
  scale?: number;
  fileName?: string;
}
