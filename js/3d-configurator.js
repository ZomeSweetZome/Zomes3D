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
  DATAFILE_LOCAL_UI,
  DATAFILE_LOCAL_PRICE,
  DATAFILE_LOCAL_ANNOTATIONS,
  DATAFILE_LOCAL_ZIPTAX,
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
  DATA_HOUSE_DIMENSIONS,
  NAV_CAM_POSITION,
  EXTRA_DOOR_AVAILABLE_SECTORS,
  getExtraDoorAffectedPanels,
  IS_EXTRA_DOOR_GLOW_MODE,
  EXTRA_DOOR_GLOW_COLOR,
  FOUNDATION_HEIGHT,
  WINDOWS_LIMIT_IN_ROW,
  VIEWPORT_AND_STRIP_SECTORS,
  HUMAN_HEIGHT,
  CALENDLY_LINK,
  // BOOK_CONSULTATION_LINK,
  PAY_DEPOSITE_LINK,
  ORIGIN_ZIPCODE,
  OPTIONS_ID_ORDER_FOR_UPGRADES,
  OPTIONS_ID_ORDER_FOR_ADDONS,
} from './settings.js';

import {
  create3DScene,
  isWebGLAvailable,
  showWebGLFallback,
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
  requestRender,
} from './3d-scene.js';

import {
  generatePDF,
} from './pdf-maker.js';

import {
  createMenu,
  loadAndParseCSV,
  loadData,
  getData,
  updateUIlanguages,
  checkConfigFinalized,
  isFinalized,
  checkPriceHiding,
  isPriceHidden,
  isFinalPriceHidden,
} from './ui-controller.js';

import { verifyDiscount } from './discount.js';

// Clipping model mode
export let current3Dmodel = null;
export let isLocalClippingOn = false;
export let notClippingMaterials = [];

// state variables
let currentLanguage = DEFAULT_LANGUAGE;
let currentCurrency = DEFAULT_CURRENCY;
let currentCurrencySign = CURRENCY_SIGN[currentCurrency] || CURRENCY_SIGN['USD'];
let currentHouse = '0';
let isWindowCustomOn = false;
let isFoundationKitOn = false;
let isExtraDoorOn = false;
let selectedExtraDoorPosition = null;
let extraDoorHotspots = [];
let glowingPanels = [];
let hoveredGlowingSector = null;
let isWindowsSmart = false;

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
  b: [],
  c: [],
  d: [],
  e: [],
  f: [],
  g: [],
  h: [],
  i: [],
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
// Calculated total *before* any URL discount override is applied. Stays
// equal to totalAmount when no discount is active. Used by the summary
// popup breakdown to render the original total + a "Discount" line item.
let originalAmountBeforeDiscount = 0;
let maximumLeadTimeWeeks = 0;

let stateSalesTax = 0;
let shippingDistance = 0;
let totalAmountShipTax = 0;
let userName = '';
let userPhone = '';
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
  {  // [4] upgrades
    id: 'upgrades',
    groupIds: ['group-4'],
    splitValue: 'V',
    type: 'array-string',
    value: [0, 0, 0],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [5] addons
    id: 'addons',
    groupIds: ['group-5'],
    splitValue: 'O',
    type: 'array-string',
    value: [0, 0, 0],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {  // [6] foundation
    id: 'foundation',
    groupIds: ['group-6'],
    splitValue: 'U',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [7] language
    id: 'lang',
    groupIds: null,
    splitValue: 'u',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [8] currency
    id: 'curr',
    groupIds: null,
    splitValue: 'a',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [9] customWindows
    id: 'customWindows',
    groupIds: null,
    splitValue: 'q',
    type: 'array-string',
    value: ['c', 'd', 'e', 'f', 'g', 'h', 'i'],
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [10] qr
    id: 'qr',
    groupIds: null,
    splitValue: 'r',
    type: 'int',
    value: 0,
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [11] discount
    // URL value format: D{amount}-{hash}, e.g. D54300-3b7c9f. Verified
    // against DISCOUNT_SECRET via verifyDiscount(); validatedAmount holds
    // the override total once verification completes (null when no
    // discount or invalid). See js/discount.js.
    id: 'discount',
    groupIds: null,
    splitValue: 'D',
    type: 'string',
    value: '0',
    validatedAmount: null,
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  { // [12] extraDoor
    id: 'extraDoor',
    groupIds: null,
    splitValue: 'X',
    type: 'int',
    value: 0,
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  }
];

function getSharedParameter(id) {
  const item = SharedParameterList.find(el => el.id === id);
  if (!item) {
    console.warn(`Element id "${id}" not found in SharedParameterList`);
    return null;
  }
  return item;
}

// zomeModel
getSharedParameter('zomeModel').groupOptionAction = function () {
  if (justClicked) {
    currentHouse = this.value;
    changeModel(this.value);
  }
}

// windows
getSharedParameter('windows').groupOptionAction = function () {
  if (justClicked) {
    if (this.value[2] == '1') { // Custom Windows on - add strip and viewport windows to custom windows object
      addStripAndViewportWindowsToCustomWindowsObject(this.value[0], this.value[1]);
    }
  }
}

// interior
getSharedParameter('interior').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    // do something if needed
  }

  setObjectTexture(TEXTURES.interior.materialNames, TEXTURES.interior[this.value]);
}

// exterior
getSharedParameter('exterior').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    // do something if needed
  }

  setObjectTexture(TEXTURES.exterior.materialNames, TEXTURES.exterior[this.value]);
}

// upgrades
getSharedParameter('upgrades').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    if (this.value[2] == '1') { // extra door
      isExtraDoorOn = true;
      if (isCameraInside) {
        $('#button_camera_outside').click();
      }
      if (selectedExtraDoorPosition) {
        // Restore previously saved position
        installExtraDoor(selectedExtraDoorPosition, false);
      } else {
        flyCameraTo('outExtraDoor', 'outside');
        showExtraDoorHotspots();
        updateExtraDoorMeshesVisibility(null, false);
      }
    } else {
      isExtraDoorOn = false;
      uninstallExtraDoor(false);
    }

    checkUpgradesAndAddonsState();
  }
}

// addons
getSharedParameter('addons').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    checkUpgradesAndAddonsState();
  }
}

// language
getSharedParameter('lang').groupOptionAction = function () {
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
        language = 'EN';
        break;
    }

    $('.language-picker select').val(language).trigger('change');
  }
}

// currency
getSharedParameter('curr').groupOptionAction = function () {
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
getSharedParameter('customWindows').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    if (this.value.length > 0) {
      restoreCustomWindows();
    }
  }
}

// foundation
getSharedParameter('foundation').groupOptionAction = function () {
  if (isFirstStart || justClicked) {
    if (this.value[0] == '1') { // foundation kit
      floor.position.y = MODEL_CENTER_POSITION - FOUNDATION_HEIGHT;
      isFoundationKitOn = true;
    } else {
      floor.position.y = MODEL_CENTER_POSITION;
      isFoundationKitOn = false;
    }

    floor.position.y -= 0.01;

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

// qr
getSharedParameter('qr').groupOptionAction = function () {
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

// Resolves once dataMain, dataPrice, and dataAnnotations are all loaded.
// Awaited at the start of StartSettings so the configurator never reads
// half-loaded data — but the menu paints as soon as dataMain is ready.
let dataReady = null;

let ziptaxPromise = null;
function ensureZiptaxLoaded() {
  if (!ziptaxPromise) {
    ziptaxPromise = loadData(DATAFILE_LOCAL_ZIPTAX, DATAFILE_CSV_LINK_SALES_ZIPCODE, dataZiptax);
  }
  return ziptaxPromise;
}

prepareDataFiles();

async function prepareDataFiles() {
  // Kick off all three configurator-data fetches in parallel.
  const mainPromise = loadData(DATAFILE_LOCAL_UI, DATAFILE_CSV_LINK_UI, dataMain);
  const pricePromise = loadData(DATAFILE_LOCAL_PRICE, DATAFILE_CSV_LINK_PRICE, dataPrice);
  const annotationsPromise = loadData(DATAFILE_LOCAL_ANNOTATIONS, DATAFILE_CSV_LINK_ANNOTATIONS, dataAnnotations);

  // ziptax (1.85 MB) is loaded lazily — see ensureZiptaxLoaded().

  dataReady = Promise.all([mainPromise, pricePromise, annotationsPromise]);

  try {
    // Menu only needs dataMain. Price + annotations finish in the background
    // while the user picks a model; awaited at the start of StartSettings.
    await mainPromise;
    Start();
  } catch (error) {
    console.error("Error loading dataMain:", error);
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

async function payAttentionToIcons() {
  const infoIcons = document.querySelectorAll('.image-info');

  // Show the animation for all icons
  infoIcons.forEach(icon => {
    icon.classList.add('attention-icon');
  });

  // Optionally, remove the animation after a few seconds
  setTimeout(() => {
    infoIcons.forEach(icon => {
      icon.classList.remove('attention-icon');
    });
  }, 20000); // 20 seconds
}

// ! *****************   START   ********************
async function Start() {
  // Without WebGL the configurator can't render, and THREE.WebGLRenderer
  // would throw an uncaught exception that strands the page on the loader.
  // Show a friendly message instead and bail before any 3D init runs.
  if (!isWebGLAvailable()) {
    showWebGLFallback();
    return;
  }

  await createMenu(dataMain);
  // Menu is on screen now. Make sure dataPrice + dataAnnotations have arrived
  // before wiring language/currency handlers in PrepareUI, since those
  // re-render translated strings on change.
  if (dataReady) await dataReady;
  PrepareUI();
  create3DScene(sceneProperties, () => InitializationGroups(startCallback));
  payAttentionToIcons();

  function startCallback() {
    if (loaded) return;
    loaded = true;

    migrateOldConfigURL();
    ReadURLParameters(StartSettings);
    checkConfigFinalized();
    checkPriceHiding();
  }
}

async function StartSettings() {
  // dataPrice / dataAnnotations may still be in flight if the user picked
  // a model very fast — wait for them before any pricing/option logic runs.
  if (dataReady) await dataReady;

  // Verify the URL discount (if any) before the first calculatePrice runs.
  // verifyDiscount is async (WebCrypto HMAC); we cache the result on the
  // parameter so calculatePrice can read it synchronously.
  const discountParam = getSharedParameter('discount');
  if (discountParam) {
    discountParam.validatedAmount = await verifyDiscount(discountParam.value);
  }

  // get all options
  document.querySelectorAll('.option').forEach(option => {
    const groupId = option.getAttribute('data-group_id');
    const componentId = option.getAttribute('data-component_id');
    const optionString = `option_${groupId}-${componentId}`;
    allOptions.push(optionString);
  });

  blockBuyBtn();

  currentHouse = getSharedParameter('zomeModel').value || '0';

  await loadModel(MODEL_PATHS[currentHouse], false, () => { }, true);
  modelHouse = IMPORTED_MODELS[0];
  setVisibility(modelHouse, false, ['bed']);
  hideAllExtraDoorMeshes();
  setMainDoorMeshVisibility(true);
  updateInsidePartitionVisibility();

  if (currentHouse === '3' || currentHouse === '4') {
    jQuery('#button_furniture').css('display', 'none');
  } else {
    jQuery('#button_furniture').css('display', 'flex');
  }

  const foundationMesh = GetMesh('foundation');
  if (foundationMesh) {
    foundationMesh.position.y = -0.0015;
  } else {
    console.error('foundation mesh is not defined for currentHouse:', currentHouse);
  }

  modelHouse?.scale.set(0, 0, 0);
  modelHouse && scene.add(modelHouse);

  changeWindowNamesForRowC(modelHouse);

  loadModel(MODEL_PATHS[parseInt(parseInt(currentHouse) + 5)], true, () => {
    modelFurniture = IMPORTED_MODELS[1];
    modelFurniture.visible = false;
    modelFurniture && scene.add(modelFurniture);
    disableModelCastingShadows(modelFurniture);
    disableModelReceivingShadows(modelFurniture);
  });

  preloadTextures();

  isolateGlassInGroups(modelHouse);

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

  window.myCamera = camera;
  window.myControls = controls;

  onChangePosition(DATA_HOUSE_NAME[currentHouse], 'outMain', () => { }, 5);

  animateScale(modelHouse, 500, () => {
    unBlockBuyBtn();
    CheckChanges();
    applyAdditionalSharedParameters(7); // customWindows
    populateFormFromUrl();
  });

  isFirstStart = false;
}
// ! ************************************************

// Add this to your page
window.addEventListener('load', function () {
  const iframe = document.querySelector('.meetings-iframe-container iframe');

  if (iframe) {
    iframe.addEventListener('load', function () {
      try {
        // Try to access the iframe's document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Inject custom styles
        const style = iframeDoc.createElement('style');
        style.textContent = `
          [class*="CardWrapper__Outer"] {
            border-radius: 50px !important;
            overflow: hidden !important;
          }
          
          [class*="CardSection__StyledCardSection"] {
            border-radius: 50px !important;
          }
        `;
        iframeDoc.head.appendChild(style);

        console.log('✅ Styles injected successfully');
      } catch (e) {
        console.error('❌ Cannot access iframe due to CORS:', e.message);
        console.log('The iframe is cross-origin and blocks style injection.');
      }
    });
  }
});

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
            if (opt.element.classList.contains('disabled') || opt.element.classList.contains('disabled_always')) {
              return;
            }
            opt.element.classList.toggle('active');
            opt.active = opt.element.classList.contains('active');
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
  requestRender();
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
      array[o].active = array[o].element ? array[o].element.classList.contains('active') : array[o].active;
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
  if (getSharedParameter('windows').value[0] == '1') { // Strip
    setWindowPreset('strip');
  }

  if (getSharedParameter('windows').value[1] == '1') { // ViewPort
    setWindowPreset('viewport');
  }

  setWindowPreset('skylight');
}

function updateStateVars() {
  // Update state vars if needed
  currentHouse = getSharedParameter('zomeModel').value;
  isWindowCustomOn = (getSharedParameter('windows').value[2] == '1') ? true : false;
  isFoundationKitOn = (getSharedParameter('foundation').value[0] == '1') ? true : false;
  isExtraDoorOn = (getSharedParameter('upgrades').value[2] == '1') ? true : false;
  const extraDoorVal = getSharedParameter('extraDoor')?.value;
  if (isExtraDoorOn && extraDoorVal && Number.isFinite(parseInt(extraDoorVal)) && parseInt(extraDoorVal) > 0) {
    selectedExtraDoorPosition = parseInt(extraDoorVal);
  } else if (!isExtraDoorOn) {
    selectedExtraDoorPosition = null;
  }
}

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

// eslint-disable-next-line no-unused-vars
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

// ! ************************************************
function CheckChanges() {
  updateStateVars();
  setAllPanelsOn();

  applyAllConditionsActiveRadios();
  applyAllConditionsUncheckedCHeckboxes();
  additionalConditions();

  if (isExtraDoorOn && selectedExtraDoorPosition) {
    const allowed = EXTRA_DOOR_AVAILABLE_SECTORS[currentHouse] || [];
    if (!allowed.includes(selectedExtraDoorPosition) || !canInstallExtraDoorAt(selectedExtraDoorPosition)) {
      selectedExtraDoorPosition = null;
      getSharedParameter('extraDoor').value = 0;
      WriteURLParameters();
      showExtraDoorHotspots();
      updateExtraDoorMeshesVisibility(null, false);
    } else {
      removeExtraDoorPanelsFromCustomWindows(selectedExtraDoorPosition);
      getSharedParameter('customWindows').value = convertObjectToArray(customWindows);
      restoreCustomWindows();
      updateExtraDoorMeshesVisibility(selectedExtraDoorPosition, true);
    }
  } else if (isExtraDoorOn && !selectedExtraDoorPosition) {
    showExtraDoorHotspots();
    updateExtraDoorMeshesVisibility(null, false);
  } else if (!isExtraDoorOn) {
    removeExtraDoorHotspots();
    updateExtraDoorMeshesVisibility(null, false);
  }

  if (isWindowCustomOn && getSharedParameter('customWindows').value.length > 0) {
    restoreCustomWindows();
    if (isExtraDoorOn && selectedExtraDoorPosition) {
      updateExtraDoorMeshesVisibility(selectedExtraDoorPosition, true);
    }
  }

  applyActiveGroupOptionAction();
  updateStateVars();

  checkUpgradesAndAddonsState();
  updateDoorAndWindowsMutualBlocking();

  smartWindowsController('glass', isWindowsSmart);
  smartWindowsController('glass.001', isWindowsSmart);

  calculatePrice();
  calculateAndSetEstimateDates();
  collectSummary();

  requestRender();
}
// ! ************************************************
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
  cancelUnplacedExtraDoor();
  removeExtraDoorHotspots();

  IMPORTED_MODELS[0] && await disposeModel(IMPORTED_MODELS[0]);
  IMPORTED_MODELS[1] && await disposeModel(IMPORTED_MODELS[1]);

  IMPORTED_MODELS.length = 0;

  await loadModel(MODEL_PATHS[modelId], false, () => { }, true);
  modelHouse = IMPORTED_MODELS[0];
  setVisibility(modelHouse, false, ['bed']);
  hideAllExtraDoorMeshes();
  setMainDoorMeshVisibility(true);
  updateInsidePartitionVisibility();

  if (currentHouse === '3' || currentHouse === '4') {
    jQuery('#button_furniture').css('display', 'none');
  } else {
    jQuery('#button_furniture').css('display', 'flex');
  }
  
  const foundationMesh = GetMesh('foundation');
  if (foundationMesh) {
    foundationMesh.position.y = -0.0015;
  } else {
    console.error('foundation mesh is not defined for currentHouse:', currentHouse);
  }

  modelHouse?.scale.set(0, 0, 0);
  modelHouse && scene.add(modelHouse);

  changeWindowNamesForRowC(modelHouse);

  setObjectTexture(TEXTURES.interiorBase.materialNames, TEXTURES.interiorBase.white);
  setMaterialColor(TEXTURES.interiorBase.materialNames[0], baseColorForRowA);

  await loadModel(MODEL_PATHS[parseInt(parseInt(modelId) + 5)], true, () => {
    modelFurniture = IMPORTED_MODELS[1];
    modelFurniture.visible = false;
    modelFurniture && scene.add(modelFurniture);
    disableModelCastingShadows(modelFurniture);
    disableModelReceivingShadows(modelFurniture);
  });

  isolateGlassInGroups(modelHouse);

  $('.summary_container').css('pointer-events', '');
  $('.product-type-3dmodel').css('cursor', '');

  (isWindowCustomOn) && $('.option_1-2').trigger('click');
  resetCustomWindowsObject();

  setVisibility(modelHouse, false, ['man']);
  onChangePosition(DATA_HOUSE_NAME[modelId], 'outMain', () => { }, 5);

  CheckChanges();

  animateScale(modelHouse, 500, () => {
    unBlockBuyBtn();
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

  getSharedParameter('customWindows').value = convertObjectToArray(customWindows);
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
  requestRender();
}

function updateFurnitureSet() {
  if ($('#button_sleep').hasClass('active')) {
    // setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['work-back-door', 'work', 'live']);
    setVisibility(modelFurniture, true, ['sleep']);
  }

  if ($('#button_live').hasClass('active')) {
    // setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
    setVisibility(modelFurniture, false, ['sleep', 'work', 'work-back-door']);
    setVisibility(modelFurniture, true, ['live']);
  }

  if ($('#button_work').hasClass('active')) {
    // setVisibility(modelFurniture, false, ['Pod-desk-top', 'office-desk-top', 'Studio-desk-top']);
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
  requestRender();
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
  requestRender();
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
    case '3':
      ui_id = 'ui_dimensions_part_500';
      break;
    case '4':
      ui_id = 'ui_dimensions_part_700';
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
  const totalAmountElement2 = document.getElementById('ar_total_price_2');
  totalAmount = 0;
  maximumLeadTimeWeeks = 0;

  let optionId = '';
  let activeOptions = [];

  for (let i = 0; i < SharedParameterList.length - 4; i++) {
    if (SharedParameterList[i].type === 'string') {
      optionId = `option_${i}-${SharedParameterList[i].value}`;
      activeOptions.push(optionId);
    } else if (SharedParameterList[i].type === 'array-string') {
      for (let j = 0; j < SharedParameterList[i].value.length; j++) {
        if (SharedParameterList[i].value[j] == '1') {
          if (i === 4) {
            optionId = `option_${i}-${OPTIONS_ID_ORDER_FOR_UPGRADES[j]}`; // upgrades
          } else if (i === 5) {
            optionId = `option_${i}-${OPTIONS_ID_ORDER_FOR_ADDONS[j]}`; // addons
          } else {
            optionId = `option_${i}-${j}`;
          }

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
    } else if (option === 'option_0-3') { // Zome 500
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[3]}_${currentCurrency}`));
    } else if (option === 'option_0-4') { // Zome 700
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[4]}_${currentCurrency}`));
    } else if (option === 'option_1-2') { // custom windows
      price = convertPriceToNumber(getData(dataPrice, option, `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
      $(`.${option} .component_price`).html(
        `${formatPrice(price, currentCurrencySign)} ${getData(dataMain, 'ui_per_window', currentLanguage)}`
      );
    } else if (option === 'option_4-5') { // smart glass
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

    const windows_C_qty = customWindows.c.length;
    const windows_C_price = convertPriceToNumber(getData(dataPrice, 'option_1-2_operable', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`)); // price of window type C

    if (activeOptions[i] === 'option_1-2') { // custom windows
      const windowsQty = Object.values(customWindows).reduce((total, array) => total + array.length, 0);
      const windowsCustomPrice = optionPrice * (windowsQty - windows_C_qty) + windows_C_price * windows_C_qty;
      $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsCustomPrice, currentCurrencySign));
      if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
      totalAmount += windowsCustomPrice;
    } else if (activeOptions[i] === 'option_4-5') { // smart windows
      let windowsSmartPrice = (currentHouse == '2') ? optionPrice * 6 : optionPrice * 5;
      $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
      if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
      totalAmount += windowsSmartPrice; // added skylights (smart glass)

      if (activeOptions.includes('option_1-2')) { // custom windows
        const windowsQty = Object.values(customWindows).reduce((total, array) => total + array.length, 0) - windows_C_qty;
        windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
        $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
        if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
        totalAmount += optionPrice * windowsQty;
      } else if (!activeOptions.includes('option_1-2')) { // NOT custom windows
        if (activeOptions.includes('option_1-1')) { // viewport
          const windowsQty = 3; // ! 4 windows minus 1 window on level C
          windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
          $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
          if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
          totalAmount += optionPrice * windowsQty;
        }
        if (activeOptions.includes('option_1-0')) { // strip
          let windowsQty = (currentHouse == '2') ? 4 : 3; // ! 5 or 4 windows minus 1 window on level C
          windowsSmartPrice = windowsSmartPrice + optionPrice * windowsQty;
          $(`.${activeOptions[i]} .component_price`).html(formatPrice(windowsSmartPrice, currentCurrencySign));
          if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
          totalAmount += optionPrice * windowsQty;
        }
      }
    } else {
      if (activeOptions[i] === 'option_4-3' && !selectedExtraDoorPosition) {
        // ! Door is toggled in menu, but not yet placed in 3D:
        // ! Show $0 in menu and do NOT add to totalAmount until placed!
        $(`.${activeOptions[i]} .component_price`).html(formatPrice(0, currentCurrencySign));
      } else {
        $(`.${activeOptions[i]} .component_price`).html(formatPrice(optionPrice, currentCurrencySign));
        if (optionLeadTime > maximumLeadTimeWeeks) { maximumLeadTimeWeeks = optionLeadTime; }
        totalAmount += optionPrice;
      }
    }
  }

  if (!activeOptions.includes('option_4-5')) { // smart windows is not active
    const price = convertPriceToNumber(getData(dataPrice, 'option_4-5', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    $(`.option_4-5 .component_price`).html(`${formatPrice(price, currentCurrencySign)} ${getData(dataMain, 'ui_per_window', currentLanguage)}`);
  }

  // Apply URL discount before stringification so every downstream consumer
  // of `totalAmount` (display, payment schedule, tax/shipping calc, webhook
  // payload) sees the discounted number. The URL value is the *amount off*
  // (i.e. the savings) — not the override total. Only applied when the
  // discount is positive and strictly less than the calculated total —
  // guards against ever zeroing-out or negating the total when a stale URL
  // discount exceeds the customer's current configuration.
  const discountParam = getSharedParameter('discount');
  const urlDiscount = discountParam?.validatedAmount;
  originalAmountBeforeDiscount = totalAmount;
  let discountAmount = 0;
  if (urlDiscount != null && urlDiscount > 0 && urlDiscount < totalAmount) {
    discountAmount = urlDiscount;
    totalAmount -= urlDiscount;
  }

  totalAmount = totalAmount.toFixed(0);
  currentAmountString = formatPrice(totalAmount, currentCurrencySign);
  totalAmountElement.innerText = currentAmountString;
  totalAmountElement2.innerText = currentAmountString;

  updateDiscountDisplay(originalAmountBeforeDiscount, discountAmount);

  document.getElementById('summary_form_totalamount_number').value = totalAmount;
  document.getElementById('summary_form_totalamount_string').value = currentAmountString;

  updateShippingTaxInfo();
}

function updateDiscountDisplay(originalAmount, discountAmount) {
  const blocks = ['ar_discount_block', 'ar_discount_block_2'];
  if (discountAmount <= 0) {
    blocks.forEach(id => document.getElementById(id)?.classList.add('hidden'));
    return;
  }
  const originalStr = formatPrice(originalAmount.toFixed(0), currentCurrencySign);
  const discountStr = formatPrice(discountAmount.toFixed(0), currentCurrencySign);
  blocks.forEach(id => document.getElementById(id)?.classList.remove('hidden'));
  document.querySelectorAll('.ar_discount__original_price').forEach(el => { el.innerText = originalStr; });
  document.querySelectorAll('.ar_discount__amount_value').forEach(el => { el.innerText = `−${discountStr}`; });
}

function convertPriceToNumber(priceString) {
  if (!priceString) return 0;

  const cleanedPrice = priceString.replace(/[^\d.,]/g, '');
  const priceWithDot = cleanedPrice.replace(',', '.');
  const priceNumber = parseFloat(priceWithDot);

  return priceNumber;
}

function formatPrice(price, currency, needToBeRounded = true, needToAddSpace = false) {
  if (
    !price
    && getSharedParameter('windows').value[2] != 1 // custom windows
    && getSharedParameter('upgrades').value[2] != 1 // extra door // !!! corrected
    && getSharedParameter('upgrades').value[0] != 1 // smart glass // !!! corrected
  ) {
    return getData(dataMain, 'ui_component_price_included', currentLanguage);
  }

  if (price !== 0 && !price) { price = '' }
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

function setMaterialProperty(materialName, value, property = 'metalness') {
  const materialObject = GetMaterialFromScene(materialName);
  if (materialObject == null) {
    console.error(`ERROR: Material ${materialName} is not found !`);
    return;
  }
  if (!materialObject.hasOwnProperty(property)) {
    console.error(`ERROR: Material ${materialName} has no property ${property} !`);
    return;
  }

  materialObject[property] = value;
  requestRender();
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
  requestRender();
}

function setMaterialColor(materialName, color) {
  const materialObject = GetMaterialFromScene(materialName);
  if (materialObject == null) { return; }
  materialObject.color.set(color);
  materialObject.needsUpdate = true;
  requestRender();
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
  requestRender();

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
          requestRender();
        }, undefined, () => {
          console.error('An error happened.');
        });
      } else {
        textureProperties[node].apply(material, textureCache[value]);
        material.needsUpdate = true;
        requestRender();
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
      // console.log(`Position of mesh '${meshName}' set to:`, newPosition);
    }
  });
}

function getGroupNamesList(parent, searchString = '') {
  if (!parent) return [];

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

function migrateOldConfigURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const config = urlParams.get('config');

  if (!config) return;
  if (config.includes('U')) return;

  // Old format                         New format
  // O{foundation}-{desk}-{other}u  ->  O{desk}-{other}U{foundation}u
  const migrated = config.replace(/O(\d+)-(\d+)-(\d+)u/, 'O$2-$3U$1u');

  if (migrated === config) return;

  urlParams.set('config', migrated);
  const newURL = location.protocol + '//' + location.host + location.pathname + '?' + urlParams.toString();
  history.replaceState(null, '', newURL);

  console.log('Old URL migrated to new format:');
  console.log('  before: ' + config);
  console.log('  after:  ' + migrated);
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
    const raw = paramArray[index + 1];

    // Pre-existing URLs may be shorter than SharedParameterList (e.g. URLs
    // shared before a new trailing parameter was added). Preserve the
    // parameter's default `value` in that case rather than overwriting with
    // undefined / NaN.
    if (raw === undefined) continue;

    switch (element.type) {
      case 'string':
        element.value = raw.toString();
        break;
      case 'int': {
        // Don't overwrite the default with NaN if the URL had a garbage value
        // (e.g. an earlier write that serialized NaN as the literal "NaN").
        // Letting NaN propagate corrupts future URL writes: NaN.toString() is
        // "NaN", whose lowercase 'a' collides with the currency splitValue
        // and breaks every parameter that follows on the next parse.
        const intVal = parseInt(raw);
        if (Number.isFinite(intVal)) element.value = intVal;
        break;
      }
      case 'float': {
        const floatVal = parseFloat(raw);
        if (Number.isFinite(floatVal)) element.value = floatVal;
        break;
      }
      case 'array-string':
        arrayValue = raw.toString();
        element.value = GetSharedArrayValues(arrayValue, 'string');
        break;
      case 'array-int':
        arrayValue = raw.toString();
        element.value = GetSharedArrayValues(arrayValue, 'int');
        break;
      case 'array-float':
        arrayValue = raw.toString();
        element.value = GetSharedArrayValues(arrayValue, 'float');
        break;
    }

    if (element.id == 'qr') {
      qrScaned = element.value;
    }
  }

  // Sanitize extra door on URL read: an unplaced extra door cannot persist across reload
  const extraDoorVal = getSharedParameter('extraDoor')?.value;
  if (!extraDoorVal || parseInt(extraDoorVal) <= 0) {
    const upgradesParam = getSharedParameter('upgrades');
    if (upgradesParam?.value) {
      upgradesParam.value[2] = '0';
    }
    isExtraDoorOn = false;
    selectedExtraDoorPosition = null;
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
          const v = (typeof element.value[i] === 'number' && !Number.isFinite(element.value[i])) ? 0 : element.value[i];
          if (i == element.value.length - 1) {
            parametersValue += v;
          } else {
            parametersValue += v + '-';
          }
        }
        break;
      default:
        // Never serialize NaN/Infinity — JavaScript stringifies NaN as the
        // literal "NaN", whose lowercase 'a' collides with the currency
        // splitValue and corrupts every parameter after it on next parse.
        // Fall back to 0 (matches the default for the int/float types
        // currently using this code path: qr, etc).
        const value = (typeof element.value === 'number' && !Number.isFinite(element.value)) ? 0 : element.value;
        parametersValue += element.splitValue + value;
        break;
    }
  }

  //You can do something here...
  return parametersValue;
}

function GetURLWithParameters() {
  // Use URL/URLSearchParams to ensure values are URL-encoded correctly
  // (the previous implementation concatenated decoded values verbatim,
  // which silently broke any value containing "+" — e.g. email addresses
  // with a "+tag" subaddress, where "+" got written literally into the
  // URL and then decoded as a space on the next read, breaking the
  // saved-designs HMAC token check).
  const url = new URL(location.href);
  url.searchParams.set(parametersKey, GetParametersString());
  return url.toString();
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

    $(document).on('mouseenter', '.option.disabled', function () {
      $(this).find('.option_tooltip').css('display', 'block');
    }).on('mouseleave', '.option.disabled', function () {
      $(this).find('.option_tooltip').css('display', '');
    });

    $(document).on('click', '.ar_button_back, .ar_button_next, .title_list__item, #view_summary_btn, #canvas_button_view_summary, #ar_button_order, #canvas_button_save', function () {
      cancelUnplacedExtraDoor();
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

      getSharedParameter('lang').value = valueForURL;
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

      getSharedParameter('curr').value = valueForURL;
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
  });

  // Date and Tax popups
  jQuery(document).ready(function () {
    $('.menu__footer_delivery_info .menu__footer__info_icon').on('click', function () {
      $('.popup__info_date').toggleClass('hidden');
    });

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
    const $phoneInput = $('#form_phone');
    const $emailInput = $('#form_email');
    const $zipcodeInput = $('#form_zipcode');
    let formOpenTime = Date.now();

    $nameInput.on('input', validateForm);
    $phoneInput.on('input', validateForm);
    $emailInput.on('input', validateForm);
    $zipcodeInput.on('input', validateForm);

    $form.on('submit', async function (event) {
      event.preventDefault();

      userName = $nameInput.val().trim();
      userPhone = $phoneInput.val().trim();
      userEmail = $emailInput.val().trim();
      userZipcode = $zipcodeInput.val().trim();

      const honeypotValue = document.querySelector('input[name="email2"]').value;
      if (honeypotValue) {
        return false;
      }

      const timeSpent = Date.now() - formOpenTime;
      if (timeSpent < 500) {
        return false;
      }

      if (!(/^\d{5}$/.test(userZipcode))) {
        $('.summary__popup-overlay').css('overflow-y', 'auto');
        $('.contact_form__popup-overlay').removeClass('active');
        return false;
      }

      // All validations passed. Show "Saving design..." while we hit
      // the tax sheet, Maps API, and the webhook — typically 1-3 seconds.
      // try/finally guarantees the original label and enabled state are
      // restored even if an unexpected error escapes one of the inner blocks.
      const $submitBtn = $('#submitButton');
      const $submitCaption = $submitBtn.find('.ar_button_order__caption_large');
      const originalCaption = $submitCaption.text();
      $submitCaption.text('Saving design...');
      $submitBtn.prop('disabled', true);

      try {
        localStorage.setItem('userName', userName);
        localStorage.setItem('userPhone', userPhone);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userZipcode', userZipcode);

        try {
          stateSalesTax = +(await getTaxRate(userZipcode));
          shippingDistance = await getDistance(userZipcode);
          updateShippingTaxInfo();
        } catch (error) {
          console.error('Error fetching distance:', error);
        }

        document.getElementById('js_enabled').value = 'true';

        const formData = new FormData($form[0]);
        formData.append('designURL', window.location.href);

        // Saved-designs: pass the existing design_id + token so the webhook
        // knows whether this is an update (design_id present) or a new save.
        // Anonymous first-saves omit both.
        const _url = new URL(window.location.href);
        const _designId = _url.searchParams.get('design_id');
        const _token = _url.searchParams.get('t');
        if (_designId) formData.append('design_id', _designId);
        if (_token) formData.append('t', _token);

        try {
          console.log("Submitting form...");
          const response = await fetch($form.attr('action'), {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const contentType = response.headers.get('content-type') ?? '';
            if (contentType.includes('application/json')) {
              const data = await response.json();
              // Mint the signed-in URL: ?…&design_id=&email=&t=. From now on
              // the browser session is authenticated for the saved-designs
              // library and subsequent saves can run silently.
              if (data.email || data.t || data.design_id) {
                const next = new URL(window.location.href);
                if (data.email) next.searchParams.set('email', data.email);
                if (data.t) next.searchParams.set('t', data.t);
                if (data.design_id) next.searchParams.set('design_id', data.design_id);
                window.history.replaceState(null, '', next.toString());
              }
              // We just saved a design — the user now has ≥ 1. Reveal the
              // header entry button immediately (no need to wait for the
              // background probe to confirm) and re-probe in the background
              // so the "currently editing" label picks up the new design's
              // name.
              if (data.design_id && window.MyDesigns) {
                window.MyDesigns.revealHeaderButton();
                window.MyDesigns.afterSave?.();
              }
              if (data.welcome_back && window.MyDesigns) {
                window.MyDesigns.showWelcomeBackToast();
              }
            }
          }
        } catch (error) {
          console.error('🚀 Error:', error);
        }
        closeContactForm();
      } finally {
        $submitCaption.text(originalCaption);
        $submitBtn.prop('disabled', false);
      }
    });

    validateForm();
  });

  // ! Hide and disable Airconditioner option
  jQuery(document).ready(function () {
    const airConditionerOption = $('.option_5-4');
    if (airConditionerOption.length) {
      airConditionerOption.hide(); // Hide the option from the UI
      airConditionerOption.addClass('disabled'); // Disable the option
    }
  });
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validateForm() {
  const name = $('#form_name').val().trim();
  const phone = $('#form_phone').val().trim();
  const email = $('#form_email').val().trim();
  const zipcode = $('#form_zipcode').val().trim();

  const isNameValid = name !== '';
  const isPhoneValid = validatePhone(phone);
  const isEmailValid = validateEmail(email);
  const isZipcodeValid = /^\d{5}$/.test(zipcode);

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isZipcodeValid;

  if (isFormValid) {
    $('#submitButton').prop('disabled', false);
    WriteURLParameters();
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('name', name);
    currentUrl.searchParams.set('phone', phone);
    currentUrl.searchParams.set('email', email);
    currentUrl.searchParams.set('zipcode', zipcode);
    window.history.replaceState({}, '', currentUrl);
  } else {
    $('#submitButton').prop('disabled', true);
  }

  if (zipcode.length > 5) {
    $('#submitButton').prop('disabled', false);
  }
}

async function populateFormFromUrl() {
  const currentUrl = new URL(window.location.href);

  const name = currentUrl.searchParams.get('name');
  const phone = currentUrl.searchParams.get('phone');
  const email = currentUrl.searchParams.get('email');
  const zipcode = currentUrl.searchParams.get('zipcode');

  if (name) {
    $('#form_name').val(name);
    localStorage.setItem('userName', name);
  }
  if (phone) {
    $('#form_phone').val(phone);
    localStorage.setItem('userPhone', phone);
  }
  if (email) {
    $('#form_email').val(email);
    localStorage.setItem('userEmail', email);
  }
  if (zipcode) {
    $('#form_zipcode').val(zipcode);
    localStorage.setItem('userZipcode', zipcode);
  }

  if (zipcode) {
    userZipcode = $('#form_zipcode').val();
    stateSalesTax = +(await getTaxRate(zipcode));
    shippingDistance = await getDistance(userZipcode);
    updateShippingTaxInfo();
  }

  if (name && phone && email && zipcode) {
    // Skip auto-summary when the URL has a saved-designs token. That means
    // the user opened the design from "My Saved Designs" (or via a token
    // link) to keep editing — they want the configurator, not the summary.
    // The legacy email-link flow (no token) keeps its existing behavior.
    const hasSavedDesignsToken = !!currentUrl.searchParams.get('t');
    if (!hasSavedDesignsToken) {
      proceedSummaryAndPdf(false);
    }
    userName = $('#form_name').val();
    userPhone = $('#form_phone').val();
    userEmail = $('#form_email').val();
    userZipcode = $('#form_zipcode').val();
    stateSalesTax = +(await getTaxRate(zipcode));
    shippingDistance = await getDistance(userZipcode);
    updateShippingTaxInfo();
  }
}

function calculateAndSetEstimateDates() {
  const estimateDate = getData(dataPrice, 'shipDate', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`);
  const prepaymentDays = getData(dataPrice, 'prepaymentDays', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`);

  const dateStrings = getDatesStrings(estimateDate, maximumLeadTimeWeeks, currentLanguage, prepaymentDays);
  const shipDateString = dateStrings.shipDateString;
  const prepaymentDateString = dateStrings.prepaymentDateString;
  const deliveryDateString = dateStrings.deliveryDateString;

  const weeksAhead = dateStrings.differenceInWeeks;
  const textPart1 = getData(dataMain, 'ui_date_popup_text_1', currentLanguage);
  const textPart2 = getData(dataMain, 'ui_date_popup_text_2', currentLanguage);
  $('#delivery_info_date').text(shipDateString);
  $('#delivery_info_date_2').text(shipDateString);
  $('.popup__info_content_date').html(`Ships ${shipDateString}. ${textPart1} ${maximumLeadTimeWeeks} ${textPart2}`);

  $('#prepayment_title').text(prepaymentDateString);
  $('#ship_day_title').text(shipDateString);
  $('#delivery_title').text(deliveryDateString);

  const depositTextString = getData(dataMain, 'ui_timeline_today_subtitle', currentLanguage);
  const depositAmount = convertPriceToNumber(getData(dataPrice, 'depositAmount', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  const depositAmountString = formatPrice(depositAmount, currentCurrencySign);
  const prepaynemtTextString = getData(dataMain, 'ui_timeline_prepayment_subtitle', currentLanguage);
  const prepaynemtAmountString = (!isFinalPriceHidden) ? `(${formatPrice(totalAmount / 2 - depositAmount, currentCurrencySign)})` : '';
  const finalPaymentTextString = getData(dataMain, 'ui_timeline_ship_day_subtitle', currentLanguage);
  const finalPaymentAmountString = (!isFinalPriceHidden) ? `(${formatPrice(totalAmount - totalAmount / 2, currentCurrencySign)})` : '';
  const todayTextPart1 = getData(dataMain, 'ui_timeline_today_text', currentLanguage);
  const todayTextPart2 = getData(dataMain, 'ui_timeline_today_text_2', currentLanguage);

  $('#today_subtitle').text(`${depositAmountString} ${depositTextString}`);
  $('#today_text').text(`${todayTextPart1} ${weeksAhead} ${todayTextPart2}`);
  $('#prepayment_subtitle').text(`${prepaynemtTextString} ${prepaynemtAmountString}`);
  $('#ship_day_subtitle').text(`${finalPaymentTextString} ${finalPaymentAmountString}`);
}

function getDatesStrings(dateStr, leadTimeInWeeks = 3, lang = 'EN', prepaymentDateDays = 28, deliveryDateWeeks = 2) {
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

  // prepaymentDate.setDate(resultDate.getDate() + prepaymentDateWeeks * 7);
  prepaymentDate.setDate(resultDate.getDate() - prepaymentDateDays);
  deliveryDate.setDate(resultDate.getDate() + deliveryDateWeeks * 7);
  const prepaymentDateString = formatDate(prepaymentDate, lang);
  const deliveryDateString = formatDate(deliveryDate, lang);

  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 1);
  const timeDifference = deliveryDate.getTime() - futureDate.getTime();
  const differenceInWeeks = Math.round(timeDifference / (7 * 24 * 60 * 60 * 1000));

  return { shipDateString, prepaymentDateString, deliveryDateString, differenceInWeeks };
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
  $('#button_camera_inside').on('click', function (event, aim = 'outXrays') {
    event.stopPropagation();
    $(this).toggleClass('hidden');
    $('#button_camera_outside').toggleClass('hidden');
    $('.canvas_btn_camera').addClass('disabled');

    flyCameraTo(aim, 'inside', () => {
      renderer.clippingPlanes = [];
      notClippingMaterials = [
        'floor',
        'AC_white',
        'AC_gray',
        'AC_gray.001',
        'AC_screen',
        'bamboo',
        'furniture',
        'gray',
        'fabric',
      ];
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
    selectModel('0');
  });

  $('#select_btn_office').on('click', function () {
    selectModel('1');
  });

  $('#select_btn_studio').on('click', function () {
    selectModel('2');
  });

  $('#select_btn_500').on('click', function () {
    selectModel('3');
  });

  $('#select_btn_700').on('click', function () {
    selectModel('4');
  });

  function selectModel(value) {
    $('.popup_select').addClass('hidden');
    getSharedParameter('zomeModel').value = value;
    StartSettings();
    $('#title_list__item_0').click();
  }
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
      $('#canvas_notification_window').removeClass('hidden');

      setTimeout(function () {
        $('#canvas_notification_window').addClass('hidden');
      }, 2500);
    }
  });

  $('.option_4-3').on('click', function () {
    if (!$(this).hasClass('active')) {
      $('#canvas_notification_door').removeClass('hidden');

      setTimeout(function () {
        $('#canvas_notification_door').addClass('hidden');
      }, 2500);
    }
  });
}

function summaryBtnsHandler() {
  // Guard against re-entry while the camera fly-out animation is in flight
  // (~2s when the user is in inside-view). Without it, mashing the button
  // queues a second flyCameraTo and a second summary open.
  let isOpeningSummary = false;

  $(document).on('click', '#ar_button_order, #ar_button_next_5, #canvas_button_save', function () {
    if (isOpeningSummary) return;
    isOpeningSummary = true;

    if ($('#button_dimensions').hasClass('active')) {
      $('#button_dimensions').trigger('click');
    }

    // Swap the caption on the clicked button (only #ar_button_order has one
    // — the floating canvas icon and the next-5 button are caption-less, so
    // the swap is a harmless no-op there).
    const $btn = $(this);
    const $caption = $btn.find('.ar_button_order__caption_large');
    const originalCaption = $caption.text();
    if (originalCaption) $caption.text('Saving design...');

    function restore() {
      if (originalCaption) $caption.text(originalCaption);
      isOpeningSummary = false;
    }

    // Saved-designs: when the URL has email + t, the user is "signed in" and
    // we have all of name/phone/email/zipcode in localStorage from their
    // first save. Skip the summary + contact form entirely; just POST and
    // toast. Falls back to the normal flow if the silent save errors out
    // (e.g. localStorage was cleared so required fields are missing).
    if (isSignedInForSavedDesigns()) {
      silentSaveDesign().then((ok) => {
        if (ok) {
          restore();
        } else {
          // Graceful fallback — silent save failed; show the form.
          setTimeout(() => {
            if (!isCameraInside) {
              proceedSummaryAndPdf(!isFinalized);
              restore();
            } else {
              flyCameraTo('outMain', 'outside', () => {
                proceedSummaryAndPdf(!isFinalized);
                restore();
              });
            }
          }, 0);
        }
      });
      return;
    }

    // Defer the popup-opening work so the browser actually paints the
    // "Saving design..." caption first. Without this delay, the camera-
    // outside path runs synchronously and the popup covers the button
    // in the same frame — the caption never reaches the screen.
    setTimeout(() => {
      if (!isCameraInside) {
        proceedSummaryAndPdf(!isFinalized);
        restore();
      } else {
        flyCameraTo('outMain', 'outside', () => {
          proceedSummaryAndPdf(!isFinalized);
          restore();
        });
      }
    }, 250);
  });

  // "View Summary" buttons (desktop side panel + mobile canvas footer).
  // Opens the summary popup without the contact form. If the camera is
  // inside the model, fly out first so the user sees the elevations
  // populated correctly — same camera step the save flow uses.
  $(document).on('click keydown', '#view_summary_btn, #canvas_button_view_summary', function (ev) {
    if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();

    resetCanvasButtons();
    

    if (isCameraInside) {
      flyCameraTo('outMain', 'outside', () => proceedSummaryAndPdf(false));
    } else {
      proceedSummaryAndPdf(false);
    }
  });

  $('.summary__link').on('click', function () {
    closeSummary();
  });

  $('#backToConfiguration').on('click', function () {
    closeSummary();
  });

  $('#updateDesignBtn').on('click', function () {
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

function proceedSummaryAndPdf(shouldOpenForm = true) {
  CreateImageList();
  collectSummary();
  openSummary();
  shouldOpenForm && openContactForm();
  $('.summary__popup-overlay').scrollTop(0);
}

// ── Saved-designs: silent-save helpers ──────────────────────────────────────
//
// When the URL carries ?email=&t=, the user is "signed in" via the stateless
// HMAC-signed token (see lib/auth/designToken.ts in zomes_sdr). Subsequent
// saves skip the summary + contact form entirely; we POST directly to the
// configurator webhook with name/phone/zipcode pulled from localStorage
// (cached from their first form submission).

function isSignedInForSavedDesigns() {
  const url = new URL(window.location.href);
  return !!(url.searchParams.get('email') && url.searchParams.get('t'));
}

async function silentSaveDesign() {
  // Required by the existing webhook validator (validateSubmission). If any
  // is missing, fall back to the form so the user can refill.
  const cachedName = localStorage.getItem('userName') || userName;
  const cachedPhone = localStorage.getItem('userPhone') || userPhone;
  const cachedEmail = localStorage.getItem('userEmail') || userEmail;
  const cachedZip = localStorage.getItem('userZipcode') || userZipcode;
  if (!cachedName || !cachedPhone || !cachedEmail || !cachedZip) {
    return false;
  }

  // Make sure the URL reflects the current configuration before we send it.
  // WriteURLParameters debounces by 100ms; sleep just past that so designURL
  // captures the user's latest tweaks instead of a stale config.
  WriteURLParameters();
  await new Promise((r) => setTimeout(r, 150));

  const url = new URL(window.location.href);
  const designId = url.searchParams.get('design_id');
  const token = url.searchParams.get('t');

  const fd = new FormData();
  fd.append('name', cachedName);
  fd.append('phone', cachedPhone);
  fd.append('email', cachedEmail);
  fd.append('zipcode', cachedZip);
  fd.append('email2', '');                    // honeypot
  fd.append('designURL', window.location.href);
  fd.append('totalamount_number', String(totalAmount));
  fd.append('totalamount_string', `${totalAmount}`);
  if (token) fd.append('t', token);
  if (designId) fd.append('design_id', designId);

  try {
    const res = await fetch('https://sdr.zomes.com/api/webhooks/configurator', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) {
      console.warn('[silent-save] HTTP', res.status);
      return false;
    }
    const data = await res.json().catch(() => null);
    if (!data || !data.ok) {
      console.warn('[silent-save] non-ok response:', data);
      return false;
    }
    // Update URL with the response (server may issue a fresh design_id on
    // save-as-new, or echo the existing one on update).
    const next = new URL(window.location.href);
    if (data.email) next.searchParams.set('email', data.email);
    if (data.t) next.searchParams.set('t', data.t);
    if (data.design_id) next.searchParams.set('design_id', data.design_id);
    window.history.replaceState(null, '', next.toString());

    if (window.MyDesigns) {
      // Save just succeeded → the user definitely has ≥ 1 design now.
      window.MyDesigns.revealHeaderButton();
      window.MyDesigns.afterSave?.();
      if (data.welcome_back) {
        window.MyDesigns.showWelcomeBackToast();
      } else {
        window.MyDesigns.showSavedToast();
      }
    }
    return true;
  } catch (err) {
    console.error('[silent-save] error:', err);
    return false;
  }
}

function getPdfBtnHandler() {
  $('.summary_download_pdf_btn').on('click', function () {

    const timelineTexts = {
      details__tax_text: $('#details__tax_text').text(),

      today_title: $('#today_title').text(),
      today_subtitle: $('#today_subtitle').text(),
      today_text: $('#today_text').text(),

      prepayment_title: $('#prepayment_title').text(),
      prepayment_subtitle: $('#prepayment_subtitle').text(),
      prepayment_text: $('#prepayment_text').text(),

      ship_day_title: $('#ship_day_title').text(),
      ship_day_subtitle: $('#ship_day_subtitle').text(),
      ship_day_text: $('#ship_day_text').text(),

      delivery_title: $('#delivery_title').text(),
      delivery_subtitle: $('#delivery_subtitle').text(),
      delivery_text: $('#delivery_text').text(),
    };

    generatePDF(
      currentHouse,
      dataMain,
      currentLanguage,
      imageSources,
      pdfContentData,
      timelineTexts,
      userName,
      userPhone,
      userEmail,
      userZipcode,
    );
  });
}

function bookTimeBtnHandler() {
  $('.summary_book_time_btn').on('click', function (e) {
    // window.open(CALENDLY_LINK, '_blank');
    e.preventDefault();
    const calendlyContainer = document.querySelector('.calendly__container');
    const closeBtn = document.querySelector('.calendly__close-btn');
    calendlyContainer.classList.add('active');
    document.body.classList.add('popup-open');

    function closePopup() {
      calendlyContainer.classList.remove('active');
      document.body.classList.remove('popup-open');
    }

    closeBtn.addEventListener('click', closePopup);

    calendlyContainer.addEventListener('click', (e) => {
      if (e.target === calendlyContainer) {
        closePopup();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && calendlyContainer.classList.contains('active')) {
        closePopup();
      }
    });
  });
}

function bookConsultationAndDepositBtns() {
  $('.timeline_btn_pay_deposit').on('click', function () {
    const email = localStorage.getItem('userEmail');
    const payDepositeUrl = (email)
      ? `${PAY_DEPOSITE_LINK}?prefilled_email=${encodeURIComponent(email)}`
      : PAY_DEPOSITE_LINK;

    window.open(payDepositeUrl, '_blank');
  });
}

async function getTaxRate(destinationZipCode) {
  await ensureZiptaxLoaded();
  return getData(dataZiptax, destinationZipCode + '', 'StateRate', 'ZipCode');
}

async function getDistance(destinationZipCode) {
  return Promise.race([
    new Promise((resolve, reject) => {
      var api = new google.maps.DistanceMatrixService();
      api.getDistanceMatrix({
        origins: [ORIGIN_ZIPCODE],
        destinations: [destinationZipCode + ''],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      }, function (response, status) {
        if (status === 'OK') {
          const element = response.rows[0].elements[0];
          if (element.status === 'OK') {
            resolve(extractDistance(element.distance.text));
          } else {
            resolve(null);
          }
        } else {
          reject(new Error(`API request failed with status: ${status}`));
        }
      });
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
  ]);
}


function extractDistance(distanceStr) {
  const numericValue = distanceStr.replace(/,/g, '').replace(' mi', '');
  const distance = parseFloat(numericValue);

  return distance;
}

function updateShippingTaxInfo() {
  const shipppingCostBase = convertPriceToNumber(getData(dataPrice, 'shipppingCostBase', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  const shipppingCostMile = convertPriceToNumber(getData(dataPrice, 'shipppingCostMile', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
  const prepaymentAmountRate = convertPriceToNumber(getData(dataPrice, 'prepaymentRates', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));

  totalAmountShipTax = totalAmount * stateSalesTax + shippingDistance * shipppingCostMile;

  if (totalAmountShipTax) {
    currentTaxAmountString = formatPrice(totalAmountShipTax + shipppingCostBase, currentCurrencySign);
  }

  const text = (totalAmountShipTax)
    ? ` ${getData(dataMain, 'ui_summary_details__tax_text_short', currentLanguage)} ${userZipcode} ${getData(dataMain, 'ui_summary_details__tax_text_to_be_calculated', currentLanguage)}`
    : getData(dataMain, 'ui_summary_details__tax_text', currentLanguage);

  const text2 = (totalAmountShipTax)
    ? ` ${getData(dataMain, 'ui_summary_details__tax_text_short_2', currentLanguage)} ${userZipcode} ${getData(dataMain, 'ui_summary_details__tax_text_to_be_calculated2', currentLanguage)}`
    : getData(dataMain, 'ui_summary_details__tax_text_2', currentLanguage);

  const amountText = (totalAmountShipTax) ? ` ${currentTaxAmountString}` : ' ';

  $('#payment_info_title').html(`+${amountText} ${text}`); // Desktop
  $('#payment_info_title_2').html(`+${amountText} ${text2}`); // Mobile
  $('#details__tax_text').html(`+ ${amountText} ${text}`); // Summary

  $('#prepayment_amount').html(`${currentCurrencySign}${prepaymentAmountRate}/month *`);
}

function openSummary() {
  $('.summary__popup-overlay').addClass('active');

  $(`.summary__scheme_zome-120`).removeClass('active');
  $(`.summary__scheme_zome-170`).removeClass('active');
  $(`.summary__scheme_zome-300`).removeClass('active');
  $(`.summary__scheme_zome-500`).removeClass('active');
  $(`.summary__scheme_zome-700`).removeClass('active');
  $(`.summary__scheme_dimensions_zome-120`).removeClass('active');
  $(`.summary__scheme_dimensions_zome-170`).removeClass('active');
  $(`.summary__scheme_dimensions_zome-300`).removeClass('active');
  $(`.summary__scheme_dimensions_zome-500`).removeClass('active');
  $(`.summary__scheme_dimensions_zome-700`).removeClass('active');

  const houseName = DATA_HOUSE_NAME[currentHouse].toLowerCase();

  $(`.summary__scheme_${houseName}`).addClass('active');
  $(`.summary__scheme_dimensions_${houseName}`).addClass('active');

  // openContactForm();
}

function closeSummary() {
  $('.summary__popup-overlay').removeClass('active');
  $('.summary__scheme').removeClass('active');
}

function openContactForm() {
  // Warm the ziptax cache while the user is typing — they'll need it on submit.
  ensureZiptaxLoaded();

  $('.summary__popup-overlay').css('overflow-y', 'hidden');

  const savedName = localStorage.getItem('userName');
  const savedPhone = localStorage.getItem('userPhone');
  const savedEmail = localStorage.getItem('userEmail');
  const savedZipcode = localStorage.getItem('userZipcode');

  if (savedName) {
    $('#form_name').val(savedName);
  }

  if (savedPhone) {
    $('#form_phone').val(savedPhone);
  }

  if (savedEmail) {
    $('#form_email').val(savedEmail);
  }

  if (savedZipcode) {
    $('#form_zipcode').val(savedZipcode);
  }

  validateForm();

  $('.contact_form__popup-overlay').addClass('active');
}

function closeContactForm() {
  $('.summary__popup-overlay').css('overflow-y', 'auto');
  $('.contact_form__popup-overlay').removeClass('active');
}

// Friendly "last saved" string for the summary hero subtitle.
//   < 30s   → "Just saved"
//   < 60s   → "Last saved 12s ago"
//   < 60m   → "Last saved 5m ago"
//   < 24h   → "Last saved 3h ago"
//   < 30d   → "Last saved 2d ago"
//   else    → "Last saved June 30, 2025"
function formatLastSavedAt(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '';
  const sec = Math.round(ms / 1000);
  if (sec < 30) return 'Just saved';
  if (sec < 60) return `Last saved ${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `Last saved ${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `Last saved ${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `Last saved ${d}d ago`;
  const date = new Date(iso);
  return `Last saved ${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
}

function collectSummary() {
  pdfContentData.length = 0;

  const detailsContainer = $('.summary__popup-content .details');
  detailsContainer.empty();

  // Hero heading: design name, then user name + email + last-saved date,
  // each on its own line. Shown only when a saved design is loaded
  // (URL has design_id resolving to one of the user's). Empty/hidden
  // otherwise — the popup just shows the elevation views and breakdown.
  const heading = document.getElementById('summary_heading');
  const headingTitle = document.getElementById('summary_heading_title');
  const headingUserName = document.getElementById('summary_heading_user_name');
  const headingUserEmail = document.getElementById('summary_heading_user_email');
  const headingSubtitle = document.getElementById('summary_heading_subtitle');
  const currentDesign = window.MyDesigns?.getCurrentDesign?.() ?? null;
  if (heading && headingTitle && headingSubtitle) {
    if (currentDesign?.name) {
      // Pull name/email from URL first (authoritative for the active
      // saved-designs session), then fall back to localStorage / globals
      // so old anonymous saves still render something useful.
      const _url = new URL(location.href);
      const displayName = _url.searchParams.get('name') || localStorage.getItem('userName') || userName || '';
      const displayEmail = _url.searchParams.get('email') || localStorage.getItem('userEmail') || userEmail || '';
      headingTitle.textContent = currentDesign.name;
      if (headingUserName) { headingUserName.textContent = displayName; headingUserName.hidden = !displayName; }
      if (headingUserEmail) { headingUserEmail.textContent = displayEmail; headingUserEmail.hidden = !displayEmail; }
      headingSubtitle.textContent = formatLastSavedAt(currentDesign.updated_at);
      heading.hidden = false;
    } else {
      headingTitle.textContent = '';
      if (headingUserName) { headingUserName.textContent = ''; headingUserName.hidden = true; }
      if (headingUserEmail) { headingUserEmail.textContent = ''; headingUserEmail.hidden = true; }
      headingSubtitle.textContent = '';
      heading.hidden = true;
    }
  }

  // "Design" row at top of the breakdown table.
  const currentDesignName = currentDesign?.name ?? '';
  if (currentDesignName) {
    const designGroup = $('<div>', { class: 'details__group details__type_select details__design', id: 'details__design' });
    const designItem = $('<div>', { class: 'details__item details__active' });
    const designText = $('<div>', { class: 'details__item_text_container' });
    $('<div>', { class: 'details__group_title', text: 'Design' }).appendTo(designText);
    $('<div>', { class: 'details__item_title', text: currentDesignName }).appendTo(designText);
    designText.appendTo(designItem);
    designItem.appendTo(designGroup);
    designGroup.appendTo(detailsContainer);
  }

  $('.ar_filter_group').each(function () {
    const group = $(this);
    const groupId = group.attr('id');

    if (groupId === 'group-3') { return; } // ! TEMPORARY CODE for removing EXTERIOR group

    const groupTitle = group.find('.ar_filter_caption').text();
    const filterOptions = group.find('.ar_filter_options');

    let classes = `details__group details__${filterOptions.attr('class').split(' ')[1]}`

    switch (groupId) {
      case 'group-0': // Model
      case 'group-2': // Interior
      case 'group-3': // Exterior
      case 'group-6': // Subfloor / Foundation
      case 'group-1': // Windows
        classes = classes + ' details__type_select';
        break;
      case 'group-4': // Upgrades
      case 'group-5': // Add-ons
        classes = classes + ' details__type_checkbox';
        break;
      default:
        break;
    }

    const detailsGroupId = `details__${groupId}`;

    const detailsGroup = $('<div>', {
      class: classes,
      id: detailsGroupId
    });

    pdfContentData.push(
      { text: groupTitle, style: 'subtitle', margin: [0, 0, 0, 0], },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 0.5 }], margin: [0, 6, 0, 6], },
    );

    filterOptions.find('.option').each(function () {
      const option = $(this);
      if (!option.hasClass('disabled')) {
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
          class: 'details__group_title',
          text: groupTitle
        }).appendTo(textContainer);

        $('<div>', {
          class: 'details__item_title',
          text: optionTitle
        }).appendTo(textContainer);

        $('<div>', {
          class: 'details__item_not_included',
          text: getData(dataMain, 'ui_summary_not_included', currentLanguage),
        }).appendTo(textContainer);

        textContainer.appendTo(detailsItem);

        if (!isFinalPriceHidden) {
          $('<div>', {
            class: 'details__item_price',
            text: optionPrice
          }).appendTo(detailsItem);
        }

        detailsItem.appendTo(detailsGroup);

        if (optionClasses.includes('details__active')) {
          const windowsCode = (optionClasses.includes('details__option_1-2')) ? formatCustomWindows(customWindows) : '';

          pdfContentData.push(
            {
              columns: [
                { text: optionTitle + windowsCode, style: 'tableText', width: '70%', margin: [0, 0, 0, 0], },
                { text: '', width: '*', margin: [0, 0, 0, 0] },
                { text: optionPrice, style: 'tableText', margin: [0, 0, 0, 0], alignment: 'right', },
              ].filter((_, index) => !(isFinalPriceHidden && index === 2)),
            },
          );
        }

        if (!optionClasses.includes('details__active') && detailsGroupId === 'details__group-4') { // ADD-ONs
          pdfContentData.push(
            {
              columns: [
                { text: optionTitle + getData(dataMain, 'ui_summary_not_included', currentLanguage), width: '70%', style: 'tableText', margin: [0, 0, 0, 0], },
                { text: '', width: '*', margin: [0, 0, 0, 0] },
                { text: optionPrice, style: 'tableText', margin: [0, 0, 0, 0], alignment: 'right', },
              ].filter((_, index) => !(isFinalPriceHidden && index === 2)),
            },
          );
        }
      }
    });

    detailsGroup.appendTo(detailsContainer);

    pdfContentData.push(
      { text: '', width: '*', margin: [0, 0, 0, 10] },
    );
  });

  // When a discount is active, append two rows before the bottom-line TOTAL:
  // "Total before discount" (pre-discount subtotal) and "Discount" (the
  // savings). Both are skipped when there's no discount, so the breakdown
  // matches its pre-discount shape. The URL value (validatedAmount) IS the
  // savings — display it directly.
  const discountParam = getSharedParameter('discount');
  const urlDiscount = discountParam?.validatedAmount;
  if (urlDiscount != null && urlDiscount > 0 && urlDiscount < originalAmountBeforeDiscount) {
    const subtotalGroup = $('<div>', { class: 'details__group details__type_select details__subtotal', id: 'details__subtotal' });
    const subtotalItem = $('<div>', { class: 'details__item details__active' });
    const subtotalText = $('<div>', { class: 'details__item_text_container' });
    $('<div>', { class: 'details__group_title', text: 'Total before discount' }).appendTo(subtotalText);
    subtotalText.appendTo(subtotalItem);
    $('<div>', {
      class: 'details__item_price',
      text: formatPrice(originalAmountBeforeDiscount.toFixed(0), currentCurrencySign),
    }).appendTo(subtotalItem);
    subtotalItem.appendTo(subtotalGroup);
    subtotalGroup.appendTo(detailsContainer);

    const discountGroup = $('<div>', { class: 'details__group details__type_select details__discount', id: 'details__discount' });
    const discountItem = $('<div>', { class: 'details__item details__active' });
    const discountText = $('<div>', { class: 'details__item_text_container' });
    $('<div>', { class: 'details__group_title', text: 'Discount' }).appendTo(discountText);
    discountText.appendTo(discountItem);
    $('<div>', {
      class: 'details__item_price details__discount_price',
      text: `−${formatPrice(urlDiscount.toFixed(0), currentCurrencySign)}`,
    }).appendTo(discountItem);
    discountItem.appendTo(discountGroup);
    discountGroup.appendTo(detailsContainer);
  }

  $('#details__total_price').html(currentAmountString);

  if (totalAmountShipTax) {
    const shipppingCostBase = convertPriceToNumber(getData(dataPrice, 'shipppingCostBase', `${DATA_HOUSE_NAME[currentHouse]}_${currentCurrency}`));
    currentTaxAmountString = formatPrice(totalAmountShipTax + shipppingCostBase, currentCurrencySign);
  }
  const text = (totalAmountShipTax)
    ? `${getData(dataMain, 'ui_summary_details__tax_text_short', currentLanguage)} ${userZipcode}`
    : getData(dataMain, 'ui_summary_details__tax_text', currentLanguage);
  const amountText = (totalAmountShipTax) ? `${currentTaxAmountString}` : '';

  $('#details__tax_text').html(`+ ${amountText} ${text}`);

  (!isFinalPriceHidden) && pdfContentData.push(
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 6], },
    {
      columns: [
        { text: getData(dataMain, 'ui_pdf_total', currentLanguage), width: '70%', style: 'tableTitle', margin: [0, 0, 0, 0], },
        { text: '', width: '*', margin: [0, 0, 0, 0] },
        { text: currentAmountString, style: 'tableTitle', margin: [0, 0, 0, 0], alignment: 'right', },
      ]
    },
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

// eslint-disable-next-line no-unused-vars
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
  if ($(this).hasClass('disabled')) return;
  if (!isCameraInside) {
    flyCameraTo('outWindowsStrip', 'outside');
  }
});

$(document).on('click', '.option.option_1-1', function () { // windows viewport
  if ($(this).hasClass('disabled')) return;
  if (!isCameraInside) {
    flyCameraTo('outWindowsViewport', 'outside');
  }
});

$(document).on('click', '.option.option_1-2', function () { // custom windows
  if ($(this).hasClass('disabled')) return;
  if (isCameraInside) {
    $('#button_camera_outside').click();
  }
});

$(document).on('click', '.option.option_4-3', function () { // extra door
  if ($(this).hasClass('disabled')) return;
  if (isCameraInside) {
    $('#button_camera_outside').click();
  }
  if ($(this).hasClass('active') && !selectedExtraDoorPosition) {
    flyCameraTo('outExtraDoor', 'outside');
  }
});

$(document).on('click', '.option.option_5-1', function () { // in-build desk
  checkUpgradesAndAddonsState();

  if ($('.option.option_5-1').hasClass('active')) {
    if (!isCameraInside) {
      $('#button_camera_inside').click();
    } else {
      flyCameraTo('outBuildInDesk', 'inside');
    }
  }
});

$(document).on('click', '.option.option_5-5', function () { // in-build bed
  checkUpgradesAndAddonsState();

  if ($('.option.option_5-5').hasClass('active')) {
    // if (!isCameraInside) {
    //   $('#button_camera_inside').click();
    // }

    if (!isCameraInside) {
      $('#button_camera_inside').trigger('click', ['outBuildInBed']);
      flyCameraTo('outBuildInBed', 'inside');
    } else {
      flyCameraTo('outBuildInBed', 'inside');
    }
  }
});

$(document).on('click', '.option.option_5-4', function () { // air conditioner
  checkUpgradesAndAddonsState();

  if (!isCameraInside) {
    $('#button_camera_inside').trigger('click', ['outAirConditioner']);
    flyCameraTo('outAirConditioner', 'inside');
  } else {
    flyCameraTo('outAirConditioner', 'inside');
  }
});


function checkUpgradesAndAddonsState() {
  // Built-in desk ON or Air conditioner ON
  if ($('.option.option_5-1').hasClass('active') || $('.option.option_5-4').hasClass('active') || $('.option.option_5-5').hasClass('active')) {
    disableFurnitureBtn();
  }

  // Built-in desk OFF and Air conditioner OFF
  if (!$('.option.option_5-1').hasClass('active') && !$('.option.option_5-4').hasClass('active') && !$('.option.option_5-5').hasClass('active')) {
    enableFurnitureBtn();
  }

  //Smart windows
  if ($('.option.option_4-5').hasClass('active')) {
    $('.tumbler__container').addClass('active');
  } else {
    $('.tumbler__container').removeClass('active');
    if ($('.tumbler-wrapper').hasClass('turned-on')) {
      $('.tumbler-wrapper').removeClass('turned-on');
      isWindowsSmart = false;
      smartWindowsController('glass', isWindowsSmart);
      smartWindowsController('glass.001', isWindowsSmart);
    }
  }
}

$(document).on('click', '.tumbler-wrapper', function () { //Smart windows tumblr
  $('.tumbler-wrapper').toggleClass('turned-on');
  isWindowsSmart = !isWindowsSmart;
  smartWindowsController('glass', isWindowsSmart);
  smartWindowsController('glass.001', isWindowsSmart);
});


function smartWindowsController(materialName, isEnabled) {
  scene.traverse((object) => {
    if (object.isMesh && object.material && object.material.name === materialName) {
      const material = object.material;

      if (isEnabled) {
        material.opacity = 1;
        material.roughness = 0.1;
        material.metalness = 0.2;
        material.needsUpdate = true;
      } else {
        material.opacity = 0.3;
        material.roughness = 0;
        material.metalness = 1;
        material.needsUpdate = true;
      }
    }
  });
  requestRender();
}

function isolateGlassInGroups(model) {
  model.traverse((object) => {

    if (object.name) {
      const lowerName = object.name.toLowerCase();

      if (lowerName.includes('window-glass-c') || lowerName.includes('door') || lowerName.includes('entry')) {
        object.traverse((child) => {
          if ((child.isMesh && child.material && child.material.name === 'glass') ||
            (child.isMesh && child.material && child.material.name === 'glass.001')) {
            const newMaterial = child.material.clone();
            newMaterial.name = 'static-glass';

            if (newMaterial.envMapIntensity === undefined) newMaterial.envMapIntensity = 1.0;
            newMaterial.envMapIntensity *= 0.5;

            if (newMaterial.roughness < 0.2) {
              newMaterial.roughness = Math.max(0.1, newMaterial.roughness + 0.1);
            }

            if (newMaterial.metalness > 0.1) {
              newMaterial.metalness *= 0.5;
            }
            child.material = newMaterial;
            child.material.needsUpdate = true;
          }
        });
      }
    }
  });
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

function getControlsMinDistance(houseName) {
  switch (houseName) {
    case 'Zome-120':
      return 3.5;
    case 'Zome-170':
      return 4;
    case 'Zome-300':
      return 4.5;
    case 'Zome-500':
      return 6;
    case 'Zome-700':
      return 7;
    default:
      return 6;
  }
}

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
    targetControlMinDist = getControlsMinDistance(houseId);
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
    removeExtraDoorHotspots();
  } else if (inOrOut === 'outside') {
    $('#button_camera_outside').addClass('hidden');
    $('#button_camera_inside').removeClass('hidden');
    isCameraInside = false;
    if (isExtraDoorOn && !selectedExtraDoorPosition) {
      showExtraDoorHotspots();
    }
  }

  onChangePosition(DATA_HOUSE_NAME[currentHouse], namePosition, callback, duration);

  smartWindowsController('glass', isWindowsSmart);
  smartWindowsController('glass.001', isWindowsSmart);
}

function changeWindowNamesForRowC(model) {
  if (model.isModelChanged === true) {
    return;
  }
  const objectsToRemove = [];
  model.traverse((child) => {
    if (child.isGroup && child.name) {
      const groupName = child.name.toLowerCase();
      if (groupName.includes("window") && groupName.includes("-c-")) {
        if (groupName.includes("001")) {
          child.name = child.name.replace("001", "");
        } else if (groupName.includes("_open")) {
          child.name = child.name.replace("_open", "");
        } else {
          // child.name = child.name.replace(/window/i, "glass");
          // child.visible = false;
          objectsToRemove.push(child);
        }
      }
    }
  });

  objectsToRemove.forEach((obj) => {
    obj.traverse((node) => {
      if (node.isMesh && node.geometry) {
        node.geometry.dispose();
      }
    });
    obj.removeFromParent();
  });

  model.isModelChanged = true;
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


function getRaycastExtraDoorSector(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Raycast against all objects in the scene so front surfaces occlude back ones
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (!intersects || intersects.length === 0) return null;

  // Find distance to the first visible object of the house (skip floor/shadows)
  let firstVisibleDist = null;
  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    if (obj && obj.visible) {
      if (obj === floor || obj.name === 'shadow_plane' || obj.name === 'shadowPlane') continue;
      firstVisibleDist = intersects[i].distance;
      break;
    }
  }

  if (firstVisibleDist === null) return null;

  const maxFrontDist = firstVisibleDist + 0.35;
  const allowed = EXTRA_DOOR_AVAILABLE_SECTORS[currentHouse] || [];

  for (let i = 0; i < intersects.length; i++) {
    const hit = intersects[i];
    if (hit.distance > maxFrontDist) break;

    const obj = hit.object;
    if (!obj || !obj.visible) continue;
    if (obj === floor || obj.name === 'shadow_plane' || obj.name === 'shadowPlane') continue;

    let matchedSector = null;

    // 1. Check glowing panels list
    if (glowingPanels.length > 0) {
      let checkObj = obj;
      outer: while (checkObj && checkObj !== scene) {
        for (const entry of glowingPanels) {
          if (entry.mesh === checkObj ||
              (entry.mesh && entry.mesh.parent && entry.mesh.parent === checkObj) ||
              (entry.mesh && entry.mesh.parent && entry.mesh.parent === checkObj.parent) ||
              (checkObj.name && entry.mesh.name && checkObj.name.toLowerCase() === entry.mesh.name.toLowerCase())) {
            matchedSector = entry.x;
            break outer;
          }
        }
        checkObj = checkObj.parent;
      }
    }

    // 2. Check panel name from object or any ancestor group
    if (matchedSector === null) {
      let checkObj = obj;
      while (checkObj && checkObj !== scene) {
        const name = checkObj.name || '';
        const match = name.match(/panel.*-c-(\d+)(?:\D|$)/i) || name.match(/-c-(\d+)(?:\D|$)/i);
        if (match) {
          matchedSector = parseInt(match[1]);
          break;
        }
        checkObj = checkObj.parent;
      }
    }

    if (matchedSector !== null && allowed.includes(matchedSector) && canInstallExtraDoorAt(matchedSector)) {
      return matchedSector;
    }
  }

  return null;
}

function onMouseMove(event) {
  if (Math.abs(event.clientX - startX) > clickThreshold || Math.abs(event.clientY - startY) > clickThreshold) {
    isMouseMoved = true;
  }

  // Hover detection for extra door placement (only before door is placed)
  if (isExtraDoorOn && !selectedExtraDoorPosition && !isCameraInside && canvas) {
    const sector = getRaycastExtraDoorSector(event);
    if (sector !== null) {
      if (hoveredGlowingSector !== sector) {
        hoveredGlowingSector = sector;
        requestRender();
      }
      canvas.style.cursor = 'pointer';
    } else if (hoveredGlowingSector !== null) {
      hoveredGlowingSector = null;
      canvas.style.cursor = 'default';
      requestRender();
    }
  }
}

function onMouseUp(event) {
  if (!isMouseMoved) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Extra Door placement: only when enabled and NOT YET INSTALLED
    if (isExtraDoorOn && !selectedExtraDoorPosition && !isCameraInside) {
      const sector = getRaycastExtraDoorSector(event);
      if (sector !== null) {
        installExtraDoor(sector, true);
        canvas.style.cursor = 'default';
        return;
      }
    }

    // Custom Windows: only when user is inside the Windows menu (group-1)
    const isWindowsMenuOpen = !$('#group-1').hasClass('invisible') && $('.ar_filter').hasClass('active');
    if (isWindowCustomOn && isWindowsMenuOpen) {
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Find first VISIBLE mesh that is a panel or window (skip hotspots, helpers, shadow planes)
      let clickedMeshName = '';
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (!obj || !obj.visible) continue;
        if (obj === floor || obj.name === 'shadow_plane' || obj.name === 'shadowPlane') continue;

        const candidateName = (obj.parent && obj.parent !== scene) ? obj.parent.name : obj.name;
        if (candidateName && containsPanelOrWindow(candidateName)) {
          clickedMeshName = candidateName;
          break;
        }
      }

      if (clickedMeshName) {
        const [letter, number] = extractLastLetterAndNumber(clickedMeshName);

        if (letter && number) {
          updateCustomWindows([letter, number]);
          getSharedParameter('customWindows').value = convertObjectToArray(customWindows);
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

  if (isExtraDoorOn && selectedExtraDoorPosition) {
    const doorSectors = getExtraDoorAffectedPanels(selectedExtraDoorPosition);
    if (doorSectors.some(s => s.row.toLowerCase() === keyName && s.number === String(number))) {
      return;
    }
  }

  if (keyName in VIEWPORT_AND_STRIP_SECTORS[DATA_HOUSE_NAME[currentHouse]].skylight) {
    return;
  }

  if (Object.prototype.hasOwnProperty.call(customWindows, keyName)) {
    const index = customWindows[keyName].indexOf(number);
    const { panelMeshName, windowMeshName, glassMeshName } = findMeshByLetterAndNumber(modelHouse, letter, number);

    if (index === -1) {
      if (customWindows[keyName].length >= WINDOWS_LIMIT_IN_ROW[DATA_HOUSE_NAME[currentHouse]]) {

        $('#canvas_notification_limit').removeClass('hidden');

        setTimeout(function () {
          $('#canvas_notification_limit').addClass('hidden');
        }, 2500);

        return;
      }

      if (keyName === 'c') {
        if (customWindows[keyName].some(el => Number(el) === +number + 1 || Number(el) === +number - 1)) {
          return;
        }
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

    if (isExtraDoorOn && !selectedExtraDoorPosition) {
      showExtraDoorHotspots();
    }

    updateDoorAndWindowsMutualBlocking();
  } else {
    console.warn(`Letter "${letter}" not found in customWindows object.`);
  }
}

function findMeshByLetterAndNumber(parent, letter, number) {
  const panelSearchPattern = new RegExp(`panel.*-${letter}-${number}(?:\\D|$)`, 'i');
  const windowSearchPattern = new RegExp(`window.*-${letter}-${number}(?:\\D|$)`, 'i');
  const glassSearchPattern = new RegExp(`glass.*-${letter}-${number}(?:\\D|$)`, 'i');

  let panelMeshName = null;
  let windowMeshName = null;
  let glassMeshName = null;

  parent.traverse((o) => {
    if (o.isMesh) {
      const groupName = o.parent.name.toLowerCase().trim();

      if (panelSearchPattern.test(groupName)) {
        panelMeshName = o.parent.name;
      }

      if (windowSearchPattern.test(groupName)) {
        windowMeshName = o.parent.name;
      }

      if (glassSearchPattern.test(groupName)) {
        glassMeshName = o.parent.name;
      }
    }
  });

  return { panelMeshName, windowMeshName, glassMeshName };
}

function restoreCustomWindows() {
  customWindows = convertArrayToObject(getSharedParameter('customWindows').value);

  if (!isWindowCustomOn) return;

  resetCustomWindows();

  for (const [key, values] of Object.entries(customWindows)) {
    for (const value of values) {
      const { panelMeshName, windowMeshName, glassMeshName } = findMeshByLetterAndNumber(modelHouse, key, value);
      (panelMeshName) && setVisibility(modelHouse, false, [panelMeshName]);
      (windowMeshName) && setVisibility(modelHouse, true, [windowMeshName]);
    }
  }
}

function removeExtraDoorPanelsFromCustomWindows(pos = selectedExtraDoorPosition) {
  if (!pos) return;
  const sectors = getExtraDoorAffectedPanels(pos);
  sectors.forEach(({ row, number }) => {
    const letter = row.toLowerCase();
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
        const { panelMeshName, windowMeshName, glassMeshName } = findMeshByLetterAndNumber(modelHouse, key, value);
        (panelMeshName) && setVisibility(modelHouse, true, [panelMeshName]);
        (windowMeshName) && setVisibility(modelHouse, false, [windowMeshName]);
      }
    }
  }
}

function setWindowPreset(type) {
  const windowPresetData = VIEWPORT_AND_STRIP_SECTORS[DATA_HOUSE_NAME[currentHouse]][type];

  for (const [key, values] of Object.entries(windowPresetData)) {
    for (const value of values) {
      const { panelMeshName, windowMeshName, glassMeshName } = findMeshByLetterAndNumber(modelHouse, key, value);
      (panelMeshName) && setVisibility(modelHouse, false, [panelMeshName]);
      (windowMeshName) && setVisibility(modelHouse, true, [windowMeshName]);
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

    getSharedParameter('customWindows').value = convertObjectToArray(customWindows);
    WriteURLParameters();
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
      if ($annotationText.hasClass('disabled') && $annotationTextLong.hasClass('active')) {
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

//#region EXTRA DOOR

function isPanelHasWindow(letter, number) {
  const row = letter.toLowerCase();
  const numStr = String(number);

  // 1. Custom windows
  if (isWindowCustomOn && customWindows[row]?.includes(numStr)) {
    return true;
  }

  // 2. Strip preset
  const windowsParam = getSharedParameter('windows');
  const houseName = DATA_HOUSE_NAME[currentHouse];
  if (windowsParam?.value?.[0] == '1') {
    if (VIEWPORT_AND_STRIP_SECTORS[houseName]?.strip?.[row]?.includes(numStr)) {
      return true;
    }
  }

  // 3. Viewport preset
  if (windowsParam?.value?.[1] == '1') {
    if (VIEWPORT_AND_STRIP_SECTORS[houseName]?.viewport?.[row]?.includes(numStr)) {
      return true;
    }
  }

  // 4. Mesh visibility check
  if (modelHouse) {
    const { windowMeshName } = findMeshByLetterAndNumber(modelHouse, row, number);
    if (windowMeshName) {
      const meshObj = GetGroup(windowMeshName) || GetMesh(windowMeshName);
      if (meshObj && meshObj.visible) {
        return true;
      }
    }
  }

  return false;
}

function canInstallExtraDoorAt(x) {
  const affected = getExtraDoorAffectedPanels(x);
  for (let i = 0; i < affected.length; i++) {
    if (isPanelHasWindow(affected[i].row, affected[i].number)) {
      return false;
    }
  }
  return true;
}

export function updateDoorAndWindowsMutualBlocking() {
  if (!modelHouse) return;

  const houseName = DATA_HOUSE_NAME[currentHouse];
  const presets = VIEWPORT_AND_STRIP_SECTORS[houseName] || {};

  const doorTooltipText = getData(dataMain, 'ui_tooltip_unavailable_door', currentLanguage) ||
    (currentLanguage === 'ru' ? 'Недоступно: все позиции заняты окнами' : 'Unavailable: all positions occupied by windows');
  const windowTooltipText = getData(dataMain, 'ui_tooltip_unavailable_window', currentLanguage) ||
    (currentLanguage === 'ru' ? 'Недоступно: конфликтует с установленной дополнительной дверью' : 'Unavailable: conflicts with the installed extra door');

  // Update texts in tooltip DOM elements
  const $doorTooltip = $('#tooltip_unavailable_door');
  if ($doorTooltip.length) {
    $doorTooltip.text(doorTooltipText);
  }
  const $stripTooltip = $('#tooltip_unavailable_strip');
  if ($stripTooltip.length) {
    $stripTooltip.text(windowTooltipText);
  }
  const $viewportTooltip = $('#tooltip_unavailable_viewport');
  if ($viewportTooltip.length) {
    $viewportTooltip.text(windowTooltipText);
  }

  // 1. Check if Windows block Extra Door
  const allowedSectors = EXTRA_DOOR_AVAILABLE_SECTORS[currentHouse] || [];
  const anyAvailable = allowedSectors.some((x) => canInstallExtraDoorAt(x));

  if (!anyAvailable && (!isExtraDoorOn || !selectedExtraDoorPosition)) {
    $('.option.option_4-3').addClass('disabled');
    if (isExtraDoorOn && !selectedExtraDoorPosition) {
      uninstallExtraDoor(true);
    }
  } else {
    $('.option.option_4-3').removeClass('disabled');
  }

  // 2. Check if installed Extra Door blocks Window Presets (Strip / ViewPort)
  if (isExtraDoorOn && selectedExtraDoorPosition) {
    const affectedDoorPanels = getExtraDoorAffectedPanels(selectedExtraDoorPosition);

    // Check Strip (option_1-0)
    let stripConflicts = false;
    if (presets.strip) {
      for (const [row, numbers] of Object.entries(presets.strip)) {
        if (numbers.some((num) => affectedDoorPanels.some((p) => p.row.toLowerCase() === row.toLowerCase() && p.number === String(num)))) {
          stripConflicts = true;
          break;
        }
      }
    }

    if (stripConflicts) {
      $('.option.option_1-0').addClass('disabled');
    } else {
      $('.option.option_1-0').removeClass('disabled');
    }

    // Check ViewPort (option_1-1)
    let viewportConflicts = false;
    if (presets.viewport) {
      for (const [row, numbers] of Object.entries(presets.viewport)) {
        if (numbers.some((num) => affectedDoorPanels.some((p) => p.row.toLowerCase() === row.toLowerCase() && p.number === String(num)))) {
          viewportConflicts = true;
          break;
        }
      }
    }

    if (viewportConflicts) {
      $('.option.option_1-1').addClass('disabled');
    } else {
      $('.option.option_1-1').removeClass('disabled');
    }
  } else {
    // Extra door is NOT installed -> Strip and ViewPort are not blocked by extra door
    $('.option.option_1-0').removeClass('disabled');
    $('.option.option_1-1').removeClass('disabled');
  }
}

export function isExtraDoorGlowMode() {
  if (typeof window !== 'undefined' && typeof window.IS_EXTRA_DOOR_GLOW_MODE === 'boolean') {
    return window.IS_EXTRA_DOOR_GLOW_MODE;
  }
  return IS_EXTRA_DOOR_GLOW_MODE;
}

export function enableExtraDoorPanelGlow() {
  disableExtraDoorPanelGlow();

  if (!isExtraDoorOn || selectedExtraDoorPosition || isCameraInside || !modelHouse) {
    return;
  }

  const allowedPositions = EXTRA_DOOR_AVAILABLE_SECTORS[currentHouse] || [];

  allowedPositions.forEach((x) => {
    if (!canInstallExtraDoorAt(x)) {
      return;
    }

    const { panelMeshName } = findMeshByLetterAndNumber(modelHouse, 'c', x);
    if (!panelMeshName) return;

    const group = GetGroup(panelMeshName) || GetMesh(panelMeshName);
    if (!group) return;

    // Collect outer wall meshes for this panel
    const meshesToGlow = [];
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        const isWallOuter = mats.some((m) => (m.name || '').toLowerCase().includes('wall-outer'));
        if (isWallOuter) {
          meshesToGlow.push(child);
        }
      }
    });

    // Fallback: if no mesh named wall-outer found, include any non-interior mesh
    if (meshesToGlow.length === 0) {
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          const isInterior = mats.some((m) => {
            const name = (m.name || '').toLowerCase();
            return name.includes('wall-in') || name.includes('floor') || name.includes('glass');
          });
          if (!isInterior) {
            meshesToGlow.push(child);
          }
        }
      });
    }

    meshesToGlow.forEach((mesh) => {
      if (Array.isArray(mesh.material)) {
        const origMats = mesh.material;
        const glowMats = origMats.map((m) => {
          const gm = m.clone();
          if (gm.emissive) {
            gm.emissive.setHex(EXTRA_DOOR_GLOW_COLOR);
            gm.emissiveIntensity = 0.45;
          }
          return gm;
        });
        mesh.material = glowMats;
        glowingPanels.push({
          x,
          mesh,
          originalMaterial: origMats,
          glowMaterial: glowMats,
        });
      } else {
        const origMat = mesh.material;
        const glowMat = origMat.clone();
        if (glowMat.emissive) {
          glowMat.emissive.setHex(EXTRA_DOOR_GLOW_COLOR);
          glowMat.emissiveIntensity = 0.45;
        }
        mesh.material = glowMat;
        glowingPanels.push({
          x,
          mesh,
          originalMaterial: origMat,
          glowMaterial: glowMat,
        });
      }
    });
  });

  requestRender();
}

export function disableExtraDoorPanelGlow() {
  if (!glowingPanels || glowingPanels.length === 0) return;

  glowingPanels.forEach(({ mesh, originalMaterial, glowMaterial }) => {
    mesh.material = originalMaterial;
    const mats = Array.isArray(glowMaterial) ? glowMaterial : [glowMaterial];
    mats.forEach((gm) => {
      if (gm && typeof gm.dispose === 'function') {
        gm.dispose();
      }
    });
  });

  glowingPanels = [];
  hoveredGlowingSector = null;
  if (canvas) {
    canvas.style.cursor = 'default';
  }
  requestRender();
}

export function updateExtraDoorPanelGlow() {
  if (!glowingPanels || glowingPanels.length === 0) return;

  const time = performance.now() * 0.003;
  // Smooth breathing / pulsing sine wave between 0.25 and 0.75
  const baseIntensity = 0.5 + 0.25 * Math.sin(time);

  glowingPanels.forEach(({ x, glowMaterial }) => {
    const mats = Array.isArray(glowMaterial) ? glowMaterial : [glowMaterial];
    const intensity = (hoveredGlowingSector === x) ? 1.1 : baseIntensity;
    mats.forEach((gm) => {
      if (gm && gm.emissive) {
        gm.emissiveIntensity = intensity;
      }
    });
  });

  // Keep continuous render active while panels are glowing
  requestRender();
}

function showExtraDoorHotspots() {
  removeExtraDoorHotspots();

  const isUpgradesMenuOpen = !$('#group-4').hasClass('invisible') && $('.ar_filter').hasClass('active');
  if (!isExtraDoorOn || selectedExtraDoorPosition || isCameraInside || !modelHouse || !isUpgradesMenuOpen) {
    return;
  }

  // Panel Glow mode:
  if (isExtraDoorGlowMode()) {
    enableExtraDoorPanelGlow();
    return;
  }

  // Hotspot icons mode:
  const allowedPositions = EXTRA_DOOR_AVAILABLE_SECTORS[currentHouse] || [];

  allowedPositions.forEach((x) => {
    if (!canInstallExtraDoorAt(x)) {
      return;
    }

    const { panelMeshName } = findMeshByLetterAndNumber(modelHouse, 'c', x);
    let position = null;

    if (panelMeshName) {
      const obj = GetGroup(panelMeshName) || GetMesh(panelMeshName);
      if (obj) {
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const radial = new THREE.Vector3(center.x, 0, center.z).normalize();
        position = center.clone().add(radial.multiplyScalar(0.2));
      }
    }

    if (!position) {
      return;
    }

    const $hotspot = $('<div>', {
      class: 'extra-door-hotspot',
      'data-position': x,
      // title: `Extra door C-${x}`,
    });

    $hotspot.on('click', function (e) {
      e.stopPropagation();
      installExtraDoor(x, true);
    });

    $canvasContainer.append($hotspot);

    extraDoorHotspots.push({
      position,
      element: $hotspot,
      x,
    });
  });

  requestRender();
}

function removeExtraDoorHotspots() {
  $('.extra-door-hotspot').remove();
  extraDoorHotspots = [];
  disableExtraDoorPanelGlow();
}

export function updateExtraDoorHotspots(camera, scene, controls) {
  if (!extraDoorHotspots || extraDoorHotspots.length === 0) return;

  if (isCameraInside) {
    $('.extra-door-hotspot').css({ display: 'none' });
    return;
  }

  const containerWidth = $canvasContainer.width();
  const containerHeight = $canvasContainer.height();

  extraDoorHotspots.forEach((hotspot) => {
    const screenPosition = hotspot.position.clone();
    screenPosition.project(camera);

    const x = (screenPosition.x * 0.5 + 0.5) * containerWidth;
    const y = (screenPosition.y * -0.5 + 0.5) * containerHeight;

    hotspot.element.css({
      left: `${x}px`,
      top: `${y}px`,
    });

    const normal = new THREE.Vector3(hotspot.position.x, 0, hotspot.position.z).normalize();
    const dirToCamera = camera.position.clone().sub(hotspot.position).normalize();
    const dot = normal.dot(dirToCamera);

    const isFacingCamera = dot >= -0.05;
    const isInFrontOfCamera = screenPosition.z <= 1 && screenPosition.z >= -1;

    if (isFacingCamera && isInFrontOfCamera) {
      hotspot.element.css({ opacity: 1, pointerEvents: 'auto', display: 'block' });
    } else {
      hotspot.element.css({ opacity: 0, pointerEvents: 'none', display: 'none' });
    }
  });
}

// ? Just for testing
// if (typeof window !== 'undefined') {
//   window.isExtraDoorGlowMode = isExtraDoorGlowMode;
//   window.showExtraDoorHotspots = showExtraDoorHotspots;
//   window.enableExtraDoorPanelGlow = enableExtraDoorPanelGlow;
//   window.disableExtraDoorPanelGlow = disableExtraDoorPanelGlow;
//   window.updateExtraDoorMeshesVisibility = updateExtraDoorMeshesVisibility;
//   window.setMainDoorMeshVisibility = setMainDoorMeshVisibility;
//   window.setExtraDoorMeshVisibility = setExtraDoorMeshVisibility;
//   window.hideAllExtraDoorMeshes = hideAllExtraDoorMeshes;
// }


function installExtraDoor(x, writeUrl = true) {
  removeExtraDoorHotspots();
  selectedExtraDoorPosition = parseInt(x);

  const extraDoorParam = getSharedParameter('extraDoor');
  if (extraDoorParam) {
    extraDoorParam.value = selectedExtraDoorPosition;
  }

  const upgradesParam = getSharedParameter('upgrades');
  if (upgradesParam?.value) {
    upgradesParam.value[2] = 1;
  }
  isExtraDoorOn = true;

  $('.option_4-3').addClass('active');

  updateExtraDoorMeshesVisibility(selectedExtraDoorPosition, true);

  // Update furniture for Studio if work layout is active
  if (currentHouse == '2' && $('#button_work').hasClass('active')) {
    setVisibility(modelFurniture, true, ['work-back-door']);
    setVisibility(modelFurniture, false, ['work']);
  }

  if (writeUrl) {
    WriteURLParameters();
  }

  calculatePrice();
  collectSummary();
  updateDoorAndWindowsMutualBlocking();
  requestRender();
}

function uninstallExtraDoor(writeUrl = true) {
  removeExtraDoorHotspots();

  const prevPos = selectedExtraDoorPosition;
  selectedExtraDoorPosition = null;

  const extraDoorParam = getSharedParameter('extraDoor');
  if (extraDoorParam) {
    extraDoorParam.value = 0;
  }

  const upgradesParam = getSharedParameter('upgrades');
  if (upgradesParam?.value) {
    upgradesParam.value[2] = '0';
  }

  isExtraDoorOn = false;
  $('.option_4-3').removeClass('active');
  if (typeof mainGroups !== 'undefined') {
    mainGroups.forEach(g => {
      if (g.id === 'group-4' && g.group?.options) {
        const opt = g.group.options.find(o => o.component_id === '3');
        if (opt) {
          opt.active = false;
          opt.element?.classList.remove('active');
        }
      }
    });
  }

  updateExtraDoorMeshesVisibility(prevPos, false);

  // Revert furniture for Studio if work layout is active
  if (currentHouse == '2' && $('#button_work').hasClass('active')) {
    setVisibility(modelFurniture, false, ['work-back-door']);
    setVisibility(modelFurniture, true, ['work']);
  }

  if (writeUrl) {
    WriteURLParameters();
  }

  calculatePrice();
  collectSummary();
  updateDoorAndWindowsMutualBlocking();
  requestRender();
}

export function cancelUnplacedExtraDoor() {
  if (isExtraDoorOn && !selectedExtraDoorPosition) {
    uninstallExtraDoor(true);
  }
}

let lastInstalledExtraDoorPosition = null;

export function updateExtraDoorMeshesVisibility(x = selectedExtraDoorPosition, isVisible = isExtraDoorOn && !!selectedExtraDoorPosition) {
  if (!modelHouse) return;

  if (isVisible && x) {
    // 1. Hide base house mesh with main door
    setMainDoorMeshVisibility(false);

    // If changing from another position, restore previously affected panels first
    if (lastInstalledExtraDoorPosition && lastInstalledExtraDoorPosition !== x) {
      const prevAffected = getExtraDoorAffectedPanels(lastInstalledExtraDoorPosition);
      prevAffected.forEach(({ row, number }) => {
        if (!isPanelHasWindow(row, number)) {
          const { panelMeshName } = findMeshByLetterAndNumber(modelHouse, row, number);
          if (panelMeshName) {
            setVisibility(modelHouse, true, [panelMeshName]);
          }
        }
      });
    }
    lastInstalledExtraDoorPosition = x;

    // 2. Hide panels C-x, D-(x-1), D-(x+1), E-x and any windows on them
    const affected = getExtraDoorAffectedPanels(x);
    affected.forEach(({ row, number }) => {
      const { panelMeshName, windowMeshName } = findMeshByLetterAndNumber(modelHouse, row, number);
      if (panelMeshName) {
        setVisibility(modelHouse, false, [panelMeshName]);
      }
      if (windowMeshName) {
        setVisibility(modelHouse, false, [windowMeshName]);
      }
    });

    // 3. Show extra door mesh (with 'entry' in name for position x) and hide other entry meshes
    setExtraDoorMeshVisibility(x, true);

    // 4. Update inside partitions for House 3 / House 4
    updateInsidePartitionVisibility(x);
  } else {
    lastInstalledExtraDoorPosition = null;

    // 1. Show base house mesh with main door
    setMainDoorMeshVisibility(true);

    // 2. If position existed, restore panels C-x, D-(x-1), D-(x+1), E-x (unless they have custom windows)
    if (x) {
      const affected = getExtraDoorAffectedPanels(x);
      affected.forEach(({ row, number }) => {
        if (!isPanelHasWindow(row, number)) {
          const { panelMeshName } = findMeshByLetterAndNumber(modelHouse, row, number);
          if (panelMeshName) {
            setVisibility(modelHouse, true, [panelMeshName]);
          }
        }
      });
    }

    // 3. Hide all meshes with 'entry' in their name
    hideAllExtraDoorMeshes();

    // 4. Update inside partitions for House 3 / House 4
    updateInsidePartitionVisibility(null);
  }

  requestRender();
}

export function setMainDoorMeshVisibility(visible) {
  if (!modelHouse) return;
  modelHouse.traverse((o) => {
    const name = (o.name || '').toLowerCase();
    const parentName = (o.parent && o.parent.name ? o.parent.name : '').toLowerCase();
    const isMainDoor = name.includes('maindoor') || name.includes('main_door') || name.includes('main-door') ||
                       parentName.includes('maindoor') || parentName.includes('main_door') || parentName.includes('main-door');
    if (isMainDoor) {
      o.visible = visible;
    }
  });
}

// Backwards-compatible alias for setMainDoorMeshVisibility
export function setEntryMeshVisibility(visible) {
  setMainDoorMeshVisibility(visible);
}

export function setExtraDoorMeshVisibility(x, visible) {
  if (!modelHouse) return;
  const numStr = String(x);
  const numStrPadded = numStr.padStart(2, '0');
  const numRegex = new RegExp(`(^|\\D)(${numStr}|${numStrPadded})(\\D|$)`);
  let found = false;

  modelHouse.traverse((o) => {
    const name = (o.name || '').toLowerCase();
    const parentName = (o.parent && o.parent.name ? o.parent.name : '').toLowerCase();
    const isEntry = name.includes('entry') || parentName.includes('entry');

    if (isEntry) {
      const matchesPos = numRegex.test(name) || numRegex.test(parentName);
      if (matchesPos && visible) {
        o.visible = true;
        found = true;
      } else {
        o.visible = false;
      }
    }
  });

  if (!found && visible) {
    console.warn(`Mesh for extra door at C-${x} (containing 'entry' and '${x}') not found in model ${DATA_HOUSE_NAME[currentHouse]}. It will be shown once the 3D model is updated.`);
  }
}

export function hideAllExtraDoorMeshes() {
  if (!modelHouse) return;
  modelHouse.traverse((o) => {
    const name = (o.name || '').toLowerCase();
    const parentName = (o.parent && o.parent.name ? o.parent.name : '').toLowerCase();

    // 1. All meshes with 'entry' in name must be invisible
    if (name.includes('entry') || parentName.includes('entry')) {
      o.visible = false;
    }

    // 2. Also ensure legacy test door meshes (like door-c5) are hidden, but NEVER hide maindoor
    const isMainDoor = name.includes('maindoor') || name.includes('main_door') || name.includes('main-door') ||
                       parentName.includes('maindoor') || parentName.includes('main_door') || parentName.includes('main-door');
    if (!isMainDoor) {
      const hasDoor = name.includes('door') || parentName.includes('door');
      const hasC = name.includes('c-') || name.includes('c_') || /c\d+/i.test(name) ||
                   parentName.includes('c-') || parentName.includes('c_') || /c\d+/i.test(parentName);
      if (hasDoor && hasC && !name.includes('center') && !parentName.includes('center')) {
        o.visible = false;
      }
    }
  });

  updateInsidePartitionVisibility(null);
}

export function updateInsidePartitionVisibility(activeDoorPos = (isExtraDoorOn ? selectedExtraDoorPosition : null)) {
  if (!modelHouse) return;

  const isHouse3 = (currentHouse === '3');
  const isHouse4 = (currentHouse === '4');

  if (!isHouse3 && !isHouse4) return;

  const posNum = (activeDoorPos !== null && activeDoorPos !== undefined) ? parseInt(activeDoorPos, 10) : null;
  const isDoorAtC8 = (posNum === 8);
  const isDoorAtC5 = (posNum === 5);

  modelHouse.traverse((o) => {
    const name = o.name || '';
    if (!name) return;

    const lower = name.toLowerCase();
    const isInsideBase = (lower === 'inside');
    // Support both Cyrillic 'С' (\u0421/\u0441) and Latin 'C'/'c'
    const isInsideC8 = /^inside_[cс]-?8$/i.test(name) || name === 'inside_С-8' || name === 'inside_C-8';
    const isInsideC5 = /^inside_[cс]-?5$/i.test(name) || name === 'inside_С-5' || name === 'inside_C-5';

    if (isHouse3) {
      if (isInsideBase) {
        o.visible = !isDoorAtC8;
      } else if (isInsideC8) {
        o.visible = isDoorAtC8;
      } else if (isInsideC5) {
        o.visible = false;
      }
    } else if (isHouse4) {
      if (isInsideBase) {
        o.visible = !isDoorAtC5;
      } else if (isInsideC5) {
        o.visible = isDoorAtC5;
      } else if (isInsideC8) {
        o.visible = false;
      }
    }
  });

  requestRender();
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

  let fontSize = 32;

  switch (currentHouse) {
    case '0':
      fontSize = 32;
      break;
    case '1':
      fontSize = 32;
      break;
    case '2':
      fontSize = 32;
      break;
    case '3':
      fontSize = 38;
      break;
    default:
      fontSize = 38;
      break;
  }

  context.font = `${fontSize}px Arial`;
  context.fillStyle = 'black';
  context.fillText(text, 50, 50);
  return canvas;
}

function createDimensions(diameter, height) {
  const heightFoundation = (isFoundationKitOn) ? FOUNDATION_HEIGHT : 0;
  const heightFoundationForText = (isFoundationKitOn) ? 0.5 : 0;

  const startDiameter = new THREE.Vector3(-diameter / 2, height + MODEL_CENTER_POSITION - heightFoundation + lineOffset, 0);
  const endDiameter = new THREE.Vector3(diameter / 2, height + MODEL_CENTER_POSITION - heightFoundation + lineOffset, 0);
  createHorizontalDimensionLine(startDiameter, endDiameter, `D = ${DATA_HOUSE_DIMENSIONS[DATA_HOUSE_NAME[currentHouse]].diameter.toFixed(1)} ft`, scene);

  const startHeight = new THREE.Vector3(-diameter / 2 - lineOffset, 0 + MODEL_CENTER_POSITION - heightFoundation, 0);
  const endHeight = new THREE.Vector3(-diameter / 2 - lineOffset, height + MODEL_CENTER_POSITION - heightFoundation, 0);
  createVerticalDimensionLine(startHeight, endHeight, `H = ${(DATA_HOUSE_DIMENSIONS[DATA_HOUSE_NAME[currentHouse]].height + heightFoundationForText).toFixed(1)} ft`, scene);

  setMaterialColor('man', manColor);
  setMaterialColor('man.001', manColor);
  setMeshPosition(modelHouse, 'man', -diameter / 2 - lineOffset - manOffset, - heightFoundation, 0);
}

function getHouseDimensions() {
  let diameter = 0;
  let height = 0;

  let deltaDiameter = 1.5;

  switch (currentHouse) {
    case '0':
      deltaDiameter = 1.5;
      break;
    case '1':
      deltaDiameter = 1.5;
      break;
    case '2':
      deltaDiameter = 1.5;
      break;
    case '3':
      deltaDiameter = 1.0;
      break;
    case '4':
      deltaDiameter = 1.0;
      break;
    default:
      deltaDiameter = 1.0;
      break;
  }

  if (modelHouse) {
    height = getMeshDimensions(modelHouse).height;
    diameter = getMeshDimensions(modelHouse).depth - deltaDiameter;
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
    case '3': // 500
      cameraFar = 13.7;
      topViewCorrection = 0.75;
      break;
    case '4': // 700
      cameraFar = 15.2;
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
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_zome-120"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_zome-170"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_zome-300"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_zome-500"></div>' +
    '<div class="summary__scheme_dimensions summary__scheme_dimensions_zome-700"></div>' +
    '<div class="summary__scheme summary__scheme_zome-120"></div>' +
    '<div class="summary__scheme summary__scheme_zome-170"></div>' +
    '<div class="summary__scheme summary__scheme_zome-300"></div>' +
    '<div class="summary__scheme summary__scheme_zome-500"></div>' +
    '<div class="summary__scheme summary__scheme_zome-700"></div>'
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


