'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../../context/MeetingContext';
import { GoogleAuthGate } from '../../components/GoogleAuthGate';

export default function LoginPage() {
  const router = useRouter();
  const { googleAccount, isHydrated } = useMeetings();

  useEffect(() => {
    // If user is already logged in with Google, redirect straight to workspace
    if (isHydrated && googleAccount.connected && googleAccount.email) {
      router.replace('/');
    }
  }, [isHydrated, googleAccount, router]);

  return <GoogleAuthGate />;
}
