export const STARTUP = {
  minShowMs: 500,
  maxWeatherWaitMs: 2000,
};

export function isStartupReady({ settingsLoaded, gardenLoaded, weatherSettled, elapsedMs }, config = STARTUP) {
  if (!settingsLoaded || !gardenLoaded || elapsedMs < config.minShowMs) return false;
  return weatherSettled || elapsedMs >= config.maxWeatherWaitMs;
}
