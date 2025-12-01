import { HashBucket, HashStep } from './types';

/**
 * Creates an empty hash table
 */
export function createEmptyTable(size: number = 10): HashBucket[] {
  return Array.from({ length: size }, (_, i) => ({
    index: i,
    values: [],
    state: 'default' as const,
  }));
}

/**
 * Simple hash function (modulo)
 */
export function hashFunction(key: number, tableSize: number): number {
  return key % tableSize;
}

/**
 * Generates random keys to insert
 */
export function generateRandomKeys(count: number = 5): number[] {
  const keys: number[] = [];
  while (keys.length < count) {
    const key = Math.floor(Math.random() * 100) + 1;
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

/**
 * Hash Function demonstration with step tracking
 */
export function demonstrateHashFunction(keys: number[], tableSize: number = 10): HashStep[] {
  const steps: HashStep[] = [];
  const buckets = createEmptyTable(tableSize);

  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values] })),
    tableSize,
    explanation: `Hash Table initialized with ${tableSize} buckets. Using hash(key) = key % ${tableSize}`,
    highlightCode: [0, 1],
  });

  for (const key of keys) {
    const hashValue = hashFunction(key, tableSize);

    // Show hashing calculation
    steps.push({
      buckets: buckets.map((b, i) => ({
        ...b,
        values: [...b.values],
        state: i === hashValue ? 'hashing' as const : b.state,
      })),
      tableSize,
      currentKey: key,
      hashValue,
      explanation: `Hashing key ${key}: hash(${key}) = ${key} % ${tableSize} = ${hashValue}`,
      highlightCode: [1],
    });

    // Check for collision
    const hasCollision = buckets[hashValue].values.length > 0;

    if (hasCollision) {
      steps.push({
        buckets: buckets.map((b, i) => ({
          ...b,
          values: [...b.values],
          state: i === hashValue ? 'collision' as const : b.state,
        })),
        tableSize,
        currentKey: key,
        hashValue,
        explanation: `⚠️ Collision detected at index ${hashValue}! Bucket already has ${buckets[hashValue].values.length} item(s).`,
        highlightCode: [4],
      });
    }

    // Insert
    buckets[hashValue].values.push({ key, value: `V${key}` });
    buckets[hashValue].state = 'inserted';

    steps.push({
      buckets: buckets.map(b => ({ ...b, values: [...b.values], state: b.state })),
      tableSize,
      currentKey: key,
      hashValue,
      explanation: `Inserted (${key}, V${key}) at index ${hashValue}`,
      highlightCode: [4, 5],
    });

    // Reset state
    buckets[hashValue].state = 'default';
  }

  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values], state: 'default' as const })),
    tableSize,
    explanation: `All keys inserted! Load factor: ${keys.length}/${tableSize} = ${(keys.length / tableSize).toFixed(2)}`,
  });

  return steps;
}

/**
 * Linear Probing with step tracking
 */
export function linearProbing(keys: number[], tableSize: number = 10): HashStep[] {
  const steps: HashStep[] = [];
  const buckets = createEmptyTable(tableSize);
  // For linear probing, only one value per bucket
  const table: (number | null)[] = Array(tableSize).fill(null);

  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values] })),
    tableSize,
    explanation: `Hash Table initialized with ${tableSize} buckets. Using Linear Probing for collision resolution.`,
    highlightCode: [0],
  });

  for (const key of keys) {
    const hashValue = hashFunction(key, tableSize);
    let probeIndex = hashValue;
    let probeCount = 0;

    steps.push({
      buckets: buckets.map((b, i) => ({
        ...b,
        values: [...b.values],
        state: i === hashValue ? 'hashing' as const : 'default' as const,
      })),
      tableSize,
      currentKey: key,
      hashValue,
      probeIndex,
      probeCount: 0,
      explanation: `Hashing key ${key}: hash(${key}) = ${hashValue}`,
      highlightCode: [1],
    });

    // Probe for empty slot
    while (table[probeIndex] !== null && probeCount < tableSize) {
      steps.push({
        buckets: buckets.map((b, i) => ({
          ...b,
          values: [...b.values],
          state: i === probeIndex ? 'collision' as const : 
                 i === hashValue ? 'hashing' as const : 'default' as const,
        })),
        tableSize,
        currentKey: key,
        hashValue,
        probeIndex,
        probeCount,
        explanation: `Collision at index ${probeIndex}! Probing next slot...`,
        highlightCode: [2, 3],
      });

      probeIndex = (probeIndex + 1) % tableSize;
      probeCount++;

      steps.push({
        buckets: buckets.map((b, i) => ({
          ...b,
          values: [...b.values],
          state: i === probeIndex ? 'probing' as const : 'default' as const,
        })),
        tableSize,
        currentKey: key,
        hashValue,
        probeIndex,
        probeCount,
        explanation: `Probing index ${probeIndex} (probe #${probeCount})`,
        highlightCode: [3],
      });
    }

    if (probeCount >= tableSize) {
      steps.push({
        buckets: buckets.map(b => ({ ...b, values: [...b.values] })),
        tableSize,
        currentKey: key,
        explanation: `❌ Table is full! Cannot insert key ${key}`,
      });
      continue;
    }

    // Insert at probed position
    table[probeIndex] = key;
    buckets[probeIndex].values = [{ key, value: `V${key}` }];
    buckets[probeIndex].state = 'inserted';

    steps.push({
      buckets: buckets.map(b => ({ ...b, values: [...b.values], state: b.state })),
      tableSize,
      currentKey: key,
      hashValue,
      probeIndex,
      probeCount,
      explanation: probeCount > 0 
        ? `Inserted (${key}, V${key}) at index ${probeIndex} after ${probeCount} probe(s)`
        : `Inserted (${key}, V${key}) at index ${probeIndex} (no collision)`,
      highlightCode: [4],
    });

    // Reset state
    buckets[probeIndex].state = 'default';
  }

  const filledSlots = table.filter(t => t !== null).length;
  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values], state: 'default' as const })),
    tableSize,
    explanation: `All keys inserted! Load factor: ${filledSlots}/${tableSize} = ${(filledSlots / tableSize).toFixed(2)}`,
  });

  return steps;
}

/**
 * Chaining with step tracking
 */
export function chaining(keys: number[], tableSize: number = 7): HashStep[] {
  const steps: HashStep[] = [];
  const buckets = createEmptyTable(tableSize);

  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values] })),
    tableSize,
    explanation: `Hash Table initialized with ${tableSize} buckets. Using Chaining (Linked Lists) for collision resolution.`,
    highlightCode: [0],
  });

  for (const key of keys) {
    const hashValue = hashFunction(key, tableSize);

    steps.push({
      buckets: buckets.map((b, i) => ({
        ...b,
        values: [...b.values],
        state: i === hashValue ? 'hashing' as const : 'default' as const,
      })),
      tableSize,
      currentKey: key,
      hashValue,
      explanation: `Hashing key ${key}: hash(${key}) = ${key} % ${tableSize} = ${hashValue}`,
      highlightCode: [1],
    });

    const hasCollision = buckets[hashValue].values.length > 0;

    if (hasCollision) {
      steps.push({
        buckets: buckets.map((b, i) => ({
          ...b,
          values: [...b.values],
          state: i === hashValue ? 'collision' as const : 'default' as const,
        })),
        tableSize,
        currentKey: key,
        hashValue,
        explanation: `Collision at index ${hashValue}! Chain has ${buckets[hashValue].values.length} item(s). Appending to chain...`,
        highlightCode: [2],
      });
    }

    // Append to chain
    buckets[hashValue].values.push({ key, value: `V${key}` });
    buckets[hashValue].state = 'inserted';

    steps.push({
      buckets: buckets.map(b => ({ ...b, values: [...b.values], state: b.state })),
      tableSize,
      currentKey: key,
      hashValue,
      explanation: hasCollision
        ? `Appended (${key}, V${key}) to chain at index ${hashValue}. Chain length: ${buckets[hashValue].values.length}`
        : `Inserted (${key}, V${key}) at index ${hashValue}`,
      highlightCode: [2],
    });

    // Reset state
    buckets[hashValue].state = 'default';
  }

  const totalItems = buckets.reduce((sum, b) => sum + b.values.length, 0);
  const maxChainLength = Math.max(...buckets.map(b => b.values.length));
  
  steps.push({
    buckets: buckets.map(b => ({ ...b, values: [...b.values], state: 'default' as const })),
    tableSize,
    explanation: `All keys inserted! Total items: ${totalItems}, Max chain length: ${maxChainLength}, Avg chain length: ${(totalItems / tableSize).toFixed(2)}`,
  });

  return steps;
}
