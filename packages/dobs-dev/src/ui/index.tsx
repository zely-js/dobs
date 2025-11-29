// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '../styles/global.scss';
import { useState } from 'react';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';

export default function App() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <main style={{ padding: '20px', maxWidth: '1000px', margin: '150px auto' }}>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
          <RequestBuilder
            onResponse={setResponse}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <ResponseViewer response={response} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
