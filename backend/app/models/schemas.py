# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class AttendeeSchema(BaseModel):
    id: str
    name: str
    role: str = "Member"
    present: bool = True

class AudioSegmentSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[str] = None
    speaker: str = "Peserta Sidang"
    startTime: Optional[str] = Field(default="00:00:00", alias="start_time")
    endTime: Optional[str] = Field(default="00:00:00", alias="end_time")
    text: str

class TranscribeResponse(BaseModel):
    status: str = "success"
    meeting_id: Optional[str] = None
    duration_seconds: int
    detected_speakers_count: int
    segments: List[AudioSegmentSchema]

class AgendaSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    discussionPoints: List[str] = Field(..., alias="discussion_points")

class DecisionSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str
    number: str
    decisionText: str = Field(..., alias="decision_text")
    rationale: str
    category: str = "Program Kerja"
    status: str = "DISAHKAN"
    date: str

class ActionItemSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str
    description: str
    assignee: str
    dueDate: str = Field(..., alias="due_date")
    status: str = "PENDING"

class SynthesizeRequest(BaseModel):
    meeting_id: Optional[str] = None
    meeting_title: str
    organizer: str = "MPK SMK Negeri 13 Bandung"
    transcript: List[AudioSegmentSchema]
    additional_notes: Optional[str] = None

class SynthesizeResponse(BaseModel):
    status: str = "success"
    meeting_title: str
    executive_summary: str
    agendas: List[AgendaSchema]
    decisions: List[DecisionSchema]
    action_items: List[ActionItemSchema]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    router_gateway: str
    vibevoice_engine: str
