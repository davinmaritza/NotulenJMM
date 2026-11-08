'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { useRouter } from 'next/navigation';
import { CraftStudioView } from '../components/CraftStudioView';
import { useMeetings } from '../context/MeetingContext';

export default function HomePage() {
  const router = useRouter();
  const { handleStartCraftSession } = useMeetings();

  const onStartSession = (session: {
    cardTitle: string;
    cardDescription: string;
    prompt: string;
    engine: string;
    destinationFolder: string;
    activeTab: string;
  }) => {
    handleStartCraftSession(session);
    router.push('/notulen');
  };

  return <CraftStudioView onStartSession={onStartSession} />;
}
