'use strict';

export const BACKGROUND_COLOR = 0xffffff;

export const LIGHT_SCHEME = 1;
// LIGHT_SCHEME 0:
export let ENVIRONMENT_MAP = './src/environment/neutral.hdr';
export let ENVIRONMENT_MAP_INTENSITY = 1.1;
export let SHADOW_TRANSPARENCY = 0.1;
export let TONE_MAPPING_EXPOSURE = 1;
// LIGHT_SCHEME 1:
if (LIGHT_SCHEME === 1) {
  ENVIRONMENT_MAP = './src/environment/belfast_open_field_1k.hdr';
  ENVIRONMENT_MAP_INTENSITY = 3.0; // 3.5
  SHADOW_TRANSPARENCY = 0.4;
  TONE_MAPPING_EXPOSURE = 0.9;
}

export const MODEL_PATHS = [
  './src/models/zomes-pod.glb',
  './src/models/zomes-office.glb',
  './src/models/zomes-studio.glb',
];

export const HUMAN_HEIGHT = 2.0; // 1.6
export const MODEL_CENTER_POSITION = 0.6;
export const FOUNDATION_HEIGHT = 0.116;

export const IS_PRICE_SIMPLE = false;
export const DEFAULT_LANGUAGE = 'EN';
export const DEFAULT_CURRENCY = '$';

export const CURRENCY_SIGN = {
  'USD': '$',
  'EUR': '€',
  'UAH': '₴',
};

// Zomes_3D_data_v_001
const MAIN_LINK_PART = 'https://docs.google.com/spreadsheets/d/1wlPf19JZoBj4w6Aqb5-CEuwxaI0ZeFvuLd73mk3gvcg/export?format=csv&gid=';

export const DATAFILE_CSV_LINK_UI = MAIN_LINK_PART + '0';
export const DATAFILE_CSV_LINK_PRICE = MAIN_LINK_PART + '1512053788';

export const DATA_HOUSE_NAME = {
  0: 'pod',
  1: 'office',
  2: 'studio',
  'pod': 0,
  'office': 1,
  'studio': 2,
};

export const NAV_CAM_POSITION = {
  // OUTSIDE
  outPrepare: {
    outside: true,
    'pod': {
      camera: [0.072, 1.536 - 1.6 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [0.072, 1.536 - 1.6 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [0.072, 1.536 - 1.6 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outMain: {
    outside: true,
    'pod': {
      camera: [3.757, 1.801 - 1.6 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [3.757, 1.801 - 1.6 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [3.757, 1.801 - 1.6 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  // INSIDE
  inPrepare: {
    outside: false,
    'pod': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  inMain: {
    outside: false,
    'pod': {
      camera: [-0.006, 1.593 - 1.6 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [-0.006, 1.593 - 1.6 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [-0.006, 1.593 - 1.6 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
};

export const CONDITIONS_ACTIVE = {
  'option_0-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'off', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_0-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'off', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_0-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'on', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': 'on', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': 'off', '*0*panel-L3-D-2': 'off', '*0*panel-L3-E-3': 'off', '*0*panel-L3-F-4': 'off', '*0*window-glass-C-2': 'on', '*0*window-glass-D-2': 'on', '*0*window-glass-E-3': 'on', '*0*window-glass-F-4': 'on', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': 'off', '*1*panel-wall-d-2': 'off', '*1*panel-wall-e-3': 'off', '*1*panel-wall-f-4': 'off', '*1*window-glass-c-2': 'on', '*1*window-glass-d-2': 'on', '*1*window-glass-e-3': 'on', '*1*window-glass-f-4': 'on', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': 'off', '*2*panel-L1-D-3': 'off', '*2*panel-L1-E-4': 'off', '*2*panel-L1-F-5': 'off', '*2*window-glass-C-3': 'on', '*2*window-glass-D-3': 'on', '*2*window-glass-E-4': 'on', '*2*window-glass-F-5': 'on', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': '', 'option_1-0': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': 'off', '*0*panel-L3-D-4': 'off', '*0*panel-L3-D-5': 'off', '*0*panel-L3-E-5': 'off', '*0*window-glass-C-5': 'on', '*0*window-glass-D-4': 'on', '*0*window-glass-D-5': 'on', '*0*window-glass-E-5': 'on', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': 'off', '*1*panel-wall-d-4': 'off', '*1*panel-wall-d-5': 'off', '*1*panel-wall-e-5': 'off', '*1*window-glass-c-5': 'on', '*1*window-glass-d-4': 'on', '*1*window-glass-d-5': 'on', '*1*window-glass-e-5': 'on', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': 'off', '*2*panel-L1-D-5': 'off', '*2*panel-L1-D-6': 'off', '*2*panel-L1-E-6': 'off', '*2*window-glass-C-6': 'on', '*2*window-glass-D-5': 'on', '*2*window-glass-D-6': 'on', '*2*window-glass-E-6': 'on', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'ud', 'option_1-0': 'ud', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_2-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_2-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_2-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_3-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_3-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_4-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_4-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': 'on', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': 'on', '*2*panel-L1-D-3': 'on', '*2*panel-L1-E-4': 'on', '*2*panel-L1-F-5': 'on', '*2*window-glass-C-3': 'off', '*2*window-glass-D-3': 'off', '*2*window-glass-E-4': 'off', '*2*window-glass-F-5': 'off', '*2*panel-L1-C-6': 'on', '*2*panel-L1-D-5': 'on', '*2*panel-L1-D-6': 'on', '*2*panel-L1-E-6': 'on', '*2*window-glass-C-6': 'off', '*2*window-glass-D-5': 'off', '*2*window-glass-D-6': 'off', '*2*window-glass-E-6': 'off', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
};

export const CONDITIONS_UNCHECKED = {
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': 'on', '*0*panel-L3-D-2': 'on', '*0*panel-L3-E-3': 'on', '*0*panel-L3-F-4': 'on', '*0*window-glass-C-2': 'off', '*0*window-glass-D-2': 'off', '*0*window-glass-E-3': 'off', '*0*window-glass-F-4': 'off', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': 'on', '*1*panel-wall-d-2': 'on', '*1*panel-wall-e-3': 'on', '*1*panel-wall-f-4': 'on', '*1*window-glass-c-2': 'off', '*1*window-glass-d-2': 'off', '*1*window-glass-e-3': 'off', '*1*window-glass-f-4': 'off', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': 'on', '*2*panel-L1-D-3': 'on', '*2*panel-L1-E-4': 'on', '*2*panel-L1-F-5': 'on', '*2*window-glass-C-3': 'off', '*2*window-glass-D-3': 'off', '*2*window-glass-E-4': 'off', '*2*window-glass-F-5': 'off', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': 'on', '*0*panel-L3-D-4': 'on', '*0*panel-L3-D-5': 'on', '*0*panel-L3-E-5': 'on', '*0*window-glass-C-5': 'off', '*0*window-glass-D-4': 'off', '*0*window-glass-D-5': 'off', '*0*window-glass-E-5': 'off', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': 'on', '*1*panel-wall-d-4': 'on', '*1*panel-wall-d-5': 'on', '*1*panel-wall-e-5': 'on', '*1*window-glass-c-5': 'off', '*1*window-glass-d-4': 'off', '*1*window-glass-d-5': 'off', '*1*window-glass-e-5': 'off', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': 'on', '*2*panel-L1-D-5': 'on', '*2*panel-L1-D-6': 'on', '*2*panel-L1-E-6': 'on', '*2*window-glass-C-6': 'off', '*2*window-glass-D-5': 'off', '*2*window-glass-D-6': 'off', '*2*window-glass-E-6': 'off', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'on', 'option_1-0': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': 'off', '*0*panel-L3-G-3': 'off', '*0*panel-L3-G-5': 'off', '*0*panel-L3-G-7': 'off', '*0*panel-L3-G-9': 'off', '*0*window-glass-G-1': 'on', '*0*window-glass-G-3': 'on', '*0*window-glass-G-5': 'on', '*0*window-glass-G-7': 'on', '*0*window-glass-G-9': 'on', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': 'off', '*1*panel-wall-g-3': 'off', '*1*panel-wall-g-5': 'off', '*1*panel-wall-g-7': 'off', '*1*panel-wall-g-9': 'off', '*1*window-glass-g-1': 'on', '*1*window-glass-g-3': 'on', '*1*window-glass-g-5': 'on', '*1*window-glass-g-7': 'on', '*1*window-glass-g-9': 'on', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': 'off', '*2*panel-L1-H-3': 'off', '*2*panel-L1-H-5': 'off', '*2*panel-L1-H-7': 'off', '*2*panel-L1-H-9': 'off', '*2*panel-L1-H-11': 'off', '*2*window-glass-H-1': 'on', '*2*window-glass-H-3': 'on', '*2*window-glass-H-5': 'on', '*2*window-glass-H-7': 'on', '*2*window-glass-H-9': 'on', '*2*window-glass-H-11': 'on', 'foundation': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_4-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
  'option_4-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': 'off', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { '*0*panel-L3-C-2': '', '*0*panel-L3-D-2': '', '*0*panel-L3-E-3': '', '*0*panel-L3-F-4': '', '*0*window-glass-C-2': '', '*0*window-glass-D-2': '', '*0*window-glass-E-3': '', '*0*window-glass-F-4': '', '*0*panel-L3-C-5': '', '*0*panel-L3-D-4': '', '*0*panel-L3-D-5': '', '*0*panel-L3-E-5': '', '*0*window-glass-C-5': '', '*0*window-glass-D-4': '', '*0*window-glass-D-5': '', '*0*window-glass-E-5': '', '*0*panel-L3-G-1': '', '*0*panel-L3-G-3': '', '*0*panel-L3-G-5': '', '*0*panel-L3-G-7': '', '*0*panel-L3-G-9': '', '*0*window-glass-G-1': '', '*0*window-glass-G-3': '', '*0*window-glass-G-5': '', '*0*window-glass-G-7': '', '*0*window-glass-G-9': '', '*1*panel-wall-c-2': '', '*1*panel-wall-d-2': '', '*1*panel-wall-e-3': '', '*1*panel-wall-f-4': '', '*1*window-glass-c-2': '', '*1*window-glass-d-2': '', '*1*window-glass-e-3': '', '*1*window-glass-f-4': '', '*1*panel-wall-c-5': '', '*1*panel-wall-d-4': '', '*1*panel-wall-d-5': '', '*1*panel-wall-e-5': '', '*1*window-glass-c-5': '', '*1*window-glass-d-4': '', '*1*window-glass-d-5': '', '*1*window-glass-e-5': '', '*1*panel-wall-g-1': '', '*1*panel-wall-g-3': '', '*1*panel-wall-g-5': '', '*1*panel-wall-g-7': '', '*1*panel-wall-g-9': '', '*1*window-glass-g-1': '', '*1*window-glass-g-3': '', '*1*window-glass-g-5': '', '*1*window-glass-g-7': '', '*1*window-glass-g-9': '', '*2*panel-L1-C-3': '', '*2*panel-L1-D-3': '', '*2*panel-L1-E-4': '', '*2*panel-L1-F-5': '', '*2*window-glass-C-3': '', '*2*window-glass-D-3': '', '*2*window-glass-E-4': '', '*2*window-glass-F-5': '', '*2*panel-L1-C-6': '', '*2*panel-L1-D-5': '', '*2*panel-L1-D-6': '', '*2*panel-L1-E-6': '', '*2*window-glass-C-6': '', '*2*window-glass-D-5': '', '*2*window-glass-D-6': '', '*2*window-glass-E-6': '', '*2*panel-L1-H-1': '', '*2*panel-L1-H-3': '', '*2*panel-L1-H-5': '', '*2*panel-L1-H-7': '', '*2*panel-L1-H-9': '', '*2*panel-L1-H-11': '', '*2*window-glass-H-1': '', '*2*window-glass-H-3': '', '*2*window-glass-H-5': '', '*2*window-glass-H-7': '', '*2*window-glass-H-9': '', '*2*window-glass-H-11': '', 'foundation': '', } },
};

export const SKYLIGHTS_MESHES = {
  '0': { // Pod
    'panel': [
      'panel-L3-G-1',
      'panel-L3-G-3',
      'panel-L3-G-5',
      'panel-L3-G-7',
      'panel-L3-G-9',
    ],
    'window': [
      'window-glass-G-1',
      'window-glass-G-3',
      'window-glass-G-5',
      'window-glass-G-7',
      'window-glass-G-9',
    ],
  },
  '1': { // Office
    'panel': [
      'panel-wall-g-1',
      'panel-wall-g-3',
      'panel-wall-g-5',
      'panel-wall-g-7',
      'panel-wall-g-9',
    ],
    'window': [
      'window-glass-g-1',
      'window-glass-g-3',
      'window-glass-g-5',
      'window-glass-g-7',
      'window-glass-g-9',
    ],
  },
  '2': { // Studio
    'panel': [
      'panel-L1-H-1',
      'panel-L1-H-3',
      'panel-L1-H-5',
      'panel-L1-H-7',
      'panel-L1-H-9',
      'panel-L1-H-11',
    ],
    'window': [
      'window-glass-H-1',
      'window-glass-H-3',
      'window-glass-H-5',
      'window-glass-H-7',
      'window-glass-H-9',
      'window-glass-H-11',
    ],
  },
}

export const STRIP_VIEWPORT_MESHES_STUDIO_EXTRADOOR = {
  strip: {
    'panel': [
      'panel-L1-C-6',
      'panel-L1-D-6',
      'panel-L1-E-7',
      'panel-L1-F-8',
    ],
    'window': [
      'window-glass-C-6',
      'window-glass-D-6',
      'window-glass-E-7',
      'window-glass-F-8',
    ],
  },
  viewport: {
    'panel': [
      'panel-L1-C-9',
      'panel-L1-D-8',
      'panel-L1-D-9',
      'panel-L1-E-9',
    ],
    'window': [
      'window-glass-C-9',
      'window-glass-D-8',
      'window-glass-D-9',
      'window-glass-E-9',
    ],
  },

}

export const TEXTURES = {
  interior: {
    materialNames: ['wall-in'],
    '0': { // oxide
      map: './src/textures/Oxide-Panels_Base_color.jpg',
      normal: 'null',
      roughness: './src/textures/Oxide-Panels_roughness.jpg',
    },
    '1': { // wood
      map: './src/textures/wood-wall_Base_color.jpg',
      normal: 'null',
      roughness: './src/textures/wood-wall_roughness.jpg',
    },
    '2': { // sound
      map: './src/textures/Soundproofing_Base_Color.jpg',
      normal: './src/textures/Soundproofing_Normal_OpenGL.jpg',
      roughness: './src/textures/Soundproofing_Roughness.jpg',
    },
  },
  exterior: {
    materialNames: ['wall-outer'],
    '0': { // grey
      map: './src/textures/EQUITONE_gray_Base_Color.jpg',
      normal: './src/textures/EQUITONE_Normal_OpenGL.jpg',
      roughness: './src/textures/EQUITONE_Roughness.jpg',
    },
    '1': { // white
      map: './src/textures/EQUITONE_white_Base_Color.jpg',
      normal: './src/textures/EQUITONE_Normal_OpenGL.jpg',
      roughness: './src/textures/EQUITONE_Roughness.jpg',
    },
  },
};

//! TODO
export const DATA_CHECKING_PRICE = {
  // {index of SharedParameterList : name in price file}
  '0': {
    name: 'Kleur tafelblad',
    value: {
      '0': 'Eiken Naturel',
      '1': 'Eiken Zwart (RAL 9005)',
      '2': 'Eiken Dark Stained',
      '3': 'Eiken Tabacco',
      '4': 'Eiken Rock',
      '5': 'Eiken Leem',
      '6': 'Eiken Royal Grey',
      '7': 'Eiken White',
      '8': 'Noten mat',
    },
  },
  '1': {
    name: 'Afwerking',
    value: {
      '0': 'Mat gelakt',
      '1': 'Geolied',
    },
  },
  '2': {
    name: 'Dikte',
    value: {
      '0': '2 cm',
      '1': '4 cm',
    },
  },
  '3': {
    name: 'Vorm tafelblad',
    value: {
      '0': 'Rechthoek',
      '1': 'Semi-rechthoek',
      '2': 'Rechthoek grote radius',
      '3': 'Ovaal',
      '4': 'Semi-ovaal',
      '5': 'Plat ovaal',
      '6': 'Rond',
      '7': 'Organisch',
    },
  },
  '4': {
    name: 'Lengte',
    value: {
      '0': '180 cm',
      '1': '200 cm',
      '2': '220 cm',
      '3': '240 cm',
      '4': '250 cm',
      '5': '260 cm',
      '6': '280 cm',
      '7': '300 cm',
    },
  },
  '5': {
    name: 'Breedte',
    value: {
      '0': '90 cm',
      '1': '100 cm',
      '2': '110 cm',
      '3': '120 cm',
    },
  },
  '6': {
    name: 'Diameter',
    value: {
      '0': '110 cm',
      '1': '120 cm',
      '2': '130 cm',
      '3': '140 cm',
      '4': '150 cm',
    },
  },
  '7': {
    name: 'Type randafwerking',
    value: {
      '0': 'Verjongd',
      '1': 'Bol',
      '2': 'Recht',
      '3': 'Halfrond',
    },
  },
  '8': {
    name: 'Type onderstel',
    value: {
      '0': 'Novum 30',
      '1': 'Novum 15',
      '2': 'Steelo',
    },
  },
  '9': {
    name: 'Kleur onderstel Novum',
    value: {
      '0': 'Eiken Naturel',
      '1': 'Eiken Zwart (RAL 9005)',
      '2': 'Eiken Dark Stained',
      '3': 'Eiken Tabacco',
      '4': 'Eiken Rock',
      '5': 'Eiken Leem',
      '6': 'Eiken Royal Grey',
      '7': 'Eiken White',
      '8': 'Noten mat',
    },
  },
  '10': {
    name: 'Kleur onderstel Steelo',
    value: {
      '0': 'RAL 7021',
      '1': 'RAL 1000',
      '2': 'RAL 3012',
      '3': 'RAL 3005',
      '4': 'RAL 5002',
      '5': 'RAL 6024',
      '6': 'RAL 6021',
      '7': 'RAL 9010',
      '8': 'RAL 7035',
      '9': 'RAL 1015',
      '10': 'RAL 7032',
    },
  },
};