/* eslint-disable no-case-declarations */
/* global THREE, jQuery, $, dat */

// Created by Marevo (Pavlo Voronin)
// Welcome to our custom script!

// REMEMBER:
// Theft is wrong not because some ancient text says, 'Thou shalt not steal.' 
// It's always bad, robber :)

'use strict';

//#region PUBLIC VALUES
import {
  DEFAULT_LANGUAGE,
  DATAFILE_CSV_LINK_UI,
  DATAFILE_CSV_LINK_RECHTHOEK,
  DATAFILE_CSV_LINK_SEMI_RECHTHOEK,
  DATAFILE_CSV_LINK_RECHTHOEK_GROTE_RADIUS,
  DATAFILE_CSV_LINK_OVAAL,
  DATAFILE_CSV_LINK_SEMI_OVAAL,
  DATAFILE_CSV_LINK_PLAT_OVAAL,
  DATAFILE_CSV_LINK_ROND,
  DATAFILE_CSV_LINK_ORGANISCH,
  DATA_CHECKING_PRICE,
  MORPH_DATA,
  MORPH_DATA_LEGS_LENGTH,
  CONDITIONS,
  MODEL_PATHS,
  MODEL_CENTER_POSITION,
  SHADOW_TRANSPARENCY,
  BACKGROUND_COLOR,
  ENVIRONMENT_MAP,
  ENVIRONMENT_MAP_INTENSITY,
  TEXTURES,
} from './settings.js';

import {
  create3DScene,
  IMPORTED_MODELS,
  scene,
  getMobileOperatingSystem,
  animateScale,
  disposeModel,
  loadModel,
} from './3d-scene.js';

import {
  createMenu,
  setLoadParseCSV,
  getData,
  gui_mode,
} from './ui-controller.js';

const DEBUG_MODE_FUNC_STARTS = false;
const DEBUG_MODE_VALUES = false;


const mainDataPrice = {
  'rechthoek': [],
  'semiRechthoek': [],
  'rechthoekGroteRadius': [],
  'ovaal': [],
  'semiOvaal': [],
  'platOvaal': [],
  'rond': [],
  'organisch': [],
};

let mainData = [];
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
let isFirstStart = true;

let tblInfo;
let tblInfoItemQr;
let tblInfoItemSharing;
let tblInfoItemLoupe;

let modelViewer;
let qrcode;
let qrScaned = 0;

let theModel;

let justClicked = false;

// CUSTOM SELECT
jQuery(document).ready(function() {
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
  {
    id: 'color', // [0]
    groupIds: ['group-0'],
    splitValue: 'M',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'afwerking', // [1]
    groupIds: ['group-1'],
    splitValue: 'a',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'dikte', // [2]
    groupIds: ['group-2'],
    splitValue: 'r',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'shape', // [3]
    groupIds: ['group-3'],
    splitValue: 'e',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'length', // [4]
    groupIds: ['group-5', 'group-6', 'group-7', 'group-8',
      'group-9', 'group-10', 'group-11', 'group-12'],
    splitValue: 'v',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'width', // [5]
    groupIds: ['group-13'],
    splitValue: 'o',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'diameter', // [6]
    groupIds: ['group-14'],
    splitValue: 'V',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'edge', // [7]
    groupIds: ['group-15', 'group-16', 'group-17', 'group-18',
      'group-19', 'group-20', 'group-21', 'group-22'],
    splitValue: 'i',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'legs', // [8]
    groupIds: ['group-23', 'group-24', 'group-27', 'group-28'],
    splitValue: 's',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'color_wood', // [9]
    groupIds: ['group-25'],
    splitValue: 'I',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'color_metal', // [10]
    groupIds: ['group-26'],
    splitValue: 'O',
    type: 'string',
    value: '0',
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  },
  {
    id: 'qr', // [11]
    groupIds: null,
    splitValue: 'n',
    type: 'int',
    value: 0,
    groupOptionAction: null,
    applyURLAction: null,
    applyURLActionReturn: false
  }
];

// color
SharedParameterList[0].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);

  if (isFirstStart) {
    changeTexture(this.value, 'top');
  }

  if (justClicked) {
    changeTexture(this.value, 'top');
    SharedParameterList[9].value = this.value;
    changeTexture(this.value, 'legs');
  }
}

// afwerking
SharedParameterList[1].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    const woodType = (SharedParameterList[0].value == '8') ? 'noten' : 'oak';
    const afwerkingType = (this.value == '1') ? 'gloss' : 'mat';
    setObjectTexture(TEXTURES.top.materialNames, TEXTURES[woodType][afwerkingType]);
    setObjectTexture(TEXTURES.end.materialNames, TEXTURES[woodType][afwerkingType]);
    setObjectTexture(TEXTURES.top.materialNamesLeg, TEXTURES[woodType][afwerkingType]);
  }
}

// dikte
SharedParameterList[2].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    changeThickness(this.value);
  }
}

// shape
SharedParameterList[3].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    if(this.value !== '6') {// shape != rond
      changeLength(SharedParameterList[4].value);
    }

    if (this.value == '6') { // shape = rond
      changeDiameter(SharedParameterList[6].value);
    }
  }
}

// length
SharedParameterList[4].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    if(SharedParameterList[3].value !== '6') { // shape = rond
      changeLength(this.value);
    }
  }
}

// width
SharedParameterList[5].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    if(SharedParameterList[3].value !== '6') { // shape != rond
      changeWidth(this.value);
    }
  }
}

// diameter
SharedParameterList[6].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    if(SharedParameterList[3].value == '6') { // shape = rond
      changeDiameter(this.value);
    }
  }
}

// edge
SharedParameterList[7].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  // if (isFirstStart || justClicked) {}
}

// legs
SharedParameterList[8].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    setColorOfActiveOption(['group-26'], ['paint']);
    changeLength(SharedParameterList[4].value, false);
  }
}

// color_wood
SharedParameterList[9].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    changeTexture(this.value, 'legs');
  }
}

// color_metal
SharedParameterList[10].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
  if (isFirstStart || justClicked) {
    setColorOfActiveOption(['group-26'], ['paint']);
  }
}

// qr
SharedParameterList[11].groupOptionAction = function () {
  (DEBUG_MODE_VALUES) && console.log('🚀 ~ groupOptionAction: ', this.id, this.value);
}

// eslint-disable-next-line no-unused-vars
function consoleLogSharedParameterListValues(txt = '') {
  SharedParameterList.forEach(item => {
    console.log(`🚀🚀 ~ SharedParameterList ${txt}: `, item.id, item.value);
  });
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

//! #region START APP

prepareDataFiles();

function prepareDataFiles() {
  setLoadParseCSV(DATAFILE_CSV_LINK_RECHTHOEK, 'text', mainDataPrice.rechthoek);
  setLoadParseCSV(DATAFILE_CSV_LINK_SEMI_RECHTHOEK, 'text', mainDataPrice.semiRechthoek);
  setLoadParseCSV(DATAFILE_CSV_LINK_RECHTHOEK_GROTE_RADIUS, 'text', mainDataPrice.rechthoekGroteRadius);
  setLoadParseCSV(DATAFILE_CSV_LINK_OVAAL, 'text', mainDataPrice.ovaal);
  setLoadParseCSV(DATAFILE_CSV_LINK_SEMI_OVAAL, 'text', mainDataPrice.semiOvaal);
  setLoadParseCSV(DATAFILE_CSV_LINK_PLAT_OVAAL, 'text', mainDataPrice.platOvaal);
  setLoadParseCSV(DATAFILE_CSV_LINK_ROND, 'text', mainDataPrice.rond);
  setLoadParseCSV(DATAFILE_CSV_LINK_ORGANISCH, 'text', mainDataPrice.organisch);

  setLoadParseCSV(DATAFILE_CSV_LINK_UI, 'text', mainData, Start);
}

//#endregion

//#region INITIALIZATION

function InitializationGroups(callback) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ InitializationGroups ~ ');

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

  (DEBUG_MODE_VALUES) && console.log('🚀 mainGroups 🚀:', mainGroups);
  if (callback != null) callback();
}

async function Start() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ Start ~ ');

  await createMenu(mainData);
  PrepareUI();
  create3DScene(sceneProperties, () => InitializationGroups(startCallback));

  function startCallback() {
    (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ startCallback ~ ');

    if (loaded) return;
    loaded = true;

    ReadURLParameters(StartSettings);
  }
}

async function StartSettings() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ StartSettings ~ ');
  
  // theModel = IMPORTED_MODELS[0];

  //! TODO -----
  const targetHouse = 0;
  await loadModel(MODEL_PATHS[targetHouse], targetHouse);
  theModel = IMPORTED_MODELS[0];
  theModel && scene.add(theModel);
  //!------
    
  InitMorphModel(theModel);
  $('#js-loader').addClass('invisible');
  $('.summary.entry-summary').removeClass('hidden');
  
  preloadTextures();
  
  PrepareAR();
  SetActionForGroups();
  ApplyURLParameters();

  CheckChanges();

  theModel?.scale.set(0, 0, 0);
  setVisibility(theModel, true);
  animateScale(theModel);

  isFirstStart = false;

  (gui_mode) && guiModeController();
}
  

function setDefaultValuesForGroups() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ setDefaultValuesForGroups ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ SetActionForGroups ~ ');

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

          $(opt.element).find('.image-loupe').on('click', function (event) {
            event.stopPropagation();

            let loupeImage;
            const loupeTitle = getData(mainData, $(this).attr('data-option'), DEFAULT_LANGUAGE);
            let loupeDescription = getData(mainData, $(this).attr('data-option'), `DESC_${DEFAULT_LANGUAGE}`);
            
            if (loupeDescription[0] === '"') {
              loupeDescription = loupeDescription.slice(1, -1);
            }
            
            if (getData(mainData, $(this).attr('data-option'), 'UI_IMG')?.substring(0, 1) !== '#') {
              loupeImage = `./src/images/${getData(mainData, $(this).attr('data-option'), 'UI_IMG')}`;
            } else {
              loupeImage = `${getData(mainData, $(this).attr('data-option'), 'UI_IMG')}`;
            }

            loupePopup(loupeTitle, loupeDescription, loupeImage);
          });

          $(opt.element).find('.image-info').on('click', function (event) {
            event.stopPropagation();

            let loupeImage;
            const loupeTitle = getData(mainData, $(this).attr('data-option'), DEFAULT_LANGUAGE);
            let loupeDescription = getData(mainData, $(this).attr('data-option'), `DESC_${DEFAULT_LANGUAGE}`);
            
            if (loupeDescription[0] === '"') {
              loupeDescription = loupeDescription.slice(1, -1);
            }

            loupeImage = '';
            loupePopup(loupeTitle, loupeDescription, loupeImage);
          });
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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ ParseAllGroups ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ SetGroupActionForSharedParametersCheckboxArray ~ ');

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

function applyAllConditions() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ applyAllConditions ~ ');

  mainGroups.forEach(target => {
    if (!target.group.element.classList.contains('disabled')) {
      for (let i = 0; i < target.group.options.length; i++) {
        const opt = target.group.options[i];
        const optionName = `option_${opt.group_id}-${opt.component_id}`;
        const condObj = CONDITIONS[optionName];
        
        // option is active
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
                } else if (condObj[targetName] == 'off') { // make option inactive
                  option.element.classList.remove('active');
                  option.element.classList.add('disabled');
                } else if (condObj[targetName] == 'inv') { // make option inactive and invisible
                  option.element.classList.remove('active');
                  option.element.classList.add('disabled');
                  option.element.classList.add('invisible');
                }
              }
            }

            else if (targetName.includes('mesh')) {
              for (let meshName in condObj[targetName]) {

                let object = GetMesh(meshName);

                if (!object) object = GetGroup(meshName);
                if (!object) continue;

                if (condObj[targetName][meshName] == 'on') {
                  object.visible = true;
                } else if (condObj[targetName][meshName] == 'off') {
                  object.visible = false;
                }
              }
            }
          }
        }

        // CHECKBOX and option is NOT active
        if (target.type === 'checkbox' && !opt.element.classList.contains('active')) {
          for (let targetName in condObj) {

            if (targetName.includes('group') && condObj[targetName]) {
              const parentGroup = mainGroups.find(element => element.id == targetName);

              if (condObj[targetName] == 'on') {
                parentGroup.group.element.classList.add('disabled');
                summaryItemVisibility(targetName, false);
              }
            }

            if (targetName.includes('option') && condObj[targetName]) {
              const groupId = 'group-' + targetName.split(/[_-]/)[1];
              const parentGroup = mainGroups.find(element => element.id == groupId);

              if (!parentGroup) { continue; }
              const compId = targetName.split('-')[1];
              const group = parentGroup.group;

              if (!group.element.classList.contains('disabled')) {
                const option = group.options.find(element => element.component_id == compId);

                if (condObj[targetName] == 'on') {
                  option.element.classList.add('disabled');

                  if (option.element.classList.contains('active')) {
                    option.element.classList.remove('active');
                  }
                }
              }
            }

            if (targetName.includes('mesh')) {
              for (let meshName in condObj[targetName]) {
                let object = GetMesh(meshName);

                if (!object) object = GetGroup(meshName);
                if (!object) continue;

                if (condObj[targetName][meshName] === 'on') {
                  object.visible = false;
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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ applyActiveGroupOptionAction ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ setActiveSelectOption ~ groupId, optionId: ', groupId, optionId);

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
  (DEBUG_MODE_FUNC_STARTS) && console.log("🚀 ~ UpdateActiveOption ~ ");

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
    console.log("🚀🚀🚀🚀🚀 ~ clickActiveOption:", group);

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

function assignOptionsInRelatedGroups(groupIDs) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ assignOptionsInRelatedGroups ~ ');

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
function CheckChanges(callback = () => {}) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ CheckChanges ~ ');

  applyAllConditions();
  additionalConditions();
  assignOptionsInRelatedGroups(SharedParameterList[4].groupIds);
  assignOptionsInRelatedGroups(SharedParameterList[7].groupIds);
  assignOptionsInRelatedGroups(SharedParameterList[8].groupIds);
  applyActiveGroupOptionAction();
  applyAllConditions();
  applyActiveGroupOptionAction();
  setOptionsResult();
  calculatePrice();
  getOrderList();

  callback();
}
//! ************************************************
//#endregion

//#region CUSTOM FUNCTIONS

function preloadTextures() {
  for (let i = 0; i < 9; i++) {
    loadTexture(TEXTURES.top[i]);
    loadTexture(TEXTURES.end[i]);
  }
  loadTexture(TEXTURES.oak.mat);
  loadTexture(TEXTURES.oak.gloss);
  loadTexture(TEXTURES.noten.mat);
  loadTexture(TEXTURES.noten.gloss);
}


function changeTexture(value, type) {
  (DEBUG_MODE_VALUES) && console.log("🚀 ~ changeTexture ~ :", value, type);

  if (type === 'top') {
    setObjectTexture(TEXTURES.top.materialNames, TEXTURES.top[value]);
    setObjectTexture(TEXTURES.end.materialNames, TEXTURES.end[value]);
  }

  if (type === 'legs') {
    setObjectTexture(TEXTURES.top.materialNamesLeg, TEXTURES.top[value]);
  }
}

function changeThickness(value) {
  const targetValue = (value == '1') ? 2 : 0;
  ChangeGlobalMorph('20-30mm', targetValue);
}

let oldLengthTop = 0;
let oldLengthLegs = 0;
function changeLength(value, needsAnimate = true) {
  if(SharedParameterList[3].value == '6') { // shape = rond
    changeDiameter(SharedParameterList[6].value);
    return;
  }

  const targetValueTop = ConvertMorphValue(MORPH_DATA.length[value], MORPH_DATA.length.min, MORPH_DATA.length.max);
  const legType = SharedParameterList[8].value;
  const formType = SharedParameterList[3].value;
  const dimensionType = (SharedParameterList[3].value == '6') ? SharedParameterList[6].value : SharedParameterList[4].value;
  let targetValueLegs = MORPH_DATA_LEGS_LENGTH[legType][formType][dimensionType];
  
  if (!targetValueLegs) { targetValueLegs = 0; }

  if (isFirstStart || !needsAnimate) {
    ChangeGlobalMorph('length', targetValueTop);
    ChangeGlobalMorph('length-legs', targetValueLegs);
  } else {
    animateMorph('length', oldLengthTop, targetValueTop);
    animateMorph('length-legs', oldLengthLegs, targetValueLegs);
  }

  let widthLegsValue = 1;

  if (SharedParameterList[3].value == '3' || // form = ( Ovaal || Semi-ovaal || Organisch )
  SharedParameterList[3].value == '4' ||
  SharedParameterList[3].value == '7') {
    widthLegsValue = 0;
  }

  ChangeGlobalMorph('width-legs', widthLegsValue);

  if (MORPH_DATA.length[value] >= 280 || SharedParameterList[2].value == '1') { // changing thickness
    // SharedParameterList[2].value = '1';
    changeThickness('1'); // = 4cm
  } else if (SharedParameterList[2].value == '0') {
    changeThickness('0'); // = 2cm
  }

  oldLengthTop = targetValueTop;
  oldLengthLegs = targetValueLegs;
}

let oldWidth = 0;
function changeWidth(value) {
  const targetValue = ConvertMorphValue(MORPH_DATA.width[value], MORPH_DATA.width.min, MORPH_DATA.width.max);
  (DEBUG_MODE_VALUES) && console.log("🚀 ~ changeWidth ~ value, targetValue:", MORPH_DATA.width[value], targetValue);

  if (isFirstStart) {
    ChangeGlobalMorph('width', targetValue);
  } else {
    animateMorph('width', oldWidth, targetValue);
  }

  oldWidth = targetValue;
}

let oldDiameter = 0;
function changeDiameter(value) {
  if (SharedParameterList[8].value == '2') { // Legs = Steelo
    ChangeGlobalMorph(
      'length-legs', 
      MORPH_DATA_LEGS_LENGTH[SharedParameterList[8].value][SharedParameterList[3].value][SharedParameterList[6].value]
    );
  }

  const targetValue = ConvertMorphValue(MORPH_DATA.diameter[value], MORPH_DATA.diameter.min, MORPH_DATA.diameter.max);
  (DEBUG_MODE_VALUES) && console.log("🚀 ~ changeDiameter ~ value, targetValue:", MORPH_DATA.diameter[value], targetValue);

  if (isFirstStart) {
    ChangeGlobalMorph('diameter', targetValue);
  } else {
    animateMorph('diameter', oldDiameter, targetValue);
  }

  oldDiameter = targetValue;
}

//#endregion

//#region PRICE CALCULATION

let totalAmount;
function calculatePrice() {
  const currency = getData(mainData, 'currency_sign', DEFAULT_LANGUAGE);
  const totalAmountElement = document.getElementById('ar_total_price');
  totalAmount = 0;
  let basePrice = 0;
  let percentage = 0;
  let selectedShape = '';
  
  switch (SharedParameterList[3].value) {
    case '0':
      selectedShape = 'rechthoek';
      break;
    case '1':
      selectedShape = 'semiRechthoek';
      break;
    case '2':
      selectedShape = 'rechthoekGroteRadius';
      break;
    case '3':
      selectedShape = 'ovaal';
      break;
    case '4':
      selectedShape = 'semiOvaal';
      break;
    case '5':
      selectedShape = 'platOvaal';
      break;
    case '6':
      selectedShape = 'rond';
      break;
    case '7':
      selectedShape = 'organisch';
      break;
    default:
      break;
  }

  const currentDataPrice = mainDataPrice[selectedShape];

  if (selectedShape) {
    let searchParameter = '';

    if (selectedShape === 'rond') {
      // searchParameter is current Diameter
      searchParameter = DATA_CHECKING_PRICE['6'].value[SharedParameterList[6].value];
    } else {
      // searchParameter is current Lengte
      searchParameter = DATA_CHECKING_PRICE['4'].value[SharedParameterList[4].value];
    }

    basePrice = convertPriceToNumber(getData(currentDataPrice, 'base price', searchParameter, selectedShape));
    if (!basePrice) { basePrice = 0 }
    
    for (let i = 0; i < SharedParameterList.length - 1; i++) {
      let dataName = '';
      let searchName = '';
      let dataNameMainPart = '';
      let targetIndex = 0;
      let targetHeadIndex = 0;
      let price = 0;
      
      if (DATA_CHECKING_PRICE[i]) {
        for (let j = 0; j < SharedParameterList[i].groupIds.length; j++) {
          if (isGroupActive(SharedParameterList[i].groupIds[j])) {
            dataNameMainPart = DATA_CHECKING_PRICE[i]?.name;
            dataName = dataNameMainPart + ' ' + DATA_CHECKING_PRICE[i]?.value[SharedParameterList[i].value];
            
            if (dataNameMainPart === 'Afwerking') {
              dataNameMainPart = dataNameMainPart + ` [${DATA_CHECKING_PRICE[i]?.value[SharedParameterList[i].value]}]`;
              dataName = dataNameMainPart + ' ' + DATA_CHECKING_PRICE[0]?.value[SharedParameterList[0].value]; // color
            }
            
            if (dataNameMainPart === 'Breedte') {
              dataNameMainPart = dataNameMainPart + ` [${DATA_CHECKING_PRICE[8]?.value[SharedParameterList[8].value]}]`; // legs
              dataName = dataNameMainPart + ' ' + DATA_CHECKING_PRICE[i]?.value[SharedParameterList[i].value];
            }

            break;
          }
        }
      }

      if (dataName) {
        for (let k = 0; k < currentDataPrice.length; k++) {
          searchName = currentDataPrice[k][0] + ' ' + currentDataPrice[k][1];

          if (dataName === searchName) {
            targetIndex = k;
            break;
          }
        }
      }

      if (targetIndex) {
        for (let n = 2; n < currentDataPrice[0].length; n++) {
          if (currentDataPrice[0][n] === searchParameter) {
            targetHeadIndex = n;
            break;
          }
        }

        if (targetHeadIndex) {
          const stringPrice = (currentDataPrice[targetIndex][targetHeadIndex]);

          if (stringPrice.includes('%')) {
            percentage += extractPercentage(stringPrice);
          } else {
              price = convertPriceToNumber(stringPrice);
          }

          totalAmount += price;
        }
      }
    }
  }

  totalAmount += basePrice;
  totalAmount += totalAmount * percentage / 100;
  totalAmount = totalAmount.toFixed(2);

  totalAmountElement.innerText = formatPrice(totalAmount, currency);
}

function convertPriceToNumber(priceString) {
  if (!priceString) return 0;

  const cleanedPrice = priceString.replace(/[^\d.,]/g, '');
  const priceWithDot = cleanedPrice.replace(',', '.');
  const priceNumber = parseFloat(priceWithDot);

  return priceNumber;
}

function extractPercentage(qString) {
  const cleanedString = qString.replace(/[^\d.%]/g, '');
  const match = cleanedString.match(/\d+/);

  if (match) {
      const percentage = parseFloat(match[0]);
      return isNaN(percentage) ? null : percentage;
  }

  return null;
}

function getOrderList() {
  let orderList = "ORDER" + '\n';

  for (let i = 0; i < SharedParameterList.length; i++) {
    if (DATA_CHECKING_PRICE[i]) {
      const dataName = DATA_CHECKING_PRICE[i]?.name + ': ' +
                       DATA_CHECKING_PRICE[i]?.value[SharedParameterList[i].value];

      for (let k = 0; k < SharedParameterList[i].groupIds.length; k++) {
        if (isGroupActive(SharedParameterList[i].groupIds[k])) {
          orderList += dataName + '\n';
          break;
        }
      }

    }
  }
  orderList = orderList + 'Amount: ' + totalAmount;
  return orderList;
}

function formatPrice(price, currency) {
  if (!price) { return ''; }
  if (!currency) { currency = '' }

  let result, firstSeparator, secondSeparator;
  const priceString = price + '';

  switch (currency) {
    case 'грн':
      firstSeparator = ' ';
      secondSeparator = ',';
      break;
    case '$':
      firstSeparator = ',';
      secondSeparator = '.';
      break;
    case '€':
      firstSeparator = '.';
      secondSeparator = ',';
      break;

    default:
      firstSeparator = '.';
      secondSeparator = ',';
      currency = '';
      break;
  }

  const parts = priceString.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, firstSeparator);
  let decimalPart = parts[1] && parts[1].replace('.', secondSeparator);

  if (decimalPart && decimalPart.length === 1) {
    decimalPart += '0';
  }

  if (currency === 'грн') {
    result = (decimalPart)
      ? `${integerPart}${secondSeparator}${decimalPart} ${currency}`
      : `${integerPart}${secondSeparator}00 ${currency}`;
  } else {
    result = (decimalPart)
      ? `${currency}${integerPart}${secondSeparator}${decimalPart}`
      : `${currency}${integerPart}${secondSeparator}00`;
  }

  return result;
}

//! TODO
const store_endpoint_link = '';
// eslint-disable-next-line no-unused-vars
function SendProductInfo(element) {
  const resultString = getOrderList();
  console.log(resultString);

  //! TODO (the code below is not corrected. It was just taken from the TBT code)
  // if(element.classList.contains('tbl-price-btn')){
  //     element.classList.add('load')
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

function GetMesh(name, model = theModel) {
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

function GetGroup(name, model = theModel) {
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
function GetMaterial(name, model = theModel) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ GetMaterial ~ ');

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
function setMaterialProperty(materialName, value, propery = 'metalness') {
  const materialObject = GetMaterialFromScene(materialName);
  if (materialObject == null) {
    console.error(`ERROR: Material ${materialName} is not found !`);
    return;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!materialObject.hasOwnProperty(propery)) {
    console.error(`ERROR: Material ${materialName} has no property ${propery} !`);
    return;
  }

  materialObject[propery] = value;
  console.log(`${propery} for material ${materialName} was set up to ${value}`);
}

// eslint-disable-next-line no-unused-vars
function ChangeMaterialTilling(materialName, x, y) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ ChangeMaterialTilling ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ ChangeMaterialOffset ~ ');

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

function setVisibility(model, value, meshArray = []) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ setVisibility ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ setMaterialColor ~ ');

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

function setObjectTexture(materialNames, textureValue, tilingValue = 1, model = theModel) {
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
function getMeshDimensions(mesh) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ getMeshDimensions ~ ');

  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(mesh);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  const width = size.x;
  const height = size.y;
  const depth = size.z;
  return { width: width, height: height, depth: depth };
}

// eslint-disable-next-line no-unused-vars
function getMaterialsList(parent) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ getMaterialsList ~ ');

  const materials = [];
  parent.traverse((o) => {
    if (o.material) {
      materials.push(o.material.name);
    }
  });
  return materials;
}

// eslint-disable-next-line no-unused-vars
function getMeshNamesList(parent) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ getMeshNamesList ~ ');

  const names = [];
  parent.traverse((o) => {
    if (o.name) {
      names.push(o.name);
    }
  });
  return names;
}

//#endregion

//#region CLIPBOARD

const copyToClipboard = (infoSharingInput) => {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ copyToClipboard ~ ');

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

  tblInfo.toggleClass('active');
  tblInfoItemQr.toggleClass('active');
  tblInfoItemSharing.removeClass('active');
  tblInfoItemLoupe.removeClass('active');
}

//IMPORT
async function ImportScene(newScene) {
  await modelViewer[0].importScene(newScene);
  modelViewer[0].activateAR();
}

//#endregion

//#region URL PARAMETERS

function EmptyURLParams() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ EmptyURLParams ~ ');

  setDefaultValuesForGroups();
  ParseAllGroups();
}

function GetParameterSplitString(array) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ GetParameterSplitString ~ ');

  if (array.length == 0) { return; }

  var params = [];
  for (let index = 0; index < array.length; index++) {
    params.push(array[index].splitValue);
  }
  return new RegExp(`${params.join('|')}`)
}

function GetSharedArrayValues(arrayValue, type) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ GetSharedArrayValues ~ ');
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

  console.log('🚀 ~ GetSharedArrayValues ~ output:', output);
  return output;
}

function ReadURLParameters(callback) {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ ReadURLParameters ~ ');

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
    if (callback != null) { callback(); }
    return;
  }

  const paramArray = parseParams.split(GetParameterSplitString(SharedParameterList));

  if (paramArray.length == 0) {
    paramsLoaded = true;
    EmptyURLParams();
    if (callback != null) { callback(); }
    return;
  }

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ ApplyURLParameters ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ WriteURLParameters ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ GetParametersString ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ GetURLWithParameters ~ ');

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ delay ~ ');

  return new Promise(resolve => setTimeout(resolve, time));
}

//#endregion

//#region UI FUNCTIONS

async function PrepareUI() {
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ PrepareUI ~ ');

  // *****   POP-UPs   *****
  jQuery(document).ready(function ($) {
    const tblWindowArBtnCanvas = $('#button_ar_qr'); // button AR on the canvas
    const tblWindowShareBtnCanvas = $('#button_share_url'); // button SHARE on the canvas
    
    tblWindowArBtnCanvas.removeClass('hidden');

    tblInfo = $('.tbl-info');
    tblInfoItemSharing = $('#tbl-info-item-share');
    tblInfoItemQr = $('#tbl-info-item-qr');
    tblInfoItemLoupe = $('#tbl-info-item-loupe');
    qrcode = $('#qrcode');

    const tblInfoSharingIco = $('.tbl-info-sharing-ico');
    const infoSharingInput = $('#info-sharing-input');
    const tblInfoClose = $('.tbl-info-close');
    const tblInfoOverlay = $('.tbl-info-overlay');

    tblInfoSharingIco.on('click', function () {
      copyToClipboard(infoSharingInput[0]);
    });

    tblInfoClose.on('click', function () {
      tblInfo?.removeClass('active');
      tblInfoItemQr?.removeClass('active');
      tblInfoItemSharing?.removeClass('active');
      tblInfoItemLoupe?.removeClass('active');

      document.documentElement.classList.remove('popup-open');
    });

    tblInfoOverlay.on('click', function () {
      tblInfo?.removeClass('active');
      tblInfoItemQr?.removeClass('active');
      tblInfoItemSharing?.removeClass('active');
      tblInfoItemLoupe?.removeClass('active');

      document.documentElement.classList.remove('popup-open');
    });

    tblWindowShareBtnCanvas?.on('click', function () {
      sharingHandler();
    });

    tblWindowArBtnCanvas.on('click', function () {
      OpenARorQR();
    });

    const sharingHandler = () => {
      tblInfo.toggleClass('active');
      tblInfoItemSharing.toggleClass('active');
      tblInfoItemQr.removeClass('active');
      tblInfoItemLoupe.removeClass('active');

      document.documentElement.classList.add('popup-open');
      
      infoSharingInput[0].value = GetURLWithParameters();
    }

    const btnBuy = $('#ar_button_order');

    btnBuy.on('click', function () {
      SendProductInfo();
    });
  });
}

// eslint-disable-next-line no-unused-vars
function getScrollbarWidth() {
  const outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body');
  const widthWithScroll = $('<div>').css({width: '100%'}).appendTo(outer).outerWidth();
  outer.remove();
  return 100 - widthWithScroll;
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

function loupePopup(loupeTitle, loupeDescription, loupeImage) {
  $('#tbl-loupe-title-ui').text(loupeTitle);
  $('#tbl-loupe-text-ui').text(loupeDescription);

  if (!loupeImage) {
    $('.tbl-loupe-img').css('display', 'none');
  } else {
    $('.tbl-loupe-img').css('display', 'block');

    if (loupeImage.substring(0, 1) === '#') {
      $('.tbl-loupe-img img').remove();
      $('.tbl-loupe-img').css('background-color', loupeImage);
    } else {
      $('.tbl-loupe-img img').attr('src', loupeImage);
    }
  }

  tblInfo.toggleClass('active');
  tblInfoItemSharing.removeClass('active');
  tblInfoItemQr.removeClass('active');
  tblInfoItemLoupe.toggleClass('active');

  document.documentElement.classList.add('popup-open');
}

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
  (DEBUG_MODE_FUNC_STARTS) && console.log('🚀 ~ promiseDelay ~ ');

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
  }
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

function ConvertMorphValue(inputval, srcStart, srcEnd, destStart = 0, destEnd = 1) {
  const result =  destStart + (inputval - srcStart) * (destEnd - destStart) / (srcEnd - srcStart);

  return result;
}

function animateMorph(morphName, valueStart, valueEnd, callback = () => {}, timeInterval = 200, steps = 5) {
  (DEBUG_MODE_VALUES) && console.log("🚀 ~ animateMorph ~ ");
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

//#region GUI

function guiModeController() {
  const materialEquilNames = {
    names: {
      'Kleur onderstel': ['paint'],
    },
    colors: {
      'Kleur onderstel': getColorArray('option_17'),
    }
  };

  const materialUiNames = Object.keys(materialEquilNames.names);
  let colorControllers = [];
  let applyButtons = [];
  let colorValues = {};

  const gui = new dat.GUI();
  const guiContainer = $('#gui-container');
  guiContainer.append(gui.domElement);

  const colorConfig = {
    selectedMaterial: materialUiNames[0],
    selectedColor: materialEquilNames.colors[materialUiNames[0]],
  };

  function updateMaterialColor(color = colorConfig.selectedColor) {
    const materialNames = getMaterialNames(colorConfig.selectedMaterial);

    for (let i = 0; i < materialNames.length; i++) {
      setMaterialColor(materialNames[i], color);
    }
  }

  function getMaterialNames(title) {
    return materialEquilNames.names[title];
  }

  function getMaterialColors(materialName) {
    return materialEquilNames.colors[materialName];
  }

  const materialController = gui.add(colorConfig, 'selectedMaterial', materialUiNames).name('Choose the material');
  gui.add({ getListColor: getListColorBtnHandler }, 'getListColor').name('GET COLOR LIST');

  function updateColorOptions() {
    colorControllers.forEach(controller => controller.remove());
    applyButtons.forEach(button => button.remove());
    colorControllers = [];
    applyButtons = [];
    colorValues = {};

    const materialColors = getMaterialColors(colorConfig.selectedMaterial);

    materialColors.forEach(color => {
      colorValues[color.name] = color.hesh;
      colorConfig.selectedColor = color.hesh;

      const colorController = gui.addColor(colorConfig, 'selectedColor').name(`${color.name}`);
      const applyButton = gui.add({ apply: applyBtnHandler }, 'apply').name('Set');

      function applyBtnHandler() {
        updateMaterialColor(colorValues[color.name]);
      }

      colorController.onChange(function () {
        colorValues[color.name] = colorConfig.selectedColor;
        updateMaterialColor();
      });

      colorControllers.push(colorController);
      applyButtons.push(applyButton);
    });
  }

  materialController.onChange(function () {
    updateColorOptions();
    updateMaterialColor();
  });

  function getListColorBtnHandler() {
    $('.gui_prompt').remove();

    const guiPrompt = $('<div class="gui_prompt">');
    const guiPromptText = $('<div class="gui_prompt_text">');
    const guiPromptBtn = $('<button class="gui_prompt_btn">Close</button>');
    guiPrompt.append(guiPromptText).append(guiPromptBtn);
    $('body').append(guiPrompt);

    guiPromptBtn.on('click', function () {
      guiPrompt.remove();
    });

    let colorsList = `Accurated colors for "${colorConfig.selectedMaterial}":<br>`;

    for (const colorName in colorValues) {
      colorsList += `${colorName}: ${colorValues[colorName]}<br>`;
    }

    guiPromptText.html(colorsList);
  }

  function getColorArray(optName, nameIndex = 4, heshIndex = 1) {
    let colorArray = [];

    mainData.forEach(item => {
      if (item[0].includes(optName)) {
        const colorElement = {
          name: item[nameIndex],
          hesh: item[heshIndex],
        }
        colorArray.push(colorElement);
      }
    });

    return colorArray;
  }

  updateColorOptions();
  updateMaterialColor();
}

//#endregion
