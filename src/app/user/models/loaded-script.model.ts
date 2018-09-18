import { LoadableScriptModel } from './loadable-script.model';

export interface LoadedScriptModel {
  script: LoadableScriptModel;
  loading: boolean;
  loaded: boolean;
  error: any | null;
}
