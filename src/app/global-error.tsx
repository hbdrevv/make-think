'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h2>App crashed</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
        <button onClick={() => reset()} style={{ marginTop: 12 }}>
          Reload
        </button>
      </body>
    </html>
  )
}
