'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { MeetingProvider } from '../context/MeetingContext';
import { AppShell } from './AppShell';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MeetingProvider>
      <AppShell>{children}</AppShell>
    </MeetingProvider>
  );
};
