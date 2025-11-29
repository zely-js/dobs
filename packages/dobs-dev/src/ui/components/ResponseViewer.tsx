export default function ResponseViewer({ response, isLoading }) {
  if (isLoading) {
    return <div className="card">Loading...</div>;
  }

  if (!response) {
    return <div className="card">Waiting for request...</div>;
  }

  return (
    <div className="card">
      <h3>Status</h3>
      <p>
        {response.status} {response.statusText}
      </p>

      <h3>Time</h3>
      <p>{response.time} ms</p>

      <h3>Headers</h3>
      <pre>{JSON.stringify(response.headers, null, 2)}</pre>

      <h3>Body</h3>
      <pre>{JSON.stringify(response.data, null, 2)}</pre>
    </div>
  );
}
