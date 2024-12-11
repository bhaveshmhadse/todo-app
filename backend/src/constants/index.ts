export const expiry = 10;

interface cache {
  [id: number]: {
    userData: any;
    ts: any;
  };
}

export let cacheData: cache = {};
