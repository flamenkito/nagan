export interface IMap<T = string | number> {
  [key: string]: T;
}

export namespace IMap {
  export function fromArray<T = string | number>(arr: T[], id: string) {
    return arr.reduce((acc: IMap<T>, cur: T): IMap<T> => {
      const key = cur[id];
      return { ...acc, [key]: cur };
    }, {});
  }

  export function asArray<T = string | number>(imap: IMap<T>): T[] {
    return Object.keys(imap).map(key => imap[key]);
  }

  export const existsOn = (obj: IMap | any) => (...props: string[]) => {
    for (const prop of props) {
      if (!obj[prop]) {
        return false;
      }
    }
    return true;
  };

  export const safeGet = (obj: IMap, def = undefined) => (
    ...props: string[]
  ) => {
    let value;
    for (const prop of props) {
      value = obj[prop];
      if (value === undefined) {
        return def;
      }
    }
    return value;
  };
}
