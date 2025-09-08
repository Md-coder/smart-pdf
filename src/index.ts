interface FileOptions {
  fileName?: string;
}

export const generatePdf = async (
  element: HTMLElement,
  fileOptions: FileOptions = {},
): Promise<void> => {
  console.log('generatePdf', element, fileOptions);
};
