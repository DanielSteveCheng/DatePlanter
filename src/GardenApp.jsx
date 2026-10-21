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
import { ComposePanel } from './components/messages/ComposePanel';
import { WhoAreYouPanel } from './components/identity/WhoAreYouPanel';
import { DevToolbar } from './components/dev/DevToolbar';
import { IconButton } from './components/ui/IconButton';
import { usePlantedDates } from './hooks/usePlantedDates';
import { CLOSED, selectionReducer } from './lib/selection';
import { createDate, updateDate, weekdayName } from './lib/dates';
import { activeCondition, sceneFor } from './lib/weather';

export function GardenApp({ settings, updateSettings, garden, weather, dev, identity, inbox, onMinimize }) {
  const [selection, dispatch] = useReducer(selectionReducer, CLOSED);
  const [overlay, setOverlay] = useState(null);
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
    const name = next.author.trim();
    const personChanges = {
      ...(name && name !== settings.author ? { name } : {}),
      ...(next.location !== settings.location ? { location: next.location } : {}),
    };
    if (Object.keys(personChanges).length > 0) await identity.update(personChanges);
    await updateSettings({ ...next, author: name || settings.author });
    closeOverlay();
  }

  function switchPerson() {
    closeOverlay();
    identity.leave();
  }

  return (
    <AppFrame
      className={dev.showSlots && 'show-slots'}
      onOpenSettings={() => setOverlay('settings')}
      onMinimize={onMinimize}
      onOpenMessages={() => setOverlay('compose')}
    >
      {dev.enabled && (
        <DevToolbar dev={dev} weatherPreview={settings.weatherPreview} />
      )}
      <Sky scene={sceneFor(condition)}>
        <WeatherReadout weather={weather} units={settings.units} dayName={weekdayName()} onSetLocation={() => setOverlay('settings')} />
        <Vine
          dates={planted.dates}
          selectedId={selection.dateId}
          onSelectDate={(id) => dispatch({ type: 'view', id })}
          onPlant={() => dispatch({ type: 'plant' })}
          inbox={inbox}
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
          <div role="alert" className="absolute inset-x-3 bottom-2 z-30 flex items-start gap-1 rounded-lg bg-red-800/90 py-1 pl-2 pr-1 text-label text-white">
            <p className="flex-1 py-0.5">{garden.error}</p>
            <IconButton icon="icon-close" label="Dismiss error" onClick={garden.dismissError} className="hover:bg-white/10" />
          </div>
        )}
      </Sky>
      <Soil notes={garden.notes} onNotesChange={(notes) => garden.saveNotes(notes).catch(() => {})} onAddDate={() => dispatch({ type: 'plant' })} />
      {overlay === 'settings' && (
        <SettingsPanel settings={settings} identity={{ ...identity, leave: switchPerson }} onSave={saveSettings} onClose={closeOverlay} onOpenStats={() => setOverlay('stats')}
          onOpenMap={() => setOverlay('map')}
        />
      )}
      {overlay === 'stats' && <StatsPanel dates={planted.dates} onBack={() => setOverlay('settings')} onClose={closeOverlay} />}
      {overlay === 'compose' && (
        <ComposePanel
          conversation={inbox.conversation}
          me={inbox.me}
          recipient={inbox.recipient}
          onSend={inbox.send}
          onDelete={inbox.remove}
          onClose={closeOverlay}
        />
      )}
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
      {identity.needsSetup && !overlay && <WhoAreYouPanel identity={identity} suggestedName={settings.author} />}
    </AppFrame>
  );
}
