import { useEffect } from 'react';
import { WindowShell } from './components/frame/WindowShell';
import { GardenApp } from './GardenApp';
import { useDevMode } from './hooks/useDevMode';
import { useGarden } from './hooks/useGarden';
import { useInbox } from './hooks/useInbox';
import { useMiniMode } from './hooks/useMiniMode';
import { useSettings } from './hooks/useSettings';
import { useStartup } from './hooks/useStartup';
import { isWeatherSettled, useWeather } from './hooks/useWeather';

export default function App() {
  const { settings, updateSettings } = useSettings();
  const garden = useGarden();
  const weather = useWeather(settings?.location, settings?.units);
  const mini = useMiniMode();
  const dev = useDevMode(settings, updateSettings);
  const inbox = useInbox({ garden, dev, settings });
  const ready = useStartup({
    settingsLoaded: Boolean(settings),
    gardenLoaded: garden.loaded,
    weatherSettled: Boolean(settings) && isWeatherSettled(weather.status),
  });
  const { reveal } = mini;

  useEffect(() => {
    if (ready) reveal();
  }, [ready, reveal]);

  return (
    <WindowShell
      phase={mini.phase}
      pot={mini.pot}
      inbox={inbox}
      onAnimationEnd={mini.finishAnimation}
      onExpand={mini.expand}
    >
      {ready && (
        <GardenApp
          settings={settings}
          updateSettings={updateSettings}
          garden={garden}
          weather={weather}
          dev={dev}
          inbox={inbox}
          onMinimize={mini.collapse}
        />
      )}
    </WindowShell>
  );
}
