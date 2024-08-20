'use strict';
/* global jQuery, $ */

import { DEFAULT_LANGUAGE, GUI_MODE_UI, IS_PRICE_SIMPLE } from './settings.js';

export let gui_mode = GUI_MODE_UI;
export let currentLanguage = DEFAULT_LANGUAGE;
export let uiMultiLanguages = [];

export async function createMenu(mainData) {
  return new Promise((resolve) => {
    jQuery(document).ready(function ($) {
      // Set language
      currentLanguage = $('.language-picker select').val() || DEFAULT_LANGUAGE;

      $('.language-picker select').on('change', function () {
        currentLanguage = $(this).val();
        updateUIlanguages(mainData);
      });

      $('.product_title.entry-title').html(`${getData(mainData, 'ui_product_title', currentLanguage)}`);
      $('.summary .product_description').html(`${getData(mainData, 'ui_product_descr', currentLanguage)}`);
      $('#button_ar_qr .tbl-window-btn-text').html(`${getData(mainData, 'ui_btn_ar', currentLanguage)}`);
      $('#nav-title-inside').html(`${getData(mainData, 'ui-nav-btn-inside', currentLanguage)}`);
      $('#nav-title-outside').html(`${getData(mainData, 'ui-nav-btn-outside', currentLanguage)}`);
      $('#ar_button_order__caption').html(`${getData(mainData, 'ui_btn_buy', currentLanguage)}`);
      $('.tbl-info-sharing-title').html(`${getData(mainData, 'ui_popup-title-share', currentLanguage)}`);
      $('#tbl-qr-title-ui').html(`${getData(mainData, 'ui_popup-title-qr', currentLanguage)}`);
      $('#tbl-qr-text-ui').html(`${getData(mainData, 'ui_popup-text-qr', currentLanguage)}`);

      uiMultiLanguages.push(
        { '.product_title.entry-title': 'ui_product_title' },
        { '.summary .product_description': 'ui_product_descr' },
        { '#button_ar_qr .tbl-window-btn-text': 'ui_btn_ar' },
        { '#nav-title-inside': 'ui-nav-btn-inside' },
        { '#nav-title-outside': 'ui-nav-btn-outside' },
        { '#ar_button_order__caption': 'ui_btn_buy' },
        { '.tbl-info-sharing-title': 'ui_popup-title-share' },
        { '#tbl-qr-title-ui': 'ui_popup-title-qr' },
        { '#tbl-qr-text-ui': 'ui_popup-text-qr' },
      );

      const speedUiAnim = 300;
      const groupsContainer = $('#ar_filter');
      const summaryList = $('.ar_summary .ar_summary_list');
      
      let dataGroup = '';

      for (let i = 1; i < mainData.length; i++) {
        let optionStyle = '';
        let optionTypeClass = 'type_select';
        let dataDefault = '';
        let uiNumber = '';

        if (mainData[i][0].toUpperCase().includes("TEST")) { gui_mode = true; }
    
        if (mainData[i][0].includes("group")) {
          dataGroup = mainData[i][0];
          const groupId = mainData[i][0].split(/[_-]/)[1];
          const customClass = getStringBetweenSquareBrackets(mainData[i][0]);
          
          if (mainData[i][0].split('_').length - 1 > 1) {
            uiNumber = mainData[i][0].split(/[_-]/)[2];
            const secondUnderscoreIndex = mainData[i][0].indexOf("_", mainData[i][0].indexOf("_") + 1);
            
            if (secondUnderscoreIndex !== -1) {
              optionStyle = mainData[i][0].substring(secondUnderscoreIndex + 1, secondUnderscoreIndex + 3);
            } else {
              optionStyle = '';
            }

            switch (optionStyle) {
              case 'np':
                optionTypeClass = 'type_select type_select_no_photo';
                dataDefault = '0';
                break;
              case 'nt':
                optionTypeClass = 'type_select type_select_no_title';
                dataDefault = '0';
                break;
              case 'cb':
                optionTypeClass = 'type_checkbox';
                dataDefault = '';
                break;
              default:
                optionTypeClass = 'type_select';
                break;
              }
            } else {
              uiNumber = mainData[i][0].split("-")[1];
            }

            
          const filterGroup = $(`<div class="ar_filter_group ${customClass}" id="group-${groupId}"></div>`);

          const filterHeaderHTML = `
            <div class="ar_filter_header">
              <div class="ar_filter_number">${uiNumber}</div>
              <div class="ar_filter_caption">${getData(mainData, mainData[i][0], currentLanguage)}</div>
              <div class="ar_filter_selected_item" id="summary-item2-${groupId}"></div>
            </div>
            <div class="ar_filter_inputs ${optionTypeClass}"></div>
            <div class="ar_filter_options ${optionTypeClass}" data-default="${dataDefault}">
          `;

          
          groupsContainer.append(filterGroup);
          filterGroup.append($(filterHeaderHTML));

          uiMultiLanguages.push(
            { [`#group-${groupId} .ar_filter_caption`]: mainData[i][0] },
          );

          $(`#group-${groupId} .ar_filter_header`).on('click', function () {
            $(`#group-${groupId} div.ar_filter_description`)?.slideToggle(speedUiAnim);
            $(`#group-${groupId} div.ar_filter_inputs`)?.slideToggle(speedUiAnim);
            $(`#group-${groupId} div.ar_filter_options`)?.slideToggle(speedUiAnim);
            $(`#group-${groupId} div.ar_filter_options_result`)?.slideToggle(speedUiAnim);
          });

          const summaryItemHTML = `
            <div class="ar_summary_list_item" id="summary-item-${groupId}">
              <div class="ar_summary_list_group" id="summary_item_title_${groupId}">${getData(mainData, mainData[i][0], currentLanguage)}</div>
              <div class="ar_summary_list_components" id="summary_item_list_${groupId}">
              </div>
            </div>
          `;

          summaryList.append($(summaryItemHTML));

          uiMultiLanguages.push(
            { [`#summary_item_title_${groupId}`]: mainData[i][0] },
          );
        }

        if (mainData[i][0].includes("option")) {
          let groupId = mainData[i][0].split(/[_-]/)[1];
          let optionId = mainData[i][0].split("-")[1];
          let descrHTML = '';
          let optImageHTML = '';
          let componentOptionsContentHTML = '';

          if (optionTypeClass === 'type_checkbox') {
            optImageHTML = `<div class="image ar_no_image"></div>`;
            componentOptionsContentHTML = '';
          } else {
            optImageHTML = `<div class="image"></div>`;
            componentOptionsContentHTML = `<div class="option_settings" data-color="${getData(mainData, mainData[i][0], `DATA-COLOR`)}"></div>`;
          }

          
          if (getData(mainData, mainData[i][0], `UI_IMG`) !== 'null' &&
          getData(mainData, mainData[i][0], `UI_IMG`) !== 'info' &&
          getData(mainData, mainData[i][0], `UI_IMG`)?.substring(0, 1) !== '#') {
            const imgLink = `./src/images/${getData(mainData, mainData[i][0], `UI_IMG`)}`;
            optImageHTML = `
            <div class="image">
              <img src="${imgLink}">
              <div id="loupe-${groupId}_${optionId}" class="image-loupe" data-option="option_${groupId}-${optionId}">
                <img src="./src/ar-ui-icons/default/loupe.png" alt="loupe">
              </div>
            </div>
            `;
          } else if (getData(mainData, mainData[i][0], `UI_IMG`).substring(0, 1) === '#') {
            optImageHTML = `
            <div class="image">
              <div class="image-color" style="background-color: ${getData(mainData, mainData[i][0], `UI_IMG`)};"></div>
              <div id="loupe-${groupId}_${optionId}" class="image-loupe" data-option="option_${groupId}-${optionId}">
                <img src="./src/ar-ui-icons/default/loupe.png" alt="loupe">
              </div>
            </div>`;
          } else if (getData(mainData, mainData[i][0], `UI_IMG`) === 'info') {
            optImageHTML = `
            <div id="loupe-${groupId}_${optionId}" class="image-info" data-group="${dataGroup}" data-option="option_${groupId}-${optionId}">
            <img src="./src/ar-ui-icons/default/info.png" alt="info">
            </div>`;
          }

          const isExist = (getData(mainData, mainData[i][0], `EXIST`)?.toUpperCase() == 'NO') 
          ? 'disabled_always' : '';
          
          const priceValue = (IS_PRICE_SIMPLE) ? parseNumber(getData(mainData, mainData[i][0], 'PRICE')) : 0;

          const optionHTML = `
            <div class="option option_${groupId}-${optionId} ${isExist}" data-group_id="${groupId}" data-component_id="${optionId}"
              data-price="${priceValue}">
              ${descrHTML}
              ${optImageHTML}
              <div class="component_options" id="options_${groupId}_${optionId}">
                ${componentOptionsContentHTML}
              </div>
              <div class="component_title">${getData(mainData, mainData[i][0], currentLanguage)}</div>
            </div>
          `;

          const optContainer = `#group-${groupId} .ar_filter_options`;
          $(optContainer).append($(optionHTML));

          uiMultiLanguages.push(
            { [`.option_${groupId}-${optionId} .component_title`]: mainData[i][0] },
          );

          if (mainData[i + 1] && !mainData[i + 1][0].includes("option") ||
            !mainData[i + 1] && mainData[i][0].includes("option")) {
            const optionsResultHTML = `
              <div class="ar_filter_options_result">
                <div class="ar_filter_options_result_caption" id="result_caption_${groupId}">${getData(mainData, 'ui_ar_selected_caption', currentLanguage)}</div>
                <div class="ar_filter_options_result_list">
                  <div class="ar_filter_options_result_item_list" id="result_item_list_${groupId}">
                  </div>
                </div>
              </div>
            `;

            $(`#group-${groupId}`).append($(optionsResultHTML));

            uiMultiLanguages.push(
              { [`#group-${groupId} #result_caption_${groupId}`]: 'ui_ar_selected_caption' },
            );
          }
        }
      }
      
      menuHider();

      if (gui_mode) { $('#ar_model_viewer').append($('<div id="gui-container"></div>')); }

      // console.log("🚀 Menu was created");

      // correctScrollForMobile(); // TODO: check and remove

      console.log("🚀 ~ uiMultiLanguages:", uiMultiLanguages);
      resolve();
    });
  });
}

function updateUIlanguages(mainData) {
  for (let i = 0; i < uiMultiLanguages.length; i++) {
    for (let key in uiMultiLanguages[i]) {
      $(key).html(getData(mainData, uiMultiLanguages[i][key], currentLanguage));
    }
  }
}

function menuHider() {
  const tblHiderContainer = $('.ar_conf_container .tbl-window-btn-hider');
  const modelViewerElement = $('.ar_conf_container .ar_model_viewer');
  const summaryElement = $('.ar_conf_container .summary_container');

  tblHiderContainer.on('click', function () {
    modelViewerElement.toggleClass('wide');
    summaryElement.animate({ width: 'toggle' }, 150);
  });
}

//#region CSV READING FUNCTIONS

export function setLoadParseCSV(link, fileType, output, callback = () => {}) {
  const request = new XMLHttpRequest();
  request.open('GET', link, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      const type = request.getResponseHeader('Content-Type');
      if (type.indexOf(fileType) !== 1) {
        parseCSV(request.responseText, output, callback);
      }
    }
  };
}

export function parseCSV(text, output, callback) {
  const lines = text.split('\n');

  lines.forEach((line) => {
    line = line.trim();

    if (line.length === 0) return;

    const skipIndexes = {};
    const columns = line.split(',');

    output.push(
      columns.reduce((result, item, index) => {
        if (skipIndexes[index]) return result;

        if (item?.startsWith('"') && !item?.endsWith('"')) {
          while (!columns[index + 1].endsWith('"')) {
            index++;
            item += `,${columns[index]}`;
            skipIndexes[index] = true;
          }

          index++;
          skipIndexes[index] = true;
          item += `,${columns[index]}`;
        }

        result.push(item);
        return result;
      }, []),
    );
  });

  callback();
}

export function getData(data, text, desiredId, titleId = 'id') {
  let titleIdInd = data[0]?.findIndex(
    (title) => title?.toUpperCase() === titleId?.toUpperCase(),
  );

  if (titleIdInd === -1) { 
    titleIdInd = 0;
  }

  let index = data[titleIdInd]?.findIndex(
    (title) => title?.toUpperCase() === desiredId?.toUpperCase(),
  );

  if (index === -1) {
    index = data[0].findIndex(
      (title) => title?.toUpperCase() === DEFAULT_LANGUAGE.toUpperCase(),
    );
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toUpperCase() === text.toUpperCase()) {
      return data[i][index];
    }
  }

  return null;
}

export function parseNumber(str) {
  if (str === null || str === undefined) {
    return 0;
  }
  str = str.replace(/\s/g, '');
  str = str.replace(/,/g, '.');
  str = str.replace(/"/g, '');
  str = str.replace(/ /g, '');
  const number = parseFloat(str);
  if (isNaN(number)) return 0;

  return number;
}

//#endregion

function getStringBetweenSquareBrackets(inputString) {
  const regex = /\[(.*?)\]/;
  const matches = inputString.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return '';
  }
}

function correctScrollForMobile() {
  const headerHeight = 142;
  const arModelViewer = document.querySelector('.ar_model_viewer');
  const summaryContainer = document.querySelector('.summary_container');

  const canvas = document.getElementById('ar_model_view');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.4;

  if (window.innerWidth < 840) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
  
      const rect = summaryContainer.getBoundingClientRect();
      const bottomVisible = rect.bottom <= window.innerHeight;
      const topValue = `calc(${rect.height}px - 100dvh + var(--marevo-canvas-height-mobile, 40dvh))`;
  
      if (scrollPosition >= headerHeight) {
        arModelViewer.classList.add('fixed_mobile');
        summaryContainer.classList.add('fixed_mobile');
        arModelViewer.style.top = 0;
      } else {
        arModelViewer.classList.remove('fixed_mobile');
        summaryContainer.classList.remove('fixed_mobile');
      }
  
      // if (bottomVisible) {
      //   arModelViewer.classList.remove('fixed_mobile');
      //   summaryContainer.classList.remove('fixed_mobile');
      //   arModelViewer.style.top = topValue;
      // }
    });
  }
}
