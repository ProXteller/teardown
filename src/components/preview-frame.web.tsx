import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { HostMessage, PreviewMessage } from '@/lib/playground';

export interface PreviewHandle {
  send: (msg: HostMessage) => void;
}

interface Props {
  html: string;
  onMessage: (msg: PreviewMessage) => void;
}

export const PreviewFrame = forwardRef<PreviewHandle, Props>(function PreviewFrame({ html, onMessage }, ref) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handler = useRef(onMessage);
  handler.current = onMessage;

  useImperativeHandle(ref, () => ({
    send: (msg) => frameRef.current?.contentWindow?.postMessage({ __teardownHost: true, payload: msg }, '*'),
  }));

  useEffect(() => {
    const listen = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow || !e.data?.__teardown) return;
      try {
        handler.current(JSON.parse(e.data.payload) as PreviewMessage);
      } catch {
        // ignore non-bridge messages
      }
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, []);

  return (
    <iframe
      ref={frameRef}
      srcDoc={html}
      sandbox="allow-scripts"
      title="Playground preview"
      style={{ border: 0, width: '100%', height: '100%', background: 'transparent', display: 'block' }}
    />
  );
});
