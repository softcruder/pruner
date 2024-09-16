/* eslint-disable no-useless-escape */

export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const NAME_REGEX =
  /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/;

export const ALPHANUMERIC_SPECIAL_CHAR_REGEX =
  /^[A-Za-z0-9_@./:,?!#$%^&*_|><{}()=~`$&+;\\-\s]*$/;

export const ALPHABETS_WITH_HYPEN_AND_SPACE = /^[a-zA-Z -]*$/i;

export const ALPHA_NUMERIC_REGEX = /^[a-z0-9]+$/i;

export const ALPHABETS_REGEX = /^[a-zA-Z]*$/;

export const ALPHABETS_WITH_SPACE_REGEX = /^[a-zA-Z ]*$/i;

export const LOOSE_ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]*$/;

export const NUMBER_REGEX = /^[0-9]*$/;

export const FLOAT_REGEX = /^[0-9,.]*$/;