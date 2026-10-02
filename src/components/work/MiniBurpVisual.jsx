import Interactive3DViewer from './Interactive3DViewer';

export default function MiniBurpVisual() {
  return <Interactive3DViewer kind="miniburp" title="MiniBurpSuite" labels={['TUN', 'JNI', 'NATIVE', 'SOCKS5', 'HTTP']} />;
}
