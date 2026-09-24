const unitSymbol = (units) => (units === 'celsius' ? '°C' : '°F');

export function WeatherReadout({ weather, units, dayName }) {
  const { status, forecast } = weather;
  return (
    <div data-slot="weather-readout" className="absolute left-4 top-20 text-sky-text drop-shadow-sm">
      <p className="text-lg font-semibold leading-tight">{forecast?.dayName ?? dayName}</p>
      {forecast ? (
        <>
          <p className="text-base leading-tight">High: {forecast.high}{unitSymbol(units)}</p>
          <p className="text-base leading-tight">Low: {forecast.low}{unitSymbol(units)}</p>
        </>
      ) : (
        <p className="max-w-32 text-xs leading-tight opacity-90">
          {status === 'no-location' ? 'Set your location in ⚙ to see the weather' : status === 'error' ? 'Weather unavailable' : 'Checking the sky…'}
        </p>
      )}
    </div>
  );
}
