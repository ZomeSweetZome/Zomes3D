/* eslint-disable no-case-declarations */
/* global THREE, jQuery, $, google */

// Created by Marevo (Pavlo Voronin)
// Welcome to our custom script!

// REMEMBER:
// Theft is wrong not because some ancient text says, 'Thou shalt not steal.' 
// It's always bad, robber :)

'use strict';

//#region PUBLIC VALUES
import {
  DATAFILE_CSV_LINK_UI,
  DATAFILE_CSV_LINK_PRICE,
  DATAFILE_CSV_LINK_ANNOTATIONS,
  DATAFILE_CSV_LINK_SALES_ZIPCODE,
  DEFAULT_LANGUAGE,
  DEFAULT_CURRENCY,
  CURRENCY_SIGN,
  CONDITIONS_ACTIVE,
  CONDITIONS_UNCHECKED,
  MODEL_PATHS,
  MODEL_CENTER_POSITION,
  SHADOW_TRANSPARENCY,
  BACKGROUND_COLOR,
  ENVIRONMENT_MAP,
  ENVIRONMENT_MAP_INTENSITY,
  TEXTURES,
  DATA_HOUSE_NAME,
  NAV_CAM_POSITION,
  STUDIO_EXTRADOOR_SECTORS,
  FOUNDATION_HEIGHT,
  WINDOWS_LIMIT_IN_ROW,
  VIEWPORT_AND_STRIP_SECTORS,
  HUMAN_HEIGHT,
  CALENDLY_LINK,
  BOOK_CONSULTATION_LINK,
  PAY_DEPOSITE_LINK,
  ORIGIN_ZIPCODE,
  OPTIONS_ID_ORDER_FOR_ADDONS,
} from './settings.js';

import {
  create3DScene,
  IMPORTED_MODELS,
  scene,
  getMobileOperatingSystem,
  animateScale,
  disposeModel,
  loadModel,
  controls,
  camera,
  renderer,
  floor,
  smoothCameraTransition,
  envMap,
} from './3d-scene.js';

import {
  generatePDF,
} from './pdf-maker.js';

import {
  createMenu,
  loadAndParseCSV,
  getData,
  updateUIlanguages,
} from './ui-controller.js';

// Clipping model mode
export let current3Dmodel = null;
export let isLocalClippingOn = false;
export let notClippingMaterials = [];

// state variables
let currentLanguage = DEFAULT_LANGUAGE;
let currentCurrency = DEFAULT_CURRENCY;
let currentCurrencySign = CURRENCY_SIGN[currentCurrency] || CURRENCY_SIGN['USD'];
let currentHouse = '0';
let isWindowStripOn = false;
let isWindowViewportOn = false;
let isWindowCustomOn = false;
let currentInteriorOption = 0;
let currentExteriorOption = 0;
let isExtrimeWeatherPackOn = false;
let isBuiltInDeskOn = false;
let isFoundationKitOn = false;
let isExtraDoorOn = false;
let isHeatCoolUnitOn = false;
let isAirconditionOn = false;
let isSmartGlassOn = false;

let [houseDiameter, houseHeight] = [0, 0];

let uiMenuInfoLanguages = [
  { '#menu_info_title': '' },
];

let uiMenuInfoDescLanguages = [
  { '#menu_info_content_descr .ar_menu_info_content__text': '' },
];

let uiMenuInfoSpecsLanguages = [
  { '#menu_info_content_specs .ar_menu_info_content__text': '' },
];

let uiAnnotationsLanguages = [];
let uiAnnotationsLongLanguages = [];

let allOptions = [];

let customWindows = {
  c: [],
  d: [],
  e: [],
  f: [],
  g: [],
};

export let dataAnnotations = [];
let dataPrice = [];
let dataMain = [];
let dataZiptax = [];
let mainGroups = [];

const sceneProperties = {
  BACKGROUND_COLOR: BACKGROUND_COLOR,
  MODEL_PATHS: MODEL_PATHS,
  MODEL_CENTER_POSITION: MODEL_CENTER_POSITION,
  SHADOW_TRANSPARENCY: SHADOW_TRANSPARENCY,
  ENVIRONMENT_MAP: ENVIRONMENT_MAP,
  ENVIRONMENT_MAP_INTENSITY: ENVIRONMENT_MAP_INTENSITY,
};

let delayForWriteURL = false;
let parametersKey = 'config';
let parametersValue = '';
let loaded = false;
let paramsLoaded = false;
let isUrlEmpty = true;

let popup;
let popupItemQr;
let popupItemSharing;
let popupItemLoupe;

let modelViewer;
let qrcode;
let qrScaned = 0;

let modelHouse;
let modelFurniture;

let isFirstStart = true;
let justClicked = false;
export let isCameraInside = false;

// Capture Camera Image
let summary_images;
let share_RenderImageSize = { x: 1024, y: 1024 };
let share_RenderImages = [];
let imageSources = [];

let pdfContentData = [];
let currentAmountString = '';
let currentTaxAmountString = '';
let totalAmount = 0;
let maximumLeadTimeWeeks = 0;

let taxAmount = 0;
let shippingAmount = 0;
let stateSalesTax = 0;
let shippingDistance = 0;
let totalAmountShipTax = 0;
let userName = '';
let userEmail = '';
let userZipcode = '';

const baseColorForRowA = '#aaaaaa';

// CUSTOM SELECT
jQuery(document).ready(function () {
  $('.custom-select').select2({
    minimumResultsForSearch: Infinity, // Removes the search line if not needed
  });
});

// MORPHS & SHADER
let isWorldposVertexShaderEnabled = true;
let morphs = [];
let globalMorphs = [];

const groupType = ['select', 'select_no_photo', 'range', 'checkbox', 'number', 'text', 'dropdown'];
const ar_filter = document.querySelector('.ar_filter');

let SharedParameterList = [
  {  // [0] zomeModel
    id: 'zomeModel',
    groupIds: ['group-0'],
    splitValue: 'M',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [1] windows
    id: 'windows',
    groupIds: ['group-1'],
    splitValue: 'A',
    type: 'array-string',
    value: [0, 0, 0],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [2] interior
    id: 'interior',
    groupIds: ['group-2'],
    splitValue: 'R',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [3] exterior
    id: 'exterior',
    groupIds: ['group-3'],
    splitValue: 'E',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [4] addons
    id: 'addons',
    groupIds: ['group-4'],
    splitValue: 'V',
    type: 'array-string',
    value: [0, 0, 0, 0, 0, 0],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [5] language
    id: 'lang',
    groupIds: null,
    splitValue: 'O',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [6] currency
    id: 'curr',
    groupIds: null,
    splitValue: 'u',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [7] customWindows
    id: 'customWindows',
    groupIds: null,
    splitValue: 'a',
    type: 'array-string',
    value: ['c', 'd', 'e', 'f', 'g'],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [8] qr
    id: 'qr',
    groupIds: null,
    splitValue: 'q',
    type: 'int',
    value: 0,
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  }
];

// zomeModel
SharedParameterList[0].groupOptionAction = function () {
  if (justClicked) {
    currentHouse = this.value;
    changeModel(this.value);
  }
}

// windows
SharedParameterList[1].groupOptionAction = function () {
  if (justClicked) {
    if(this.value[2] == '1') {
      addStripAndViewportWindowsToCustomWindowsObject(this.value[0], this.value[1]);
    }
  }
}

// interior
SharedParameterList[2].groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    // do something if needed
  }

  setObjectTexture(TEXTURES.interior.materialNames, TEXTURES.interior[this.value]);
}

// exterior
SharedParameterList[3].groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    // do something if needed
  }

  setObjectTexture(TEXTURES.exterior.materialNames, TEXTURES.exterior[this.value]);
}

// addons
SharedParameterList[4].groupOptionAction = function () {
  // if (isFirstStart || justClicked) {
  //   if (this.value[2] == '1') { // foundation kit
  //     floor.position.y = MODEL_CENTER_POSITION - FOUNDATION_HEIGHT;
  //   } else {
  //     floor.position.y = MODEL_CENTER_POSITION;
  //   }

  //   if (currentHouse == '2') {
  //     if (this.value[3] == '1') { // extra door
  //       isExtraDoorOn = true;
  //     } else if (this.value[3] == '0') {
  //       isExtraDoorOn = false;
  //     }

  //     updateFurnitureSet();
  //   }

  //   if (this.value[1] == '1') { // in-build desk
  //     isBuiltInDeskOn = true;
  //   } else if (this.value[1] == '0') {
  //     isBuiltInDeskOn = false;
  //   }

  //   checkBuiltInDeskState();

  //   if ($('#button_dimensions').hasClass('active')) {
  //     if (this.value[2] == '1') { // foundation kit
  //       isFoundationKitOn = true;
  //     } else {
  //       isFoundationKitOn = false;
  //     }

  //     dimensionsController(true);
  //   }
  // }

  if (isFirstStart || justClicked) {
    if (this.value[0] == '1') { // foundation kit
      floor.position.y = MODEL_CENTER_POSITION - FOUNDATION_HEIGHT;
    } else {
      floor.position.y = MODEL_CENTER_POSITION;
    }

    if (currentHouse == '2') {
      if (this.value[5] == '1') { // extra door
        isExtraDoorOn = true;
      } else if (this.value[5] == '0') {
        isExtraDoorOn = false;
      }

      updateFurnitureSet();
    }

    if (this.value[1] == '1') { // in-build desk
      isBuiltInDeskOn = true;
    } else if (this.value[1] == '0') {
      isBuiltInDeskOn = false;
    }

    checkBuiltInDeskState();

    if ($('#button_dimensions').hasClass('active')) {
      if (this.value[0] == '1') { // foundation kit
        isFoundationKitOn = true;
      } else {
        isFoundationKitOn = false;
      }

      dimensionsController(true);
    }
  }
}

// language
SharedParameterList[5].groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    let language = 'EN';
    switch (this.value) {
      case '0':
        language = 'EN';
        break;
      case '1':
        language = 'FR';
        break;
      case '2':
        language = 'ES';
        break;
      default:
        language = 'ES';
        break;
    }

    $('.language-picker select').val(language).trigger('change');
  }
}

// currency
SharedParameterList[6].groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    let currency = 'EN';
    switch (this.value) {
      case '0':
        currency = 'USD';
        break;
      case '1':
        currency = 'EUR';
        break;
      default:
        currency = 'USD';
        break;
    }

    $('.currency-picker select').val(currency).trigger('change');
  }
}

// customWindows
SharedParameterList[7].groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    if (this.value.length > 0) {
      restoreCustomWindows();
    }
  }
}

// qr
SharedParameterList[8].groupOptionAction = function () {
}

//#endregion


//#region CLASS's

class Group {
  constructor() {
    this.element = null;
    this.group = null;
    this.id = '';
    this.type = '';
  }
}

class GroupSelect {
  constructor() {
    this.element = null;
    this.header = null;
    this.name = '';
    this.description = '';
    this.filter_option = null;
    this.options = [];
    this.activeOption = 0;
    this.optionsResult = null;
  }
}

class GroupRange {
  constructor() {
    this.element = null;
    this.header = null;
    this.name = '';
    this.description = '';
    this.filter_option = null;
    this.options = [];
    this.input = null;
    this.rangeList = [];
    this.optionsResult = null;
  }
}

class GroupInput {
  constructor() {
    this.element = null;
    this.header = null;
    this.name = '';
    this.description = '';
    this.filter_option = null;
    this.options = [];
    this.input = null;
    this.optionsResult = null;
  }
}

class GroupDropdown {
  constructor() {
    this.element = null;
    this.header = null;
    this.name = '';
    this.description = '';
    this.filter_option = null;
    this.options = [];
    this.select = null;
    this.optionsResult = null;
  }
}

class GroupCheckbox {
  constructor() {
    this.element = null;
    this.header = null;
    this.name = '';
    this.description = '';
    this.filter_option = null;
    this.options = [];
    this.activeOption = 0;
    this.optionsResult = null;
  }
}

class Option {
  constructor() {
    this.element = null;
    this.name = null;
    this.description = null;
    this.tooltip = null;
    this.group_id = null;
    this.component_id = null;
    this.price = null;
    this.active = false;
    this.componentOptions = [];
  }
}

class ComponentOption {
  constructor() {
    this.element = null;
    this.name = null;
    this.color = null;
    this.map = null;
    this.normal_map = null;
    this.roughness = null;
    this.metalness = null;
    this.ao = null;
    this.targetObject = null;
  }
}

//#endregion

//#region START APP

prepareDataFiles();

async function prepareDataFiles() {
  try {
    await loadAndParseCSV(DATAFILE_CSV_LINK_ANNOTATIONS, 'text', dataAnnotations);
    await loadAndParseCSV(DATAFILE_CSV_LINK_PRICE, 'text', dataPrice);
    await loadAndParseCSV(DATAFILE_CSV_LINK_UI, 'text', dataMain);
    await loadAndParseCSV(DATAFILE_CSV_LINK_SALES_ZIPCODE, 'text', dataZiptax);
    Start();
  } catch (error) {
    console.error("Error loading data files:", error);
  }
}

//#endregion

//#region INITIALIZATION

function InitializationGroups(callback) {
  mainGroups = [];

  let groups = ar_filter.querySelectorAll(':scope > div.ar_filter_group');

  for (let i = 0; i < groups.length; i++) {
    const element = groups[i];

    let typeValue = '';

    let name = element.querySelector('div.ar_filter_caption');
    let description = element.querySelector('div.ar_filter_description');

    let ar_filter_option = null;
    var ar_filter_inputs = null;

    for (let t = 0; t < groupType.length; t++) {

      ar_filter_option = element.querySelector('div.ar_filter_options.type_' + groupType[t]);
      ar_filter_inputs = element.querySelector('div.ar_filter_inputs.type_' + groupType[t]);

      if (ar_filter_option != null) {
        typeValue = groupType[t];
        break;
      }
    }

    if (ar_filter_option == null) { continue; }

    var ar_filter_options_result = element.querySelector('div.ar_filter_options_result');
    var ar_filter_header = element.querySelector('div.ar_filter_header');
    let options = ar_filter_option.querySelectorAll(':scope > div.option');

    const newGroup = new Group();
    newGroup.element = element;
    newGroup.type = typeValue;
    newGroup.id = element.getAttribute('id');

    var newSomeGroup = null;
    switch (typeValue) {
      case 'select':
      case 'select_no_photo':
        newSomeGroup = new GroupSelect();
        break;
      case 'range':
        newSomeGroup = new GroupRange();
        break;
      case 'checkbox':
        newSomeGroup = new GroupCheckbox();
        break;
      case 'number':
        newSomeGroup = new GroupInput();
        break;
      case 'text':
        newSomeGroup = new GroupInput();
        break;
      case 'dropdown':
        newSomeGroup = new GroupDropdown();
        break;
    }

    newSomeGroup.element = element;
    newSomeGroup.name = name != null ? name.textContent.trim() : null;
    newSomeGroup.description = description != null ? description.textContent.trim() : null;
    newSomeGroup.filter_option = ar_filter_option;
    newSomeGroup.optionsResult = ar_filter_options_result != null ? ar_filter_options_result : null;
    newSomeGroup.header = ar_filter_header != null ? ar_filter_header : null;

    switch (typeValue) {
      case 'range':
        let inputRange = ar_filter_inputs.querySelector('input');
        console.log(inputRange);

        if (inputRange != null) {
          newSomeGroup.input = inputRange;

          newSomeGroup.rangeList = [];
          if (options != null) {
            options.forEach(opt => {
              newSomeGroup.rangeList.push(opt.textContent.trim());
            });
            newSomeGroup.rangeList.sort();
            console.log(newSomeGroup.rangeList);
          }
        }
        break;
      case 'number':
      case 'text':
        let input = ar_filter_inputs.querySelector('input');
        console.log(input);

        if (input != null) {
          newSomeGroup.input = input;
        }
        break;
      case 'dropdown':
        let select_dropdown = ar_filter_inputs.querySelector('select');
        console.log(select_dropdown);

        if (select_dropdown != null) {
          newSomeGroup.select = select_dropdown;
        }
        break;
      default:
        break;
    }

    if (options != null) {
      if (options.length > 0) {
        for (let o = 0; o < options.length; o++) {
          const opt = options[o];

          const newOption = new Option();
          newOption.element = opt;
          var nameElement = opt.querySelector('div.component_title');
          var descriptionElement = opt.querySelector('div.ar_option_description');
          var tooltipElement = opt.querySelector('div.ar_option_description_tooltip');

          newOption.name = nameElement ? nameElement.textContent.trim() : '';
          newOption.description = descriptionElement ? descriptionElement.textContent.trim() : '';
          newOption.tooltip = tooltipElement ? tooltipElement.textContent.trim() : '';
          newOption.active = opt.classList.contains('active') ? true : false;

          if (newOption.active) {
            newSomeGroup.activeOption = o;
          }

          newOption.group_id = opt.getAttribute('data-group_id');
          newOption.component_id = opt.getAttribute('data-component_id');
          newOption.price = opt.getAttribute('data-price');

          newOption.componentOptions = [];

          let divComponentOptions = opt.querySelector('div.component_options');

          if (divComponentOptions != null) {
            let componentOptions = divComponentOptions.querySelectorAll(':scope > div.option_settings');

            if (componentOptions != null) {
              if (componentOptions.length > 0) {
                componentOptions.forEach(copt => {
                  const newComponentOption = new ComponentOption();
                  newComponentOption.element = copt;
                  newComponentOption.name = copt.getAttribute('data-name');
                  newComponentOption.color = copt.getAttribute('data-color');
                  newComponentOption.map = copt.getAttribute('data-map');
                  newComponentOption.normal_map = copt.getAttribute('data-normal_map');
                  newComponentOption.roughness = copt.getAttribute('data-roughness');
                  newComponentOption.metalness = copt.getAttribute('data-metalness');
                  newComponentOption.ao = copt.getAttribute('data-ao');
                  newComponentOption.targetObject = copt.getAttribute('data-name');
                  newOption.componentOptions.push(newComponentOption);
                });
              }
            }
          }

          newSomeGroup.options.push(newOption);
        }
      }
    }

    newGroup.group = newSomeGroup;

    mainGroups.push(newGroup);
  }

  if (callback != null) callback();
}

//! *****************   START   ********************
async function Start() {
  await createMenu(dataMain);
  PrepareUI();
  create3DScene(sceneProperties, () => InitializationGroups(startCallback));

  function startCallback() {
    if (loaded) return;
    loaded = true;

    ReadURLParameters(StartSettings);
  }
}

async function StartSettings() {
  // get all options
  document.querySelectorAll('.option').forEach(option => {
    const groupId = option.getAttribute('data-group_id');
    const componentId = option.getAttribute('data-component_id');
    const optionString = `option_${groupId}-${componentId}`;
    allOptions.push(optionString);
  });

  blockBuyBtn();

  currentHouse = SharedParameterList[0].value || '0';

  await loadModel(MODEL_PATHS[currentHouse], 0);
  await loadModel(MODEL_PATHS[parseInt(parseInt(currentHouse) + 3)], 1);
  modelHouse = IMPORTED_MODELS[0];
  modelHouse?.scale.set(0, 0, 0);
  modelHouse && scene.add(modelHouse);

  modelFurniture = IMPORTED_MODELS[1];
  modelFurniture.visible = false;
  modelFurniture && scene.add(modelFurniture);
  disableModelCastingShadows(modelFurniture);
  disableModelReceivingShadows(modelFurniture);

  preloadTextures();

  if (!isUrlEmpty) {
    applyAdditionalSharedParameters(5); // language
    applyAdditionalSharedParameters(6); // currency
  }

  PrepareAR();
  SetActionForGroups();
  ApplyURLParameters();

  applyAdditionalSharedParameters(7); // customWindows

  setVisibility(modelHouse, false, ['man']);
  setObjectTexture(TEXTURES.interiorBase.materialNames, TEXTURES.interiorBase.white);
  setMaterialColor(TEXTURES.interiorBase.materialNames[0], baseColorForRowA);

  $('#js-loader').addClass('invisible');
  $('.summary.entry-summary').removeClass('hidden');
  animateScale(modelHouse, 500, () => { 
    unBlockBuyBtn(); 
    CheckChanges();
    applyAdditionalSharedParameters(7); // customWindows
  });

  isFirstStart = false;
}
//! ************************************************

function applyAdditionalSharedParameters(id) {
  SharedParameterList[id].groupOptionAction();
}

function setDefaultValuesForGroups() {
  for (let i = 0; i < SharedParameterList.length; i++) {
    const element = SharedParameterList[i];
    if (!element.groupIds) { continue; }

    for (let j = 0; j < element.groupIds.length; j++) {
      const group = mainGroups.find(g => g.id === element.groupIds[j]);
      group?.group.options.forEach(o => {
        o.active = false;
        o.element.classList.remove('active');
      });

      const opt = group?.group.options.find(o => o.component_id === element.value);

      if (opt) {
        opt.active = true;
        opt.element.classList.add('active');
      }

      if (Array.isArray(element.value)) {
        for (let k = 0; k < element.value.length; k++) {
          const opt = group?.group.options[k];

          if (opt) {
            if (element.value[k] === 1) {
              opt.active = true;
              opt.element.classList.add('active');
            } else {
              opt.active = false;
              opt.element.classList.remove('active');
            }
          }
        }
      }
    }
  }
}

//#endregion

//#region MAIN ACTIONS

function SetActionForGroups() {
  mainGroups.forEach(target => {
    switch (target.type) {
      case 'select':
      case 'select_no_photo':
        for (let i = 0; i < target.group.options.length; i++) {
          const opt = target.group.options[i];
          opt.element.addEventListener('click', function () {
            if (!opt.element.classList.contains('disabled') &&
              !opt.element.classList.contains('disabled_always')) {
              target.group.activeOption = i;

              target.group.options.forEach(o => {
                o.active = false;
                o.element.classList.remove('active');
              });

              opt.active = true;
              opt.element.classList.add('active');
              justClicked = true;
              SetGroupActionForSharedParameters(target.id, opt.component_id, () => {
                justClicked = false;
                CheckChanges();
                WriteURLParameters();
              });
            }
          });

          menuInfoBtnHandler(opt);
        }
        break;

      case 'range':
        if (target.id == 'group-10999999') {
          //You can do something here...
        }

        target.group.input?.addEventListener('input', function () {
          if (!loaded) { return; }
          //You can do something here...
        });
        target.group.input?.addEventListener('change', function () {
          if (!loaded) { return; }
          justClicked = true;
          SetGroupActionForSharedParameters(target.id, target.group.input.value, () => {
            justClicked = false;
            CheckChanges();
            WriteURLParameters();
          });
          console.log('%c' + target.group.input.value, 'color: blue; font-size: larger');
          //You can do something here...
        });
        break;

      case 'checkbox':
        for (let i = 0; i < target.group.options.length; i++) {
          const opt = target.group.options[i];
          opt.element.addEventListener('click', function () {
            target.group.activeOption = i;
            opt.active = !opt.active;
            opt.element.classList.toggle('active');
            justClicked = true;
            SetGroupActionForSharedParametersCheckboxArray(target.id, target.group.options, () => {
              justClicked = false;
              CheckChanges();
              WriteURLParameters();
            }, false, opt.component_id);

            //You can do something here...
          });

          menuInfoBtnHandler(opt);
        }
        break;

      case 'number':
        target.group.input.addEventListener('input', function () {
          SetGroupActionForSharedParameters(target.id, target.group.input.value);
          //You can do something here...
        });

        target.group.input.addEventListener('change', function () {
          console.log('%c' + target.group.input.value, 'color: blue; font-size: larger');
          WriteURLParameters();
          //You can do something here...
        });
        break;

      case 'dropdown':
        target.group.select.addEventListener('change', function () {
          target.group.activeOption = target.group.select.value;

          target.group.options.forEach(o => {
            o.active = false;
            o.element.classList.remove('active');
          });

          const opt = target.group.options.find(o => o.component_id === target.group.select.value);
          opt.active = true;
          opt.element.classList.add('active');
          justClicked = true;
          SetGroupActionForSharedParameters(target.id, target.group.select.value, () => {
            justClicked = false;
            CheckChanges();
            WriteURLParameters();
          });
        });

        target.group.select.addEventListener('change', function () {
          console.log('%c' + target.group.select.value, 'color: blue; font-size: larger');
          //You can do something here...
        });

        // CASTOM SELECT
        $('select').change(function () {
          const selectedValue = $(this).val();
          $(this).attr('value', selectedValue);

          target.group.activeOption = target.group.select.value;

          target.group.options.forEach(o => {
            o.active = false;
            o.element.classList.remove('active');
          });

          const opt = target.group.options.find(o => o.component_id === target.group.select.value);
          opt.active = true;
          opt.element.classList.add('active');

          justClicked = true;
          SetGroupActionForSharedParameters(target.id, target.group.select.value, () => {
            justClicked = false;
            CheckChanges();
            WriteURLParameters();
          });
        });

        break;

      case 'text':
        //You can do something here...
        break;
    }
  });
}

function ParseAllGroups() {
  mainGroups.forEach(target => {
    if (!target.group.element.classList.contains('disabled')) {
      switch (target.type) {
        case 'select':
        case 'select_no_photo':
          for (let i = 0; i < target.group.options.length; i++) {
            const opt = target.group.options[i];

            if (opt.element.classList.contains('active')) {
              SetGroupActionForSharedParameters(target.id, opt.component_id, null, true);
              break;
            }
          }
          break;
        case 'range':
          SetGroupActionForSharedParameters(target.id, target.group.input.value, null, true);
          break;
        case 'checkbox':
          SetGroupActionForSharedParametersCheckboxArray(target.id, target.group.options, null, true);
          break;
        case 'number':
          SetGroupActionForSharedParameters(target.id, target.group.input.value, null, true);
          break;
        case 'dropdown':
          SetGroupActionForSharedParameters(target.id, target.group.select.value, null, true);
          break;
        case 'text':
          //You can do something here...
          break;
      }
    }
  });
}

function SetGroupActionForSharedParameters(targetID, value, callback, parse = false) {
  for (let i = 0; i < SharedParameterList.length; i++) {
    const element = SharedParameterList[i];

    if (element.groupIds == undefined || element.groupIds == null) { continue; }
    if (!element.groupIds.includes(targetID)) { continue; }

    if (element.value == value) { continue; }

    element.value = value;

    if (element.groupOptionAction != null && parse == false) {
      element.groupOptionAction();
    }
  }

  if (callback != null) {
    callback();
  }

}

function SetGroupActionForSharedParametersCheckboxArray(targetID, array, callback, parse = false, lastClicked = '0') {
  if (array == undefined || array == null) { return; }

  for (let i = 0; i < SharedParameterList.length; i++) {
    const element = SharedParameterList[i];

    if (element.groupIds == undefined || element.groupIds == null) { continue; }
    if (!element.groupIds.includes(targetID)) { continue; }

    var newValue = [];

    for (var o = 0; o < array.length; o++) {
      if (array[o].active) {
        newValue.push('1');
      } else {
        newValue.push('0');
      }
    }

    if (element.value == newValue) { continue; }

    element.value = newValue;
    element.lastClicked = lastClicked;

    if (element.groupOptionAction != null && parse == false) {
      element.groupOptionAction();
    }
  }

  if (callback != null) {
    callback();
  }
}

function applyAllConditionsActiveRadios() {
  mainGroups.forEach(target => {
    if (!target.group.element.classList.contains('disabled')) {
      for (let i = 0; i < target.group.options.length; i++) {
        const opt = target.group.options[i];
        const optionName = `option_${opt.group_id}-${opt.component_id}`;
        const condObj = CONDITIONS_ACTIVE[optionName];

        // select option is active
        if (opt.element.classList.contains('active')) {
          for (let targetName in condObj) {
            if (targetName.includes('group') && condObj[targetName]) {
              const parentGroup = mainGroups.find(element => element.id == targetName);

              if (condObj[targetName] == 'on') {
                parentGroup?.group.element.classList.remove('disabled');
                summaryItemVisibility(targetName, true);
              } else if (condObj[targetName] == 'off') {
                parentGroup?.group.element.classList.add('disabled');
                summaryItemVisibility(targetName, false);
              }
            }

            else if (targetName.includes('option') && condObj[targetName]) {
              const groupId = 'group-' + targetName.split(/[_-]/)[1];
              const parentGroup = mainGroups.find(element => element.id == groupId);
              if (!parentGroup) { continue; }
              const compId = targetName.split('-')[1];
              const group = parentGroup.group;

              if (!group.element.classList.contains('disabled')) {
                const option = group.options.find(element => element.component_id == compId);

                if (condObj[targetName] == 'on') {
                  option.element.classList.remove('disabled');
                  option.element.classList.remove('invisible');
                } else if (condObj[targetName] == 'off') { // make option inactive (checkbox just disabled)
                  option.element.classList.add('disabled');
                  const groupType = mainGroups.find(element => element.id == `group-${option.group_id}`).type;
                  if (groupType !== 'checkbox') {
                    option.element.classList.remove('active');
                  }
                } else if (condObj[targetName] == 'ud') { // make checkbox disabled and unchecked
                  const groupType = mainGroups.find(element => element.id == `group-${option.group_id}`).type;
                  if (groupType === 'checkbox' && option.element.classList.contains('active')) {
                    option.element.click();
                    option.element.classList.add('disabled');
                  }
                  if (groupType === 'checkbox' && !option.element.classList.contains('active')) {
                    option.element.classList.add('disabled');
                  }
                } else if (condObj[targetName] == 'unchecked') { // make checkbox just unchecked
                  const groupType = mainGroups.find(element => element.id == `group-${option.group_id}`).type;
                  if (groupType === 'checkbox' && option.element.classList.contains('active')) {
                    option.element.click();
                    option.element.classList.remove('disabled');
                  }
                  if (groupType === 'checkbox' && !option.element.classList.contains('active')) {
                    option.element.classList.remove('disabled');
                  }
                } else if (condObj[targetName] == 'inv') { // make option inactive and invisible
                  option.element.classList.add('disabled');
                  option.element.classList.remove('active');
                  option.element.classList.add('invisible');
                }
              }
            }

            else if (targetName.includes('mesh')) {
              for (let meshNameComplex in condObj[targetName]) {
                const modelId = splitString(meshNameComplex)[0];
                const meshName = splitString(meshNameComplex)[1];
                let object;

                if (modelId === 'all' || modelId == currentHouse) {
                  object = GetMesh(meshName);
                  if (!object) object = GetGroup(meshName);
                  if (!object) continue;

                  if (condObj[targetName][meshNameComplex] == 'on') {
                    object.visible = true;
                  } else if (condObj[targetName][meshNameComplex] == 'off') {
                    object.visible = false;
                  }
                } else {
                  continue;
                }
              }
            }
          }
        }
      }
    }
  });
}

function splitString(input) {
  let result = [];

  if (input.startsWith('*')) {
    const parts = input.split('*');
    result = [parts[1] || '', parts[2] || ''];
  } else {
    result = ['all', input];
  }

  return result;
}

function applyAllConditionsUncheckedCHeckboxes() {
  mainGroups.forEach(target => {
    if (!target.group.element.classList.contains('disabled')) {
      for (let i = 0; i < target.group.options.length; i++) {
        const opt = target.group.options[i];
        const optionName = `option_${opt.group_id}-${opt.component_id}`;
        const condObj = CONDITIONS_UNCHECKED[optionName];

        // checkbox is UNCHECKED (not active)
        if (target.type === 'checkbox' && !opt.element.classList.contains('active')) {
          for (let targetName in condObj) {
            if (targetName.includes('group') && condObj[targetName]) {
              const parentGroup = mainGroups.find(element => element.id == targetName);

              if (condObj[targetName] == 'on') {
                parentGroup?.group.element.classList.remove('disabled');
                summaryItemVisibility(targetName, true);
              } else if (condObj[targetName] == 'off') {
                parentGroup?.group.element.classList.add('disabled');
                summaryItemVisibility(targetName, false);
              }
            }

            else if (targetName.includes('option') && condObj[targetName]) {
              const groupId = 'group-' + targetName.split(/[_-]/)[1];
              const parentGroup = mainGroups.find(element => element.id == groupId);
              if (!parentGroup) { continue; }
              const compId = targetName.split('-')[1];
              const group = parentGroup.group;
              const option = group.options.find(element => element.component_id == compId);

              if (condObj[targetName] == 'on') {
                option.element.classList.remove('disabled');
                option.element.classList.remove('invisible');
              } else if (condObj[targetName] == 'off') { // make option inactive (checkbox just disabled)
                option.element.classList.add('disabled');
                const groupType = mainGroups.find(element => element.id == `group-${option.group_id}`).type;
                if (groupType !== 'checkbox') {
                  option.element.classList.remove('active');
                }
              } else if (condObj[targetName] == 'ud') { // make checkbox disabled and unchecked
                const groupType = mainGroups.find(element => element.id == `group-${option.group_id}`).type;
                if (groupType === 'checkbox' && option.element.classList.contains('active')) {
                  option.element.click();
                  option.element.classList.add('disabled');
                }
                if (groupType === 'checkbox' && !option.element.classList.contains('active')) {
                  option.element.classList.add('disabled');
                }
              } else if (condObj[targetName] == 'inv') { // make option inactive and invisible
                option.element.classList.add('disabled');
                option.element.classList.remove('active');
                option.element.classList.add('invisible');
              }
            }

            else if (targetName.includes('mesh')) {
              for (let meshNameComplex in condObj[targetName]) {
                const modelId = splitString(meshNameComplex)[0];
                const meshName = splitString(meshNameComplex)[1];
                let object;

                if (modelId === 'all' || modelId == currentHouse) {
                  object = GetMesh(meshName);
                  if (!object) object = GetGroup(meshName);
                  if (!object) continue;

                  if (condObj[targetName][meshNameComplex] == 'on') {
                    object.visible = true;
                  } else if (condObj[targetName][meshNameComplex] == 'off') {
                    object.visible = false;
                  }
                } else {
                  continue;
                }
              }
            }
          }
        }
      }
    }
  });
}

function additionalConditions() {
  // Additional custom conditions if needed
}

function updateStateVars() {
  // Update state vars if needed
  currentHouse = SharedParameterList[0].value;
  isWindowStripOn = (SharedParameterList[1].value[0] == '1') ? true : false;
  isWindowViewportOn = (SharedParameterList[1].value[1] == '1') ? true : false;
  isWindowCustomOn = (SharedParameterList[1].value[2] == '1') ? true : false;
  currentInteriorOption = SharedParameterList[2].value;
  currentExteriorOption = SharedParameterList[3].value;
  // isExtrimeWeatherPackOn = (SharedParameterList[4].value[0] == '1') ? true : false;
  // isBuiltInDeskOn = (SharedParameterList[4].value[1] == '1') ? true : false;
  // isFoundationKitOn = (SharedParameterList[4].value[2] == '1') ? true : false;
  // isExtraDoorOn = (SharedParameterList[4].value[3] == '1') ? true : false;
  // isHeatCoolUnitOn = (SharedParameterList[4].value[3] == '1') ? true : false;
  // isAirconditionOn = (SharedParameterList[4].value[3] == '1') ? true : false;
  // isSmartGlassOn = (SharedParameterList[4].value[3] == '1') ? true : false;
  isFoundationKitOn = (SharedParameterList[4].value[0] == '1') ? true : false;
  isBuiltInDeskOn = (SharedParameterList[4].value[1] == '1') ? true : false;
  isSmartGlassOn = (SharedParameterList[4].value[2] == '1') ? true : false;
  isExtrimeWeatherPackOn = (SharedParameterList[4].value[3] == '1') ? true : false;
  isAirconditionOn = (SharedParameterList[4].value[4] == '1') ? true : false;
  isExtraDoorOn = (SharedParameterList[4].value[5] == '1') ? true : false;
}

// eslint-disable-next-line no-unused-vars
function setOptionsResult() {
  mainGroups.forEach(target => {
    if (!target.group.element.classList.contains('disabled')) {
      const groupResultCaption = `#result_caption_${target.group.options[0]?.group_id}`;
      const summaryResultCaption = `#summary_item_title_${target.group.options[0]?.group_id}`;
      const summaryItem = `#summary-item-${target.group.options[0]?.group_id}`;

      $(groupResultCaption).addClass('hidden');
      $(summaryResultCaption).addClass('hidden');
      $(summaryItem).css('margin-bottom', '0px');

      const groupResultList = `#result_item_list_${target.group.options[0]?.group_id}`;
      const summaryResultList = `#summary_item_list_${target.group.options[0]?.group_id}`;
      $(groupResultList).empty();
      $(summaryResultList).empty();

      const groupResultList2 = `#summary-item2-${target.group.options[0]?.group_id}`;
      $(groupResultList2).empty();

      for (let i = 0; i < target.group.options.length; i++) {
        const opt = target.group.options[i];

        if (opt.active
          && !opt.element.classList.contains('disabled')
          && !opt.element.classList.contains('disabled_always')) {
          $(groupResultCaption).removeClass('hidden');
          $(summaryResultCaption).removeClass('hidden');
          $(summaryItem).css('margin-bottom', '');

          const groupResultItemHTML = `
            <div class='ar_filter_options_result_item'>
              <div class='ar_filter_options_result_name' id='result_name_${opt.group_id}'>${opt.name}</div>
            </div>
          `;

          const groupResultItemHTML2 = `
            <div class='ar_filter_options_result_name2' id='result_name2_${opt.group_id}'>${opt.name}</div>
          `;

          const summaryResultItemHTML = `
            <div class='ar_summary_list_components_component'>
              <div class='ar_summary_list_components_component_title' id='summary_result_name_${opt.group_id}'>${opt.name}</div>
            </div>
          `;

          $(groupResultList).append($(groupResultItemHTML));
          $(summaryResultList).append($(summaryResultItemHTML));
          $(groupResultList2).append($(groupResultItemHTML2));
        }
      }
    }
  });
}

function applyActiveGroupOptionAction() {
  for (let i = 0; i < SharedParameterList.length; i++) {
    for (let j = 0; j < SharedParameterList[i].groupIds?.length; j++) {
      const parentGroup = mainGroups.find(element => element.id == SharedParameterList[i].groupIds[j]);
      if (!parentGroup) { continue; }
      const group = parentGroup.group;

      setActiveSelectOption(parentGroup.id, SharedParameterList[i].value);

      if (!group.element.classList.contains('disabled')) {
        SharedParameterList[i].groupOptionAction();
        break;
      }
    }
  }
}

function setActiveSelectOption(groupId, optionId) {
  // updating active option WITHOUT clicking on it
  if (!optionId) return;
  if (Array.isArray(optionId)) return;

  const parentGroup = mainGroups.find(element => element.id == groupId);
  if (!parentGroup) { return; }

  const group = parentGroup.group;

  if (!group.element.classList.contains('disabled')) {
    group.options.forEach(o => {
      o.active = false;
      o.element.classList.remove('active');
    });

    if (group.options[optionId].element.classList.contains('disabled')) {

      group.options[optionId].element.classList.remove('active');

      for (let i = 0; i < group.options.length; i++) {
        const opt = group.options[i];

        if (!opt.element.classList.contains('disabled')) {
          group.activeOption = i;
          group.options[i].active = true;
          group.options[i].element.classList.add('active');
          group.options[i].element.click();
          break;
        }
      }
    } else {
      group.activeOption = optionId;
      group.options[optionId].active = true;
      group.options[optionId].element.classList.add('active');
      SetGroupActionForSharedParameters(parentGroup.id, optionId, null, true);
    }
  }
}

// eslint-disable-next-line no-unused-vars
function clickActiveOption(groupId) { // if !groupId will scan every groupId
  const checkOption = (option) => !option.element.classList.contains('disabled') &&
    !option.element.classList.contains('disabled_always') &&
    option.element.classList.contains('active');

  const clickActiveOption = (options) => {
    const activeOption = options.find(checkOption);
    if (activeOption) {
      activeOption.element.click();
    }
  };

  if (groupId) {
    const parentGroup = mainGroups.find(element => element.id == groupId);
    if (!parentGroup) { return; }
    const group = parentGroup.group;

    if (!group.element.classList.contains('disabled')) {
      clickActiveOption(group.options);
    }
  } else {
    mainGroups.forEach(target => {
      if (!target.group.element.classList.contains("disabled")) {
        clickActiveOption(target.group.options);
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
function assignOptionsInRelatedGroups(groupIDs) {
  let activeComponentId = '0';

  for (let i = 0; i < groupIDs.length; i++) {
    const parentGroup = mainGroups.find(element => element.id == groupIDs[i]);
    if (!parentGroup) { continue; }
    const group = parentGroup.group;

    if (!group.element.classList.contains('disabled')) {
      for (let j = 0; j < group.options.length; j++) {
        if (group.options[j].element.classList.contains('active')) {
          activeComponentId = group.options[j].component_id;
          break;
        }
      }

      break;
    }
  }

  for (let i = 0; i < groupIDs.length; i++) {
    const parentGroup = mainGroups.find(element => element.id == groupIDs[i]);
    if (!parentGroup) { continue; }
    const group = parentGroup.group;
    let activeOption = 0;

    if (group.element.classList.contains('disabled')) {
      for (let j = 0; j < group.options.length; j++) {
        if (group.options[j].element.classList.contains('active')) {
          group.options[j].element.classList.remove('active');
          group.options[j].active = false;
          activeOption = j;
        }
      }

      if (activeComponentId >= group.options.length) {
        group.options[0].element.classList.add('active');
        group.options[0].active = true;
        group.activeOption = 0;
        continue;
      }

      for (let k = 0; k < group.options.length; k++) {
        if (group.options[k].component_id === activeComponentId) {
          if (group.options[k].element.classList.contains('disabled') ||
            group.options[k].element.classList.contains('disabled_always')) {
            group.options[0].element.classList.add('active');
            group.options[0].active = true;
            group.activeOption = 0;
            continue;
          } else {
            group.options[k].element.classList.add('active');
            group.options[k].active = true;
            group.activeOption = activeOption;
            break;
          }
        }
      }
    }
  }
}

function isGroupActive(groupId) {
  const parentGroup = mainGroups.find(element => element.id == groupId);
  if (!parentGroup) { return false; }
  const group = parentGroup.group;

  if (!group.element.classList.contains('disabled')) {
    return true;
  }
}

// eslint-disable-next-line no-unused-vars
function clickOption(groupId, optionId) {
  const parentGroup = mainGroups.find(element => element.id == groupId);
  if (!parentGroup) { return; }
  const group = parentGroup.group;

  if (!group.element.classList.contains('disabled')) {
    group.options[optionId]?.element.click();
  }
}

//! ************************************************
function CheckChanges() {
  updateStateVars();
  setAllPanelsOn();

  applyAllConditionsActiveRadios();
  applyAllConditionsUncheckedCHeckboxes();
  additionalConditions();

  if (currentHouse == '2' && isExtraDoorOn) {
    removeExtraDoorPanelsFromCustomWindows();
    SharedParameterList[7].value = convertObjectToArray(customWindows);
    WriteURLParameters();
    restoreCustomWindows();
  }

  if (isWindowCustomOn && SharedParameterList[7].value.length > 0) {
    restoreCustomWindows();
  }

  applyActiveGroupOptionAction();

  updateStateVars();

  checkBuiltInDeskState();

  calculatePrice();
  calculateAndSetEstimateDates();
  collectSummary();
}
//! ************************************************
//#endregion

//#region CUSTOM FUNCTIONS

async function changeModel(modelId) {
  blockBuyBtn();
  $('.summary_container').css('pointer-events', 'none');
  $('.product-type-3dmodel').css('cursor', 'progress');

  if ($('.ar_menu_info_container').hasClass('active')) {
    $('.ar_menu_info__header_close').trigger('click');
  }

  if (isCameraInside) {
    $('#button_camera_outside').trigger('click');
  }

  resetCanvasButtons();

  IMPORTED_MODELS[0] && await disposeModel(IMPORTED_MODELS[0]);
  IMPORTED_MODELS[1] && await disposeModel(IMPORTED_MODELS[1]);

  IMPORTED_MODELS.length = 0;

  await loadModel(MODEL_PATHS[modelId], 0);
  await loadModel(MODEL_PATHS[parseInt(parseInt(modelId) + 3)], 1);
  modelHouse = IMPORTED_MODELS[0];
  modelHouse?.scale.set(0, 0, 0);
  modelHouse && scene.add(modelHouse);

  setObjectTexture(TEXTURES.interiorBase.materialNames, TEXTURES.interiorBase.white);
  setMaterialColor(TEXTURES.interiorBase.materialNames[0], baseColorForRowA);

  modelFurniture = IMPORTED_MODELS[1];
  modelFurniture.visible = false;
  modelFurniture && scene.add(modelFurniture);
  disableModelCastingShadows(modelFurniture);
  disableModelReceivingShadows(modelFurniture);

  $('.summary_container').css('pointer-events', '');
  $('.product-type-3dmodel').css('cursor', '');

  (isWindowCustomOn) && $('.option_1-2').trigger('click');
  resetCustomWindowsObject();
  
  setVisibility(modelHouse, false, ['man']);
  onChangePosition(DATA_HOUSE_NAME[modelId], 'outMain', () => { }, 5);
  animateScale(modelHouse, 500, () => { 
    unBlockBuyBtn(); 
    CheckChanges();
  });
}

function blockBuyBtn() {
  $('.ar_menu_footer_container .ar_buy-btn').addClass('disabled');
}
function unBlockBuyBtn() {
  $('.ar_menu_footer_container .ar_buy-btn').removeClass('disabled');
}

function resetCanvasButtons() {
  if ($('#button_annotation').hasClass('active')) {
    $('#button_annotation').trigger('click');
  }
  if ($('#button_dimensions').hasClass('active')) {
    $('#button_dimensions').trigger('click');
  }
  if ($('#button_furniture').hasClass('active')) {
    $('#button_furniture').trigger('click');
  }
}

function resetCustomWindowsObject() {
  for (const key in customWindows) {
    if (Array.isArray(customWindows[key])) {
      customWindows[key] = [];
    }
  }

  SharedParameterList[7].value = convertObjectToArray(customWindows);
  WriteURLParameters();
}

function setAllPanelsOn() {
  const allPanelMeshes = getGroupNamesList(modelHouse, 'panel');
  const allWindowMeshes = getGroupNamesList(modelHouse, 'window');
  setVisibility(modelHouse, true, allPanelMeshes);
  setVisibility(modelHouse, false, allWindowMeshes);
}

function preloadTextures() {
  for (let i = 0; i < 3; i++) {
    loadTexture(TEXTURES.interior[i]);
  }

  for (let i = 0; i < 2; i++) {
    loadTexture(TEXTURES.exterior[i]);
  }
}

function furnitureController(value) {
  if (value) {
    $('.canvas_buttons__radio').removeClass('hidden');
  } else {
    $('.canvas_buttons__radio').addClass('hidden');
  }

  modelFurniture.visible = value;
}

function updateFurnitureSet() {
  if ($('#button_sleep').hasClass('active')) {
    setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['work-back-door', 'work', 'live']);
    setVisibility(modelFurniture, true, ['sleep']);
  }

  if ($('#button_live').hasClass('active')) {
    setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['sleep', 'work', 'work-back-door']);
    setVisibility(modelFurniture, true, ['live']);
  }

  if ($('#button_work').hasClass('active')) {
    setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['sleep', 'live']);

    if (currentHouse == '2' && !isExtraDoorOn) {
      setVisibility(modelFurniture, false, ['work-back-door']);
      setVisibility(modelFurniture, true, ['work']);
    }

    if (currentHouse == '2' && isExtraDoorOn) {
      setVisibility(modelFurniture, true, ['work-back-door']);
      setVisibility(modelFurniture, false, ['work']);
    }

    if (currentHouse != '2') {
      setVisibility(modelFurniture, true, ['work']);
    }
  }
}

function annotationController(value) {
  if (value) {
    showAnnotations();
  } else {
    hideAnnotations();
  }
}

function dimensionsController(value) {
  if (value) {
    removeDimensions();
    [houseDiameter, houseHeight] = getHouseDimensions();
    createDimensions(houseDiameter, houseHeight);
  } else {
    removeDimensions();
  }

  checkLanguageForDimensions();

  if (value) {
    $('.canvas_dimensions').addClass('active');
  } else {
    $('.canvas_dimensions').removeClass('active');
  }

  setVisibility(modelHouse, value, ['man']);
}

function checkLanguageForDimensions() {
  let ui_id = 'ui_dimensions_part_120';

  switch (currentHouse) {
    case '0':
      ui_id = 'ui_dimensions_part_120';
      break;
    case '1':
      ui_id = 'ui_dimensions_part_170';
      break;
    case '2':
      ui_id = 'ui_dimensions_part_300';
      break;
    default:
      break;
  }

  updateUIlanguages(dataMain, [{ '.canvas_dimensions': ui_id }], currentLanguage);
}

//#endregion

//#region PRICE CALCULATION


function calculatePrice() {
  const totalAmountElement = document.getElementById('ar_total_price');
  totalAmount = 0;
  maximumLeadTimeWeeks = 0;

  let optionId = '';
  let activeOptions = [];



  // get active options array
  for (let i = 0; i < SharedParameterList.length - 4; i++) {
    if (SharedParameterList[i].type === 'string') {
      optionId = `option_${i}-${SharedParameterList[i].value}`;
      activeOptions.push(optionId);
    } else if (SharedParameterList[i].type === 'array-string') {
      for (let j = 0; j < SharedParameterList[i].value.length; j++) {
        if (SharedParameterList[i].value[j] == '1') {
          // optionId = `option_${i}-${j}`;
          optionId = `option_${i}-${OPTIONS_ID_ORDER_FOR_ADDONS[j]}`;
          if ($(`.${optionId}`).hasClass('disabled')) { continue; }
          activeOptions.push(optionId);
        }
      }
    }
  }
  
  let price = 0;

  allOptions.forEach((option) => {
    if (option === 'option_0-0') { // pod
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[0]}_${currentCurrency}`));
    } else if (option === 'option_0-1') { // office
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[1]}_${currentCurrency}`));
    } else if (option === 'option_0-2') { // studio
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[2]}_${currentCurrency}`));
    } else if (option === 'option_1-2') { // custom windows
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
      $(`.${option} .component_price`).html(
        `${formatPrice(price, currentCurrencySign)} ${getData(dataMain, 'ui_per_window', currentLanguage)}`
      );
    } else if (option === 'option_4-5') {
      price = '';
    } else {
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    }

    if ((option !== 'option_1-2')) { // NOT custom windows
      $(`.${option} .component_price`).html(formatPrice(price, currentCurrencySign));
    }
  });

  let optionPrice = 0;
  let optionLeadTime = 0;

  for (let i = 0; i < activeOptions.length; i++) {
    optionPrice = convertPriceToNumber(getData(dataPrice, activeOptions[i], `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    optionLeadTime = convertPriceToNumber(getData(dataPrice, activeOptions[i], `Lead_Time_${DATA_HOUSE_NAME[currentHouse]}`));

    if (activeOptions[i] === 'option_1-2') { // custom windows
      const windowsQty = Object.values(customWindows).reduce((total, array) => total + array.length, 0);
      const windowsCustomPrice = optionPrice * windowsQty;
      $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsCustomPrice, currentCurrencySign));
      if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
      totalAmount += windowsCustomPrice;
    } else if (activeOptions[i] === 'option_4-5') { // smart windows
      let windowsSmartPrice = (currentHouse == '2') ? optionPrice * 6 : optionPrice * 5;
      $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
      if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
      totalAmount += windowsSmartPrice;

      if (activeOptions.includes('option_1-2')) { // custom windows
        const windowsQty = Object.values(customWindows).reduce((total, array) => total + array.length, 0);
        windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
        $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
        if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
        totalAmount += windowsSmartPrice;
      } else if (!activeOptions.includes('option_1-2')) { // NOT custom windows
        if (activeOptions.includes('option_1-1')) { // viewport
          const windowsQty = 4;
          windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
          $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
          if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
          totalAmount += windowsSmartPrice;
        }
        if (activeOptions.includes('option_1-0')) { // strip
          let windowsQty = (currentHouse == '2') ? 5 : 4;
          windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
          $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
          if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
          totalAmount += windowsSmartPrice;
        }
      }
    } else {
      $(`.${activeOptions[i]} .component_price`).html(formatPrice(optionPrice, currentCurrencySign));
      if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
      totalAmount += optionPrice;
    }
  }

  if (!activeOptions.includes('option_0-2')) { // the house is not a studio
    $(`.option_4-3 .component_price`).html(`${getData(dataMain, 'ui_component_not_allowed', currentLanguage)}`);
  }

  if (!activeOptions.includes('option_4-5')) { // smart windows is not active
    const price = convertPriceToNumber(getData(dataPrice, 'option_4-5', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    $(`.option_4-5 .component_price`).html(`${formatPrice(price, currentCurrencySign)} ${getData(dataMain, 'ui_per_window', currentLanguage)}`);
  }

  totalAmount = totalAmount.toFixed(0);
  currentAmountString = formatPrice(totalAmount, currentCurrencySign);
  totalAmountElement.innerText = currentAmountString;
  updateShippingTaxInfo();
}

function convertPriceToNumber(priceString) {
  if (!priceString) return 0;

  const cleanedPrice = priceString.replace(/[^\d.,]/g, '');
  const priceWithDot = cleanedPrice.replace(',', '.');
  const priceNumber = parseFloat(priceWithDot);

  return priceNumber;
}


function getOrderList() {
  // let orderList = "ORDER" + '\n';

  // for (let i = 0; i < SharedParameterList.length; i++) {
  //   if (DATA_CHECKING_PRICE[i]) {
  //     const dataName = DATA_CHECKING_PRICE[i]?.name + ': ' +
  //       DATA_CHECKING_PRICE[i]?.value[SharedParameterList[i].value];

  //     if (SharedParameterList[i].groupIds) {
  //       for (let k = 0; k < SharedParameterList[i].groupIds.length; k++) {
  //         if (isGroupActive(SharedParameterList[i].groupIds[k])) {
  //           orderList += dataName + '\n';
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }
  // orderList = orderList + 'Amount: ' + totalAmount;
  // return orderList;
}

function formatPrice(price, currency, needToBeRounded = true, needToAddSpace = false) {
  if (
    !price
    && SharedParameterList[1].value[2] != 1 // custom windows
    // && SharedParameterList[4].value[3] != 1 // extra door
    && SharedParameterList[4].value[5] != 1 // extra door
    // && SharedParameterList[4].value[5] != 1 // smart glass
    && SharedParameterList[4].value[2] != 1 // smart glass
  ) {
    return getData(dataMain, 'ui_component_price_included', currentLanguage);
  }

  if (!price) { price = '' }
  if (!currency) { currency = '' }

  let result, firstSeparator;
  const priceString = (needToBeRounded) 
    ? Math.round(price).toString()
    : price.toString();

  switch (currency) {
    case 'грн':
      firstSeparator = ' ';
      break;
    case '$':
      firstSeparator = ',';
      break;
    case '€':
      firstSeparator = ',';
      break;
    default:
      firstSeparator = '.';
      currency = '';
      break;
  }

  const integerPart = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, firstSeparator);

  if (currency === 'грн') {
    result = `${integerPart} ${currency}`;
  } else {
    result = (needToAddSpace) 
      ? `${currency} ${integerPart}`
      : `${currency}${integerPart}`;
  }

  return result;
}

const store_endpoint_link = '';
// eslint-disable-next-line no-unused-vars
function SendProductInfo(element) {
  const resultString = getOrderList();
  console.log(resultString);

  // if(element.classList.contains('tbl-price-btn')){
  //   element.classList.add('load')
  // }
  // createProduct()

  var xhr = new XMLHttpRequest();
  xhr.open("POST", store_endpoint_link, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      //Request DONE
    }
  }
  xhr.send(resultString);
}

//#endregion

//#region SETTING COLORS

function setColorOfActiveOption(groupIDs, materialNames) {
  for (let i = 0; i < groupIDs.length; i++) {
    const group = mainGroups.find(element => element.id == groupIDs[i])?.group;

    for (let j = 0; j < group?.options.length; j++) {
      if (group.options[j].active) {
        const color = group.options[j].componentOptions[0].color;

        for (let k = 0; k < materialNames.length; k++) {
          setMaterialColor(materialNames[k], color);
        }

        break;
      }
    }

    break;
  }
}

//#endregion

//#region MESH / MATERIAL utils

function GetMesh(name, model = modelHouse) {
  var object = null;
  model?.traverse((o) => {
    if (o.isMesh) {
      if (name == o.name) {
        object = o;
      }
    }
  });

  return object;
}

function GetGroup(name, model = modelHouse) {
  var group = null;
  model?.traverse((o) => {
    if (o.isGroup) {
      if (name == o.name) {
        group = o;
      }
    }
  });

  return group;
}

// eslint-disable-next-line no-unused-vars
function GetMaterial(name, model = modelHouse) {
  var material = null;
  model.traverse((o) => {
    if (o.isMaterial) {
      console.log('🚀 ~ model.traverse ~ o.isMaterial:', o.isMaterial)
      if (name == o.material.name) {
        material = o.material;
      }
    }
  });

  return material;
}

function GetMaterialFromScene(name) {
  var material = null;
  scene.traverse((o) => {
    if (o.material) {
      if (name == o.material.name) {
        material = o.material;
      }
    }
  });

  return material;
}

// eslint-disable-next-line no-unused-vars
function setMaterialProperty(materialName, value, property = 'metalness') {
  const materialObject = GetMaterialFromScene(materialName);
  if (materialObject == null) {
    console.error(`ERROR: Material ${materialName} is not found !`);
    return;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!materialObject.hasOwnProperty(property)) {
    console.error(`ERROR: Material ${materialName} has no property ${property} !`);
    return;
  }

  materialObject[property] = value;
  console.log(`${property} for material ${materialName} was set up to ${value}`);
}

// eslint-disable-next-line no-unused-vars
function ChangeMaterialTilling(materialName, x, y) {
  var materialObject = GetMaterialFromScene(materialName);

  if (materialObject == null) { return; }

  if (materialObject.map != null) {
    materialObject.map.repeat.set(x, y);
  }

  if (materialObject.normalMap != null) {
    materialObject.normalMap.repeat.set(x, y);
  }

  if (materialObject.roughnessMap != null) {
    materialObject.roughnessMap.repeat.set(x, y);
  }

  if (materialObject.metalnessMap != null) {
    materialObject.metalnessMap.repeat.set(x, y);
  }

  if (materialObject.aoMap != null) {
    materialObject.aoMap.repeat.set(x, y);
  }
}

// eslint-disable-next-line no-unused-vars
function ChangeMaterialOffset(materialName, x, y) {
  var materialObject = GetMaterialFromScene(materialName);

  if (materialObject == null) { return; }

  if (materialObject.map != null) {
    materialObject.map.offset.set(x, y);
  }

  if (materialObject.normalMap != null) {
    materialObject.normalMap.offset.set(x, y);
  }

  if (materialObject.roughnessMap != null) {
    materialObject.roughnessMap.offset.set(x, y);
  }

  if (materialObject.metalnessMap != null) {
    materialObject.metalnessMap.offset.set(x, y);
  }

  if (materialObject.aoMap != null) {
    materialObject.aoMap.offset.set(x, y);
  }
}

function getMeshesWithMaterial(model, materialName) {
  const meshesWithMaterial = [];

  model.traverse((object) => {
    if (object.isMesh && object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          if (material.name === materialName) {
            meshesWithMaterial.push(object.name);
          }
        });
      } else if (object.material.name === materialName) {
        meshesWithMaterial.push(object.name);
      }
    }
  });

  return meshesWithMaterial;
}

function setVisibility(model, value, meshArray = []) {
  if (model) {
    if (value == undefined && value == null) {
      return;
    }

    if (meshArray.length === 0) {
      model.visible = value;
      return;
    }

    for (let i = 0; i < meshArray.length; i++) {
      model.traverse((o) => {
        if (o.name == meshArray[i]) {
          o.visible = value;
        }
      });
    }
  }
}

function setMaterialColor(materialName, color) {
  const materialObject = GetMaterialFromScene(materialName);
  if (materialObject == null) { return; }
  materialObject.color.set(color);
  materialObject.needsUpdate = true;
}

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');
const textureCache = {};

function loadTexture(textureValue, tilingValue = 1) {
  applyTexture(textureValue, tilingValue);

  function applyTexture(textureValue, tilingValue) {
    const textureProperties = {
      'Map': {},
      'Normal': {},
      'Roughness': {},
      'Metalness': {},
      'Emission': {},
      'AO': {},
      'Gloss': {},
    };

    for (const node in textureProperties) {
      const value = textureValue[node.toLowerCase()];
      if (!value || value === 'null') continue;

      if (value && !textureCache[value]) {
        textureLoader.load(value, (texture) => {
          // console.log("texture is loading");
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestMipmapNearestFilter;
          texture.anisotropy = 16;
          texture.flipY = false;
          setTiling(texture, tilingValue);
          textureCache[value] = texture;
        }, undefined, () => {
          console.error('An error happened.');
        });
      }
    }
  }

  function setTiling(texture, tiling) {
    texture.repeat.set(tiling, tiling);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
  }
}

function setObjectTexture(materialNames, textureValue, tilingValue = 1, model = modelHouse) {
  model?.traverse((o) => {
    if (o.material) {
      for (let i = 0; i < materialNames.length; i++) {
        if (o.material.name == materialNames[i]) {
          applyTexture(o.material, textureValue, tilingValue);
        }
      }
    }
  });

  function applyTexture(material, textureValue, tilingValue) {
    const textureProperties = {
      'Map': {
        apply: (material, texture) => {
          texture.encoding = THREE.sRGBEncoding;
          material.map = texture;
          if (texture) material.map.needsUpdate = true;
        },
      },
      'Normal': {
        apply: (material, texture) => {
          material.normalMap = texture;
          if (texture) material.normalMap.needsUpdate = true;
        },
      },
      'Roughness': {
        apply: (material, texture) => {
          material.roughnessMap = texture;
          if (texture) material.roughnessMap.needsUpdate = true;
        },
      },
      'Metalness': {
        apply: (material, texture) => {
          material.metalnessMap = texture;
          if (texture) material.metalnessMap.needsUpdate = true;
        },
      },
      'Emission': {
        apply: (material, texture) => {
          material.emissiveMap = texture;
          if (texture) material.emissiveMap.needsUpdate = true;
        },
      },
      'AO': {
        apply: (material, texture) => {
          material.aoMap = texture;
          if (texture) material.aoMap.needsUpdate = true;
        },
      },
      'Gloss': {
        apply: (material) => {
          material.metalness = 1;
          material.roughness = 0.2;
        },
      },
    };

    for (const node in textureProperties) {
      const value = textureValue[node.toLowerCase()];
      if (!value) continue;

      if (value === 'null') {
        textureProperties[node].apply(material, null);
        material.needsUpdate = true;
        continue;
      }

      if (!textureCache[value]) {
        textureLoader.load(value, (texture) => {
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestMipmapNearestFilter;
          texture.anisotropy = 16;
          texture.flipY = false;
          setTiling(texture, tilingValue);
          textureCache[value] = texture;

          textureProperties[node].apply(material, texture);
          material.needsUpdate = true;
        }, undefined, () => {
          console.error('An error happened.');
        });
      } else {
        textureProperties[node].apply(material, textureCache[value]);
        material.needsUpdate = true;
      }
    }
  }

  function setTiling(texture, tiling) {
    texture.repeat.set(tiling, tiling);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
  }
}

// eslint-disable-next-line no-unused-vars
function getMeshDimensions(object) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(object);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  const width = size.x;
  const height = size.y;
  const depth = size.z;

  return { width: width, height: height, depth: depth };
}

function setMeshPosition(model, meshName, x = 0, y = 0, z = 0) {
  if (!model || !meshName) {
    console.warn('Model, mesh name, or new position not provided.');
    return;
  }

  const newPosition = new THREE.Vector3(x, y, z);

  model.traverse((object) => {
    if (object.isMesh && object.name === meshName) {
      object.position.set(newPosition.x, newPosition.y, newPosition.z);
      console.log(`Position of mesh '${meshName}' set to:`, newPosition);
    }
  });
}

// eslint-disable-next-line no-unused-vars
function getMaterialsList(parent) {
  const materialsSet = new Set();

  parent.traverse((o) => {
    if (o.material) {
      materialsSet.add(o.material.name);
    }
  });

  return Array.from(materialsSet);
}

// eslint-disable-next-line no-unused-vars
function getMeshNamesList(parent) {
  const names = [];
  parent.traverse((o) => {
    if (o.name) {
      names.push(o.name);
    }
  });
  return names;
}

// eslint-disable-next-line no-unused-vars
function getGroupNamesList(parent, searchString = '') {
  const groupNames = [];
  const normalizedSearchString = searchString.toLowerCase();

  parent.traverse((object) => {
    if (object.isGroup && object.name) {
      const normalizedGroupName = object.name.toLowerCase();
      if (!searchString || normalizedGroupName.includes(normalizedSearchString)) {
        groupNames.push(object.name);
      }
    }
  });

  return groupNames;
}

function disableModelCastingShadows(model) {
  if (!model) return;

  model.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = false;
    }
  });
}

function disableModelReceivingShadows(model) {
  if (!model) return;

  model.traverse((object) => {
    if (object.isMesh) {
      object.receiveShadow = false;
    }
  });
}

//#endregion

//#region CLIPBOARD

const copyToClipboard = (infoSharingInput) => {
  var aux = document.createElement('input');
  aux.setAttribute('value', infoSharingInput.value);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
}

//#endregion

//#region QR

function CreateQR() {
  const qr = qrcode[0];
  if (qr == null) { return; }

  while (qr.hasChildNodes()) {
    qr.removeChild(qr.lastChild);
  }

  qrScaned = 1;

  const uri = GetURLWithParameters();
  const encoded = encodeURIComponent(uri);
  const qrImg = new Image();
  qrImg.src = 'https://quickchart.io/qr?text=' + encoded + "&size=200";

  qrImg.addEventListener("load", () => {
    qr.appendChild(qrImg);
  });
}

async function CheckQRMobile() {
  // eslint-disable-next-line no-unused-vars
  await waitFor(_ => loaded === true);

  if (qrScaned == 1) {
    if (getMobileOperatingSystem() == "Android" || getMobileOperatingSystem() == "iOS") {
      OpenAR();
    }

    qrScaned = 0;
  }
}

//#endregion

//#region AR

function PrepareAR() {
  jQuery(document).ready(function ($) {
    modelViewer = $('#marevo_model');
    const arPromt = $('#ar-prompt');

    modelViewer[0].addEventListener('ar-status', (event) => {
      if (event.detail.status == 'session-started') {
        arPromt[0].style.display = "block";
      } else if (event.detail.status == 'not-presenting') {
        arPromt[0].style.display = "none";
        modelViewer[0].resetScene();
      }
      else {
        arPromt[0].style.display = "none";
      }
    });
  });
}

async function OpenAR() {
  ComputeMorphedAttributes();

  ImportScene(scene);
}

function OpenARorQR() {
  if (getMobileOperatingSystem() == "Android" || getMobileOperatingSystem() == "iOS") {
    OpenAR();
    return;
  }

  CreateQR();

  popup.toggleClass('active');
  popup.addClass('arqr');
  popup.removeClass('share');
  popup.removeClass('info');
  popupItemQr.toggleClass('active');
  popupItemSharing.removeClass('active');
  popupItemLoupe.removeClass('active');
}

//IMPORT
async function ImportScene(newScene) {
  await modelViewer[0].importScene(newScene);
  modelViewer[0].activateAR();
}

//#endregion

//#region URL PARAMETERS

function EmptyURLParams() {
  $('.popup_select').removeClass('hidden');
  $('#js-loader').addClass('invisible');
  setDefaultValuesForGroups();
  ParseAllGroups();
}

function GetParameterSplitString(array) {
  if (array.length == 0) { return; }

  var params = [];
  for (let index = 0; index < array.length; index++) {
    params.push(array[index].splitValue);
  }
  return new RegExp(`${params.join('|')}`)
}

function GetSharedArrayValues(arrayValue, type) {
  var output = [];

  if (arrayValue == undefined || arrayValue == null) { return output; }
  if (arrayValue == '') { return output; }

  var options = arrayValue.split('-');
  for (let i = 0; i < options.length; i++) {
    switch (type) {
      case 'string':
        output.push(options[i]);
        break;
      case 'int':
        output.push(parseInt(options[i]));
        break;
      case 'float':
        output.push(parseFloat(options[i]));
        break;
    }
  }

  return output;
}

function ReadURLParameters(callback) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries();
  let parseParams = '';

  for (const entry of entries) {
    if (entry[0] == parametersKey) {
      parseParams = entry[1];
      break;
    }
  }

  if (!parseParams?.trim()) {
    paramsLoaded = true;
    EmptyURLParams();
    // if (callback != null) { callback(); }
    return;
  }

  const paramArray = parseParams.split(GetParameterSplitString(SharedParameterList));

  if (paramArray.length == 0) {
    paramsLoaded = true;
    EmptyURLParams();
    // if (callback != null) { callback(); }
    return;
  }

  isUrlEmpty = false;
  var arrayValue;

  for (let index = 0; index < SharedParameterList.length; index++) {
    const element = SharedParameterList[index];

    switch (element.type) {
      case 'string':
        element.value = paramArray[index + 1]?.toString();
        break;
      case 'int':
        element.value = parseInt(paramArray[index + 1]);
        break;
      case 'float':
        element.value = parseFloat(paramArray[index + 1]);
        break;
      case 'array-string':
        arrayValue = paramArray[index + 1]?.toString();
        element.value = GetSharedArrayValues(arrayValue, 'string');
        break;
      case 'array-int':
        arrayValue = paramArray[index + 1]?.toString();
        element.value = GetSharedArrayValues(arrayValue, 'int');
        break;
      case 'array-float':
        arrayValue = paramArray[index + 1]?.toString();
        element.value = GetSharedArrayValues(arrayValue, 'float');
        break;
    }

    if (element.id == 'qr') {
      qrScaned = element.value;
    }
  }

  if (callback != null) callback();

  CheckQRMobile();
}

async function ApplyURLParameters() {
  if (paramsLoaded) {
    return;
  }

  for (const target of mainGroups) {
    const group = target.group;

    for (let i = 0; i < SharedParameterList.length; i++) {
      const element = SharedParameterList[i];

      if (!element.groupIds) { continue; }
      if (!element.groupIds.includes(target.id)) { continue; }

      if (element.applyURLActionReturn) {
        if (element.applyURLAction != null) {
          element.applyURLAction();
        }

        continue;
      }

      switch (target.type) {
        case 'select':
        case 'select_no_photo':
          if (element.value == '') { break; }

          const option = group.options.find(o => o.component_id == element.value);

          if (option == null) { break; }
          if (option.element.classList.contains('active')) { break; }

          for (let i = 0; i < group.options.length; i++) {
            const element = group.options[i];

            if (element.element.classList.contains('active')) {
              element.element.classList.remove('active');
            }
          }

          if (group.element.classList.contains('disabled')) {
            option.element.classList.add('active');
            break;
          }

          option.element.click();
          break;
        case 'range':
          group.input.value = element.value;
          group.input.dispatchEvent(new Event('input'));
          break;
        case 'checkbox':
          for (let i = 0; i < element.value.length; i++) {
            const value = element.value[i];
            if (value == '1') {
              group.options[i].active = true;
              group.options[i].element.classList.add('active');
            }
          }
          break;
        case 'number':
          group.input.value = element.value;
          group.input.dispatchEvent(new Event('input'));
          break;
        case 'dropdown':
          if (element.value == '') { break; }

          group.select.value = element.value;
          group.options[group.select.value].active = true;
          group.options[group.select.value].element.classList.add("active");
          // CASTOM SELECT
          $('select').val(group.select.value);
          $('select').trigger('refresh');
          break;
        case 'text':
          break;
      }

      if (element.applyURLAction != null) {
        element.applyURLAction();
      }
    }
  }

  paramsLoaded = true;
}

function WriteURLParameters() {
  if (!paramsLoaded) { return; }
  qrScaned = 0;

  if (!delayForWriteURL) {
    delayForWriteURL = true;
    promiseDelay(100, function () {
      history.pushState(null, 'marevo', GetURLWithParameters());
      delayForWriteURL = false;
    });
  }
}

function GetParametersString() {
  parametersValue = '';

  for (let index = 0; index < SharedParameterList.length; index++) {
    const element = SharedParameterList[index];

    if (element.value == undefined || element.value == null) { continue; }

    switch (element.type) {
      case 'array-string':
      case 'array-int':
      case 'array-float':
        parametersValue += element.splitValue;

        for (var i = 0; i < element.value.length; i++) {
          if (i == element.value.length - 1) {
            parametersValue += element.value[i];
          } else {
            parametersValue += element.value[i] + '-';
          }
        }
        break;
      default:
        parametersValue += element.splitValue + element.value;
        break;
    }
  }

  //You can do something here...
  return parametersValue;
}

function GetURLWithParameters() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries();

  var url = location.protocol + '//' + location.host + location.pathname + '?';

  var configEmpty = true;

  for (const entry of entries) {
    if (entry[0] == parametersKey) {
      url += parametersKey + '=' + GetParametersString() + '&';
      configEmpty = false;
    } else {
      url += entry[0] + '=' + entry[1] + '&';
    }
  }

  if (configEmpty) {
    url += parametersKey + '=' + GetParametersString();
  }

  if (url.endsWith('&')) {
    url = url.substring(0, url.length - 1);
  }

  return url;
}

// eslint-disable-next-line no-unused-vars
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

//#endregion

//#region UI FUNCTIONS

async function PrepareUI() {
  // *****   POP-UPs   *****
  jQuery(document).ready(function ($) {
    const BtnsAR = $('.button_ar_qr');
    const canvasBtnShare = $('#button_share_url');

    BtnsAR.removeClass('hidden');

    popup = $('.popup');
    popupItemSharing = $('#popup-item-share');
    popupItemQr = $('#popup-item-qr');
    popupItemLoupe = $('#popup-item-info');
    qrcode = $('#qrcode');

    const popupSharingIco = $('.popup-sharing-ico');
    const infoSharingInput = $('#info-sharing-input');
    const popupClose = $('.popup-close');
    const popupOverlay = $('.popup-overlay');

    popupSharingIco.on('click', function () {
      copyToClipboard(infoSharingInput[0]);
    });

    popupClose.on('click', function () {
      popup?.removeClass('active');
      popup?.removeClass('share');
      popup?.removeClass('arqr');
      popup?.removeClass('info');
      popupItemQr?.removeClass('active');
      popupItemSharing?.removeClass('active');
      popupItemLoupe?.removeClass('active');

      document.documentElement.classList.remove('popup-open');
    });

    popupOverlay.on('click', function () {
      popup?.removeClass('active');
      popup?.removeClass('share');
      popup?.removeClass('arqr');
      popup?.removeClass('info');
      popupItemQr?.removeClass('active');
      popupItemSharing?.removeClass('active');
      popupItemLoupe?.removeClass('active');

      document.documentElement.classList.remove('popup-open');
    });

    canvasBtnShare?.on('click', function () {
      sharingHandler();
    });

    BtnsAR.on('click', function () {
      OpenARorQR();
    });

    const sharingHandler = () => {
      popup.toggleClass('active');
      popup.removeClass('arqr');
      popup.addClass('share');
      popup.removeClass('info');
      popupItemSharing.toggleClass('active');
      popupItemQr.removeClass('active');
      popupItemLoupe.removeClass('active');

      document.documentElement.classList.add('popup-open');

      infoSharingInput[0].value = GetURLWithParameters();
    }

    currentCurrency = $('.currency-picker select').val() || DEFAULT_CURRENCY;
  });

  jQuery(document).ready(function () {
    $('.language-picker select').on('change', function () {
      currentLanguage = $(this).val();
      let valueForURL;
      switch (currentLanguage) {
        case 'EN':
          valueForURL = '0';
          break;
        case 'FR':
          valueForURL = '1';
          break;
        case 'ES':
          valueForURL = '2';
          break;
        default:
          valueForURL = '0';
          break;
      }

      SharedParameterList[5].value = valueForURL;
      CheckChanges();
      WriteURLParameters();

      updateUIlanguages(dataAnnotations, uiAnnotationsLanguages, `SHORT_${currentLanguage}`);
      updateUIlanguages(dataAnnotations, uiAnnotationsLongLanguages, `LONG_${currentLanguage}`);
    });

    $('.currency-picker select').on('change', function () {
      currentCurrency = $(this).val();
      currentCurrencySign = CURRENCY_SIGN[currentCurrency] || CURRENCY_SIGN['USD'];

      let valueForURL;
      switch (currentCurrency) {
        case 'USD':
          valueForURL = '0';
          break;
        case 'EUR':
          valueForURL = '1';
          break;
        default:
          valueForURL = '0';
          break;
      }

      SharedParameterList[6].value = valueForURL;
      CheckChanges();
      WriteURLParameters();
    });
  });

  // Buttons handlers
  jQuery(document).ready(function () {
    cameraBtnHandlers();
    annotationsBtnHandler();
    dimensionsBtnHandler();
    furnitureBtnHandler();
    furnitureRadioBtnsHandlers();
    notificationHandler();
    summaryBtnsHandler();
    modelSelectorHandler();
    getPdfBtnHandler();
    bookTimeBtnHandler();
    bookConsultationAndDepositBtns();
    // calculateTaxHandler();
  });

  // Date and Tax popups
  jQuery(document).ready(function () {
    $('.menu__footer_delivery_info .menu__footer__info_icon').on('click', function () {
      $('.popup__info_date').toggleClass('hidden');
    });

    // $('#calculate_shipping_tax').on('click', function () {
    //   const savedEmail = localStorage.getItem('userEmail');
  
    //   if (savedEmail) {
    //     $('#popup_tax_email').val(savedEmail);
    //   }

    //   $('.popup__info_tax').toggleClass('hidden');
    // });

    $('.menu__footer_payment_info .menu__footer__calc_icon').on('click', function () {
      $('.popup__info_tax').toggleClass('hidden');
    });

    $('.popup__info_close').on('click', function () {
      $('.popup__info').addClass('hidden');
    });

    $('.popup_tax__close_btn').on('click', function () {
      $('.popup__info').addClass('hidden');
    });
  });

  // Contact form popup
  jQuery(document).ready(function () {
    const $form = $('#popupForm');
    const $nameInput = $('#form_name');
    const $emailInput = $('#form_email');
    const $zipcodeInput = $('#form_zipcode');
  
    $nameInput.on('input', () => {
      validateForm();
    });

    $emailInput.on('input', () => {
      validateForm();
    });

    $zipcodeInput.on('input', () => {
      validateForm();
    });
  
    $form.on('submit', async function (event) {
      event.preventDefault();
      
      userName = $nameInput.val();
      userEmail = $emailInput.val();
      userZipcode = $zipcodeInput.val();

      localStorage.setItem('userName', $nameInput.val());
      localStorage.setItem('userEmail', $emailInput.val());
      localStorage.setItem('userZipcode', $emailInput.val());

      try {
        stateSalesTax = +getTaxRate(userZipcode);
        shippingDistance = await getDistance(userZipcode);
        console.log("🚀 ~ stateSalesTax, shippingDistance:", stateSalesTax, shippingDistance);
        updateShippingTaxInfo();
      } catch (error) {
        console.error('Error fetching distance:', error);
      } finally {
        closeContactForm();
      }
    });
  
    validateForm();
  });
  
  // function validateTaxForm() {
  //   const email = $('#popup_tax_email').val();
  //   const zipcode = $('#popup_tax_zipcode').val();
  //   const emailIsValid = email.includes('@') && email.includes('.');
  //   const zipcodeIsValid = zipcode.length >= 5;
  //   return emailIsValid && zipcodeIsValid;
  // }

  // $('#popup_tax_email, #popup_tax_zipcode').on('input', function() {
  //   if (validateTaxForm()) {
  //     $('#popup_tax_calculate').prop('disabled', false);
  //   } else {
  //     $('#popup_tax_calculate').prop('disabled', true);
  //   }
  // });
}

function validateForm() {
  const isNameValid = $('#form_name').val().trim() !== '';
  const isEmailValid = validateEmail($('#form_email').val().trim());
  
  const zipcodeIsValid = true;
  // const zipcodeIsValid = $('#form_zipcode').val().trim().length >= 5;
  
  const isFormValid = isNameValid && isEmailValid && zipcodeIsValid;

  if (isFormValid) {
    $('#submitButton').prop('disabled', false);
  } else {
    $('#submitButton').prop('disabled', true);
  }
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function calculateAndSetEstimateDates() {
  const estimateDate = getData(dataPrice, 'shipDate', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`);
  const shipDateString = getDatesStrings(estimateDate, maximumLeadTimeWeeks, currentLanguage).shipDateString;
  const prepaymentDateString = getDatesStrings(estimateDate, maximumLeadTimeWeeks, currentLanguage).prepaymentDateString;
  const deliveryDateString = getDatesStrings(estimateDate, maximumLeadTimeWeeks, currentLanguage).deliveryDateString;
  const weeksAhead = getDatesStrings(estimateDate, maximumLeadTimeWeeks, currentLanguage).differenceInWeeks;
  const textPart1 = getData(dataMain, 'ui_date_popup_text_1', currentLanguage);
  const textPart2 = getData(dataMain, 'ui_date_popup_text_2', currentLanguage);
  $('#delivery_info_date').text(shipDateString);
  $('.popup__info_content_date').html(`Ships ${shipDateString}. ${textPart1} ${maximumLeadTimeWeeks} ${textPart2}`);
  
  $('#prepayment_title').text(prepaymentDateString);
  $('#ship_day_title').text(shipDateString);
  $('#delivery_title').text(deliveryDateString);

  const depositTextString = getData(dataMain, 'ui_timeline_today_subtitle', currentLanguage);
  const depositAmount = convertPriceToNumber(getData(dataPrice, 'depositAmount', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  const depositAmountString = formatPrice(depositAmount, currentCurrencySign);
  const prepaynemtTextString = getData(dataMain, 'ui_timeline_prepayment_subtitle', currentLanguage);
  const prepaynemtAmountString = formatPrice(totalAmount / 2 - depositAmount, currentCurrencySign);
  const finalPaymentTextString = getData(dataMain, 'ui_timeline_ship_day_subtitle', currentLanguage);
  const finalPaymentAmountString = formatPrice(totalAmount - totalAmount / 2, currentCurrencySign);
  const todayTextPart1 = getData(dataMain, 'ui_timeline_today_text', currentLanguage);
  const todayTextPart2 = getData(dataMain, 'ui_timeline_today_text_2', currentLanguage);

  $('#today_subtitle').text(`${depositAmountString} ${depositTextString}`);
  $('#today_text').text(`${todayTextPart1} ${weeksAhead} ${todayTextPart2}`);
  $('#prepayment_subtitle').text(`${prepaynemtTextString} (${prepaynemtAmountString})`);
  $('#ship_day_subtitle').text(`${finalPaymentTextString} (${finalPaymentAmountString})`);
}

function getDatesStrings(dateStr, leadTimeInWeeks = 3, lang = 'EN', prepaymentDateWeeks = -4, deliveryDateWeeks = 2) {
  const monthNames = {
    EN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    FR: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    ES: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  };

  const formatDate = (date, language) => {
    const month = monthNames[language][date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    if (language === 'EN') {
      return `${month} ${day}, ${year}`;
    } else if (language === 'FR' || language === 'ES') {
      return `${day} ${month} ${year}`;
    }
  };

  let inputDate;

  if (!dateStr) {
    inputDate = new Date();
  } else {
    let [month, day, year] = dateStr.split('/');

    if (year && year.length === 2) {
      year = (year >= '80' ? '19' : '20') + year;
    }

    inputDate = new Date(year, month - 1, day);

    if (isNaN(inputDate.getTime())) {
      inputDate = new Date();
    }
  }

  let currentDate = new Date();
  let newDate = new Date();
  newDate.setDate(currentDate.getDate() + leadTimeInWeeks * 7);

  const resultDate = (inputDate > newDate) ? inputDate : newDate;
  const shipDateString = formatDate(resultDate, lang);

  let prepaymentDate = new Date(resultDate);
  let deliveryDate = new Date(resultDate);

  prepaymentDate.setDate(resultDate.getDate() + prepaymentDateWeeks * 7);
  deliveryDate.setDate(resultDate.getDate() + deliveryDateWeeks * 7);
  const prepaymentDateString = formatDate(prepaymentDate, lang);
  const deliveryDateString = formatDate(deliveryDate, lang);

  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 1);
  const timeDifference = deliveryDate.getTime() - futureDate.getTime();
  const differenceInWeeks = Math.round(timeDifference / (7 * 24 * 60 * 60 * 1000));

  return {shipDateString, prepaymentDateString, deliveryDateString, differenceInWeeks};
}


// *****   MENU-INFO   *****
let lastOpenElementId = '';

function menuInfoBtnHandler(opt) {

  $(opt.element).find('.image-info').on('click', function (event) {
    event.stopPropagation();

    // title
    const infoTitle = getData(dataMain, $(this).attr('data-option'), currentLanguage);
    $('#menu_info_title').html(infoTitle);

    // description image
    if (getData(dataMain, $(this).attr('data-option'), `DESC_IMG`).toLowerCase() !== 'null' &&
      getData(dataMain, $(this).attr('data-option'), `DESC_IMG`) !== '') {
      const imgLink = `./src/images/info/${getData(dataMain, $(this).attr('data-option'), `DESC_IMG`)}`;
      const descrImageHTML = `
        <div class="ar_menu_info_content__image">
          <img src="${imgLink}">
        </div>
      `;

      if ($('#menu_info_content_descr .ar_menu_info_content__image').length) {
        $('#menu_info_content_descr .ar_menu_info_content__image').remove();
      }

      $('#menu_info_content_descr .ar_menu_info_content__text').before(descrImageHTML);
    } else {
      $('#menu_info_content_descr .ar_menu_info_content__image').remove();
    }

    // description text
    let descrText = getData(dataMain, $(this).attr('data-option'), `DESC_${currentLanguage}`);


    if (descrText !== '' && descrText.toLowerCase() !== 'null') {
      if (descrText[0] === '"' && descrText[descrText.length - 1] === '"') {
        descrText = descrText.slice(1, -1);
      }
    } else {
      descrText = '';
    }

    uiMenuInfoLanguages[0]['#menu_info_title'] = $(this).attr('data-option');
    uiMenuInfoDescLanguages[0]['#menu_info_content_descr .ar_menu_info_content__text'] = $(this).attr('data-option');

    $('#menu_info_content_descr .ar_menu_info_content__text').html(descrText);

    // specs image
    if (getData(dataMain, $(this).attr('data-option'), `SPECS_IMG`).toLowerCase() !== 'null' &&
      getData(dataMain, $(this).attr('data-option'), `SPECS_IMG`) !== '') {
      const imgLink = `./src/images/info/${getData(dataMain, $(this).attr('data-option'), `SPECS_IMG`)}`;
      const specsImageHTML = `
        <div class="ar_menu_info_content__image">
          <img src="${imgLink}">
        </div>
      `;

      if ($('#menu_info_content_specs .ar_menu_info_content__image').length) {
        $('#menu_info_content_specs .ar_menu_info_content__image').remove();
      }

      $('#menu_info_content_specs .ar_menu_info_content__text').before(specsImageHTML);
    } else {
      $('#menu_info_content_specs .ar_menu_info_content__image').remove();
    }

    // specs text
    let specsText = getData(dataMain, $(this).attr('data-option'), `SPECS_${currentLanguage}`);

    if (specsText !== '' && specsText.toLowerCase() !== 'null') {
      if (specsText[0] === '"' && specsText[specsText.length - 1] === '"') {
        specsText = specsText.slice(1, -1);
      }
    } else {
      specsText = '';
    }

    uiMenuInfoSpecsLanguages[0]['#menu_info_content_specs .ar_menu_info_content__text'] = $(this).attr('data-option');

    $('#menu_info_content_specs .ar_menu_info_content__text').html(specsText);

    $('#menu_info_tab_descr').click();

    // check the descr content available
    if ($('#menu_info_content_descr .ar_menu_info_content__text').html() === '' &&
      $('#menu_info_content_descr .ar_menu_info_content__image').length === 0) {
      $('#menu_info_tab_specs').click();
      $('#menu_info_tab_descr').addClass('disabled');
      $('#menu_info_tab_descr').removeClass('active');
    } else {
      $('#menu_info_tab_descr').removeClass('disabled');
    }

    // check the specs content available
    if ($('#menu_info_content_specs .ar_menu_info_content__text').html() === '' &&
      $('#menu_info_content_specs .ar_menu_info_content__image').length === 0) {
      $('#menu_info_tab_specs').addClass('disabled');
      $('#menu_info_tab_specs').removeClass('disactiveabled');
    } else {
      $('#menu_info_tab_specs').removeClass('disabled');
    }

    // hide menu info tabs if there is no content
    if ($('#menu_info_tab_descr').hasClass('disabled') || $('#menu_info_tab_specs').hasClass('disabled')) {
      $('.ar_menu_info__tabs').hide();
    } else {
      $('.ar_menu_info__tabs').show();
    }

    
    // show or hide menu info
    if (this.id === lastOpenElementId) {
      $('.ar_menu_info_container').removeClass('active');
      lastOpenElementId = '';
    } else {
      $('.ar_menu_info_container').addClass('active');
      lastOpenElementId = this.id;
    }
  });
}

// *****   Camera Btns   *****
function cameraBtnHandlers() {

  $('#button_camera_inside').on('click', function (event) {
    event.stopPropagation();
    $(this).toggleClass('hidden');
    $('#button_camera_outside').toggleClass('hidden');
    $('.canvas_btn_camera').addClass('disabled');

    flyCameraTo('outXrays', 'inside', () => {
      renderer.clippingPlanes = [];
      notClippingMaterials = ['floor'];
      current3Dmodel = modelHouse;
      isLocalClippingOn = true;
      $('.canvas_btn_camera').removeClass('disabled');
    });

    isCameraInside = true;
  });

  $('#button_camera_outside').on('click', function (event) {
    event.stopPropagation();
    $(this).toggleClass('hidden');
    $('#button_camera_inside').toggleClass('hidden');

    $('.canvas_btn_camera').addClass('disabled');

    // flyCameraTo('outMain', 'outside', () => {
    //   $('.canvas_btn_camera').removeClass('disabled');
    // });

    flyCameraTo('outMain', 'outside', () => {
      isLocalClippingOn = false;
      $('.canvas_btn_camera').removeClass('disabled');
    });

    isCameraInside = false;
  });
}

// *****   Model Selector Btns   *****
function modelSelectorHandler() {
  $('#select_btn_pod').on('click', function () {
    $('.popup_select').addClass('hidden');
    SharedParameterList[0].value = '0';
    StartSettings();
    $('#title_list__item_0').click();
  });

  $('#select_btn_office').on('click', function () {
    $('.popup_select').addClass('hidden');
    SharedParameterList[0].value = '1';
    StartSettings();
    $('#title_list__item_0').click();
  });

  $('#select_btn_studio').on('click', function () {
    $('.popup_select').addClass('hidden');
    SharedParameterList[0].value = '2';
    StartSettings();
    $('#title_list__item_0').click();
  });
}

// *****   Annotation Btn   *****
function annotationsBtnHandler() {
  $('#button_annotation').on('click', function () {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      if ($('#button_dimensions').hasClass('active')) {
        $('#button_dimensions').trigger('click');
      }

      annotationController(true);
    } else {
      annotationController(false);
    }
  });
}

// *****   Dimensions Btn   *****
function dimensionsBtnHandler() {
  $('#button_dimensions').on('click', function () {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      if ($('#button_annotation').hasClass('active')) {
        $('#button_annotation').trigger('click');
      }
      
      if ($('#button_furniture').hasClass('active')) {
        $('#button_furniture').trigger('click');
      }

      dimensionsController(true);

      if (isCameraInside) { 
        $('#button_camera_outside').click();
        flyCameraTo('outDimensions', 'outside');
      } else {
        flyCameraTo('outDimensions', 'outside');
      }
    } else {
      dimensionsController(false);
    }
  });
}

// *****   Furniture Btn   *****
function furnitureBtnHandler() {
  $('#button_furniture').on('click', function () {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      !isCameraInside && $('#button_camera_inside').click();
      
      if ($('#button_dimensions').hasClass('active')) {
        $('#button_dimensions').trigger('click');
      }

      furnitureController(true);
      updateFurnitureSet();
    } else {
      furnitureController(false);
    }

    updateFurnitureSet();
  });
}

function furnitureRadioBtnsHandlers() {
  $('#button_sleep').on('click', function () {
    $(this).toggleClass('active');
    $('#button_work').removeClass('active');
    $('#button_live').removeClass('active');
    updateFurnitureSet();
  });

  $('#button_work').on('click', function () {
    $(this).toggleClass('active');
    $('#button_sleep').removeClass('active');
    $('#button_live').removeClass('active');
    updateFurnitureSet();
  });

  $('#button_live').on('click', function () {
    $(this).toggleClass('active');
    $('#button_sleep').removeClass('active');
    $('#button_work').removeClass('active');
    updateFurnitureSet();
  });
}

function disableFurnitureBtn() {
  if ($('#button_furniture').hasClass('active')) {
    $('#button_furniture').trigger('click');
  }

  $('#button_furniture').addClass('disabled');

}

function enableFurnitureBtn() {
  $('#button_furniture').removeClass('disabled');
}

function notificationHandler() {
  $('.option_1-2').on('click', function () {
    if (!$(this).hasClass('active')) {
      $('#canvas_notification').removeClass('hidden');

      setTimeout(function () {
        $('#canvas_notification').addClass('hidden');
      }, 2500);
    }
  });
}

function summaryBtnsHandler() {
  $('#ar_button_order').on('click', function () {
    if (!isCameraInside) {
      proceedSummaryAndPdf();
    } else {
      flyCameraTo('outMain', 'outside', () => {
        proceedSummaryAndPdf();
      });
    }
  });

  $('#backToConfiguration').on('click', function () {
    closeSummary();
  });

  $('.summary__popup-overlay .popup-close').on('click', function () {
    closeSummary();
  });

  $('.contact_form__popup-overlay .popup-close').on('click', function () {
    closeSummary();
    closeContactForm();
  });

  $('.contact_form__popup-overlay .contact_form__close_btn').on('click', function () {
    closeSummary();
    closeContactForm();
  });
}

function proceedSummaryAndPdf() {
  CreateImageList();
  collectSummary();
  openSummary();
  $('.summary__popup-overlay').scrollTop(0);
}

function getPdfBtnHandler() {
  $('#summary_download_pdf_btn').on('click', function () {
    generatePDF(currentHouse, dataMain, currentLanguage, imageSources, pdfContentData, userName, userEmail, userZipcode);
  });
}

function bookTimeBtnHandler() {
  $('#summary_book_time_btn').on('click', function() {
    // window.open(CALENDLY_LINK, '_self'); // same browser window
    window.open(CALENDLY_LINK, '_blank'); // new browser window
  });
}

function bookConsultationAndDepositBtns() {
  $('#ar_button_book_consult_1, #ar_button_book_consult_2').on('click', function() {
    $('.popup__info_timeline').toggleClass('active');
  });

  $('#popup__info_timeline_close').on('click', function() {
    $('.popup__info_timeline').removeClass('active');
  });

  $('#timeline_btn_pay_deposit').on('click', function() {
    // window.open(PAY_DEPOSITE_LINK, '_self'); // same browser window
    window.open(PAY_DEPOSITE_LINK, '_blank'); // new browser window
  });

  $('#timeline_btn_book_consult').on('click', function() {
    // window.open(BOOK_CONSULTATION_LINK, '_self'); // same browser window
    window.open(BOOK_CONSULTATION_LINK, '_blank'); // new browser window
  });
}


// function calculateTaxHandler() {
//   $('#popup_tax_calculate').on('click', async function() {
//     $('#popup_tax_calculate').prop('disabled', true);

//     userZipcode = $('#popup_tax_zipcode').val();
//     userEmail = $('#popup_tax_email').val();
    
//     localStorage.setItem('userEmail', userEmail);

//     try {
//       stateSalesTax = +getTaxRate(userZipcode);
//       shippingDistance = await getDistance(userZipcode);
//       updateShippingTaxInfo();
//     } catch (error) {
//       console.error('Error fetching distance:', error);
//     } finally {
//       $('#popup_tax_calculate').prop('disabled', false);
//       $('.popup__info').addClass('hidden');

//     }
//   });
// }

function getTaxRate(destinationZipCode) {
  const taxRate = getData(dataZiptax, destinationZipCode + '', 'StateRate', 'ZipCode');
  return taxRate;
}

async function getDistance(destinationZipCode) {
  return new Promise((resolve, reject) => {
    var api = new google.maps.DistanceMatrixService();
    api.getDistanceMatrix({
      origins: [ORIGIN_ZIPCODE],
      destinations: [destinationZipCode + ''],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, 
    function(response, status) {
      if (status == 'OK') {
        const element = response.rows[0].elements[0];
        if (element.status === 'OK') {
          const distance = element.distance.text;
          resolve(extractDistance(distance));
        } else {
          console.log(`🚀 Could not find distance between ${ORIGIN_ZIPCODE} and ${destinationZipCode}`);
          resolve(null);
        }
      } else {
        console.log(`🚀 API request error: ${status}`);
        reject(new Error(`API request failed with status: ${status}`));
      }
    });
  });
}


function extractDistance(distanceStr) {
  const numericValue = distanceStr.replace(/,/g, '').replace(' mi', '');
  const distance = parseFloat(numericValue);
  
  return distance;
}

function updateShippingTaxInfo() {
  const shipppingCostBase = convertPriceToNumber(getData(dataPrice, 'shipppingCostBase', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  const shipppingCostMile = convertPriceToNumber(getData(dataPrice, 'shipppingCostMile', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  
  totalAmountShipTax = totalAmount * stateSalesTax + shippingDistance * shipppingCostMile;

  if (totalAmountShipTax) {
    currentTaxAmountString = formatPrice(totalAmountShipTax + shipppingCostBase, currentCurrencySign);
  }
  
  const text = (totalAmountShipTax) 
    ? `${getData(dataMain, 'ui_summary_details__tax_text_short', currentLanguage)} ${userZipcode}`
    : getData(dataMain, 'ui_summary_details__tax_text', currentLanguage);
  const amountText = (totalAmountShipTax) ? `${currentTaxAmountString}` : '';
  $('#payment_info_title').html(`+ ${amountText}${text}`); 
  $('#details__tax_text').html(`+ ${amountText}${text}`);
}

function openSummary() {
  $('.summary__popup-overlay').addClass('active');
  
  $(`.summary__scheme_pod`).removeClass('active');
  $(`.summary__scheme_office`).removeClass('active');
  $(`.summary__scheme_studio`).removeClass('active');
  $(`.summary__scheme_dimensions_pod`).removeClass('active');
  $(`.summary__scheme_dimensions_office`).removeClass('active');
  $(`.summary__scheme_dimensions_studio`).removeClass('active');

  $(`.summary__scheme_${DATA_HOUSE_NAME[currentHouse]}`).addClass('active');
  $(`.summary__scheme_dimensions_${DATA_HOUSE_NAME[currentHouse]}`).addClass('active');

  openContactForm();
}

function closeSummary() {
  $('.summary__popup-overlay').removeClass('active');
  $('.summary__scheme').removeClass('active');
}

function openContactForm() {
  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');
  
  if (savedName) {
    $('#form_name').val(savedName);
  }

  if (savedEmail) {
    $('#form_email').val(savedEmail);
  }

  validateForm();

  $('.contact_form__popup-overlay').addClass('active');
}

function closeContactForm() {
  $('.contact_form__popup-overlay').removeClass('active');
}

function collectSummary() {
  pdfContentData.length = 0;

  const detailsContainer = $('.summary__popup-content .details');
  detailsContainer.empty();

  $('.ar_filter_group').each(function () {
    const group = $(this);
    const groupId = group.attr('id');
    const groupTitle = group.find('.ar_filter_caption').text();
    const filterOptions = group.find('.ar_filter_options');

    let classes = `details__group details__${filterOptions.attr('class').split(' ')[1]}`

    if (groupId === 'group-1') { // Windows group
      classes = classes + ' details__type_select';
    }

    classes = classes + ' details__type_select';
    
    const detailsGroupId = `details__${groupId}`;

    const detailsGroup = $('<div>', {
      class: classes,
      id: detailsGroupId
    });

    $('<div>', {
      class: 'details__group_title',
      text: groupTitle
    }).appendTo(detailsGroup);

    pdfContentData.push(
      { text: groupTitle, style: 'subtitle', margin: [0, 0, 0, 0], },
      { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 0.5 }], margin: [0, 6, 0, 6], },
    );

    filterOptions.find('.option').each(function () {
      const option = $(this);
      const optionClasses = option.attr('class').split(' ').map(cls => `details__${cls}`);
      const optionTitle = option.find('.component_title').text();
      let optionPrice = option.find('.component_price').text();

      if (!optionClasses.includes('details__active')) {
        optionPrice = `${currentCurrencySign} 0`;
      }

      const detailsItem = $('<div>', {
        class: `details__item ${optionClasses.join(' ')}`
      });

      const textContainer = $('<div>', {
        class: 'details__item_text_container'
      });

      $('<div>', {
        class: 'details__item_title',
        text: optionTitle
      }).appendTo(textContainer);

      $('<div>', {
        class: 'details__item_not_included',
        text: getData(dataMain, 'ui_summary_not_included', currentLanguage),
      }).appendTo(textContainer);

      textContainer.appendTo(detailsItem);

      $('<div>', {
        class: 'details__item_price',
        text: optionPrice
      }).appendTo(detailsItem);
      
      detailsItem.appendTo(detailsGroup);



      if (optionClasses.includes('details__active')) {
        const windowsCode = (optionClasses.includes('details__option_1-2')) ? formatCustomWindows(customWindows) : '';

        pdfContentData.push(
          { columns: [
            { text: optionTitle + windowsCode, style: 'tableText', width: '70%', margin: [0, 0, 0, 0], },
            { text: '', width: '*', margin: [0, 0, 0, 0] },
            { text: optionPrice, style: 'tableText', margin: [0, 0, 0, 0], alignment: 'right', },
          ]},
        );
      }

      if (!optionClasses.includes('details__active') && detailsGroupId === 'details__group-4') { // ADD-ONs
        pdfContentData.push(
          { columns: [
            { text: optionTitle + getData(dataMain, 'ui_summary_not_included', currentLanguage),  width: '70%', style: 'tableText', margin: [0, 0, 0, 0], },
            { text: '', width: '*', margin: [0, 0, 0, 0] },
            { text: optionPrice, style: 'tableText', margin: [0, 0, 0, 0], alignment: 'right', },
          ]},
        );
      }
    });

    detailsGroup.appendTo(detailsContainer);

    // $('#details__tax_amount').html(`+ ${currentTaxAmountString}&nbsp;`);
    
    pdfContentData.push(
      { text: '', width: '*', margin: [0, 0, 0, 10] },
    );
  });
  
  $('#details__total_price').html(currentAmountString);

  if (totalAmountShipTax) {
    const shipppingCostBase = convertPriceToNumber(getData(dataPrice, 'shipppingCostBase', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    currentTaxAmountString = formatPrice(totalAmountShipTax + shipppingCostBase, currentCurrencySign);
  }
  const text = (totalAmountShipTax) 
  ? `${getData(dataMain, 'ui_summary_details__tax_text_short', currentLanguage)} ${userZipcode}`
  : getData(dataMain, 'ui_summary_details__tax_text', currentLanguage);
  const amountText = (totalAmountShipTax) ? `${currentTaxAmountString}` : '';
  
  $('#details__tax_text').html(`+ ${amountText}${text}`);
  // const currentTaxAmountWithTextForPDF = `+ ${currentTaxAmountString} ${getData(dataMain, 'ui_summary_details__tax_text', currentLanguage)}`;

  pdfContentData.push(
    { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 6], },
    { columns: [
      { text: getData(dataMain, 'ui_pdf_total', currentLanguage), width: '70%', style: 'tableTitle', margin: [0, 0, 0, 0], },
      { text: '', width: '*', margin: [0, 0, 0, 0] },
      { text: currentAmountString, style: 'tableTitle', margin: [0, 0, 0, 0], alignment: 'right', },
    ]},
    { columns: [
      { text: `+ ${amountText}${text}`, width: '100%', style: 'tableTitle', margin: [0, 6, 0, 0], alignment: 'right', },
    ]},
  );
}

function formatCustomWindows(customWindowsObj) {
  const parts = [];

  for (const key in customWindowsObj) {
    if (Object.prototype.hasOwnProperty.call(customWindowsObj, key)) {
      const array = customWindowsObj[key];
      
      if (array.length > 0) {
        const count = array.length;
        const upperKey = key.toUpperCase();
        parts.push(`${count}X${upperKey}`);
      }
    }
  }

  if (parts.length === 0) {
    return '';
  }

  return ` (${parts.join(' + ')})`;
}

function summaryItemVisibility(groupId, value) {
  const id = groupId.split('-')[1];
  const element = document.getElementById(`summary-item-${id}`);

  if (element) {
    element.style.display = (value) ? 'flex' : 'none';
  } else {
    console.error(`Element is not found: summary-item-${id}`);
  }
}

function infoPopup(infoPopupTitle, infoPopupDescription, infoPopupImage) {
  $('#popup-info-title-ui').html(infoPopupTitle);
  $('#popup-info-text-ui').html(infoPopupDescription);

  if (!infoPopupImage) {
    $('.popup-info-img').css('display', 'none');
  } else {
    $('.popup-info-img').css('display', 'block');

    if (infoPopupImage.substring(0, 1) === '#') {
      $('.popup-info-img img').remove();
      $('.popup-info-img').css('background-color', infoPopupImage);
    } else {
      $('.popup-info-img img').attr('src', infoPopupImage);
    }
  }

  popup.toggleClass('active');
  popup.removeClass('arqr');
  popup.removeClass('share');
  popup.addClass('info');
  popupItemSharing.removeClass('active');
  popupItemQr.removeClass('active');
  popupItemLoupe.toggleClass('active');

  document.documentElement.classList.add('popup-open');
}

// **** CAMERA FLYING ****

$(document).on('click', '#title_list__item_2', function () { // interior group
  $('#button_camera_inside').click();
});

$(document).on('click', '#title_list__item_3', function () { // exterior group
  $('#button_camera_outside').click();
});

$(document).on('click', '#group-2 .ar_button_back', function () { // exterior group
  $('#button_camera_outside').click();
});

$(document).on('click', '.option.option_1-0', function () { // windows strip
  if (!isCameraInside) {
    flyCameraTo('outWindowsStrip', 'outside');
  }
});

$(document).on('click', '.option.option_1-1', function () { // windows viewport
  if (!isCameraInside) {
    flyCameraTo('outWindowsViewport', 'outside');
  }
});

$(document).on('click', '.option.option_4-3', function () { // extra door
  if (currentHouse == '2' && $('.option.option_4-3').hasClass('active')) {
    if (!isCameraInside) {
      flyCameraTo('outExtraDoor', 'outside');
    }
  }
});

$(document).on('click', '.option.option_1-2', function () { // custom windows
  if (isCameraInside) {
    $('#button_camera_outside').click();
  }
});

$(document).on('click', '.option.option_4-1', function () { // in-build desk
  checkBuiltInDeskState();

  if ($('.option.option_4-1').hasClass('active')) {
    if (!isCameraInside) {
      $('#button_camera_inside').click();
      // flyCameraTo('inBuildInDesk', 'inside');
    } 
  }
});

function checkBuiltInDeskState() {
  if ($('.option.option_4-1').hasClass('active')) {
    disableFurnitureBtn();
    modelFurniture.visible = true;
    setVisibility(modelFurniture, true, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['work-back-door', 'work', 'live', 'sleep']);
  } else {
    setVisibility(modelFurniture, false, ['work-back-door', 'work', 'live', 'sleep']);
    setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    modelFurniture.visible = false;
    enableFurnitureBtn();
  }
}

// *******************

// dynamic change language for info menu
$('.language-picker select').on('change', function () {
  currentLanguage = $(this).val();
  updateUIlanguages(dataMain, uiMenuInfoLanguages, currentLanguage);
  updateUIlanguages(dataMain, uiMenuInfoDescLanguages, `DESC_${currentLanguage}`);
  updateUIlanguages(dataMain, uiMenuInfoSpecsLanguages, `SPECS_${currentLanguage}`);

  checkLanguageForDimensions();
});

// *******************

//#endregion

//#region UTILS

function waitFor(conditionFunction) {
  const poll = resolve => {
    if (conditionFunction()) resolve();
    // eslint-disable-next-line no-unused-vars
    else setTimeout(_ => poll(resolve), 400);
  }

  return new Promise(poll);
}

export function promiseDelay(time, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
      if (callback != null) {
        callback();
      }
    }, time);
  });
}

//#endregion

//#region 3D FUNCTIONS

function onChangePosition(houseId, pos, callback = () => { }, duration = 750, isLeftSideHouse = true) {
  let targetCameraPosition;
  let targetControlX;
  let targetControlY;
  let targetControlZ;
  let targetControlMinDist;
  let targetCameraFOV;
  let maxPolarAngle;

  let callback_env = null;

  if (NAV_CAM_POSITION[pos] && Object.prototype.hasOwnProperty.call(NAV_CAM_POSITION[pos][houseId], 'camera')) {
    const k = (isLeftSideHouse) ? 1 : -1;

    targetCameraPosition = new THREE.Vector3(
      NAV_CAM_POSITION[pos][houseId].camera[0] * k,
      NAV_CAM_POSITION[pos][houseId].camera[1],
      NAV_CAM_POSITION[pos][houseId].camera[2],
    );

    targetControlX = NAV_CAM_POSITION[pos][houseId].target[0] * k;
    targetControlY = NAV_CAM_POSITION[pos][houseId].target[1];
    targetControlZ = NAV_CAM_POSITION[pos][houseId].target[2];

    (NAV_CAM_POSITION[pos].outside) && (outsideCameraSettings());

    if (!NAV_CAM_POSITION[pos].outside) {
      const fov = 82; // 80
      const env = envMap;
      // const env = null;
      insideCameraSettings(fov);
      callback_env = () => {
        scene.background = env;
        setMaterialProperty('glass', 0);
      };
    } else {
      scene.background = null;
      setMaterialProperty('glass', 1);
    }

    if (isEqualVector(camera.position, targetCameraPosition)) {
      duration = 5;
    }

    smoothCameraTransition(
      targetCameraPosition,
      duration,
      targetControlX,
      targetControlY,
      targetControlZ,
      targetControlMinDist,
      targetCameraFOV,
      maxPolarAngle,
      callback,
      callback_env,
    );
  } else {
    console.log(`🚀 Position '${pos}' is not available for house ${houseId}`);
    callback();
  }

  function insideCameraSettings(fov = 50, envirMap = null) {
    controls.enableZoom = false;
    targetControlMinDist = 0;
    targetCameraFOV = fov;
    maxPolarAngle = Math.PI / 1;
    scene.background = envirMap;
  }

  function outsideCameraSettings() {
    controls.enableZoom = true;
    targetControlMinDist = 4;
    targetCameraFOV = 50;
    maxPolarAngle = Math.PI / 1.88;
  }

  function isEqualVector(vector1, vector2) {
    const precision = 4;
    return (
      vector1.x.toFixed(precision) === vector2.x.toFixed(precision) &&
      vector1.y.toFixed(precision) === vector2.y.toFixed(precision) &&
      vector1.z.toFixed(precision) === vector2.z.toFixed(precision)
    );
  }
}

export function flyCameraTo(namePosition, inOrOut, callback = () => { }, duration = 750) {
  if (inOrOut === 'inside') {
    $('#button_camera_inside').addClass('hidden');
    $('#button_camera_outside').removeClass('hidden');
    isCameraInside = true;
  } else if (inOrOut === 'outside') {
    $('#button_camera_outside').addClass('hidden');
    $('#button_camera_inside').removeClass('hidden');
    isCameraInside = false;
  }

  onChangePosition(DATA_HOUSE_NAME[currentHouse], namePosition, callback, duration);
}

//#endregion

//#region RAYCASTING (WINDOWS/PANELS CLICKS)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const canvas = document.getElementById('ar_model_view');

let isMouseMoved = false;
let clickThreshold = 5;

let startX, startY;

function onMouseDown(event) {
  isMouseMoved = false;
  startX = event.clientX;
  startY = event.clientY;
}

function onMouseMove(event) {
  if (Math.abs(event.clientX - startX) > clickThreshold || Math.abs(event.clientY - startY) > clickThreshold) {
    isMouseMoved = true;
  }
}

function onMouseUp(event) {
  if (!isMouseMoved && isWindowCustomOn) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      let clickedMeshName = '';
      if (intersectedObject.parent && intersectedObject.parent !== scene) {
        clickedMeshName = intersectedObject.parent.name;
      } else {
        clickedMeshName = intersectedObject.name;
      }

      if (clickedMeshName && containsPanelOrWindow(clickedMeshName)) {
        const [letter, number] = extractLastLetterAndNumber(clickedMeshName);

        if (letter && number) {
          // clickedMeshName = `${letter}-${number}`;
          updateCustomWindows([letter, number]);
          SharedParameterList[7].value = convertObjectToArray(customWindows);
          WriteURLParameters();
        }
      }
    }
  }


  function extractLastLetterAndNumber(name) {
    const match = name.match(/-([A-Za-z])-(\d+)$/);

    if (match) {
      return [match[1], match[2]];
    }

    return [null, null];
  }

  function containsPanelOrWindow(name) {
    return name.includes("panel") || name.includes("window");
  }
}

function convertObjectToArray(customWindowsObj) {
  const customWindowsArray = [];
  for (const [key, values] of Object.entries(customWindowsObj)) {
    customWindowsArray.push(key);
    customWindowsArray.push(...values);
  }
  return customWindowsArray;
}

function convertArrayToObject(customWindowsArray) {
  const customWindowsObj = {};
  let currentKey = null;

  customWindowsArray.forEach(item => {
    if (isNaN(item)) {
      currentKey = item;
      customWindowsObj[currentKey] = [];
    } else if (currentKey) {
      customWindowsObj[currentKey].push(item);
    }
  });

  return customWindowsObj;
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);


function updateCustomWindows([letter, number]) {
  const keyName = letter.toLowerCase();

  if (STUDIO_EXTRADOOR_SECTORS.includes(`${keyName}${number}`)
    && isExtraDoorOn
    && currentHouse == '2') {
    return;
  }

  if (keyName === 'g' && currentHouse !== '2') {
    return;
  }

  if (Object.prototype.hasOwnProperty.call(customWindows, keyName)) {
    const index = customWindows[keyName].indexOf(number);
    const { panelMeshName, windowMeshName } = findMeshByLetterAndNumber(modelHouse, letter, number);

    if (index === -1) {
      if (customWindows[keyName].length >= WINDOWS_LIMIT_IN_ROW) {

        $('#canvas_notification_limit').removeClass('hidden');

        setTimeout(function () {
          $('#canvas_notification_limit').addClass('hidden');
        }, 2500);

        return;
      }

      customWindows[keyName].push(number);

      // make it WINDOW
      (panelMeshName) && setVisibility(modelHouse, false, [panelMeshName]);
      (windowMeshName) && setVisibility(modelHouse, true, [windowMeshName]);
      calculatePrice();
    } else {
      customWindows[keyName].splice(index, 1);
      // make it PANEL
      (panelMeshName) && setVisibility(modelHouse, true, [panelMeshName]);
      (windowMeshName) && setVisibility(modelHouse, false, [windowMeshName]);
      calculatePrice();
    }
  } else {
    console.warn(`Letter "${letter}" not found in customWindows object.`);
  }
}

function findMeshByLetterAndNumber(parent, letter, number) {
  const panelSearchPattern = new RegExp(`panel.*-${letter.toLowerCase()}-${number}$`, 'i');
  const windowSearchPattern = new RegExp(`window.*-${letter.toLowerCase()}-${number}$`, 'i');

  let panelMeshName = null;
  let windowMeshName = null;

  parent.traverse((o) => {
    if (o.isMesh) {
      const groupName = o.parent.name.toLowerCase().trim();

      if (panelSearchPattern.test(groupName)) {
        panelMeshName = o.parent.name;
      }

      if (windowSearchPattern.test(groupName)) {
        windowMeshName = o.parent.name;
      }
    }
  });

  return { panelMeshName, windowMeshName };
}

function restoreCustomWindows() {
  customWindows = convertArrayToObject(SharedParameterList[7].value);

  if (!isWindowCustomOn) return;

  resetCustomWindows();

  for (const [key, values] of Object.entries(customWindows)) {
    for (const value of values) {
      const { panelMeshName, windowMeshName } = findMeshByLetterAndNumber(modelHouse, key, value);
      (panelMeshName) && setVisibility(modelHouse, false, [panelMeshName]);
      (windowMeshName) && setVisibility(modelHouse, true, [windowMeshName]);
    }
  }
}

function removeExtraDoorPanelsFromCustomWindows() {
  STUDIO_EXTRADOOR_SECTORS.forEach(section => {
    const letter = section[0].toLowerCase();
    const number = section[1];

    if (Object.prototype.hasOwnProperty.call(customWindows, letter)) {
      const index = customWindows[letter].indexOf(number);
      if (index !== -1) {
        customWindows[letter].splice(index, 1);
      }
    }
  });
}

function resetCustomWindows() {
  const windowStripData = VIEWPORT_AND_STRIP_SECTORS[DATA_HOUSE_NAME[currentHouse]].strip;
  const windowViewportData = VIEWPORT_AND_STRIP_SECTORS[DATA_HOUSE_NAME[currentHouse]].viewport;

  resetWindowsMeshes(windowStripData);
  resetWindowsMeshes(windowViewportData);

  function resetWindowsMeshes(windowObj) {
    for (const [key, values] of Object.entries(windowObj)) {
      for (const value of values) {
        const { panelMeshName, windowMeshName } = findMeshByLetterAndNumber(modelHouse, key, value);
        (panelMeshName) && setVisibility(modelHouse, true, [panelMeshName]);
        (windowMeshName) && setVisibility(modelHouse, false, [windowMeshName]);
      }
    }
  }
}

function addStripAndViewportWindowsToCustomWindowsObject(strip, viewport) {
  resetCustomWindowsObject();

  (strip == '1') && assignCustomWindows(DATA_HOUSE_NAME[currentHouse], 'strip');
  (viewport == '1') && assignCustomWindows(DATA_HOUSE_NAME[currentHouse], 'viewport');

  function assignCustomWindows(house, windowType) {
    const windowData = VIEWPORT_AND_STRIP_SECTORS[house][windowType];
  
    if (!windowData) return;
  
    Object.keys(windowData).forEach(key => {
      if (customWindows[key]) {
        customWindows[key].push(...windowData[key]);
      }
    });

    SharedParameterList[7].value = convertObjectToArray(customWindows);
    WriteURLParameters();
  }
}


//#endregion

//#region SHADER and MORPHS

function Shader_ChangeVertexToWorldpos(object) {
  promiseDelayShaderSettings(500, object, () => {
    if (object.isMesh) {
      if (isWorldposVertexShaderEnabled) {
        if (object.material) {
          if (object.material.name.includes("_Z")) {
            object.material.onBeforeCompile = (shader) => {
              shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>\n', '').replace('#include <worldpos_vertex>', 'vec4 worldPosition = vec4( transformed, 1.0 );\n#ifdef USE_INSTANCING\nworldPosition = instanceMatrix * worldPosition;\n#endif\nworldPosition = modelMatrix * worldPosition;\nvUv = (uvTransform * vec3(worldPosition.xz, 1)).xy;');
            };
          }
          else if (object.material.name.includes("_Y")) {
            object.material.onBeforeCompile = (shader) => {
              shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>\n', '').replace('#include <worldpos_vertex>', 'vec4 worldPosition = vec4( transformed, 1.0 );\n#ifdef USE_INSTANCING\nworldPosition = instanceMatrix * worldPosition;\n#endif\nworldPosition = modelMatrix * worldPosition;\nvUv = (uvTransform * vec3(worldPosition.xy, 1)).xy;');
            };
          }
          else if (object.material.name.includes("_X")) {
            object.material.onBeforeCompile = (shader) => {
              shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>\n', '').replace('#include <worldpos_vertex>', 'vec4 worldPosition = vec4( transformed, 1.0 );\n#ifdef USE_INSTANCING\nworldPosition = instanceMatrix * worldPosition;\n#endif\nworldPosition = modelMatrix * worldPosition;\nvUv = (uvTransform * vec3(worldPosition.yz, 1)).xy;');
            };
          }
          object.material.needsUpdate = true;
        }
      }
    }
  });

}

function promiseDelayShaderSettings(time, object, callback) {
  if (time == null) {
    time = 2000;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
      if (object.material.map == null) {
        promiseDelayShaderSettings(time, object, callback);
      } else {
        if (callback != null) {
          callback();
        }
      }
    }, time);
  });
}

// eslint-disable-next-line no-unused-vars
function InitMorphModel(model) {
  var BufferGeometryUtils_script = document.createElement('script');
  BufferGeometryUtils_script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/three@0.147/examples/js/utils/BufferGeometryUtils.js');
  document.body.appendChild(BufferGeometryUtils_script);

  model?.traverse((object) => {
    if (object.isMesh) {

      Shader_ChangeVertexToWorldpos(object);

      if (object.morphTargetDictionary != null) {

        for (const [key, value] of Object.entries(object.morphTargetDictionary)) {

          var morph = {
            name: key,
            object: object,
            key: value,
            value: value
          };

          if (!morphs.includes(morph)) {
            morphs.push(morph);
          }
        }
      }
    }
  });

  PrepareGlobalMorphs();
}

function PrepareGlobalMorphs() {
  globalMorphs = [];

  for (let index = 0; index < morphs.length; index++) {
    const morph = morphs[index];

    var hasMorph = false;

    for (let m = 0; m < globalMorphs.length; m++) {
      const globalMorph = globalMorphs[m];
      if (globalMorph.name != morph.name) { continue; }
      hasMorph = true;
      break;
    }

    if (!hasMorph) {
      globalMorphs.push(morph);
    }
  }
}

function ComputeMorphedAttributes() {
  for (let index = 0; index < morphs.length; index++) {
    const morph = morphs[index];
    var computeMorphedAttributes = THREE.BufferGeometryUtils.computeMorphedAttributes(morph.object);
    morph.object.geometry.computeMorphedAttributes = computeMorphedAttributes;
  }
}

// eslint-disable-next-line no-unused-vars
function ChangeObjectMorph(morph, inputvalue) {
  if (morph.object == null) { return; }

  if (morph.object.isMesh) {
    if (morph.object.morphTargetInfluences != null) {
      morph.object.morphTargetInfluences[morph.key] = inputvalue;
    }
  } f
}

function ChangeGlobalMorph(morphName, inputvalue) {
  for (let index = 0; index < morphs.length; index++) {
    const morph = morphs[index];

    if (morph.name != morphName) { continue; }
    if (morph.object == null) { continue; }
    if (!morph.object.isMesh) { continue; }
    if (morph.object.morphTargetInfluences == null) { continue; }

    morph.object.morphTargetInfluences[morph.key] = inputvalue;
  }
}

// eslint-disable-next-line no-unused-vars
function ConvertMorphValue(inputval, srcStart, srcEnd, destStart = 0, destEnd = 1) {
  const result = destStart + (inputval - srcStart) * (destEnd - destStart) / (srcEnd - srcStart);

  return result;
}

// eslint-disable-next-line no-unused-vars
function animateMorph(morphName, valueStart, valueEnd, callback = () => { }, timeInterval = 200, steps = 5) {
  const stepDuration = timeInterval / steps;
  const stepValue = (valueEnd - valueStart) / steps;
  let currentValue = valueStart;
  let completedSteps = 0;

  for (let i = 1; i <= steps; i++) {
    setTimeout(() => {
      ChangeGlobalMorph(morphName, currentValue);
      currentValue += stepValue;
      completedSteps++;
      if (completedSteps === steps) {
        ChangeGlobalMorph(morphName, valueEnd);
        callback();
      }
    }, i * stepDuration);
  }
}

//#endregion

//#region ANNOTATIONS

const $canvasContainer = $('#ar_model_viewer');
let annotations = [];

function showAnnotations() {
  const idIndex = dataAnnotations[0].findIndex(item => item.toLowerCase() === 'id');

  if (idIndex == -1) return;

  annotations = [];
  uiAnnotationsLanguages = [];
  uiAnnotationsLongLanguages = [];

  dataAnnotations.forEach((item) => {
    if (item[idIndex].includes(DATA_HOUSE_NAME[currentHouse])) {
      const coordsString = getData(dataAnnotations, item[idIndex], 'COORDS');
      const [x, y, z] = parseCoordinates(coordsString);

      let textLongContent = getData(dataAnnotations, item[idIndex], `LONG_${currentLanguage.toUpperCase()}`)
      
      if (textLongContent[0] === '"' && textLongContent[textLongContent.length - 1] === '"') {
        textLongContent = textLongContent.slice(1, -1);
      }

      annotations.push({
        id: item[idIndex],
        position: new THREE.Vector3(x, y + MODEL_CENTER_POSITION, z),
        text: getData(dataAnnotations, item[idIndex], `SHORT_${currentLanguage.toUpperCase()}`),
        textLong: textLongContent,
      });
    }
  });

  annotations.forEach((annotation) => {
    const $annotationElement = $('<div>', { class: 'annotation' }).html(`
      <div id="annotation_text_short_${annotation.id}" class="annotation-text">
        ${annotation.text}
      </div>
    `);

    const $annotationElementLong = $('<div>', {
      id: `annotation_text_long_${annotation.id}`,
      class: 'annotation-text long',
    }).html(`${annotation.textLong}`);

    $canvasContainer.append($annotationElement);
    $annotationElement.append($annotationElementLong);

    annotation.element = $annotationElement;
    annotation.elementLong = $annotationElementLong;

    uiAnnotationsLanguages.push({ [`#annotation_text_short_${annotation.id}`]: annotation.id });
    uiAnnotationsLongLanguages.push({ [`#annotation_text_long_${annotation.id}`]: annotation.id });
  });
}

function hideAnnotations() {
  $('.annotation').remove();
}

function parseCoordinates(str) {
  const parts = str.replace(/^"(.*)"$/, '$1').split(',').map(part => part.trim());

  const numbers = parts.map(part => {
    const num = parseFloat(part);
    return isNaN(num) ? 0 : num;
  });

  return numbers;
}

export function updateAnnotations(camera, scene, controls) {
  if (!annotations) return;

  annotations.forEach(annotation => {
    const screenPosition = annotation.position.clone();
    screenPosition.project(camera);

    const x = (screenPosition.x * 0.5 + 0.5) * $canvasContainer.width();
    const y = (screenPosition.y * -0.5 + 0.5) * $canvasContainer.height();

    $(annotation.element).css({
      left: `${x}px`,
      top: `${y}px`
    });

    if (!controls.enableZoom || isCameraInside) { // camera is inside
      const cameraToAnnotation = annotation.position.clone().sub(camera.position).normalize();
      const angle = cameraToAnnotation.dot(camera.getWorldDirection(new THREE.Vector3()));
      const isVisible = angle > 0;

      if (isVisible) {
        $(annotation.element).css('opacity', 1);
      } else {
        $(annotation.element).css('opacity', 0);
      }
    } else { // camera is outside
      const raycaster = new THREE.Raycaster();
      raycaster.ray.origin.copy(camera.position);
      raycaster.ray.direction.copy(annotation.position.clone().sub(camera.position).normalize());

      let isBehindModel = false;
      scene.traverse((object) => {
        if (object.isMesh) {
          const intersects = raycaster.intersectObject(object, true);
          if (intersects.length > 0 && intersects[0].distance < annotation.position.distanceTo(camera.position)) {
            isBehindModel = true;
          }
        }
      });

      if (isBehindModel) {
        $(annotation.element).css('opacity', 0.05);
      } else {
        $(annotation.element).css('opacity', 1);
      }
    }

    const $annotationText = $(annotation.element).find('.annotation-text');
    const $annotationTextLong = $(annotation.element).find('.annotation-text.long');

    if ($canvasContainer.width() - x < 250) {
      $annotationText.addClass('left');
    } else {
      $annotationText.removeClass('left');
    }

    $(annotation.element).off('click').on('click', () => {
      if ($annotationText.hasClass('disabled') && $annotationTextLong.hasClass('active')){
        $annotationText.removeClass('disabled');
        $annotationTextLong.removeClass('active');
      } else {
        closeAllAnnotations();
        $annotationText.addClass('disabled');
        $annotationTextLong.addClass('active');
      }
    });
  });
}

function closeAllAnnotations() {
  annotations.forEach((annotation) => {
    $(annotation.element).find('.annotation-text').removeClass('disabled');
    $(annotation.element).find('.annotation-text.long').removeClass('active');
  });
}

//#endregion

//#region DIMENSIONS

let dimensionObjects = [];
const crossLineLength = 0.2;
const textOffsetHorizontal = 0.15;
const textOffsetVertical = 0.6;
const manOffset = 0.9;
const lineOffset = 0.3;
const lineColor = '#ececef';
const manColor = '#ececef';

function createHorizontalDimensionLine(start, end, label, scene) {
  const material = new THREE.LineBasicMaterial({ color: lineColor });

  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  dimensionObjects.push(line);

  const crossStart1 = start.clone().add(new THREE.Vector3(0, crossLineLength / 2, 0));
  const crossEnd1 = start.clone().add(new THREE.Vector3(0, -crossLineLength / 2, 0));
  const crossGeometry1 = new THREE.BufferGeometry().setFromPoints([crossStart1, crossEnd1]);
  const crossLine1 = new THREE.Line(crossGeometry1, material);
  scene.add(crossLine1);
  dimensionObjects.push(crossLine1);

  const crossStart2 = end.clone().add(new THREE.Vector3(0, crossLineLength / 2, 0));
  const crossEnd2 = end.clone().add(new THREE.Vector3(0, -crossLineLength / 2, 0));
  const crossGeometry2 = new THREE.BufferGeometry().setFromPoints([crossStart2, crossEnd2]);
  const crossLine2 = new THREE.Line(crossGeometry2, material);
  scene.add(crossLine2);
  dimensionObjects.push(crossLine2);

  const spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(createTextTexture(label)) });
  const sprite = new THREE.Sprite(spriteMaterial);

  const midPoint = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, textOffsetHorizontal, 0));
  sprite.position.copy(midPoint);

  const k = 0.8;
  sprite.scale.set(2 * k, 1 * k, 1);
  scene.add(sprite);
  dimensionObjects.push(sprite);
}

function createVerticalDimensionLine(start, end, label, scene) {
  const material = new THREE.LineBasicMaterial({ color: lineColor });

  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  dimensionObjects.push(line);

  const crossStart1 = start.clone().add(new THREE.Vector3(crossLineLength / 2, 0, 0));
  const crossEnd1 = start.clone().add(new THREE.Vector3(-crossLineLength / 2, 0, 0));
  const crossGeometry1 = new THREE.BufferGeometry().setFromPoints([crossStart1, crossEnd1]);
  const crossLine1 = new THREE.Line(crossGeometry1, material);
  scene.add(crossLine1);
  dimensionObjects.push(crossLine1);

  const crossStart2 = end.clone().add(new THREE.Vector3(crossLineLength / 2, 0, 0));
  const crossEnd2 = end.clone().add(new THREE.Vector3(-crossLineLength / 2, 0, 0));
  const crossGeometry2 = new THREE.BufferGeometry().setFromPoints([crossStart2, crossEnd2]);
  const crossLine2 = new THREE.Line(crossGeometry2, material);
  scene.add(crossLine2);
  dimensionObjects.push(crossLine2);

  const spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(createTextTexture(label)) });
  const sprite = new THREE.Sprite(spriteMaterial);
  const midPoint = start.clone().lerp(end, 0.7).add(new THREE.Vector3(-textOffsetVertical, 0, 0));
  sprite.position.copy(midPoint);

  const k = 0.8;
  sprite.scale.set(2 * k, 1 * k, 1);
  scene.add(sprite);
  dimensionObjects.push(sprite);
}


function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '32px Arial';
  context.fillStyle = 'black';
  context.fillText(text, 50, 50);
  return canvas;
}

function createDimensions(diameter, height) {
  const heightFoundation = (isFoundationKitOn) ? FOUNDATION_HEIGHT : 0;

  const startDiameter = new THREE.Vector3(-diameter / 2, height + MODEL_CENTER_POSITION - heightFoundation + lineOffset, 0);
  const endDiameter = new THREE.Vector3(diameter / 2, height + MODEL_CENTER_POSITION - heightFoundation + lineOffset, 0);
  createHorizontalDimensionLine(startDiameter, endDiameter, `D = ${Math.round((diameter * 3.28084) / 0.5) * 0.5} ft`, scene);

  const startHeight = new THREE.Vector3(-diameter / 2 - lineOffset, 0 + MODEL_CENTER_POSITION - heightFoundation, 0);
  const endHeight = new THREE.Vector3(-diameter / 2 - lineOffset, height + MODEL_CENTER_POSITION - heightFoundation, 0);
  createVerticalDimensionLine(startHeight, endHeight, `H = ${Math.round((height + heightFoundation) * 3.28084 / 0.5) * 0.5} ft`, scene);

  setMaterialColor('man', manColor);
  setMaterialColor('man.001', manColor);
  setMeshPosition(modelHouse, 'man', -diameter / 2 - lineOffset - manOffset, - heightFoundation, 0);
}

function getHouseDimensions() {
  let diameter = 0;
  let height = 0;

  if (modelHouse) {
    height = getMeshDimensions(modelHouse).height;
    const meshName = (currentHouse == '1') ? 'entry-center' : 'entry-L1-center';
    diameter = getMeshDimensions(modelHouse.getObjectByName(meshName)).width;
  }

  return [diameter, height];
}

function removeDimensions() {
  dimensionObjects.forEach(obj => {
    scene.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
  dimensionObjects = [];
}

//#endregion

//#region CAPTURE CAMERA IMAGE

const cameraImageViews_Global = [
  {
    id: "view_1.png",
    alt: "view_front",
    cameraObject: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 1000),
    position: new THREE.Vector3(0, 2, 10),
    rotation: new THREE.Vector3(0, 0, 0)
  },
  {
    id: "view_4.png",
    alt: "view_left",
    cameraObject: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 1000),
    position: new THREE.Vector3(-10, 2, 0),
    rotation: new THREE.Vector3(0, -Math.PI / 2, 0)
  },
  {
    id: "view_5.png",
    alt: "view_rear",
    cameraObject: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 1000),
    position: new THREE.Vector3(0, 2, -10),
    rotation: new THREE.Vector3(0, Math.PI, 0)
  },
  {
    id: "view_2.png",
    alt: "view_right",
    cameraObject: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 1000),
    position: new THREE.Vector3(10, 2, 0),
    rotation: new THREE.Vector3(0, Math.PI / 2, 0)
  },
  {
    id: "view_3.png",
    alt: "view_top",
    cameraObject: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 1000),
    position: new THREE.Vector3(0, 2 + 10, 0),
    rotation: new THREE.Vector3(-Math.PI / 2, 0, 0)
  },
];

function CreateImageList() {
  let cameraFar = 11;
  let topViewCorrection = 0;

  currentHouse = currentHouse + '';

  switch (currentHouse) {
    case '0': // pod
      cameraFar = 8.3;
      topViewCorrection = 0.5;
      break;
    case '1': // office
      cameraFar = 8.7;
      topViewCorrection = 0.8;
      break;
    case '2': // studio
      cameraFar = 10.7;
      topViewCorrection = 0.5;
      break;
    default:
      break;
  }

  cameraImageViews_Global[0].position = new THREE.Vector3(0, HUMAN_HEIGHT, cameraFar); // front
  cameraImageViews_Global[1].position = new THREE.Vector3(-cameraFar, HUMAN_HEIGHT, 0); // left
  cameraImageViews_Global[2].position = new THREE.Vector3(0, HUMAN_HEIGHT, -cameraFar); // rear
  cameraImageViews_Global[3].position = new THREE.Vector3(cameraFar, HUMAN_HEIGHT, 0); // right
  cameraImageViews_Global[4].position = new THREE.Vector3(0, HUMAN_HEIGHT + cameraFar - topViewCorrection, 0); // top
  
  $('.summary__images_container').empty();
  
  $('.summary__images_container').append(
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_pod"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_office"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_studio"></div>' +
    '<div class="summary__scheme summary__scheme_pod"></div>' +
    '<div class="summary__scheme summary__scheme_office"></div>' +
    '<div class="summary__scheme summary__scheme_studio"></div>'
  );

  imageSources.length = 0;

  if (summary_images == null) {
    summary_images = document.querySelector("div.summary__images_container");
  }

  if (summary_images == null) { return; }

  share_RenderImages.length = 0;

  for (let index = 0; index < cameraImageViews_Global.length; index++) {
    const element = cameraImageViews_Global[index];
    element.cameraObject.visible = true;
    element.cameraObject.aspect = camera.aspect;
    element.cameraObject.updateProjectionMatrix();
    element.cameraObject.position.set(element.position.x, element.position.y, element.position.z);
    element.cameraObject.rotation.set(element.rotation.x, element.rotation.y, element.rotation.z);
    TakeImage(element, "summary__images_image");
  }

  // $('.summary__images_container').append(
  //   '<div class="summary__scheme_dimensions summary__scheme_dimensions_pod"></div>'
  //   //  +
  //   // '<div class="summary__scheme_dimensions summary__scheme_dimensions_office"></div>' +
  //   // '<div class="summary__scheme_dimensions summary__scheme_dimensions_studio"></div>'
  // );
}

function TakeImage(view, img_class) {
  var img_div = document.createElement("div");
  img_div.classList.add(img_class);
  var img = CreateImage(view);
  img_div.appendChild(img);
  summary_images.appendChild(img_div);
}

function CreateImage(view) {
  var img = new Image();

  renderer.setSize(share_RenderImageSize.x, share_RenderImageSize.y, false);
  view.cameraObject.aspect = share_RenderImageSize.x / share_RenderImageSize.y;
  view.cameraObject.updateProjectionMatrix();
  renderer.render(scene, view.cameraObject);

  img.src = renderer.domElement.toDataURL();
  img.alt = view.alt;

  imageSources.push(img.src);
  share_RenderImages.push(img);

  view.cameraObject.visible = false;
  return img;
}

//#endregion
