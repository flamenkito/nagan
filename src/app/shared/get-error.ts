const DEFAULT_MESSAGE = 'Unknown error';

export const getError = (res: any): string => {
  switch (res && res.constructor && res.constructor.name) {
    case 'HttpErrorResponse': {
      const reason = res.error && res.error.reason;
      const statusText = res.statusText;
      return reason || statusText || DEFAULT_MESSAGE;
    }
    default: {
      return DEFAULT_MESSAGE;
    }
  }
};
