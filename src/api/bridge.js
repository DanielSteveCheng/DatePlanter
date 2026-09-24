import { createMemoryBridge } from './memoryBridge';

export const bridge = window.dateplanter ?? createMemoryBridge();
