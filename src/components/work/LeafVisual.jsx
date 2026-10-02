import Interactive3DViewer from './Interactive3DViewer';

export default function LeafVisual() {
  return <Interactive3DViewer kind="leaf" title="LEAF" labels={['RUNTIME', 'SERVICES', 'EVENTS', 'STORAGE']} />;
}
