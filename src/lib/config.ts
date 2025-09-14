export type PaperConfig = {
  [key: string]: {
    [key: string]: ModuleConfig;
  };
};

export type ModuleConfig = {
  label: string;
  count: number;
  minutes: number;
};

export const MODULE_CONFIG: PaperConfig = {
  a: {
    m1: {
      label: '1',
      count: 30,
      minutes: 35
    },
    m2: {
      label: '2',
      count: 5,
      minutes: 10
    }
  },
  b: {
    '3b': {
      label: '3B',
      count: 25,
      minutes: 30
    }
  },
  c: {
    '4b': {
      label: '4B',
      count: 15,
      minutes: 15
    }
  },
};
