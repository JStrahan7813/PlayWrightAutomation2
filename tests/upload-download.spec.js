/* This file creates functions to read and write excel files
Then tests it by going to an online spreadsheet/table
downloads that file, reads it, replaces the price of mangoes from 299 to 350 and 
asserts that has been done

**/

const ExcelJs =require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcelTest(searchText,replaceText,change,filePath)
{
    
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output= await readExcel(worksheet,searchText);

  const cell = worksheet.getCell(output.row,output.column+change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);

}


async function readExcel(worksheet,searchText)
{
    let output = {row:-1,column:-1};
    worksheet.eachRow((row,rowNumber) =>
    {
          row.eachCell((cell,colNumber) =>
          {
              if(cell.value === searchText)
              {
                  output.row=rowNumber;
                  output.column=colNumber;
              }
  
  
          }  )
    
    })
    return output;
}
//update Mango Price to 350. 
//check the sheet at below location in here mangoes will be priced at 350 now
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/James Strahan/downloads/download.xlsx");
test('Upload download excel validation',async ({page})=>
{
  const textSearch = 'Mango';
  const updateValue = '350';
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  await page.pause();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button',{name:'Download'}).click();
  await downloadPromise;
  writeExcelTest(textSearch,updateValue,{rowChange:0,colChange:2},"/Users/James Strahan/downloads/download.xlsx");
  await page.pause();
  await page.locator("#fileinput").click();
  await page.locator("#fileinput").setInputFiles("/Users/James Strahan/downloads/download.xlsx");
  const textlocator = page.getByText(textSearch);
  const desiredRow = await page.getByRole('row').filter({has :textlocator });
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);
  




















})







