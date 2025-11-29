import { useState } from 'react';

interface Header {
  key: string;
  value: string;
}

export default function RequestBuilder({ onResponse, isLoading, setIsLoading }) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);
  const [body, setBody] = useState(
    `{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}`,
  );

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));

  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setIsLoading(true);
    const start = Date.now();

    try {
      const headerObj = Object.fromEntries(
        headers.filter((h) => h.key && h.value).map((h) => [h.key, h.value]),
      );

      const opts: RequestInit = {
        method,
        headers: headerObj,
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
      };

      const res = await fetch(url, opts);
      const end = Date.now();

      const contentType = res.headers.get('content-type');
      const data = contentType?.includes('json') ? await res.json() : await res.text();

      onResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        time: end - start,
      });
    } catch (err: any) {
      onResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: err.message,
        time: Date.now() - start,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const config = JSON.parse(document.getElementById('_config').textContent);

  return (
    <div className="card">
      <div>
        <label>
          URL{' '}
          <span style={{ fontSize: '14px', opacity: 0.7 }}>
            (base : http://localhost:{config.port ?? 3000})
          </span>
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
      </div>

      <h3>Headers</h3>

      {headers.map((h, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <input
            className="input"
            placeholder="key"
            value={h.key}
            onChange={(e) => updateHeader(i, 'key', e.target.value)}
          />
          <input
            className="input"
            placeholder="value"
            value={h.value}
            onChange={(e) => updateHeader(i, 'value', e.target.value)}
          />
          <button className="button" onClick={() => removeHeader(i)}>
            X
          </button>
        </div>
      ))}

      <button className="button" onClick={addHeader}>
        Add Header
      </button>

      <h3>Body</h3>
      <textarea
        className="textarea"
        disabled={method === 'GET' || method === 'HEAD'}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {(method === 'GET' || method === 'HEAD') && (
        <p style={{ fontSize: '12px', opacity: 0.7 }}>
          GET/HEAD requests cannot use a body.
        </p>
      )}

      <button
        className="button"
        disabled={isLoading}
        onClick={sendRequest}
        style={{ width: '100%', marginTop: '15px' }}
      >
        {isLoading ? 'Sending...' : 'Send Request'}
      </button>
    </div>
  );
}
