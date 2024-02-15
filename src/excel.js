const XLSX = require('xlsx-js-style');


// Function to append a new row
const appendRow = (filePath, newRow) => {
     // Attempt to read the existing workbook, create if not found
     let workbook;
     try {
          workbook = XLSX.readFile(filePath);
     } catch (error) {
          workbook = XLSX.utils.book_new();
     }

     // Work with the first sheet
     const sheetName = 'Transfer'; // workbook.SheetNames[0] || "Sheet1";
     let worksheet = workbook.Sheets[sheetName];
     if (!worksheet) {
          workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet([]);
          worksheet = workbook.Sheets[sheetName];
     }

     // Convert the worksheet to JSON to find the last non-empty row
     const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
     console.log('jsonSheet', jsonSheet);
     const lastNonEmptyRow = jsonSheet.length;

     // Append new row at the position right after the last non-empty row
     XLSX.utils.sheet_add_json(worksheet, [newRow], {
          skipHeader: true,
          origin: { r: lastNonEmptyRow, c: 0 }
     });


     // console.log(workbook);
     // Write back to the file
     XLSX.writeFile(workbook, filePath);
     console.log('Row appended successfully.');
     return true;
};

// Function to delete a row with a given date
const deleteRow = (filePath, {
     Tarih, CikisPB, GirisPB
}) => {
     const workbook = XLSX.readFile(filePath);
     const sheetName = 'Transfer'; // workbook.SheetNames[0];
     const worksheet = workbook.Sheets[sheetName];
     const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });
     // const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
     // Find and remove the row
     // console.log('jsonSheet2delete', jsonSheet);

     const rowIndex = jsonSheet.findIndex(row => row.Tarih === Tarih
          && row.CikisPB === CikisPB
          && row.GirisPB === GirisPB
          // && row.Tutar === `${Tutar}`
     );
     if (rowIndex > -1) {
          jsonSheet.splice(rowIndex, 1);
          const newWorksheet = XLSX.utils.json_to_sheet(jsonSheet);
          workbook.Sheets[sheetName] = newWorksheet;
          XLSX.writeFile(workbook, filePath);
          console.log('Row deleted successfully.');
          return true;
     }
     console.log('Date not found.');
     return false;
};

// Example Usage
// appendRow('cash.xlsx', { Tarih: new Date().toLocaleDateString(), CikisPB: 'USD',
// GirisPB: 'TL', Tutar: 4502});
// deleteRow('cash.xlsx', new Date().toLocaleDateString());

module.exports = { appendRow, deleteRow };
