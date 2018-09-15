import { environment } from '@env/environment';

export const API = (...paths: string[]) => {
  return [environment.api].concat(paths).join('/');
};

export const POUCHDB = (...paths: string[]) => {
  return [environment.pouchdb].concat(paths).join('/');
};
