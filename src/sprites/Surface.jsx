import { customSpriteUrl } from './registry';

export function Surface({ slot, as: Tag = 'div', style, ...props }) {
  const url = customSpriteUrl(slot);
  const textureStyle = url ? { backgroundImage: `url("${url}")`, backgroundSize: '100% 100%' } : undefined;
  return <Tag data-slot={slot} style={{ ...textureStyle, ...style }} {...props} />;
}
