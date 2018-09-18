export interface RequestModel {
  loaded: boolean;
  loading: boolean;
  error: any;
}

export namespace RequestModel {
  export function empty(): RequestModel {
    return { loaded: false, loading: false, error: null };
  }
}
