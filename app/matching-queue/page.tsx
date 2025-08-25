'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Match {
  id: string;
  users: string[];
  course: string;
  createdAt: any;
  status: string;
}

interface MatchedUser {
  firstName: string;
  lastName: string;
  major: string;
  year: string;
  email: string;
}

export default function MatchingQueue() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<Record<string, MatchedUser>>({});
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        setPreferences(data?.studyPreferences);
        
        if (!data?.studyPreferences) {
          router.push('/preferences');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user, router]);

  // Listen for matches
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'matches'),
      where('users', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const matchList: Match[] = [];
      const userIds = new Set<string>();
      
      snapshot.forEach((doc) => {
        const data = doc.data() as Match;
        matchList.push({ ...data, id: doc.id });
        data.users.forEach(uid => {
          if (uid !== user.uid) userIds.add(uid);
        });
      });
      
      // Fetch matched users' data
      const userData: Record<string, MatchedUser> = {};
      for (const uid of userIds) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          userData[uid] = userDoc.data() as MatchedUser;
        }
      }
      
      setMatches(matchList);
      setMatchedUsers(userData);
    });

    return () => unsubscribe();
  }, [user]);

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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Your Study Matches
            </h1>
            <p style={{ color: '#9ca3af' }}>
              {matches.length > 0 
                ? `You have ${matches.length} potential study partner${matches.length > 1 ? 's' : ''}!`
                : 'Finding your perfect study partners...'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/preferences')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #374151',
                color: '#9ca3af',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Edit Preferences
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #374151',
                color: '#9ca3af',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div style={{
          padding: '30px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s infinite'
            }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
              Actively Searching
            </h2>
          </div>
          
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
            We&apos;re looking for students who match your preferences. You&apos;ll be notified when we find a good match!
          </p>

          {/* Your Preferences Summary */}
          {preferences && (
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                Your Preferences:
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>Courses: </span>
                  <span style={{ fontSize: '14px' }}>
                    {userProfile?.courses?.map(c => c.split(' - ')[0]).join(', ')}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>Locations: </span>
                  <span style={{ fontSize: '14px' }}>
                    {preferences.studyLocations?.join(', ')}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>Study Style: </span>
                  <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>
                    {preferences.studyStyle}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>Group Size: </span>
                  <span style={{ fontSize: '14px' }}>
                    {preferences.groupSize === '2' ? 'Just one partner' : 
                     preferences.groupSize === 'any' ? 'No preference' : 
                     `${preferences.groupSize} people`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Matches Section */}
        {matches.length > 0 ? (
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
              Your Matches
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {matches.map((match) => {
                const otherUserId = match.users.find(id => id !== user?.uid);
                const otherUser = otherUserId ? matchedUsers[otherUserId] : null;
                
                return (
                  <div
                    key={match.id}
                    style={{
                      padding: '24px',
                      backgroundColor: 'rgba(17, 24, 39, 0.5)',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {otherUser?.firstName} {otherUser?.lastName}
                      </h4>
                      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>
                        {otherUser?.year} - {otherUser?.major}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                        Course: {match.course}
                      </p>
                    </div>
                    <button
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Waiting State */
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'rgba(17, 24, 39, 0.3)',
            borderRadius: '16px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-4-4h-1" />
                <circle cx="16" cy="7" r="4" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
              Finding Matches...
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>
              We&apos;re searching for students who match your study preferences. This may take a few minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}