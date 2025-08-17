import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/firebase/auth-context';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'AggieStudyLink - Find Your Study Pod',
  description: 'Connect with TAMU students for collaborative study sessions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}