'use strict';
/* global jQuery, $ */

import { DEFAULT_LANGUAGE, IS_PRICE_SIMPLE } from './settings.js';

let currentLanguage;

export let uiMultiLanguages = [];

export async function createMenu(mainData) {
  return new Promise((resolve) => {
    jQuery(document).ready(function ($) {

      let firstObj = { name: 'Hello' };
      let secondObj = firstObj;
      firstObj = { name: 'Bye' };
      console.log(secondObj.name);

      currentLanguage = $('.language-picker select').val() || DEFAULT_LANGUAGE;

      $('.language-picker select').on('change', function () {
        currentLanguage = $(this).val();
        updateUIlanguages(mainData);
      });

      uiMultiLanguages.push(
        { '#button_ar_qr .canvas_btn_text': 'ui_btn_ar' },
        { '#button_share_url .canvas_btn_text': 'ui_btn_share' },
        { '#button_camera_inside .canvas_btn_text': 'ui_btn_camera_inside' },
        { '#button_camera_outside .canvas_btn_text': 'ui_btn_camera_outside' },
        { '#button_annotation .canvas_btn_text': 'ui_btn_annotations' },
        { '#button_dimensions .canvas_btn_text': 'ui_btn_dimensions' },
        { '#button_furniture .canvas_btn_text': 'ui_btn_furniture' },
        { '#button_sleep .canvas_btn_text': 'ui_btn_radio_sleep' },
        { '#button_work .canvas_btn_text': 'ui_btn_radio_work' },
        { '#button_live .canvas_btn_text': 'ui_btn_radio_live' },
        { '#ar_button_order__caption .ar_button_order__caption_large': 'ui_btn_buy' },
        { '.popup-sharing-title': 'ui_popup-title-share' },
        { '#popup-qr-title-ui': 'ui_popup-title-qr' },
        { '#popup-qr-text-ui': 'ui_popup-text-qr' },
        { '#delivery_info_title': 'ui_delivery_info_title' },
        { '#delivery_info_caption': 'ui_delivery_info_caption' },
        { '#payment_info_title': 'ui_payment_info_title' },
        { '.ar_button_back__caption': 'ui_btn_back' },
        { '#menu_info_tab_descr': 'ui_menu_info_tab_descr' },
        { '#menu_info_tab_specs': 'ui_menu_info_tab_specs' },
        { '#canvas_notification': 'ui_canvas_notification' },
        { '#canvas_notification_limit': 'ui_canvas_notification_limit' },
      );

      const groupsContainer = $('#ar_filter');
      const summaryList = $('.ar_summary .ar_summary_list');

      let dataGroup = '';

      for (let i = 1; i < mainData.length; i++) {
        let optionStyle = '';
        let optionTypeClass = 'type_select';
        let dataDefault = '';
        let uiNumber = '';

        if (mainData[i][0].includes("group")) {
          dataGroup = mainData[i][0];
          const groupId = dataGroup.split(/[_-]/)[1];
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

          const filterGroup = $(`<div class="ar_filter_group ${customClass} invisible" id="group-${groupId}"></div>`);

          const filterHeaderHTML = `
            <div class="ar_filter_header">
              <div class="ar_button_back">
                <div class="ar_button_back__image"></div>
                <div class="ar_button_back__caption">${getData(mainData, 'ui_btn_back', currentLanguage)}</div>
              </div>
              <div class="ar_filter_number">${uiNumber}</div>
              <div class="ar_filter_caption">${getData(mainData, mainData[i][0], currentLanguage)}</div>
              <div class="ar_filter_selected_item" id="summary-item2-${groupId}"></div>
            </div>
            <div class="ar_filter_inputs ${optionTypeClass}"></div>
            <div class="ar_filter_options ${optionTypeClass}" data-default="${dataDefault}">
          `;

          const titleMenuItemHTML = `
            <li class="title_list__item vertical-align-wrapper" id="title_list__item_${groupId}">
              <div class="title_list__item-text">${getData(mainData, mainData[i][0], currentLanguage)}</div>
              <div class="title_list__item-arrow"></div>
            </li>
          `;

          $('#title_menu_list').append($(titleMenuItemHTML));

          groupsContainer.append(filterGroup);
          filterGroup.append($(filterHeaderHTML));

          uiMultiLanguages.push(
            { [`#title_list__item_${groupId} .title_list__item-text`]: mainData[i][0] },
          );

          uiMultiLanguages.push(
            { [`#group-${groupId} .ar_filter_caption`]: mainData[i][0] },
          );

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
          let optInfoHTML = '';
          let componentOptionsContentHTML = '';

          if (optionTypeClass === 'type_checkbox') {
            optImageHTML = `<div class="image ar_no_image"></div>`;
            componentOptionsContentHTML = '';
          } else {
            optImageHTML = `<div class="image"></div>`;
            componentOptionsContentHTML = `<div class="option_settings" data-color="${getData(mainData, mainData[i][0], `DATA-COLOR`)}"></div>`;
          }


          if (getData(mainData, mainData[i][0], `UI_IMG`) !== 'null' &&
            getData(mainData, mainData[i][0], `UI_IMG`)?.substring(0, 1) !== '#') {
            const imgLink = `./src/images/${getData(mainData, mainData[i][0], `UI_IMG`)}`;
            optImageHTML = `
              <div class="image">
                <img src="${imgLink}">
              </div>
            `;
          } else if (getData(mainData, mainData[i][0], `UI_IMG`).substring(0, 1) === '#') {
            optImageHTML = `
            <div class="image">
              <div class="image-color" style="background-color: ${getData(mainData, mainData[i][0], `UI_IMG`)};"></div>
            </div>`;
          }

          optInfoHTML = `<div id="menu_item_info-${groupId}_${optionId}" class="image-info" data-group="group-${groupId}" data-option="option_${groupId}-${optionId}"></div>`;

          const isExist = (getData(mainData, mainData[i][0], `EXIST`)?.toUpperCase() == 'NO')
            ? 'disabled_always' : '';

          const priceValue = (IS_PRICE_SIMPLE) ? parseNumber(getData(mainData, mainData[i][0], 'PRICE')) : 0;

          const optionHTML = `
            <div class="option option_${groupId}-${optionId} ${isExist}" data-group_id="${groupId}" data-component_id="${optionId}" data-price="${priceValue}">
              <div class="option__content">
                <div class="option__status_icon"></div>
                ${descrHTML}
                ${optImageHTML}
              
                <div class="component_options" id="options_${groupId}_${optionId}">
                  ${componentOptionsContentHTML}
                </div>

                <div class="component_title">${getData(mainData, mainData[i][0], currentLanguage)}</div>
              </div>

              ${optInfoHTML}
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

      // menuHider();

      updateUIlanguages(mainData);
      setEventListenersForMenuItems();

      $('.ar_button_back').on('click', function () {
        $('.ar_filter').removeClass('active');
        $('.ar_menu_info_container').removeClass('active');
      });

      $('.ar_menu_info__header_close').on('click', function () {
        $('.ar_menu_info_container').removeClass('active');
      });

      $('.ar_menu_info_tab').on('click', function () {
        $('.ar_menu_info_tab').removeClass('active');
        $(this).addClass('active');
      });
      
      $('#menu_info_tab_descr').on('click', function () {
        $(this).addClass('active');
        $('#menu_info_tab_specs').removeClass('active');
        $('#menu_info_content_specs').removeClass('active');
        $('#menu_info_content_descr').addClass('active');
      });

      $('#menu_info_tab_specs').on('click', function () {
        $(this).addClass('active');
        $('#menu_info_tab_descr').removeClass('active');
        $('#menu_info_content_descr').removeClass('active');
        $('#menu_info_content_specs').addClass('active');
      });
      
      resolve();
    });
  });
}

function updateUIlanguages(mainData, lang = currentLanguage) {
  for (let i = 0; i < uiMultiLanguages.length; i++) {
    for (let key in uiMultiLanguages[i]) {
      let contentText = getData(mainData, uiMultiLanguages[i][key], lang);
      
      if (!contentText) continue;

      if (contentText !== '' && contentText?.toLowerCase() !== 'null') {
        if (contentText[0] === '"' && contentText[contentText.length - 1] === '"') {
          contentText = contentText.slice(1, -1);
        }
      } else {
        contentText = '';
      }
      
      $(key).html(contentText);
    }
  }
}

function setEventListenersForMenuItems() {
  $('.title_list__item').on('click', function () {
    const itemId = $(this).attr('id');
    const identifier = itemId.split('title_list__item_')[1];

    $('.ar_filter .ar_filter_group').addClass('invisible');
    $(`#group-${identifier}`).removeClass('invisible');
    $('.ar_filter').addClass('active');
  });
}


//#region CSV READING FUNCTIONS

export async function loadAndParseCSV(link, fileType, output, retryCount = 999, retryDelay = 1000) {
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      const response = await fetch(link);
      
      if (response.ok) {
        const type = response.headers.get('Content-Type');
        if (type && type.includes(fileType)) {
          const text = await response.text();
          parseCSV(text, output);
          return;
        } else {
          throw new Error(`Unexpected content type: ${type}`);
        }
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} to load ${link} failed:`, error);

      if (attempt < retryCount - 1) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw new Error(`Failed to load ${link} after ${retryCount} attempts`);
      }
    }
  }
}

function parseCSV(text, output) {
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
