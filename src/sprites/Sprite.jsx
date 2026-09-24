import { IMAGE_SLOTS, customSpriteUrl } from './registry';
import { cn } from '../lib/cn';

export function Sprite({ slot, className, ...props }) {
  const url = customSpriteUrl(slot);
  if (url) {
    return <img src={url} alt="" draggable={false} data-slot={slot} className={cn('object-contain', className)} {...props} />;
  }
  const DefaultSprite = IMAGE_SLOTS[slot];
  if (!DefaultSprite) throw new Error(`Unknown sprite slot "${slot}"`);
  return <DefaultSprite data-slot={slot} className={className} {...props} />;
}
