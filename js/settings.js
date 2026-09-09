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
  ENVIRONMENT_MAP = './src/environment/symmetrical_garden_02_1k.hdr';
  ENVIRONMENT_MAP_INTENSITY = 3.0; // 3.5
  SHADOW_TRANSPARENCY = 0.4;
  TONE_MAPPING_EXPOSURE = 0.9;
}

export const MODEL_PATHS = [
  './src/models/zomes-pod3-draco.glb',
  './src/models/zomes-office3-draco.glb',
  './src/models/zomes-studio3-draco.glb',
  './src/models/zomes-500-draco.glb',
  './src/models/zomes-700-draco.glb',
  './src/models/furniture-pod-draco.glb',
  './src/models/furniture-office-draco.glb',
  './src/models/furniture-studio-draco.glb',
  null,
  null,
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
  0: 'USD',
  1: 'EUR',
  2: 'UAH',
};

// External URLs
export const CALENDLY_LINK = 'https://zomes.com/book';
// export const PAY_DEPOSITE_LINK = 'https://pay.zomes.com/b/fZe9Cl1nzenf7zGaEG';
export const PAY_DEPOSITE_LINK = 'https://app.hubspot.com/payments/vMTPtW7WgXzTn67q?referrer=PAYMENT_LINK';
// export const BOOK_CONSULTATION_LINK = 'https://www.zomes.com/book';

export const ORIGIN_ZIPCODE = '94950';

export const DEV_MODE = true; //!!! When true, fetches live data directly from Google Sheets CSVs instead of local json snapshots

// Zomes_3D_data_LIVE
// const MAIN_LINK_PART = 'https://docs.google.com/spreadsheets/d/1hU0H-7k5TqUaMsO5IgSG8SCk64Vf73_uzAKGlmT5HyI/export?format=csv&gid='; // LIVE
const MAIN_LINK_PART = 'https://docs.google.com/spreadsheets/d/1ASySSyU_y-Fm1ME8oXIGGhjdWWehsGIQ4r_HTHpip5M/export?format=csv&gid='; // DEV

export const DATAFILE_CSV_LINK_UI = MAIN_LINK_PART + '911871288';
export const DATAFILE_CSV_LINK_PRICE = MAIN_LINK_PART + '608401970';
export const DATAFILE_CSV_LINK_ANNOTATIONS = MAIN_LINK_PART + '1110711170';

// Same-origin pre-baked snapshots refreshed by .github/workflows/refresh-data.yml.
// loadData() tries these first and falls back to the CSV links above.
export const DATAFILE_LOCAL_UI = './data/ui.json';
export const DATAFILE_LOCAL_PRICE = './data/price.json';
export const DATAFILE_LOCAL_ANNOTATIONS = './data/annotations.json';
export const DATAFILE_LOCAL_ZIPTAX = './data/ziptax.json.gz';

// Sales Zipcode Table
export const DATAFILE_CSV_LINK_SALES_ZIPCODE = 'https://docs.google.com/spreadsheets/d/1r2yclrOnu-h9EjJjuYAYK9NbmKgITAaKCjFZmTea1bY/export?format=csv&gid=1261074691';

export const WINDOWS_LIMIT_IN_ROW = {
  'Zome-120': 3,
  'Zome-170': 3,
  'Zome-300': 3,
  'Zome-500': 4,
  'Zome-700': 4,
};

export const GROUP_ID_ORDER_FOR_NEXT_MENU_BTNS = [
  '0', '1', '3', '2', '6', '4', '5',
];

export const OPTIONS_ID_ORDER_FOR_UPGRADES = [
  // '2', 
  // '1', 
  '5',
  '0',
  // '4', 
  '3',
];

export const OPTIONS_ID_ORDER_FOR_ADDONS = [
  // '2',
  '1',
  // '0', 
  '4',
  '5',
  // '3',
];

export const DATA_HOUSE_NAME = {
  0: 'Zome-120',
  1: 'Zome-170',
  2: 'Zome-300',
  3: 'Zome-500',
  4: 'Zome-700',
  'Zome-120': 0,
  'Zome-170': 1,
  'Zome-300': 2,
  'Zome-500': 3,
  'Zome-700': 4,
};

export const NAV_CAM_POSITION = {
  // OUTSIDE
  outPrepare: {
    outside: true,
    'Zome-120': {
      camera: [0.072, -0.064 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [0.072, -0.064 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [0.072, -0.064 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [0.072, -0.064 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [0.072, -0.064 + HUMAN_HEIGHT, 6.515],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outMain: {
    outside: true,
    'Zome-120': {
      camera: [3.757, 0.201 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [3.757, 0.201 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [3.757, 0.201 + HUMAN_HEIGHT, 9.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [3.757, 0.201 + HUMAN_HEIGHT, 10.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [3.757, 0.201 + HUMAN_HEIGHT, 10.629],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outXrays: {
    outside: true,
    'Zome-120': {
      // camera: [2.709, 3.279 + HUMAN_HEIGHT, 4.497],
      camera: [-3.211, 3.201 + HUMAN_HEIGHT, 4.214],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      // camera: [2.233, 3.613 + HUMAN_HEIGHT, 4.941],
      camera: [-4.737, 2.821 + HUMAN_HEIGHT, 3.472],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      // camera: [1.337, 2.884 + HUMAN_HEIGHT, 6.482],
      camera: [-6.888, 1.571 + HUMAN_HEIGHT, 1.487],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [-6.888, 1.571 + HUMAN_HEIGHT, 1.487],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [-6.888, 1.571 + HUMAN_HEIGHT, 1.487],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outDimensions: {
    outside: true,
    'Zome-120': {
      camera: [0, -0.412 + HUMAN_HEIGHT, 11.426],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [0, -0.412 + HUMAN_HEIGHT, 11.426],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [0, -0.412 + HUMAN_HEIGHT, 11.426],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [0, -0.412 + HUMAN_HEIGHT, 11.426],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [0, -0.412 + HUMAN_HEIGHT, 11.426],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outExtraDoor: {
    outside: true,
    'Zome-120': {
      camera: [0, -0.367 + HUMAN_HEIGHT, -9.327],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [0, -0.367 + HUMAN_HEIGHT, -9.327],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [0, -0.367 + HUMAN_HEIGHT, -9.327],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [0, -0.367 + HUMAN_HEIGHT, -9.327],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [0, -0.367 + HUMAN_HEIGHT, -9.327],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outWindowsStrip: {
    outside: true,
    'Zome-120': {
      camera: [0.327, 3.275 + HUMAN_HEIGHT, -8.735],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [1.205, 2.024 + HUMAN_HEIGHT, -9.032],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [8.5, 1.956 + HUMAN_HEIGHT, -3.324],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [8.5, 1.956 + HUMAN_HEIGHT, -3.324],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [8.5, 1.956 + HUMAN_HEIGHT, -3.324],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outAirConditioner: {
    outside: true,
    'Zome-120': {
      // camera: [-5.372, 2.68 + HUMAN_HEIGHT, -1.507],
      camera: [4.4, 2.517 + HUMAN_HEIGHT, -3.553],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      // camera: [-5.647, 2.602 + HUMAN_HEIGHT, -1.949],
      camera: [4.8, 1.493 + HUMAN_HEIGHT, -4.145],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [5.833, 1.082 + HUMAN_HEIGHT, -3.443],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [5.833, 1.082 + HUMAN_HEIGHT, -3.443],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [5.833, 1.082 + HUMAN_HEIGHT, -3.443],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outBuildInDesk: {
    outside: true,
    'Zome-120': {
      camera: [-4.739, 2.606 + HUMAN_HEIGHT, 3.011],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [-5.587, 0.892 + HUMAN_HEIGHT, 2.583],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [-6.751, 1.082 + HUMAN_HEIGHT, -0.556],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [-6.751, 1.082 + HUMAN_HEIGHT, -0.556],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [-6.751, 1.082 + HUMAN_HEIGHT, -0.556],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outBuildInBed: {
    outside: true,
    'Zome-120': {
      camera: [4.4, 2.517 + HUMAN_HEIGHT, -3.553],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [4.8, 1.493 + HUMAN_HEIGHT, -4.145],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [-4.557, 0.982 + HUMAN_HEIGHT, 5.032],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [-4.557, 0.982 + HUMAN_HEIGHT, 5.032],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [-4.557, 0.982 + HUMAN_HEIGHT, 5.032],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  outWindowsViewport: {
    outside: true,
    'Zome-120': {
      camera: [9.159, 1.686 + HUMAN_HEIGHT, -0.625],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [9.009, 1.821 + HUMAN_HEIGHT, -1.627],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [7.596, 1.119 + HUMAN_HEIGHT, 5.308],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [7.596, 1.119 + HUMAN_HEIGHT, 5.308],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [7.596, 1.119 + HUMAN_HEIGHT, 5.308],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  // INSIDE
  inPrepare: {
    outside: false,
    'Zome-120': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [0.001, 1.599 - 1.6 + HUMAN_HEIGHT, -0.05],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  inMain: {
    outside: false,
    'Zome-120': {
      camera: [-0.006, -0.007 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [-0.006, -0.007 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [-0.006, -0.007 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [-0.006, -0.007 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [-0.006, -0.007 + HUMAN_HEIGHT, 0.049],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  inExtraDoor: {
    outside: false,
    'Zome-120': {
      camera: [0, HUMAN_HEIGHT, 0.005],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [0, HUMAN_HEIGHT, 0.005],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [0, HUMAN_HEIGHT, 0.005],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [0, HUMAN_HEIGHT, 0.005],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [0, HUMAN_HEIGHT, 0.005],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
  inBuildInDesk: {
    outside: false,
    'Zome-120': {
      camera: [-0.041, 0.005 + HUMAN_HEIGHT, 0.028],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-170': {
      camera: [-0.04, 0.003 + HUMAN_HEIGHT, 0.029],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-300': {
      camera: [-0.049, 0.004 + HUMAN_HEIGHT, -0.007],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-500': {
      camera: [-0.049, 0.004 + HUMAN_HEIGHT, -0.007],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'Zome-700': {
      camera: [-0.049, 0.004 + HUMAN_HEIGHT, -0.007],
      target: [0, HUMAN_HEIGHT, 0],
    },
  },
};

export const CONDITIONS_ACTIVE = {
  'option_0-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_0-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_0-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_0-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_0-4': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': 'on', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': 'on', 'option_1-1': '', 'option_1-0': 'on', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'off', 'option_1-0': 'off', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_3-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_3-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_2-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_2-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_2-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_6-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': 'off', } },
  'option_6-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': 'on', } },
  'option_5-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': 'on', 'office-desk-top': 'on', 'Studio-desk-top': 'on', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_4-5': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_5-4': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': 'on', 'foundation': '', } },
  'option_5-5': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': 'on', 'AC': '', 'foundation': '', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
};

export const CONDITIONS_UNCHECKED = {
  'option_1-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_1-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_1-2': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': 'on', 'option_1-0': 'on', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_5-1': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': 'off', 'office-desk-top': 'off', 'Studio-desk-top': 'off', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_4-5': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_4-0': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
  'option_5-4': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': 'off', 'foundation': '', } },
  'option_5-5': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': 'off', 'AC': '', 'foundation': '', } },
  'option_4-3': { 'group-0': '', 'option_0-0': '', 'option_0-1': '', 'option_0-2': '', 'option_0-3': '', 'option_0-4': '', 'group-1': '', 'option_1-2': '', 'option_1-1': '', 'option_1-0': '', 'group-3': '', 'option_3-0': '', 'option_3-1': '', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'option_2-2': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'group-4': '', 'option_5-1': '', 'option_4-5': '', 'option_4-0': '', 'option_5-4': '', 'option_4-3': '', meshes: { 'Pod-desk-top': '', 'office-desk-top': '', 'Studio-desk-top': '', 'bed': '', 'AC': '', 'foundation': '', } },
};

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
  interiorBase: {
    materialNames: ['wall-outer.001'],
    white: { // white
      map: './src/textures/EQUITONE_white_Base_Color.jpg',
      normal: './src/textures/EQUITONE_Normal_OpenGL.jpg',
      roughness: './src/textures/EQUITONE_Roughness.jpg',
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

export const STUDIO_EXTRADOOR_SECTORS = ['c6', 'd5', 'd6', 'e6']; // ! TODO

export const EXTRA_DOOR_AVAILABLE_SECTORS = {
  0: [4, 5, 6],
  1: [4, 5, 6],
  2: [4, 5, 6, 7, 8],
  3: [4, 5, 6, 7, 8, 9, 10],
  4: [4, 5, 6, 7, 8, 9, 10, 11, 12],
  'Zome-120': [4, 5, 6],
  'Zome-170': [4, 5, 6],
  'Zome-300': [4, 5, 6, 7, 8],
  'Zome-500': [4, 5, 6, 7, 8, 9, 10],
  'Zome-700': [4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export function getExtraDoorAffectedPanels(x) {
  const num = parseInt(x);
  return [
    { row: 'c', number: String(num) },
    { row: 'd', number: String(num - 1) },
    { row: 'd', number: String(num) },
    { row: 'e', number: String(num) },
  ];
}

// Extra Door selection mode:
// true: Pulsing glowing highlight on available C panels (clickable 3D mesh)
// false: Hotspot icons (DOM elements)
export const IS_EXTRA_DOOR_GLOW_MODE = true;
export const EXTRA_DOOR_GLOW_COLOR = 0x22d3ee;


export const VIEWPORT_AND_STRIP_SECTORS = {
  'Zome-120': {
    viewport: {
      c: ['7'],
      d: ['6', '7'],
      e: ['7'],
    },
    strip: {
      c: ['4'],
      d: ['4'],
      e: ['5'],
      f: ['6'],
    },
    skylight: {
      g: ['1', '3', '5', '7', '9'],
    },
  },
  'Zome-170': {
    viewport: {
      c: ['7'],
      d: ['6', '7'],
      e: ['7'],
    },
    strip: {
      c: ['4'],
      d: ['4'],
      e: ['5'],
      f: ['6'],
    },
    skylight: {
      g: ['1', '3', '5', '7', '9'],
    },
  },
  'Zome-300': {
    viewport: {
      c: ['10'],
      d: ['9', '10'],
      e: ['10'],
    },
    strip: {
      c: ['7'],
      d: ['7'],
      e: ['8'],
      f: ['9'],
      g: ['10'],
    },
    skylight: {
      h: ['2', '4', '6', '8', '10', '12'],
    },
  },
  'Zome-500': {
    viewport: {
      c: ['11'],
      d: ['10', '11'],
      e: ['11'],
    },
    strip: {
      c: ['8'],
      d: ['8'],
      e: ['9'],
      f: ['10'],
      g: ['11'],
      h: ['11'],
    },
    skylight: {
      i: ['2', '4', '6', '8', '10', '12', '14'],
    },
  },
  'Zome-700': {
    viewport: {
      c: ['11'],
      d: ['10', '11'],
      e: ['11'],
    },
    strip: {
      c: ['8'],
      d: ['8'],
      e: ['9'],
      f: ['10'],
      g: ['11'],
      h: ['11'],
    },
    skylight: {
      i: ['2', '4', '6', '8', '10', '12', '14'],
    },
  },
};
