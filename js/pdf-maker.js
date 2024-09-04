/* eslint-disable no-case-declarations */
/* global pdfMake */

'use strict';

import { getData } from './ui-controller.js';

export function generatePDF(
  currentHouse, data, language, imageSources,
  userName = 'Name Surname',
  address = 'Address',
  zipcode = 'Zipcode',
  city = 'City',
  country = 'Country',
  phone = 'Phone',
  email = 'Email',
  opt = 'open'
) {
  const colorTextBlack = '#101011';
  const colorLineBlack = '#000000';
  const colorBackground = '#ffffff';

  const mainMargins = [30, 90, 30, 30];
  const contentWidth = 595 - mainMargins[0] - mainMargins[2];

  const imageUrls = [
    './src/pdf/images/logo_zomes.png',
    './src/pdf/images/icon_website.png',
    './src/pdf/images/icon_phone.png',
    './src/pdf/images/icon_email.png',
  ];

  switch (currentHouse) {
    case '0':
      imageUrls.push('./src/pdf/images/scheme_pod.jpg');
      break;
    case '1':
      imageUrls.push('./src/pdf/images/scheme_office.jpg');
      break;
    case '2':
      imageUrls.push('./src/pdf/images/scheme_studio.jpg');
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
  //       style: 'tableText',
  //     },
  //     {
  //       text: optionValue,
  //       style: 'tableText',
  //     },
  //     {
  //       text: price,
  //         style: 'tableText',
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
  //       style: 'tableText',
  //     },
  //     {
  //       text: optionValue,
  //       style: 'tableText',
  //     },
  //     {
  //       text: price,
  //       style: 'tableText',
  //     alignment: 'center',
  //     },
  //   ]);

  //   return result;
  // }, []);

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
    // shotImage3,
  ]) => {
    const schemeWidth = contentWidth;
    const schemePosX = 0;
    const schemePosY = 0;

    const shotsPoses = [
      { w: 178, x: 0, y: 0 },
      { w: 178, x: 178, y: 0 },
      { w: 178, x: 356, y: 0 },
    ];

    const uiPdfWeb = getData(data, "ui_pdf_web", language);
    const uiPdfPhone = getData(data, "ui_pdf_phone", language);
    const uiPdfEmail = getData(data, "ui_pdf_email", language);
    const uiPdfPersonalDetails = getData(data, "ui_pdf_personal_details", language);
    const uiPdfYourConfiguration = getData(data, "ui_pdf_your_configuration", language);

    const headerContent = {
      columns: [
        { image: logoImage, width: 60, margin: [30, 30, 0, 0] },
        { text: '', width: '*', margin: [0, 30, 0, 0] },
        { image: phoneIconImage, width: 14, margin: [0, 43, 0, 0] },
        { text: uiPdfPhone, width: 'auto', fontSize: 10, margin: [6, 43, 16, 0] },
        
        { image: websiteIconImage, width: 14, margin: [0, 43, 0, 0] },
        { text: uiPdfWeb, width: 'auto', fontSize: 10, margin: [6, 43, 16, 0] },
        
        { image: emailIconImage, width: 14, margin: [0, 43, 0, 0] },
        { text: uiPdfEmail, link: `mailto:${uiPdfEmail}`, width: 'auto', fontSize: 10, margin: [6, 43, 30, 0] }
      ]
    };

    const pdfContent = [
      { image: schemeImage, width: schemeWidth, margin: [0, 0, 0, 20] },
      { image: imageSources[0], width: shotsPoses[0].w, relativePosition: { x: shotsPoses[0].x, y: shotsPoses[0].y } },
      { image: imageSources[1], width: shotsPoses[1].w, relativePosition: { x: shotsPoses[1].x, y: shotsPoses[1].y } },
      { image: imageSources[2], width: shotsPoses[2].w, relativePosition: { x: shotsPoses[2].x, y: shotsPoses[2].y } },

      {
        text: uiPdfPersonalDetails,
        style: 'subtitle',
        margin: [0, shotsPoses[2].w + 20, 0, 0],
      },

      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0, x2: contentWidth, y2: 0,
            lineWidth: 0.5
          }
        ],
        margin: [0, 6, 0, 6],
      },

      {
        text: userName,
        style: 'tableText',
      },
      {
        text: address,
        style: 'tableText',
      },
      {
        text: `${zipcode} ${city}`,
        style: 'tableText',
      },
      {
        text: country,
        style: 'tableText',
      },
      {
        text: phone,
        style: 'tableText',
      },
      {
        text: email,
        style: 'tableText',
      },

      // ******************    PAGE 2    ***********************

      {
        text: uiPdfYourConfiguration,
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
      pageMargins: mainMargins,
      header: headerContent,
      content: pdfContent,
      styles: {
        contacts: { fontSize: 10, bold: false, font: 'SourceSansPro' },
        subtitle: { fontSize: 14, bold: true, font: 'SourceSansPro' },
        title: { fontSize: 20, bold: true, font: 'SourceSansPro' },
        tableTitle: { fontSize: 14, bold: true, font: 'SourceSansPro' },
        tableText: { fontSize: 14, bold: false, font: 'SourceSansPro' },
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

