'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, userProfile, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 40px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #a855f7, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AggieStudyLink
        </h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>
            {user.email}
          </span>
          <button
            onClick={signOut}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #ef4444',
              color: '#ef4444',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                Welcome back, {userProfile?.firstName || 'Aggie'}! 👋
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '18px' }}>
                Ready to find your perfect study pod?
              </p>
            </div>
            <button
              onClick={() => router.push('/onboarding')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #374151',
                color: '#9ca3af',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.color = '#a5b4fc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        {userProfile && (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(17, 24, 39, 0.3)',
            border: '1px solid #374151',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Year</p>
              <p style={{ fontSize: '16px', color: '#fff' }}>{userProfile.year || 'Not set'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Major</p>
              <p style={{ fontSize: '16px', color: '#fff' }}>{userProfile.major || 'Not set'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Courses</p>
              <p style={{ fontSize: '16px', color: '#fff' }}>
                {userProfile.courses?.length ? `${userProfile.courses.length} courses` : 'No courses selected'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Start Swiping Card */}
          <div style={{
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Start Matching</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Swipe through potential study partners in your courses
            </p>
          </div>

          {/* View Matches Card */}
          <div style={{
            padding: '30px',
            background: 'rgba(17, 24, 39, 0.5)',
            border: '1px solid #374151',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💬</div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Your Matches</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              View and chat with your matched study partners
            </p>
            <div style={{
              marginTop: '15px',
              padding: '4px 8px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '999px',
              display: 'inline-block',
              fontSize: '12px',
              color: '#86efac'
            }}>
              0 matches
            </div>
          </div>

          {/* Study Pods Card */}
          <div style={{
            padding: '30px',
            background: 'rgba(17, 24, 39, 0.5)',
            border: '1px solid #374151',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>👥</div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Study Pods</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Manage your active study groups
            </p>
            <div style={{
              marginTop: '15px',
              padding: '4px 8px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '999px',
              display: 'inline-block',
              fontSize: '12px',
              color: '#93c5fd'
            }}>
              0 active pods
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div style={{
          padding: '30px',
          background: 'rgba(17, 24, 39, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
            🚀 Coming Soon
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
            We're working hard to bring you amazing features!
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {['Drop-In Mode', 'Calendar Sync', 'Study Stats', 'AI Icebreakers'].map((feature) => (
              <div
                key={feature}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '999px',
                  fontSize: '14px',
                  color: '#c084fc'
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}