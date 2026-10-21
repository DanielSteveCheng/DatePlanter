import { useBridge } from '../../api/BridgeContext';
import { Sprite } from '../../sprites/Sprite';
import { SPRITE_ANCHORS, SPRITE_SIZES, spriteSize } from '../../sprites/sizes';
import { cn } from '../../lib/cn';
import { usePotGesture } from './usePotGesture';
import { MessageSprout } from '../messages/MessageSprout';
import { LoadingIndicator } from './LoadingIndicator';

const STATE_CLASSES = {
  waiting: 'pointer-events-none animate-bob',
  resting: 'animate-pop',
  leaving: 'pointer-events-none animate-fade-out',
};

const BUBBLE_ROOM_ABOVE = 190;

export function MiniPot({ position, state, inbox, onOpen }) {
  const { window: win } = useBridge();
  const gesture = usePotGesture(win, onOpen);
  const sprout = SPRITE_ANCHORS['message-bud-on-pot'];
  const potHeight = SPRITE_SIZES['mini-pot'].height;
  const roomAbove = position.y - potHeight;
  const sproutY = position.y - potHeight * (1 - sprout.y);

  return (
    <div
      className={cn('absolute -translate-x-1/2 -translate-y-full', STATE_CLASSES[state])}
      style={{ left: position.x, top: position.y, ...spriteSize('mini-pot') }}
      onPointerEnter={() => win.setPotHover(true)}
      onPointerLeave={() => !gesture.isActive() && win.setPotHover(false)}
    >
      {state === 'waiting' && <LoadingIndicator />}
      <button
        type="button"
        aria-label={state === 'waiting' ? 'Loading Date Planter' : 'Open Date Planter'}
        title={state === 'waiting' ? 'Loading…' : 'Open Date Planter'}
        onKeyDown={(event) => event.key === 'Enter' && onOpen()}
        className="block size-full outline-none"
        {...gesture.handlers}
      >
        <Sprite slot="mini-pot" className="size-full transition hover:scale-105 hover:brightness-105" />
      </button>
      {state === 'resting' && (
        <MessageSprout
          inbox={inbox}
          placement={roomAbove < BUBBLE_ROOM_ABOVE ? 'below' : 'above'}
          room={{ up: sproutY, down: window.innerHeight - sproutY }}
          style={{ left: `${sprout.x * 100}%`, top: `${sprout.y * 100}%` }}
        />
      )}
    </div>
  );
}
