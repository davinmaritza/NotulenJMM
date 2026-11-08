'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { useRouter } from 'next/navigation';
import { AudioRecorderStudio } from '../../components/AudioRecorderStudio';
import { useMeetings } from '../../context/MeetingContext';
import { AudioSegment } from '../../lib/types';

export default function RecordPage() {
  const router = useRouter();
  const { handleDiarizationComplete, handleSaveDraft } = useMeetings();

  const onDiarizationComplete = async (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string,
    audioUrl?: string
  ) => {
    await handleDiarizationComplete(segments, duration, meetingTitle, secretaryNotes, audioUrl);
    router.push('/notulen');
  };

  const onSaveDraft = (draft: {
    title: string;
    secretaryNotes: string;
    durationSeconds: number;
    audioBlob?: Blob | null;
    audioUrl?: string | null;
  }) => {
    handleSaveDraft(draft);
    router.push('/notulen');
  };

  return (
    <div className="space-y-6">
      <AudioRecorderStudio
        onDiarizationComplete={onDiarizationComplete}
        onSaveDraft={onSaveDraft}
      />
    </div>
  );
}
