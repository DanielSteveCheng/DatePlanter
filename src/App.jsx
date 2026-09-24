import { useReducer, useState } from 'react';
import { AppFrame } from './components/frame/AppFrame';
import { Sky } from './components/sky/Sky';
import { WeatherReadout } from './components/sky/WeatherReadout';
import { Vine } from './components/vine/Vine';
import { DatePanel } from './components/dates/DatePanel';
import { Soil } from './components/soil/Soil';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { useGarden } from './hooks/useGarden';
import { useSettings } from './hooks/useSettings';
import { useWeather } from './hooks/useWeather';
import { CLOSED, selectionReducer } from './lib/selection';
import { createDate, updateDate } from './lib/dates';
import { sceneFor } from './lib/weather';

const today = () => new Date().toLocaleDateString(undefined, { weekday: 'long' });

export default function App() {
  const { settings, updateSettings } = useSettings();
  const garden = useGarden();
  const weather = useWeather(settings?.location, settings?.units);
  const [selection, dispatch] = useReducer(selectionReducer, CLOSED);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!settings) return null;

  const selectedDate = garden.dates.find((date) => date.id === selection.dateId);
  const condition = settings.weatherPreview !== 'live' ? settings.weatherPreview : weather.forecast?.condition;

  async function submitDate(fields) {
    const date = selectedDate && selection.mode === 'edit'
      ? updateDate(selectedDate, fields)
      : createDate(fields, { author: settings.author });
    await garden.saveDate(date);
    dispatch({ type: 'saved', id: date.id });
  }

  async function deleteSelected() {
    if (!selectedDate || !window.confirm(`Pull the "${selectedDate.title}" leaf?`)) return;
    await garden.deleteDate(selectedDate.id);
    dispatch({ type: 'close' });
  }

  async function saveSettings(next) {
    await updateSettings(next);
    setSettingsOpen(false);
  }

  return (
    <AppFrame onOpenSettings={() => setSettingsOpen(true)}>
      <Sky scene={sceneFor(condition)}>
        <WeatherReadout weather={weather} units={settings.units} dayName={today()} />
        <Vine
          dates={garden.dates}
          selectedId={selection.dateId}
          onSelectDate={(id) => dispatch({ type: 'view', id })}
          onSprout={() => dispatch({ type: 'plant' })}
        />
        <DatePanel
          selection={selection}
          date={selectedDate}
          onSubmit={submitDate}
          onEdit={() => dispatch({ type: 'edit' })}
          onDelete={deleteSelected}
          onClose={() => dispatch({ type: 'close' })}
        />
        {garden.error && (
          <p role="alert" className="absolute inset-x-3 bottom-2 z-30 rounded-lg bg-red-800/90 px-2 py-1 text-[10px] text-white">
            {garden.error}
          </p>
        )}
      </Sky>
      <Soil notes={garden.notes} onNotesChange={(notes) => garden.saveNotes(notes).catch(() => {})} onAddDate={() => dispatch({ type: 'plant' })} />
      {settingsOpen && <SettingsPanel settings={settings} onSave={saveSettings} onClose={() => setSettingsOpen(false)} />}
    </AppFrame>
  );
}
