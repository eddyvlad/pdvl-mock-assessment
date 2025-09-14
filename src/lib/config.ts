export type PapersConfig = {
  [paperKey: string]: PaperMeta & {
    modules: {
      [moduleKey: string]: ModuleConfig;
    };
  };
};

export type PaperMeta = {
  name: string; // Display name, e.g., "Paper A"
  passMark: number; // Minimum total correct to pass the paper
};

export type ModuleConfig = {
  label: string; // Display label for the module (e.g., "1", "2", "3B")
  count: number; // Number of questions to pick for this module
  minutes: number; // Time allocated to this module
  passMark?: number; // Optional module-specific pass mark (defaults to paper passMark semantics if needed)
};

// Centralized configuration for all papers and modules
export const CONFIG: PapersConfig = {
  a: {
    name: 'Paper A',
    passMark: 30,
    modules: {
      m1: {
        label: '1',
        count: 30,
        minutes: 35,
      },
      m2: {
        label: '2',
        count: 5,
        minutes: 10,
      },
    },
  },
  b: {
    name: 'Paper B',
    passMark: 22,
    modules: {
      '3b': {
        label: '3B',
        count: 25,
        minutes: 30,
      },
    },
  },
  c: {
    name: 'Paper C',
    passMark: 12,
    modules: {
      '4b': {
        label: '4B',
        count: 15,
        minutes: 15,
      },
    },
  },
};
