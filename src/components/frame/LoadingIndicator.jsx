import { useState } from 'react';
import { Sprite } from '../../sprites/Sprite';
import { SpeechBubble } from '../ui/SpeechBubble';
import { squareSize } from '../../sprites/sizes';
import { pickLoadingMessage } from '../../lib/loadingMessages';

export function LoadingIndicator() {
  const [message] = useState(() => pickLoadingMessage());
  return (
    <span className="absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 flex-col items-center gap-1.5">
      <SpeechBubble slot="loading-message" as="span" className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-bubble font-bold">
        {message}
      </SpeechBubble>
      <Sprite slot="loading-spinner" className="animate-spin" style={squareSize('loading-spinner')} />
    </span>
  );
}
