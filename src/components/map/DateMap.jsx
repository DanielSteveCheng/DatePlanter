import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_TILES, MAP_VIEW, groupDatesByPlace } from '../../lib/map';
import { formatWhen } from '../../lib/dates';
import { customSpriteUrl } from '../../sprites/registry';
import { PIN_SIZE, PIN_SVG } from './pinArt';

function pinIcon(count) {
  const custom = customSpriteUrl('map-pin');
  const art = custom ? `<img src="${custom}" alt="" />` : PIN_SVG;
  const badge = count > 1 ? `<span class="date-pin-count">${count}</span>` : '';
  return L.divIcon({
    className: 'date-pin',
    html: art + badge,
    iconSize: [PIN_SIZE.width, PIN_SIZE.height],
    iconAnchor: [PIN_SIZE.width / 2, PIN_SIZE.height],
    popupAnchor: [0, -PIN_SIZE.height + 4],
  });
}

function popupContent(pin, onSelectDate) {
  const root = document.createElement('div');
  root.className = 'date-pin-popup';
  const heading = document.createElement('strong');
  heading.textContent = pin.label;
  const list = document.createElement('ul');
  for (const date of pin.dates) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${date.title} · ${formatWhen(date.when)}`;
    button.addEventListener('click', () => onSelectDate(date.id));
    const item = document.createElement('li');
    item.append(button);
    list.append(item);
  }
  root.append(heading, list);
  return root;
}

function frame(map, pins, home) {
  if (pins.length > 1) {
    const padding = [MAP_VIEW.fitPadding, MAP_VIEW.fitPadding];
    map.fitBounds(L.latLngBounds(pins.map((pin) => [pin.latitude, pin.longitude])), { padding });
  } else if (pins.length === 1) {
    map.setView([pins[0].latitude, pins[0].longitude], MAP_VIEW.singlePinZoom);
  } else if (home) {
    map.setView([home.latitude, home.longitude], MAP_VIEW.singlePinZoom - 3);
  } else {
    map.setView(MAP_VIEW.fallbackCenter, MAP_VIEW.fallbackZoom);
  }
}

export function DateMap({ dates, home, onSelectDate }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const selectRef = useRef(onSelectDate);
  selectRef.current = onSelectDate;

  useEffect(() => {
    const map = L.map(containerRef.current);
    L.tileLayer(MAP_TILES.url, {
      attribution: MAP_TILES.attribution,
      maxZoom: MAP_TILES.maxZoom,
    }).addTo(map);
    mapRef.current = map;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const pins = groupDatesByPlace(dates);
    const markers = pins.map((pin) =>
      L.marker([pin.latitude, pin.longitude], { icon: pinIcon(pin.dates.length), title: pin.label }).bindPopup(() =>
        popupContent(pin, (id) => selectRef.current(id)),
      ),
    );
    const layer = L.layerGroup(markers).addTo(map);
    frame(map, pins, home);
    return () => layer.remove();
  }, [dates, home]);

  return <div ref={containerRef} data-slot="map" className="size-full overflow-hidden rounded-xl" />;
}
