const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const { format } = require('winston');

async function generatePDF(bestelling) {
    

    const pdfName = 'Factuur' +bestelling.ORDERID;
    const orderId = bestelling.ORDERID;
    const orderStatus = bestelling.ORDERSTATUS;
    const bedrag = bestelling.BEDRAG;
    const datum = bestelling.BETAALDAG;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <title>Factuur Delaware</title>
    
</head>
<body>
    <div>
        <div>
            <div>
                <img src="https://www.delaware.pro/r-images/delaware-logo/delaware-logo.svg?mode=autocrop&w=150&h=50&attachmenthistoryguid=3a1e5da6-dc5c-4765-9f9e-148513b69803&v=&c=ebe46d380acb8e8757d31b1dea70de49b44801a896435d25c337e5d06cd5dc90" alt="Company Logo" width="150">
                <h1>bedrijfsnaam</h1>
                <p>addres</p>
                <p>Email</p>
                <p>nummer</p>
            </div>
            <div>
                <h2>factuur</h2>
                <p>factuur nummer</p>
                <p>Datum3</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Item 1</td>
                    <td>2</td>
                    <td>$3</td>
                    <td>$4</td>
                </tr>
                
            </tbody>
        </table>

        <div>
            <p>Totaal: $4.00</p>
        </div>

    </div>
</body>
</html>
    `;

  

    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlContent);
        await page.emulateMediaType('screen');

        await page.pdf({
            path: 'C:/Users/Public/Downloads/'+pdfName+'.pdf', 
            format: 'A4',
            printBackground: true,

        });

        console.log("done");
    }
    catch (e) {
        console.log("our error: " +e);
    }
 
};

module.exports = {
    generatePDF,
};