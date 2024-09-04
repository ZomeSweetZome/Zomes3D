/* eslint-disable no-case-declarations */
/* global pdfMake */

'use strict';

import { getData } from './ui-controller.js';

function getBase64Image(url) {
  const img = new Image();
  img.src = url;
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg").replace(/^data:image\/(jpeg|png);base64,/, "");
}

export function generatePDF(currentHouse, data, language, userName = '', userEmail = '', userPhone = '', opt = 'open') {
  console.log("🚀 ~ generatePDF ~ language:", language);
 
  const colorBackground = '#ffffff';
  const colorBlackText = '#101011';
  const colorBlackLine = '#000000';

  const imageUrls = [
    './src/pdf/images/logo_zomes.png',
    './src/pdf/images/icon_website.png',
    './src/pdf/images/icon_phone.png',
    './src/pdf/images/icon_email.png',
  ];

  switch (currentHouse) {
    case '0':
      imageUrls.push('./src/pdf/images/scheme_pod.jpg');
      console.log("🚀 ~ generatePDF ~ scheme_pod.jpg");
      break;
      case '1':
        imageUrls.push('./src/pdf/images/scheme_office.jpg');
        console.log("🚀 ~ generatePDF ~ scheme_office.jpg");
        break;
        case '2':
          imageUrls.push('./src/pdf/images/scheme_studio.jpg');
          console.log("🚀 ~ generatePDF ~ scheme_studio.jpg");
      break;
    default:
      break;
  }

  pdfMake.fonts = {
    SourceSansPro: {
      normal: 'SourceSansPro-Regular.ttf',
      bold: 'SourceSansPro-Bold.ttf',
      italics: 'SourceSansPro-Italic.ttf',
      bolditalics: 'SourceSansPro-BoldItalic.ttf'
    },
  };

  // let outsideOptions = outsideOptionsData.reduce((result, option, index) => {
  //   if (option.displayNone) {
  //     return result;
  //   }

  //   let price;

  //   if (option.elementType !== 'checkbox') {
  //     price = (option.elementPrice[option.currentValue]) 
  //       ? amountWithCurrencySign(currency, option.elementPrice[option.currentValue]) 
  //       : '-';
  //   }

  //   if (option.elementType === 'checkbox') {
  //     price = (option.currentValue === 1) 
  //       ? amountWithCurrencySign(currency, option.elementPrice[0]) 
  //       : '-';
  //   }

  //   let optionTitle;
  //   let optionValue;

  //   if (option.title) {
  //     optionTitle = getData(scandiData, option.title, language);
  //     optionValue = (option.elementText.length > 0) ? getData(scandiData, option.elementText[option.currentValue], language) : getData(scandiData, option.pdfText[option.currentValue], language)
  //   } else if (option.pdfTitle) {
  //     optionTitle = getData(scandiData, option.pdfTitle, language);
  //     optionValue = (option.pdfText) ? getData(scandiData, option.pdfText[option.currentValue], language) : '';
  //   } else {
  //     optionTitle = '';
  //     optionValue = '';
  //   }

  //   result.push([
  //     {
  //       text: optionTitle,
  //       style: 'tableType',
  //     },
  //     {
  //       text: optionValue,
  //       style: 'tableOption',
  //     },
  //     {
  //       text: price,
  //         style: 'tableOption',
  //       alignment: 'center',
  //     },
  //   ]);
  
  //   return result;
  // }, []);

  // let insideOptions = insideOptionsData.reduce((result, option, index) => {
  //   if (option.displayNone) {
  //     return result;
  //   }

  //   let price;

  //   if (option.elementType !== 'checkbox') {
  //     price = (option.elementPrice[option.currentValue]) 
  //       ? amountWithCurrencySign(currency, option.elementPrice[option.currentValue]) 
  //       : '-';
  //   }

  //   if (option.elementType === 'checkbox') {
  //     price = (option.currentValue === 1) 
  //       ? amountWithCurrencySign(currency, option.elementPrice[0]) 
  //       : '-';
  //   }

  //   let optionTitle;
  //   let optionValue;

  //   if (option.title) {
  //     optionTitle = getData(scandiData, option.title, language);
  //     optionValue = (option.elementText.length > 0) ? getData(scandiData, option.elementText[option.currentValue], language) : getData(scandiData, option.pdfText[option.currentValue], language)
  //   } else if (option.pdfTitle) {
  //     optionTitle = getData(scandiData, option.pdfTitle, language);
  //     optionValue = (option.pdfText) ? getData(scandiData, option.pdfText[option.currentValue], language) : '';
  //   } else {
  //     optionTitle = '';
  //     optionValue = '';
  //   }

  //   const wardrobeHall = 'S4plus_Wardrobe_hall';
  //   const wardrobeBedroom = 'S4plus_Wardrobe_bedroom';
  //   const kitchen = 'S4plus_Kitchen_title';
  //   const bathroom = 'Bathroom_option_title';

  //   if (option.pdfTitle === wardrobeHall || option.pdfTitle === wardrobeBedroom) {
  //     const ind = +option.cardId + 1;
  //     optionValue = getData(scandiData, UI_LIST[ind].pdfText[UI_LIST[ind].currentValue], language);
  //     price = amountWithCurrencySign(currency, option.elementPrice[0]);
  //   }
    
  //   if (option.pdfTitle === kitchen) {
  //     const ind = +option.cardId + 1;
  //     const value1 = getData(scandiData, UI_LIST[ind].pdfText[UI_LIST[ind].currentValue], language);
  //     const value2 = getData(scandiData, UI_LIST[ind + 1 + UI_LIST[ind].currentValue].pdfText[UI_LIST[ind + 1 + UI_LIST[ind].currentValue].currentValue], language);
  //     optionValue = value1 + ' (' + value2 + ')';
  //     price = amountWithCurrencySign(currency, UI_LIST[ind].elementPrice[UI_LIST[ind].currentValue]);
  //   }

  //   if (option.pdfTitle === bathroom) {
  //     const ind = +option.cardId + 1;
  //     const value1 = getData(scandiData, UI_LIST[ind].pdfText[UI_LIST[ind].currentValue], language);
  //     const value2 = getData(scandiData, UI_LIST[ind].elementDescription[UI_LIST[ind].currentValue], language);
  //     optionValue = value1 + ': ' + value2;
  //     price = amountWithCurrencySign(currency, UI_LIST[ind].elementPrice[UI_LIST[ind].currentValue]);
  //   }

  //   result.push([
  //     {
  //       text: optionTitle,
  //       style: 'tableType',
  //     },
  //     {
  //       text: optionValue,
  //       style: 'tableOption',
  //     },
  //     {
  //       text: price,
  //       style: 'tableOption',
  //     alignment: 'center',
  //     },
  //   ]);
  
  //   return result;
  // }, []);

  //! TODO two generated model shots
  //! imageUrls.push(`shot1`);
  //! imageUrls.push(`shot2`);
  
  const promises = imageUrls.map(async imageUrl => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  });

  Promise.all(promises).then(([
    logoImage,
    websiteIconImage,
    phoneIconImage,
    emailIconImage,
    schemeImage,
    // shotImage1,
    // shotImage2,
  ]) => { 
    const schemeWidth = 550; 
    const schemePosX = 20;
    const schemePosY = 100;
    const shot1Width = 200;
    const shot1PosX = 20;
    const shot1PosY = 400;
    const shot2Width = 200;
    const shot2PosX = 300;
    const shot2PosY = 400;

    const imagesStack = [
      { image: schemeImage, width: schemeWidth, absolutePosition: { x: schemePosX, y: schemePosY } },
      // { image: shotImage1, width: shot1Width, absolutePosition: { x: shot1PosX, y: shot1PosY } },
      // { image: shotImage2, width: shot2Width, absolutePosition: { x: shot2PosX, y: shot2PosY } },
    ];

    const uiPdfWeb = getData(data, "ui_pdf_web", language);
    const uiPdfPhone = getData(data, "ui_pdf_phone", language);
    const uiPdfEmail = getData(data, "ui_pdf_email", language);
    const uiPdfPersonalDetails = getData(data, "ui_pdf_personal_details", language);
    const uiPdfYourConfiguration = getData(data, "ui_pdf_your_configuration", language);

    const headerContent = function() {
      return [
        {
          margin: [0, 0, 0, 51],
          table: {
            widths: ['30%', "*", 14,'auto', 14,'auto', 14,'auto', 26],
            body: [
              [
                { image: logoImage, width: 90, height: 25, margin: [26, 13, 0, 13] },
                { text: "" },
                { image: websiteIconImage, width: 11, height: 11, margin: [0, 20, 0, 20], alignment: "right"},
                { text: uiPdfWeb, style: 'contacts', color: colorBlackText, margin: [0, 20, 0, 0], alignment: "left"},
                { image: phoneIconImage, width: 11, height: 11, margin: [0, 20, 0, 20], alignment: "right" },
                { text: '+' + uiPdfPhone, style: 'contacts', color: colorBlackText, margin: [0, 20, 0, 0], alignment: "left"},
                { image: emailIconImage, width: 11, height: 11, margin: [0, 20, 0, 20], alignment: "right" },
                { text: uiPdfEmail, style: 'contacts', color: colorBlackText, margin: [0, 20, 0, 0], alignment: "left"},
                { text: "" },
              ],
            ]
          },
          layout: {
            paddingLeft: function(i, node) { return 0; },
            paddingRight: function(i, node) { return 0; },
            paddingTop: function(i, node) { return 0; },
            paddingBottom: function(i, node) { return 0; },
            hLineWidth: function (i, node) { return 2 },
            vLineWidth: function (i, node) { return 2 },
            // hLineColor: function (i, node) { return colorBlackLine; },
            // vLineColor: function (i, node) { return colorBlackLine; },
          },
          // fillColor: colorBackground,
        }
      ]
    };

    const pdfContent = [
      {
        stack: imagesStack,
      },
      { text: uiPdfPersonalDetails, 
        style: 'subtitle',
        margin: [10, 5, 0, 12]
      },
      //! TODO below
      { text: 'Name Surname',
        style: 'title',
        margin: [10, 20, 0, 1],
      },
      { text: 'Address',
        style: 'title',
        margin: [10, 20, 0, 1],
      },
      { text: 'zipcode City',
        style: 'title',
        margin: [10, 20, 0, 1],
      },
      { text: 'Country',
        style: 'title',
        margin: [10, 20, 0, 1],
      },
      { text: 'phone',
        style: 'title',
        margin: [10, 20, 0, 1],
      },
      { text: 'email',
        style: 'title',
        margin: [10, 20, 0, 1],
      },

      
      // ******************    PAGE 2    ***********************

      { text: uiPdfYourConfiguration, 
        style: 'title',
        margin: [10, 5, 0, 4],
        pageBreak: "before"
      },

      // { stack: 
      //   [
      //     { table: { 
      //       widths: ['70%', '30%'],
      //       body: [
      //         // [
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_title", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_options", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_price", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     alignment: 'center',
      //         //     color: colorWhite,
      //         //   },
      //         // ],

      //         //! ...configuredItems,
      //       ],
      //       },
      //       //! layout: {
      //       //   defaultBorder: true,
      //       //   hLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
      //       //   },
      //       //   vLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
      //       //   },
      //       //   hLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   vLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   paddingTop: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
			// 	    //   paddingBottom: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
      //       // }
      //     },
      //   ],
      //   margin: [10, 0, 10, 0]
      // },

      // { text: getData(data, "ui_summary_shipping_rates_title", language), 
      //   style: 'title',
      //   margin: [10, 15, 0, 4]
      // },

      // { text: getData(data, "ui_summary_shipping_rates_america", language), 
      //   style: 'textBold',
      //   margin: [10, 15, 0, 4]
      // },

      // { stack: 
      //   [
      //     { table: { 
      //       widths: ['70%', '30%'],
      //       body: [
      //         // [
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_title", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_options", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_price", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     alignment: 'center',
      //         //     color: colorWhite,
      //         //   },
      //         // ],

      //         //! ...shippingRatesAmericaItems,
      //       ],
      //       },
      //       //! layout: {
      //       //   defaultBorder: true,
      //       //   hLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
      //       //   },
      //       //   vLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
      //       //   },
      //       //   hLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   vLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   paddingTop: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
			// 	    //   paddingBottom: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
      //       // }
      //     },
      //   ],
      //   margin: [10, 0, 10, 0]
      // },

      // { text: getData(data, "ui_summary_shipping_rates_america", language), 
      //   style: 'textBold',
      //   margin: [10, 15, 0, 4]
      // },

      // { stack: 
      //   [
      //     { table: { 
      //       widths: ['70%', '30%'],
      //       body: [
      //         // [
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_title", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_options", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     color: colorWhite,
      //         //   },
      //         //   {
      //         //     fillColor: colorDark,
      //         //     text: getData(scandiData, "Pdf_table_price", language).toUpperCase(),
      //         //     style: 'tableTitle',
      //         //     alignment: 'center',
      //         //     color: colorWhite,
      //         //   },
      //         // ],

      //         //! ...shippingRatesEuropeItems,
      //       ],
      //       },
      //       //! layout: {
      //       //   defaultBorder: true,
      //       //   hLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
      //       //   },
      //       //   vLineWidth: function (i, node) {
      //       //     return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
      //       //   },
      //       //   hLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   vLineColor: function (i, node) {
      //       //     return colorGrey;
      //       //   },
      //       //   paddingTop: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
			// 	    //   paddingBottom: function(i, node) { 
      //       //     return (i === 0 || i === node.table.body.length) ? 4 : 2; 
      //       //   },
      //       // }
      //     },
      //   ],
      //   margin: [10, 0, 10, 0]
      // },
    ];

    const pdfDefinition = {
      pageMargins: [20, 66, 20, 0],
      header: headerContent,
      content: pdfContent,
      styles: {
        contacts: { fontSize: 10, bold: false, font: 'SourceSansPro' },
        title: { fontSize: 20, bold: true, font: 'SourceSansPro' },
        tableTitle: { fontSize: 14, bold: true, font: 'SourceSansPro' },
        tableType: { fontSize: 14, bold: false, font: 'SourceSansPro' },
        tableOption: { fontSize: 14, bold: false, font: 'SourceSansPro' },
        cost: { fontSize: 14, bold: false, font: 'SourceSansPro' },
        amount: { fontSize: 14, bold: true, font: 'SourceSansPro' },
      },
      defaultStyle: { font: 'SourceSansPro' },
    };
    
    switch (opt) {
      case 'open':
        pdfMake.createPdf(pdfDefinition).open();
        break;
      
      case 'download':
        pdfMake.createPdf(pdfDefinition).download("Zome_configuration.pdf");
        break;
      
      default:
        break;
    }
  })
  .catch(error => {
    console.error("Image loading error:", error);
  });
}

