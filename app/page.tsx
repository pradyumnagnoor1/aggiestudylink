
'use client';

import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // User is signed in, redirect to dashboard
        // router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.email?.endsWith('@tamu.edu')) {
        await auth.signOut();
        alert('Only TAMU email addresses are allowed');
        return;
      }
      console.log('Signed in:', result.user.email);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header with user info */}
      {user && (
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Signed in as: {user.email}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '999px',
            marginBottom: '30px',
            fontSize: '14px',
            color: '#c084fc'
          }}>
            ✨ Exclusively for TAMU Students
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(to right, #a855f7, #ec4899, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AggieStudyLink
          </h1>

          <p style={{
            fontSize: '24px',
            color: '#d1d5db',
            marginBottom: '20px'
          }}>
            Find your perfect study pod at Texas A&M
          </p>

          <p style={{
            fontSize: '18px',
            color: '#9ca3af',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Smart matching with fellow Aggies in your courses. Form focused study groups 
            of 2-4 students and ace your classes together.
          </p>

          {!user && (
            <button
              onClick={handleSignIn}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '500',
                background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s',
                boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with TAMU Email
            </button>
          )}

          {user && (
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              marginTop: '20px'
            }}>
              <p style={{ color: '#86efac' }}>
                ✅ You're signed in! Dashboard coming soon...
              </p>
            </div>
          )}

          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '20px'
          }}>
            Only @tamu.edu emails are allowed
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '80px'
        }}>
          {/* Feature Card 1 */}
          <div style={{
            padding: '30px',
            backgroundColor: 'rgba(17, 24, 39, 0.5)',
            border: '1px solid rgba(55, 65, 81, 1)',
            borderRadius: '12px',
            textAlign: 'center',
            transition: 'border-color 0.3s'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              👥
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
              Smart Matching
            </h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              Swipe through potential study partners in your courses. Match based on schedule, 
              study style, and preferred locations.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div style={{
            padding: '30px',
            backgroundColor: 'rgba(17, 24, 39, 0.5)',
            border: '1px solid rgba(55, 65, 81, 1)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              📅
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
              Easy Scheduling
            </h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              Automatically find the best meeting times based on everyone's availability. 
              Export sessions to your calendar.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div style={{
            padding: '30px',
            backgroundColor: 'rgba(17, 24, 39, 0.5)',
            border: '1px solid rgba(55, 65, 81, 1)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              📍
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
              Drop-In Mode
            </h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              Studying now? Toggle Drop-In mode to find classmates currently studying in 
              your building.
            </p>
          </div>
        </div>

        {/* Why Section */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '50px',
            background: 'linear-gradient(to right, #a855f7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why AggieStudyLink?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                📚
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  Course-Specific Matching
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Only see students in your actual classes
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  Instant Notifications
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Get notified when you match or receive invites
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                🛡️
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  Safe & Secure
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  TAMU-only access with privacy controls
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                ✨
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  AI-Powered Suggestions
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Smart icebreakers and study agendas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          borderTop: '1px solid #374151'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
            Ready to boost your GPA?
          </h2>
          <p style={{ fontSize: '20px', color: '#9ca3af', marginBottom: '30px' }}>
            Join hundreds of Aggies forming study pods
          </p>
          {!user && (
            <button
              onClick={handleSignIn}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                border: '2px solid #7c3aed',
                backgroundColor: 'transparent',
                color: '#c084fc',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Get Started Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}