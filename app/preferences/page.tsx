'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

const studyLocations = [
  'Evans Library',
  'Annex Library',
  'Medical Sciences Library (MSL)',
  'Zachry Engineering Building',
  'Memorial Student Center (MSC)',
  'Commons',
  'Blocker Building',
  'Home/Apartment',
  'Coffee Shop',
  'Other'
];

const studyStyles = [
  { value: 'silent', label: 'Silent Study', description: 'Complete quiet, focused individual work' },
  { value: 'quiet', label: 'Quiet Collaboration', description: 'Occasional discussion, mostly independent' },
  { value: 'active', label: 'Active Discussion', description: 'Regular discussion, problem-solving together' },
  { value: 'teaching', label: 'Peer Teaching', description: 'Taking turns explaining concepts' }
];

const timeSlots = [
  'Early Morning (6am-9am)',
  'Morning (9am-12pm)',
  'Afternoon (12pm-3pm)',
  'Late Afternoon (3pm-6pm)',
  'Evening (6pm-9pm)',
  'Night (9pm-12am)',
  'Late Night (12am-3am)'
];

const groupSizes = [
  { value: '2', label: 'Just one partner' },
  { value: '3-4', label: 'Small group (3-4)' },
  { value: '5+', label: 'Larger group (5+)' },
  { value: 'any', label: 'No preference' }
];

export default function StudyPreferences() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingPrefs, setExistingPrefs] = useState(false);
  
  const [preferences, setPreferences] = useState({
    studyLocations: [] as string[],
    studyStyle: '',
    preferredTimes: {
      monday: [] as string[],
      tuesday: [] as string[],
      wednesday: [] as string[],
      thursday: [] as string[],
      friday: [] as string[],
      saturday: [] as string[],
      sunday: [] as string[]
    },
    groupSize: '',
    goals: '',
    lookingFor: [] as string[],
    additionalNotes: ''
  });

  // Load existing preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        
        if (data?.studyPreferences) {
          setPreferences(data.studyPreferences);
          setExistingPrefs(true);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    
    loadPreferences();
  }, [user]);

  const handleTimeToggle = (day: string, time: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTimes: {
        ...prev.preferredTimes,
        [day]: prev.preferredTimes[day as keyof typeof prev.preferredTimes].includes(time)
          ? prev.preferredTimes[day as keyof typeof prev.preferredTimes].filter(t => t !== time)
          : [...prev.preferredTimes[day as keyof typeof prev.preferredTimes], time]
      }
    }));
  };

  const handleLocationToggle = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      studyLocations: prev.studyLocations.includes(location)
        ? prev.studyLocations.filter(l => l !== location)
        : [...prev.studyLocations, location]
    }));
  };

  const handleLookingForToggle = (item: string) => {
    setPreferences(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(item)
        ? prev.lookingFor.filter(i => i !== item)
        : [...prev.lookingFor, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in');
      return;
    }

    // Validate required fields
    if (preferences.studyLocations.length === 0 || !preferences.studyStyle || !preferences.groupSize) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if at least one time slot is selected
    const hasTimeSlots = Object.values(preferences.preferredTimes).some(times => times.length > 0);
    if (!hasTimeSlots) {
      toast.error('Please select at least one preferred study time');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        studyPreferences: preferences,
        preferencesComplete: true,
        updatedAt: new Date()
      });

      await refreshUserProfile();
      toast.success(existingPrefs ? 'Preferences updated!' : 'Preferences saved! We\'ll notify you when we find a match.');
      router.push('/matching-queue');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(to right, #a855f7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Study Preferences
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '18px' }}>
            Help us find your perfect study match
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Study Locations */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
              Preferred Study Locations *
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '16px',
              backgroundColor: 'rgba(17, 24, 39, 0.3)',
              borderRadius: '8px',
              border: '1px solid #374151'
            }}>
              {studyLocations.map(location => (
                <button
                  key={location}
                  type="button"
                  onClick={() => handleLocationToggle(location)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: preferences.studyLocations.includes(location)
                      ? 'rgba(139, 92, 246, 0.2)'
                      : 'transparent',
                    border: preferences.studyLocations.includes(location)
                      ? '2px solid rgba(139, 92, 246, 0.5)'
                      : '1px solid #374151',
                    borderRadius: '8px',
                    color: preferences.studyLocations.includes(location) ? '#c084fc' : '#9ca3af',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Study Style */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
              Study Style *
            </label>
            <div style={{ display: 'grid', gap: '12px' }}>
              {studyStyles.map(style => (
                <label
                  key={style.value}
                  style={{
                    padding: '16px',
                    backgroundColor: preferences.studyStyle === style.value
                      ? 'rgba(139, 92, 246, 0.1)'
                      : 'rgba(17, 24, 39, 0.3)',
                    border: preferences.studyStyle === style.value
                      ? '2px solid rgba(139, 92, 246, 0.5)'
                      : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="studyStyle"
                    value={style.value}
                    checked={preferences.studyStyle === style.value}
                    onChange={(e) => setPreferences({ ...preferences, studyStyle: e.target.value })}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{style.label}</div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>{style.description}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Times */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
              Preferred Study Times * (Select all that apply)
            </label>
            <div style={{
              backgroundColor: 'rgba(17, 24, 39, 0.3)',
              borderRadius: '8px',
              border: '1px solid #374151',
              overflow: 'hidden'
            }}>
              {Object.keys(preferences.preferredTimes).map((day) => (
                <div key={day} style={{
                  padding: '16px',
                  borderBottom: day !== 'sunday' ? '1px solid #374151' : 'none'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {day}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeToggle(day, time)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: preferences.preferredTimes[day as keyof typeof preferences.preferredTimes].includes(time)
                            ? 'rgba(139, 92, 246, 0.2)'
                            : 'transparent',
                          border: preferences.preferredTimes[day as keyof typeof preferences.preferredTimes].includes(time)
                            ? '1px solid rgba(139, 92, 246, 0.5)'
                            : '1px solid #4b5563',
                          borderRadius: '6px',
                          color: preferences.preferredTimes[day as keyof typeof preferences.preferredTimes].includes(time)
                            ? '#c084fc'
                            : '#9ca3af',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
              Preferred Group Size *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {groupSizes.map(size => (
                <label
                  key={size.value}
                  style={{
                    padding: '16px',
                    backgroundColor: preferences.groupSize === size.value
                      ? 'rgba(139, 92, 246, 0.1)'
                      : 'rgba(17, 24, 39, 0.3)',
                    border: preferences.groupSize === size.value
                      ? '2px solid rgba(139, 92, 246, 0.5)'
                      : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="groupSize"
                    value={size.value}
                    checked={preferences.groupSize === size.value}
                    onChange={(e) => setPreferences({ ...preferences, groupSize: e.target.value })}
                    style={{ display: 'none' }}
                  />
                  {size.label}
                </label>
              ))}
            </div>
          </div>

          {/* What are you looking for */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
              What are you looking for? (Select all that apply)
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {[
                'Homework Help',
                'Exam Preparation',
                'Project Collaboration',
                'Concept Review',
                'Problem Sets',
                'Lab Partners',
                'General Study Buddy',
                'Accountability Partner'
              ].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleLookingForToggle(item)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: preferences.lookingFor.includes(item)
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'transparent',
                    border: preferences.lookingFor.includes(item)
                      ? '2px solid rgba(34, 197, 94, 0.3)'
                      : '1px solid #374151',
                    borderRadius: '8px',
                    color: preferences.lookingFor.includes(item) ? '#86efac' : '#9ca3af',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Study Goals */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
              Study Goals (Optional)
            </label>
            <textarea
              value={preferences.goals}
              onChange={(e) => setPreferences({ ...preferences, goals: e.target.value })}
              placeholder="What are your academic goals this semester? What grade are you aiming for?"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={preferences.additionalNotes}
              onChange={(e) => setPreferences({ ...preferences, additionalNotes: e.target.value })}
              placeholder="Anything else you'd like potential study partners to know?"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              background: loading
                ? 'rgba(107, 114, 128, 0.5)'
                : 'linear-gradient(to right, #7c3aed, #2563eb)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? 'Saving...' : (existingPrefs ? 'Update Preferences' : 'Save & Find Matches')}
          </button>
        </form>
      </div>
    </div>
  );
}