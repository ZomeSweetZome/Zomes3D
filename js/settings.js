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
  ENVIRONMENT_MAP_INTENSITY = 3.5;
  SHADOW_TRANSPARENCY = 0.4;
  TONE_MAPPING_EXPOSURE = 0.9;
}

export const MODEL_PATHS = [
  './src/models/zomes-pod.glb',
  './src/models/zomes-office.glb',
  './src/models/zomes-studio.glb',
];

export const HUMAN_HEIGHT = 1.6;
export const MODEL_CENTER_POSITION = 0.6;

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
      camera: [0.072, 1.536, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [0.072, 1.536, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [0.072, 1.536, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outMain: {
    outside: true,
    'pod': {
      camera: [3.757, 1.801, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [3.757, 1.801, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [3.757, 1.801, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  // INSIDE
  inPrepare: {
    outside: false,
    'pod': {
      camera: [0.001, 1.599, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [0.001, 1.599, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [0.001, 1.599, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  inMain: {
    outside: false,
    'pod': {
      camera: [-0.006, 1.593, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [-0.006, 1.593, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [-0.006, 1.593, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
};

export const CONDITIONS_ACTIVE = {
  'option_0-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'off', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_0-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'off', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_0-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': 'on', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': 'on', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': '', 'option_1-0': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'ud', 'option_1-0': 'ud', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_3-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_3-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
};

export const CONDITIONS_UNCHECKED = {
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'on', 'option_1-0': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_2-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-4': '', 'option_4-0': '', 'option_4-1': '', 'option_4-2': '', 'option_4-3': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', } },
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

//! TODO
export const TEXTURES = {
  'oak': {
    'mat': {
      // normal: './src/textures/oak_normal.png',
      // roughness: './src/textures/oak_rough.jpg',
    },
    'gloss': {
      // normal: 'null',
      // roughness: './src/textures/oak_rough_gloss.jpg',
    },
  },
  'noten': {
    'mat': {
      // roughness: './src/textures/Noten_mat_roughness.jpg',
    },
    'gloss': {
      normal: 'null',
      // roughness: './src/textures/Noten_gloss_roughness.jpg',
    },
  },
};
