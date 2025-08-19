'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

// TAMU Engineering and Pre-med related majors
const majors = [
  // Engineering Majors
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Engineering',
  'Computer Science',
  'Electrical Engineering',
  'Industrial & Systems Engineering',
  'Materials Science & Engineering',
  'Mechanical Engineering',
  'Nuclear Engineering',
  'Ocean Engineering',
  'Petroleum Engineering',
  
  // Pre-med Common Majors
  'Biology',
  'Biochemistry',
  'Biomedical Sciences',
  'Chemistry',
  'Genetics',
  'Microbiology',
  'Molecular & Cell Biology',
  'Neuroscience',
  'Nutrition',
  'Psychology',
  'Public Health',
  
  // Other Sciences
  'Mathematics',
  'Physics',
  'Statistics',
];

// Course mappings based on TAMU degree plans
const coursesByMajor: Record<string, string[]> = {
  // Computer Science & Computer Engineering (similar courses)
  'Computer Science': [
    'CSCE 121 - Intro to Program Design',
    'CSCE 181 - Intro to Computing',
    'CSCE 221 - Data Structures & Algorithms',
    'CSCE 222 - Discrete Structures',
    'CSCE 312 - Computer Organization',
    'CSCE 313 - Intro to Computer Systems',
    'CSCE 314 - Programming Languages',
    'CSCE 315 - Programming Studio',
    'CSCE 410 - Operating Systems',
    'CSCE 411 - Design & Analysis of Algorithms',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 304 - Linear Algebra',
    'STAT 211 - Statistics',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'ENGR 102 - Engineering Lab I',
  ],
  
  'Computer Engineering': [
    'CSCE 121 - Intro to Program Design',
    'CSCE 221 - Data Structures & Algorithms',
    'CSCE 222 - Discrete Structures',
    'CSCE 312 - Computer Organization',
    'CSCE 313 - Intro to Computer Systems',
    'ECEN 214 - Electrical Circuit Theory',
    'ECEN 215 - Electrical Lab',
    'ECEN 248 - Digital Systems Design',
    'ECEN 350 - Computer Architecture',
    'ECEN 449 - Microprocessor System Design',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'ENGR 102 - Engineering Lab I',
  ],

  // Other Engineering Majors
  'Aerospace Engineering': [
    'AERO 201 - Intro to Aerospace',
    'AERO 202 - Aerospace Lab',
    'AERO 210 - Aerospace Mechanics',
    'AERO 211 - Aerospace Lab II',
    'AERO 302 - Aerodynamics I',
    'AERO 303 - Aerodynamics II',
    'AERO 304 - Aerospace Structures',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 308 - Differential Equations',
    'PHYS 206 - Newtonian Mechanics',
    'ENGR 102 - Engineering Lab I',
    'ENGR 216 - Experimental Physics',
    'ENGR 217 - Experimental Physics Lab',
  ],

  'Biomedical Engineering': [
    'BMEN 201 - Intro to Biomedical Engineering',
    'BMEN 211 - Biomedical Signals & Systems',
    'BMEN 241 - Biomechanics',
    'BMEN 321 - Bioinstrumentation',
    'BMEN 343 - Biomaterials',
    'BMEN 344 - Biological Transport',
    'BIOL 111 - Intro Biology I',
    'BIOL 112 - Intro Biology II',
    'CHEM 107 - General Chemistry',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
  ],

  'Chemical Engineering': [
    'CHEN 204 - Chemical Process Calculations',
    'CHEN 205 - Chemical Process Principles',
    'CHEN 320 - Transport Phenomena',
    'CHEN 324 - Chemical Engineering Thermo',
    'CHEN 354 - Chemical Engineering Lab I',
    'CHEM 107 - General Chemistry',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 308 - Differential Equations',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'ENGR 102 - Engineering Lab I',
  ],

  'Civil Engineering': [
    'CVEN 207 - Civil Engineering Materials',
    'CVEN 221 - Statics & Dynamics',
    'CVEN 301 - Structural Analysis',
    'CVEN 302 - Structural Design',
    'CVEN 305 - Mechanics of Materials',
    'CVEN 311 - Fluid Dynamics',
    'CVEN 322 - Transportation Engineering',
    'CVEN 365 - Geotechnical Engineering',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 308 - Differential Equations',
    'PHYS 206 - Newtonian Mechanics',
    'ENGR 102 - Engineering Lab I',
    'ENGR 214 - Engineering Mechanics',
  ],

  'Electrical Engineering': [
    'ECEN 214 - Electrical Circuit Theory',
    'ECEN 215 - Electrical Lab',
    'ECEN 248 - Digital Systems Design',
    'ECEN 314 - Signals & Systems',
    'ECEN 322 - Electric & Magnetic Fields',
    'ECEN 325 - Electronics',
    'ECEN 350 - Computer Architecture',
    'ECEN 370 - Electronic Properties',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 308 - Differential Equations',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'PHYS 208 - Optics & Modern Physics',
    'ENGR 102 - Engineering Lab I',
  ],

  'Mechanical Engineering': [
    'MEEN 221 - Statics & Particle Dynamics',
    'MEEN 222 - Materials Science',
    'MEEN 225 - Engineering Mechanics',
    'MEEN 315 - Mechanics of Materials',
    'MEEN 344 - Fluid Mechanics',
    'MEEN 345 - Heat Transfer',
    'MEEN 357 - Engineering Analysis',
    'MEEN 360 - Dynamic Systems',
    'MEEN 361 - Design & Analysis',
    'MEEN 363 - Dynamics & Vibrations',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'MATH 251 - Engineering Math III',
    'MATH 308 - Differential Equations',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'ENGR 102 - Engineering Lab I',
  ],

  // Pre-med Track Majors
  'Biology': [
    'BIOL 111 - Intro Biology I',
    'BIOL 112 - Intro Biology II',
    'BIOL 213 - Molecular Cell Biology',
    'BIOL 214 - Genes, Ecology & Evolution',
    'BIOL 319 - Genetics',
    'BIOL 320 - Genetics Lab',
    'BIOL 351 - Fundamentals of Microbiology',
    'CHEM 119 - General Chemistry I',
    'CHEM 120 - General Chemistry II',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'CHEM 237 - Organic Chemistry Lab I',
    'PHYS 201 - College Physics I',
    'PHYS 202 - College Physics II',
    'MATH 142 - Business Calculus',
    'STAT 302 - Statistical Methods',
  ],

  'Biochemistry': [
    'BICH 303 - Elements of Biochemistry',
    'BICH 304 - Elements of Biochemistry II',
    'BICH 410 - Comprehensive Biochemistry I',
    'BICH 411 - Comprehensive Biochemistry II',
    'BICH 440 - Biochemistry Lab',
    'BIOL 111 - Intro Biology I',
    'BIOL 112 - Intro Biology II',
    'CHEM 119 - General Chemistry I',
    'CHEM 120 - General Chemistry II',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'CHEM 237 - Organic Chemistry Lab I',
    'CHEM 238 - Organic Chemistry Lab II',
    'PHYS 201 - College Physics I',
    'PHYS 202 - College Physics II',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
  ],

  'Biomedical Sciences': [
    'BIMS 110 - Intro to Biomedical Sciences',
    'BIMS 120 - Biomedical Terminology',
    'VTMI 305 - Medical Microbiology',
    'VTPB 405 - Biomedical Physiology I',
    'VTPB 406 - Biomedical Physiology II',
    'VIBS 310 - Pathobiology',
    'BIOL 111 - Intro Biology I',
    'BIOL 112 - Intro Biology II',
    'CHEM 119 - General Chemistry I',
    'CHEM 120 - General Chemistry II',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'PHYS 201 - College Physics I',
    'PHYS 202 - College Physics II',
    'MATH 142 - Business Calculus',
    'STAT 302 - Statistical Methods',
  ],

  'Chemistry': [
    'CHEM 119 - General Chemistry I',
    'CHEM 120 - General Chemistry II',
    'CHEM 227 - Organic Chemistry I',
    'CHEM 228 - Organic Chemistry II',
    'CHEM 237 - Organic Chemistry Lab I',
    'CHEM 238 - Organic Chemistry Lab II',
    'CHEM 327 - Physical Chemistry I',
    'CHEM 328 - Physical Chemistry II',
    'CHEM 331 - Inorganic Chemistry',
    'CHEM 345 - Quantitative Analysis',
    'CHEM 470 - Modern Instrumental Analysis',
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'BIOL 111 - Intro Biology I',
  ],

  // Default for other majors
  'default': [
    'MATH 151 - Engineering Math I',
    'MATH 152 - Engineering Math II',
    'PHYS 206 - Newtonian Mechanics',
    'PHYS 207 - Electricity & Magnetism',
    'CHEM 107 - General Chemistry',
    'BIOL 111 - Intro Biology I',
    'ENGR 102 - Engineering Lab I',
    'STAT 211 - Statistics',
  ]
};

export default function Onboarding() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    year: '',
    major: '',
    courses: [] as string[],
  });

  // Load existing profile data when component mounts
  useEffect(() => {
    if (userProfile && !dataLoaded) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        year: userProfile.year || '',
        major: userProfile.major || '',
        courses: userProfile.courses || [],
      });
      setDataLoaded(true);
    }
  }, [userProfile, dataLoaded]);

  // Get courses based on selected major
  const getCoursesForMajor = () => {
    if (!formData.major) return [];
    return coursesByMajor[formData.major] || coursesByMajor['default'];
  };

  const handleMajorChange = (major: string) => {
    setFormData({ 
      ...formData, 
      major, 
      courses: [] // Reset courses when major changes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in');
      return;
    }

    if (!formData.firstName || !formData.year || !formData.major || formData.courses.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName.charAt(0).toUpperCase(), // Just the initial
        year: formData.year,
        major: formData.major,
        courses: formData.courses,
        profileComplete: true,
        updatedAt: new Date()
      });

      toast.success('Profile completed! Let\'s find your study partners!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course)
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course]
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
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
            Complete Your Profile
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '18px' }}>
            Help us match you with the perfect study partners
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(17, 24, 39, 0.5)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
                placeholder="John"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
                Last Name (Optional)
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(17, 24, 39, 0.5)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
              Year *
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              required
            >
              <option value="">Select your year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Major */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
              Major *
            </label>
            <select
              value={formData.major}
              onChange={(e) => handleMajorChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              required
            >
              <option value="">Select your major</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          {/* Courses - Only show if major is selected */}
          {formData.major && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
                Current Courses * (Select all that apply)
              </label>
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: 'rgba(17, 24, 39, 0.3)',
                borderRadius: '8px',
                border: '1px solid #374151'
              }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {getCoursesForMajor().map(course => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: formData.courses.includes(course) 
                          ? 'rgba(139, 92, 246, 0.2)' 
                          : 'transparent',
                        border: formData.courses.includes(course)
                          ? '2px solid rgba(139, 92, 246, 0.5)'
                          : '1px solid #374151',
                        borderRadius: '8px',
                        color: formData.courses.includes(course) ? '#c084fc' : '#9ca3af',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>
              {formData.courses.length > 0 && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '12px', color: '#86efac', marginBottom: '8px' }}>
                    <strong>{formData.courses.length} courses selected:</strong>
                  </p>
                  <p style={{ fontSize: '12px', color: '#86efac' }}>
                    {formData.courses.map(c => c.split(' - ')[0]).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

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
            {loading ? 'Saving...' : 'Complete Profile & Start Matching'}
          </button>
        </form>
      </div>
    </div>
  );
}