export interface ElementModel {
  name: string;
  description: string;
  element: string;
  url: string;
  loading: boolean;
  loaded: boolean;
  error: any | null;
}
