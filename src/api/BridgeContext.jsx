import { createContext, useContext } from 'react';
import { bridge as defaultBridge } from './bridge';

const BridgeContext = createContext(defaultBridge);

export const BridgeProvider = BridgeContext.Provider;
export const useBridge = () => useContext(BridgeContext);
