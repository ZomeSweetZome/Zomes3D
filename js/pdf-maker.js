/* eslint-disable no-case-declarations */
/* global pdfMake */

'use strict';

import { getData } from './ui-controller.js';

export function generatePDF(
  currentHouse, data, language, imageSources, configurationData, timelineData, 
  userName = '',
  email = '',
  zipcode = '',
  opt = 'all',
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
    './src/pdf/images/timeline_point.png',
  ];

  currentHouse = currentHouse + '';

  switch (currentHouse) {
    case '0':
      imageUrls.push('./src/pdf/images/sch_pod.png');
      imageUrls.push('./src/pdf/images/dimensions_pod.png');
      break;
    case '1':
      imageUrls.push('./src/pdf/images/sch_office.png');
      imageUrls.push('./src/pdf/images/dimensions_office.png');
      break;
    case '2':
      imageUrls.push('./src/pdf/images/sch_studio.png');
      imageUrls.push('./src/pdf/images/dimensions_studio.png');
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
    timelinePointImage,
    schemeImage,
    dimensionsImage,
  ]) => {

    const picsPoses = [
      { w: 218, x: 10, y: -34 },
      { w: 218, x: 220, y: -34 },
      { w: 218, x: 10, y: 115 },
      { w: 218, x: 220, y: 115 },
      { w: 230, x: 0, y: 300 },
      { w: 220, x: 220, y: 270 },
      { w: contentWidth, x: 0, y: 0 },
    ];

    const uiPdfWeb = getData(data, "ui_pdf_web", language);
    const uiPdfPhone = getData(data, "ui_pdf_phone", language);
    const uiPdfEmail = getData(data, "ui_pdf_email", language);
    const uiPdfPersonalDetails = getData(data, "ui_pdf_personal_details", language);
    const uiPdfYourConfiguration = getData(data, "ui_pdf_your_configuration", language);
    const uiPdfTimeline = getData(data, "ui_timeline_title", language);

    const headerContent = {
      columns: [
        { image: logoImage, width: 60, margin: [30, 30, 0, 0] },
        { text: '', width: '*', margin: [0, 30, 0, 0] },
        { image: phoneIconImage, width: 14, height: 14,  margin: [0, 43, 0, 0] },
        { text: uiPdfPhone, width: 'auto', fontSize: 10, margin: [6, 43, 16, 0] },
        { image: websiteIconImage, width: 14, height: 14,  margin: [0, 43, 0, 0] },
        { text: uiPdfWeb, width: 'auto', fontSize: 10, margin: [6, 43, 16, 0] },
        { image: emailIconImage, width: 14, height: 14,  margin: [0, 43, 0, 0] },
        { text: uiPdfEmail, link: `mailto:${uiPdfEmail}`, width: 'auto', fontSize: 10, margin: [6, 43, 30, 0] }
      ]
    };

    const timelineOffset = 35;
    const timelinePointDiameter = 12;
    const timelineColumnWidth = 100;
    const timelineMarginSmall = 4;
    const timelineMarginLarge = 20;
    let lineY2 = 375;

    console.log("🚀 ~ language:", language);

    switch (language) {
      case 'EN':
        lineY2 = 375;
        break;
      case 'FR':
        lineY2 = 432;
        break;
      case 'ES':
        lineY2 = 415;
        break;
      default:
        lineY2 = 375;
        break;
    }

    const pdfContent = [
      // ******************    PAGE 1    ***********************
      { image: imageSources[0], width: picsPoses[0].w, relativePosition: { x: picsPoses[0].x, y: picsPoses[0].y } },
      { image: imageSources[1], width: picsPoses[1].w, relativePosition: { x: picsPoses[1].x, y: picsPoses[1].y } },
      { image: imageSources[2], width: picsPoses[2].w, relativePosition: { x: picsPoses[2].x, y: picsPoses[2].y } },
      { image: imageSources[3], width: picsPoses[3].w, relativePosition: { x: picsPoses[3].x, y: picsPoses[3].y } },
      { image: schemeImage,     width: picsPoses[4].w, relativePosition: { x: picsPoses[4].x, y: picsPoses[4].y } },
      { image: imageSources[4], width: picsPoses[5].w, relativePosition: { x: picsPoses[5].x, y: picsPoses[5].y } },
      { image: dimensionsImage, width: picsPoses[6].w, relativePosition: { x: picsPoses[6].x, y: picsPoses[6].y } },
      
      {
        text: uiPdfPersonalDetails,
        style: 'subtitle',
        margin: [0, picsPoses[5].x +picsPoses[5].w + 90, 0, 0],
      },
      {
        canvas: [ { type: 'line', x1: 0, y1: 0, x2: contentWidth, y2: 0, lineWidth: 0.5 }],
        margin: [0, 6, 0, 6],
      },
      { text: userName, style: 'tableText', },
      { text: email, style: 'tableText', },
      { text: zipcode, style: 'tableText', },

      // ******************    PAGE 2    ***********************

      {
        text: uiPdfYourConfiguration,
        style: 'title',
        margin: [0, 0, 0, 20],
        pageBreak: "before"
      },

      ...configurationData,

      { columns: [
        { text: timelineData.details__tax_text, width: '100%', style: 'tableTitle', margin: [0, 6, 0, 0], alignment: 'right', },
      ]},

      // ******************    PAGE 3    ***********************

      {
        text: uiPdfTimeline,
        style: 'title',
        margin: [0, 0, 0, 20],
        pageBreak: "before"
      },

      { canvas: [ { type: 'line', 
        x1: 30 + timelineColumnWidth + timelineOffset + timelinePointDiameter / 2, 
        y1: 140, 
        x2: 30 + timelineColumnWidth + timelineOffset + timelinePointDiameter / 2, 
        y2: lineY2, 
        lineWidth: 0.5 }],
        absolutePosition: { x: 0, y: 0 },
      },

      { columns: [
        { text: timelineData.today_title, style: 'timelineTitle', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { image: timelinePointImage, width: timelinePointDiameter, height: timelinePointDiameter, margin: [0, 2, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.today_subtitle, style: 'timelineTitle', margin: [0, 0, 0, timelineMarginSmall], },
      ]},
      { columns: [
        { text: '', style: 'timelineText', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: '', style: 'timelineText', width: timelinePointDiameter, height: timelinePointDiameter,  margin: [0, 0, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.today_text, style: 'timelineText', margin: [0, 0, 0, timelineMarginLarge], },
      ]},

      { columns: [
        { text: timelineData.prepayment_title, style: 'timelineTitle', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { image: timelinePointImage, width: timelinePointDiameter, height: timelinePointDiameter, margin: [0, 2, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.prepayment_subtitle, style: 'timelineTitle', margin: [0, 0, 0, timelineMarginSmall], },
      ]},
      { columns: [
        { text: '', style: 'timelineText', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: '', style: 'timelineText', width: timelinePointDiameter, height: timelinePointDiameter,  margin: [0, 0, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.prepayment_text, style: 'timelineText', margin: [0, 0, 0, timelineMarginLarge], },
      ]},

      { columns: [
        { text: timelineData.ship_day_title, style: 'timelineTitle', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { image: timelinePointImage, width: timelinePointDiameter, height: timelinePointDiameter, margin: [0, 2, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.ship_day_subtitle, style: 'timelineTitle', margin: [0, 0, 0, timelineMarginSmall], },
      ]},
      { columns: [
        { text: '', style: 'timelineText', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: '', style: 'timelineText', width: timelinePointDiameter, height: timelinePointDiameter,  margin: [0, 0, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.ship_day_text, style: 'timelineText', margin: [0, 0, 0, timelineMarginLarge], },
      ]},

      { columns: [
        { text: timelineData.delivery_title, style: 'timelineTitle', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { image: timelinePointImage, width: timelinePointDiameter, height: timelinePointDiameter, margin: [0, 2, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.delivery_subtitle, style: 'timelineTitle', margin: [0, 0, 0, timelineMarginSmall], },
      ]},
      { columns: [
        { text: '', style: 'timelineText', width:  timelineColumnWidth, margin: [0, 0, 0, 0], },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: '', style: 'timelineText', width: timelinePointDiameter, height: timelinePointDiameter,  margin: [0, 0, 0, 0] },
        { text: '', width: timelineOffset, margin: [0, 0, 0, 0] },
        { text: timelineData.delivery_text, style: 'timelineText', margin: [0, 0, 0, 0], },
      ]},
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
        timelineTitle: { fontSize: 14, bold: true, font: 'SourceSansPro' },
        timelineText: { fontSize: 14, bold: false, font: 'SourceSansPro', color: '#7D7D7D' },
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

      case 'all':
        pdfMake.createPdf(pdfDefinition).open();
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
