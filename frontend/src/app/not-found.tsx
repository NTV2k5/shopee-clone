'use client';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f9f9f9',
          color: '#333',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: '72px', margin: '0 0 10px 0', color: '#ee4d2d' }}>404</h1>
          <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 20px 0', color: '#555' }}>
            Page Not Found / Không tìm thấy trang
          </h2>
          <p style={{ margin: '0 0 30px 0', fontSize: '14px', color: '#888', maxWidth: '400px', textAlign: 'center', lineHeight: 1.5 }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <a href="/" style={{
            padding: '10px 20px',
            backgroundColor: '#ee4d2d',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '14px',
            borderRadius: '4px',
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d34327'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee4d2d'}
          >
            Go to Home / Quay về trang chủ
          </a>
        </div>
      </body>
    </html>
  );
}
