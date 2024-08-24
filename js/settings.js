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
  './TEMP/Model_T.glb',
  // './src/models/zomes_pod.glb',
  './src/models/zomes_office.glb',
  // './src/models/zomes_studio.glb',
  './TEMP/SCANDI DOUBLE-4.glb',
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
      camera: [2.741, 1.875, 7.51],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'office': {
      camera: [2.741, 1.875, 7.51],
      target: [0, HUMAN_HEIGHT, 0],
    },
    'studio': {
      camera: [2.741, 1.875, 7.51],
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

//! TODO
export const CONDITIONS = {
  // 'option_0-0': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
  // 'option_0-1': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'off', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
  // 'option_0-2': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
};
