import { useReducer, useState } from 'react';
import { AppFrame } from './components/frame/AppFrame';
import { Sky } from './components/sky/Sky';
import { WeatherReadout } from './components/sky/WeatherReadout';
import { Vine } from './components/vine/Vine';
import { DatePanel } from './components/dates/DatePanel';
import { Soil } from './components/soil/Soil';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { StatsPanel } from './components/stats/StatsPanel';
import { MapPanel } from './components/map/MapPanel';
import { DevToolbar } from './components/dev/DevToolbar';
import { useDevMode } from './hooks/useDevMode';
import { usePlantedDates } from './hooks/usePlantedDates';
import { CLOSED, selectionReducer } from './lib/selection';
import { createDate, updateDate } from './lib/dates';
import { activeCondition, sceneFor } from './lib/weather';

const today = () => new Date().toLocaleDateString(undefined, { weekday: 'long' });

export function GardenApp({ settings, updateSettings, garden, weather, onMinimize }) {
  const [selection, dispatch] = useReducer(selectionReducer, CLOSED);
  const [overlay, setOverlay] = useState(null);
  const dev = useDevMode(settings, updateSettings);
  const planted = usePlantedDates(garden, dev);

  const selectedDate = planted.dates.find((date) => date.id === selection.dateId);
  const condition = activeCondition(settings, weather.forecast);
  const closeOverlay = () => setOverlay(null);

  async function submitDate(fields) {
    const date = selectedDate && selection.mode === 'edit'
      ? updateDate(selectedDate, fields)
      : createDate(fields, { author: settings.author });
    await planted.saveDate(date);
    dispatch({ type: 'saved', id: date.id });
  }

  async function deleteSelected() {
    if (!selectedDate) return;
    await planted.deleteDate(selectedDate.id);
    dispatch({ type: 'close' });
  }

  async function saveSettings(next) {
    await updateSettings(next);
    closeOverlay();
  }

  return (
    <AppFrame
      className={dev.showSlots && 'show-slots'}
      onOpenSettings={() => setOverlay('settings')}
      onMinimize={onMinimize}
    >
      {dev.enabled && (
        <DevToolbar
          weatherPreview={settings.weatherPreview}
          onPreview={dev.preview}
          showSlots={dev.showSlots}
          onToggleSlots={dev.toggleSlots}
          leafCount={dev.dates.length}
          onAddLeaves={dev.addDates}
          onClearLeaves={dev.clearDates}
        />
      )}
      <Sky scene={sceneFor(condition)}>
        <WeatherReadout weather={weather} units={settings.units} dayName={today()} />
        <Vine
          dates={planted.dates}
          selectedId={selection.dateId}
          onSelectDate={(id) => dispatch({ type: 'view', id })}
          onPlant={() => dispatch({ type: 'plant' })}
        />
        <DatePanel
          selection={selection}
          near={settings.location}
          date={selectedDate}
          onSubmit={submitDate}
          onEdit={() => dispatch({ type: 'edit' })}
          onDelete={deleteSelected}
          onClose={() => dispatch({ type: 'close' })}
        />
        {garden.error && (
          <p role="alert" className="absolute inset-x-3 bottom-2 z-30 rounded-lg bg-red-800/90 px-2 py-1 text-label text-white">
            {garden.error}
          </p>
        )}
      </Sky>
      <Soil notes={garden.notes} onNotesChange={(notes) => garden.saveNotes(notes).catch(() => {})} onAddDate={() => dispatch({ type: 'plant' })} />
      {overlay === 'settings' && (
        <SettingsPanel settings={settings} onSave={saveSettings} onClose={closeOverlay} onOpenStats={() => setOverlay('stats')}
          onOpenMap={() => setOverlay('map')}
        />
      )}
      {overlay === 'stats' && <StatsPanel dates={planted.dates} onBack={() => setOverlay('settings')} onClose={closeOverlay} />}
      {overlay === 'map' && (
        <MapPanel
          dates={planted.dates}
          home={settings.location}
          onSelectDate={(id) => {
            closeOverlay();
            dispatch({ type: 'view', id });
          }}
          onBack={() => setOverlay('settings')}
          onClose={closeOverlay}
        />
      )}
    </AppFrame>
  );
}
