'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Calendar, MapPin, Sparkles, BookOpen, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Exclusively for TAMU Students</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AggieStudyLink
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Find your perfect study pod at Texas A&M
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Smart matching with fellow Aggies in your courses. Form focused study groups 
              of 2-4 students and ace your classes together.
            </p>
            
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with TAMU Email
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Only @tamu.edu emails are allowed
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-gray-900/50 backdrop-blur border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Matching</h3>
              <p className="text-gray-400">
                Swipe through potential study partners in your courses. Match based on schedule, 
                study style, and preferred locations.
              </p>
            </Card>

            <Card className="p-6 bg-gray-900/50 backdrop-blur border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Easy Scheduling</h3>
              <p className="text-gray-400">
                Automatically find the best meeting times based on everyone's availability. 
                Export sessions to your calendar.
              </p>
            </Card>

            <Card className="p-6 bg-gray-900/50 backdrop-blur border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Drop-In Mode</h3>
              <p className="text-gray-400">
                Studying now? Toggle Drop-In mode to find classmates currently studying in 
                your building.
              </p>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Why AggieStudyLink?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-purple-500/10 p-3 mt-1">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Course-Specific Matching</h3>
                  <p className="text-gray-400 text-sm">Only see students in your actual classes</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-purple-500/10 p-3 mt-1">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Instant Notifications</h3>
                  <p className="text-gray-400 text-sm">Get notified when you match or receive invites</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-purple-500/10 p-3 mt-1">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Safe & Secure</h3>
                  <p className="text-gray-400 text-sm">TAMU-only access with privacy controls</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="rounded-lg bg-purple-500/10 p-3 mt-1">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">AI-Powered Suggestions</h3>
                  <p className="text-gray-400 text-sm">Smart icebreakers and study agendas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-gray-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your GPA?</h2>
            <p className="text-xl mb-8 text-gray-400">
              Join hundreds of Aggies forming study pods
            </p>
            <Button
              onClick={signInWithGoogle}
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}