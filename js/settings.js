'use strict';

export const GUI_MODE_UI = false;

export const BACKGROUND_COLOR = 0xffffff;
export const ENVIRONMENT_MAP = './src/environment/neutral.hdr';
export const ENVIRONMENT_MAP_INTENSITY = 1;
export const SHADOW_TRANSPARENCY = 0.075;
export const TONE_MAPPING_EXPOSURE = 1.1;

export const MODEL_PATHS = [
  './src/models/zome_1.glb',
  // './TEMP/SCANDI-CAMP.glb',
  // './TEMP/SCANDI DOUBLE.glb',
  // './TEMP/SCANDI DOUBLE-2.glb',
];

export const MODEL_CENTER_POSITION = -0.3;

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

export const MORPH_DATA = {
  length: {
    min: 180,
    max: 300,
    '0': 180,
    '1': 200,
    '2': 220,
    '3': 240,
    '4': 250,
    '5': 260,
    '6': 280,
    '7': 300,
  },
  width: {
    min: 90,
    max: 120,
    '0': 90,
    '1': 100,
    '2': 110,
    '3': 120,
  },
  diameter: {
    min: 110,
    max: 150,
    '0': 110,
    '1': 120,
    '2': 130,
    '3': 140,
    '4': 150,
  },
}

export const MORPH_DATA_LEGS_LENGTH = {
  '0': { //! Novum 30
    '0': { //? Rechthoek
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '1': { //? Semi-rechthoek
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '2': { //? Rechthoek grote radius
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '3': { //? Ovaal
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '4': { //? Semi-ovaal
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '5': { //? Plat ovaal
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
    '6': { //? Rond
      '0': 1, // 110 diameter - 100
      '1': 1, // 120 diameter - 100
      '2': 1, // 130 diameter - 100
      '3': 1, // 140 diameter - 100
      '4': 1, // 150 diameter - 100
    },
    '7': { //? Organisch
      '0': 0.00000, // 180 -  87
      '1': 0.16667, // 200 - 107
      '2': 0.33333, // 220 - 127
      '3': 0.50000, // 240 - 147
      '4': 0.58333, // 250 - 157
      '5': 0.66667, // 260 - 167
      '6': 0.83333, // 280 - 187
      '7': 1.00000, // 300 - 207
    },
  },
  '1': { //! Novum 15
    '0': { //? Rechthoek
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '1': { //? Semi-rechthoek
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '2': { //? Rechthoek grote radius
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '3': { //? Ovaal
      // '0': 0.00000, // 180 - 112
      // '1': 0.16667, // 200 - 132
      // '2': 0.33333, // 220 - 152
      // '3': 0.50000, // 240 - 172
      // '4': 0.58333, // 250 - 182
      // '5': 0.66667, // 260 - 192
      // '6': 0.83333, // 280 - 212
      // '7': 1.00000, // 300 - 232
      '0': -0.25, // 180
      '1': -0.13333, // 200
      '2': -0.01667, // 220
      '3': 0.1, // 240
      '4': 0.15833, // 250
      '5': 0.21667, // 260
      '6': 0.33333, // 280
      '7': 0.45, // 300
    },
    '4': { //? Semi-ovaal
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '5': { //? Plat ovaal
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '6': { //? Rond
      '0': 1, // 110 diameter - 330
      '1': 1, // 120 diameter - 330
      '2': 1, // 130 diameter - 330
      '3': 1, // 140 diameter - 330
      '4': 1, // 150 diameter - 330
    },
    '7': { //? Organisch
      // '0': 0.00000, // 180 - 112
      // '1': 0.16667, // 200 - 132
      // '2': 0.33333, // 220 - 152
      // '3': 0.50000, // 240 - 172
      // '4': 0.58333, // 250 - 182
      // '5': 0.66667, // 260 - 192
      // '6': 0.83333, // 280 - 212
      // '7': 1.00000, // 300 - 232
      '0': 0, // 180
      '1': 0, // 200
      '2': 0, // 220
      '3': 0.125, // 240
      '4': 0.1875, // 250
      '5': 0.25, // 260
      '6': 0.375, // 280
      '7': 0.5, // 300
    },
  },
  '2': { //! Steelo
    '0': { //? Rechthoek
      '0': 0.33333, // 180 - 152
      '1': 0.50000, // 200 - 172
      '2': 0.66667, // 220 - 192
      '3': 0.83333, // 240 - 212
      '4': 0.91667, // 250 - 222
      '5': 1.00000, // 260 - 232
      '6': 1.16667, // 280 - 252
      '7': 1.33333, // 300 - 272
    },
    '1': { //? Semi-rechthoek
      '0': 0.33333, // 180 - 152
      '1': 0.50000, // 200 - 172
      '2': 0.66667, // 220 - 192
      '3': 0.83333, // 240 - 212
      '4': 0.91667, // 250 - 222
      '5': 1.00000, // 260 - 232
      '6': 1.16667, // 280 - 252
      '7': 1.33333, // 300 - 272
    },
    '2': { //? Rechthoek grote radius
      '0': 0.33333, // 180 - 152
      '1': 0.50000, // 200 - 172
      '2': 0.66667, // 220 - 192
      '3': 0.83333, // 240 - 212
      '4': 0.91667, // 250 - 222
      '5': 1.00000, // 260 - 232
      '6': 1.16667, // 280 - 252
      '7': 1.33333, // 300 - 272
    },
    '3': { //? Ovaal
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '4': { //? Semi-ovaal
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '5': { //? Plat ovaal
      '0': 0.00000, // 180 - 112
      '1': 0.16667, // 200 - 132
      '2': 0.33333, // 220 - 152
      '3': 0.50000, // 240 - 172
      '4': 0.58333, // 250 - 182
      '5': 0.66667, // 260 - 192
      '6': 0.83333, // 280 - 212
      '7': 1.00000, // 300 - 232
    },
    '6': { //? Rond
      '2': -0.25, // ! 130 diameter - 130
      '3': -0.10, // ! 140 diameter - 140
    },
    '7': { //? Organisch
      // '0': 0.33333, //! 220 - 152
      // '1': 0.33333, //! 220 - 152
      // '2': 0.33333, // 220 - 152
      // '3': 0.50000, // 240 - 172
      // '4': 0.58333, // 250 - 182
      // '5': 0.66667, // 260 - 192
      // '6': 0.83333, // 280 - 212
      // '7': 1.00000, // 300 - 232
      '0': 0.33333, // 180
      '1': 0.33333, // 200
      '2': 0.33333, // 220
      '3': 0.45, // 240
      '4': 0.50833, // 250
      '5': 0.56667, // 260
      '6': 0.68333, // 280
      '7': 0.8, // 300
    },
  },
};

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

export const TEXTURES = {
  'oak': {
    'mat': {
      normal: './src/textures/oak_normal.png',
      roughness: './src/textures/oak_rough.jpg',
    },
    'gloss': {
      normal: 'null',
      roughness: './src/textures/oak_rough_gloss.jpg',
    },
  },
  'noten': {
    'mat': {
      roughness: './src/textures/Noten_mat_roughness.jpg',
    },
    'gloss': {
      normal: 'null',
      roughness: './src/textures/Noten_gloss_roughness.jpg',
    },
  },
  'top': {
    materialNames: ['wood_top'],
    materialNamesLeg: ['wood_legs'],
    '0': { // 'Eiken Naturel'
      map: './src/textures/Naturel.jpg',
    },
    '1': { // 'Eiken Zwart (RAL 9005)'
      map: './src/textures/Tabacco_Zwart.jpg',
    },
    '2': { // 'Eiken Dark Stained'
      map: './src/textures/Dark_Stained.jpg',
    },
    '3': { // 'Eiken Tabacco'
      map: './src/textures/Tabacco.jpg',
    },
    '4': { // 'Eiken Rock'
      map: './src/textures/Rock.jpg',
    },
    '5': { // 'Eiken Leem'
      map: './src/textures/Leem.jpg',
    },
    '6': { // 'Eiken Royal Grey'
      map: './src/textures/Royal_Grey.jpg',
    },
    '7': { // 'Eiken White'
      map: './src/textures/Tabacco_White.jpg',
    },
    '8': { // 'Noten mat'
      map: './src/textures/Noten_mat.jpg',
    },
  },
  'end': {
    materialNames: ['wood_top_end'],
    '0': { // 'Eiken Naturel'
      map: './src/textures/Wood_End_Naturel.jpg',
    },
    '1': { // 'Eiken Zwart (RAL 9005)'
      map: './src/textures/Wood_End_Tabacco_Zwart.jpg',
    },
    '2': { // 'Eiken Dark Stained'
      map: './src/textures/Wood_End_Dark_Stained.jpg',
    },
    '3': { // 'Eiken Tabacco'
      map: './src/textures/Wood_End_Tabacco.jpg',
    },
    '4': { // 'Eiken Rock'
      map: './src/textures/Wood_End_Rock.jpg',
    },
    '5': { // 'Eiken Leem'
      map: './src/textures/Wood_End_Leem.jpg',
    },
    '6': { // 'Eiken Royal Grey'
      map: './src/textures/Wood_End_Royal_Grey.jpg',
    },
    '7': { // 'Eiken White'
      map: './src/textures/Wood_End_Tabacco_White.jpg',
    },
    '8': { // 'Noten mat'
      map: './src/textures/Wood_End_Noten_mat.jpg',
    },
  },
};

export const CONDITIONS = {
  // 'option_0-0': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
  // 'option_0-1': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'off', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
  // 'option_0-2': { 'group-1': 'on', 'option_1-0': 'on', 'option_1-1': 'on', 'group-2': '', 'option_2-0': '', 'option_2-1': '', 'group-5': '', 'option_5-0': '', 'option_5-1': '', 'option_5-2': '', 'option_5-3': '', 'option_5-4': '', 'option_5-5': '', 'option_5-6': '', 'option_5-7': '', 'group-6': '', 'option_6-0': '', 'option_6-1': '', 'option_6-2': '', 'option_6-3': '', 'option_6-4': '', 'option_6-5': '', 'option_6-6': '', 'option_6-7': '', 'group-7': '', 'option_7-0': '', 'option_7-1': '', 'option_7-2': '', 'option_7-3': '', 'option_7-4': '', 'option_7-5': '', 'option_7-6': '', 'option_7-7': '', 'group-8': '', 'option_8-0': '', 'option_8-1': '', 'option_8-2': '', 'option_8-3': '', 'option_8-4': '', 'option_8-5': '', 'option_8-6': '', 'option_8-7': '', 'group-9': '', 'option_9-0': '', 'option_9-1': '', 'option_9-2': '', 'option_9-3': '', 'option_9-4': '', 'option_9-5': '', 'option_9-6': '', 'option_9-7': '', 'group-10': '', 'option_10-0': '', 'option_10-1': '', 'option_10-2': '', 'option_10-3': '', 'option_10-4': '', 'option_10-5': '', 'option_10-6': '', 'option_10-7': '', 'group-11': '', 'option_11-0': '', 'option_11-1': '', 'option_11-2': '', 'option_11-3': '', 'option_11-4': '', 'option_11-5': '', 'option_11-6': '', 'option_11-7': '', 'group-12': '', 'option_12-0': '', 'option_12-1': '', 'option_12-2': '', 'option_12-3': '', 'option_12-4': '', 'option_12-5': '', 'option_12-6': '', 'option_12-7': '', 'group-13': '', 'option_13-0': '', 'option_13-1': '', 'option_13-2': '', 'option_13-3': '', 'group-14': '', 'option_14-0': '', 'option_14-1': '', 'option_14-2': '', 'option_14-3': '', 'option_14-4': '', 'group-15': '', 'group-16': '', 'group-17': '', 'group-18': '', 'group-19': '', 'group-20': '', 'group-21': '', 'group-22': '', 'group-23': '', 'option_23-0': '', 'option_23-1': '', 'option_23-2': '', 'group-27': '', 'option_27-0': '', 'option_27-1': '', 'option_27-2': '', 'group-28': '', 'option_28-0': '', 'option_28-1': '', 'option_28-2': '', 'group-24': '', 'option_24-0': '', 'option_24-1': '', 'option_24-2': '', 'group-25': 'on', 'option_25-0': 'on', 'option_25-1': 'on', 'option_25-2': 'on', 'option_25-3': 'on', 'option_25-4': 'on', 'option_25-5': 'on', 'option_25-6': 'on', 'option_25-7': 'on', 'option_25-8': 'off', 'group-26': '', meshes: { 'ovaal_bol': '', 'ovaal_halfrond': '', 'ovaal_recht': '', 'ovaal_verjongd': '', 'round_bol': '', 'round_halfrond': '', 'round_recht': '', 'round_verjongd': '', 'semi-ovaal_bol': '', 'semi-ovaal_halfrond': '', 'semi-ovaal_recht': '', 'semi-ovaal_verjongd': '', 'semi-recht_bol': '', 'semi-recht_halfrond': '', 'semi-recht_recht': '', 'semi-recht_verjongd': '', 'rechthoekig_bol': '', 'rechthoekig_halfrond': '', 'rechthoekig_recht': '', 'rechthoekig_verjongd': '', 'plat-ovaal_bol': '', 'plat-ovaal_halfrond': '', 'plat-ovaal_recht': '', 'plat-ovaal_verjongd': '', 'organish_bol': '', 'organish_halfrond': '', 'organish_recht': '', 'organish_verjongd': '', 'Rechthoek_radius_bol': '', 'Rechthoek_radius_halfrond': '', 'Rechthoek_radius_recht': '', 'Rechthoek_radius_verjongd': '', 'novum-15': '', 'novum-15-round': '', 'novum-30': '', 'novum-30-round': '', 'steelo': '', } },
};
