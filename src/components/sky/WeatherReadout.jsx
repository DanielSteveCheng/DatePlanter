const unitSymbol = (units) => (units === 'celsius' ? '°C' : '°F');

const hintButton = 'pointer-events-auto mt-0.5 rounded-md bg-white/20 px-1.5 py-0.5 text-left font-semibold hover:bg-white/30';

function WeatherHint({ weather, onSetLocation }) {
  if (weather.status === 'no-location') {
    return (
      <button type="button" onClick={onSetLocation} className={hintButton}>
        Set your location to see the weather
      </button>
    );
  }
  if (weather.status === 'error') {
    return (
      <>
        <span className="block" title={weather.error ?? undefined}>
          Weather unavailable
        </span>
        <button type="button" onClick={weather.retry} className={hintButton}>
          Retry
        </button>
      </>
    );
  }
  return 'Checking the sky…';
}

export function WeatherReadout({ weather, units, dayName, onSetLocation }) {
  const { forecast } = weather;
  return (
    <div data-slot="weather-readout" className="absolute left-4 top-20 text-sky-text drop-shadow-sm">
      <p className="text-day font-semibold">{forecast?.dayName ?? dayName}</p>
      {forecast ? (
        <>
          <p className="text-temp">
            High: {forecast.high}
            {unitSymbol(units)}
          </p>
          <p className="text-temp">
            Low: {forecast.low}
            {unitSymbol(units)}
          </p>
        </>
      ) : (
        <div className="max-w-36 text-sky-hint opacity-90">
          <WeatherHint weather={weather} onSetLocation={onSetLocation} />
        </div>
      )}
    </div>
  );
}
