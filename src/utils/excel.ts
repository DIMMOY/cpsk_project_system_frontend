import * as XLSX from 'xlsx';

export const exportXLSX = (
  heading: Array<string>, 
  datasheet: Array<any>, 
  fileName: string, 
  wrap?: Array<number> | null,
  title?: Array<any>,
) => {
  let excel = [heading, ...datasheet];

  if (title) {
    excel = [...title, ...excel]
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excel);
  XLSX.utils.book_append_sheet(wb, ws, fileName);

  if (wrap && Object.keys(ws).length > 0) {
    const range = XLSX.utils.decode_range(ws['!ref'] as string);
    wrap.forEach((col: number) => {
      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 }); // get reference cell to copy formatting
        const cellStyle = Object.assign({}, ws[cellRef].s); // create a copy of the reference cell's style
        cellStyle.wrapText = true; // set the wrapText property to true
        if (!ws[cell]) ws[cell] = {};
        ws[cell].s = cellStyle; // apply the updated style to the cell
      }
    });
  }
  

  XLSX.writeFile(wb, fileName.concat('.xlsx'))
}
