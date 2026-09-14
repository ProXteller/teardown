import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import type { HostMessage, PreviewMessage } from '@/lib/playground';

export interface PreviewHandle {
  send: (msg: HostMessage) => void;
}

interface Props {
  html: string;
  onMessage: (msg: PreviewMessage) => void;
}

export const PreviewFrame = forwardRef<PreviewHandle, Props>(function PreviewFrame({ html, onMessage }, ref) {
  const webRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    send: (msg) => {
      webRef.current?.injectJavaScript(`window.__teardown && window.__teardown(${JSON.stringify(msg)}); true;`);
    },
  }));

  return (
    <WebView
      ref={webRef}
      originWhitelist={['*']}
      source={{ html }}
      style={styles.web}
      nestedScrollEnabled
      keyboardDisplayRequiresUserAction={false}
      hideKeyboardAccessoryView
      onMessage={(e) => {
        try {
          onMessage(JSON.parse(e.nativeEvent.data) as PreviewMessage);
        } catch {
          // ignore non-bridge messages
        }
      }}
    />
  );
});

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: 'transparent' },
});
