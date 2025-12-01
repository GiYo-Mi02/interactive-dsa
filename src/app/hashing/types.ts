// Hashing algorithm types

export type HashAlgorithm = 
  | 'hash-function'
  | 'linear-probing'
  | 'chaining';

export interface HashBucket {
  index: number;
  values: { key: number; value: string }[];
  state: 'default' | 'hashing' | 'collision' | 'inserted' | 'probing' | 'found';
}

export interface HashStep {
  buckets: HashBucket[];
  tableSize: number;
  currentKey?: number;
  hashValue?: number;
  probeIndex?: number;
  probeCount?: number;
  explanation: string;
  highlightCode?: number[];
}

export interface HashInfo {
  name: string;
  description: string;
  avgTimeComplexity: string;
  worstTimeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

export const HASH_INFO: Record<HashAlgorithm, HashInfo> = {
  'hash-function': {
    name: 'Hash Function (Modulo)',
    description: 'Maps keys to array indices using the modulo operation: hash(key) = key % tableSize',
    avgTimeComplexity: 'O(1)',
    worstTimeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function hash(key, tableSize):',
      '  return key % tableSize',
      '',
      'function insert(key, value):',
      '  index = hash(key, tableSize)',
      '  table[index] = (key, value)',
    ],
  },
  'linear-probing': {
    name: 'Linear Probing',
    description: 'On collision, probe linearly for the next empty slot: (hash + i) % tableSize',
    avgTimeComplexity: 'O(1)',
    worstTimeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function insert(key, value):',
      '  index = hash(key)',
      '  while table[index] is not empty:',
      '    index = (index + 1) % tableSize',
      '  table[index] = (key, value)',
      '',
      '// Probe sequence: h, h+1, h+2, ...',
    ],
  },
  'chaining': {
    name: 'Chaining (Linked Lists)',
    description: 'Handle collisions by storing multiple values in a linked list at each bucket.',
    avgTimeComplexity: 'O(1 + α)',
    worstTimeComplexity: 'O(n)',
    spaceComplexity: 'O(n + m)',
    pseudocode: [
      'function insert(key, value):',
      '  index = hash(key)',
      '  table[index].append((key, value))',
      '',
      'function search(key):',
      '  index = hash(key)',
      '  return table[index].find(key)',
    ],
  },
};
