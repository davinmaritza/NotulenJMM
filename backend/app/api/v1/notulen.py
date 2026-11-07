# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import re
from fastapi import APIRouter, HTTPException
from app.models.schemas import SynthesizeRequest, SynthesizeResponse
from app.services.router_service import router_service

router = APIRouter()

@router.post(
    "/synthesize",
    response_model=SynthesizeResponse,
    summary="Synthesize Meeting Minutes via 9Router LLM",
)
async def synthesize_notulen(req: SynthesizeRequest):
    """
    Analyzes diarized transcript and generates structured meeting minutes:
    - Executive Summary
    - Agenda breakdown and discussion points
    - Formal Decision Log (id, number, decision text, rationale, category, status)
    - Action Items checklist with assignees and due dates
    """
    if not req.transcript:
        raise HTTPException(status_code=400, detail="Transcript segments cannot be empty.")

    try:
        response = await router_service.synthesize_notulen(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating meeting minutes via 9Router: {str(e)}",
        )

@router.post(
    "/export-markdown",
    summary="Export Meeting Minutes to Standard Formatted Markdown",
)
async def export_markdown(data: SynthesizeResponse):
    """
    Formats structured notulen into official standardized Markdown document
    conforming to MPK SMK Negeri 13 Bandung administrative guidelines.
    """
    lines = []
    lines.append("# RISALAH RESMI SIDANG / RAPAT PLENO")
    lines.append("## MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG")
    lines.append(f"**Topik Pertemuan**: {data.meeting_title}  ")
    lines.append("**Sistem**: NotulenJMM (VibeVoice Diarization & 9Router LLM Engine)  ")
    lines.append("**Lisensi**: MIT License - Davin Maritza & MPK SMK Negeri 13 Bandung  ")
    lines.append("\n---\n")

    lines.append("### 1. Ringkasan Eksekutif")
    lines.append(data.executive_summary)
    lines.append("\n---\n")

    lines.append("### 2. Agenda & Pembahasan")
    for i, agenda in enumerate(data.agendas, 1):
        lines.append(f"#### Agenda {i}: {agenda.title}")
        for pt in agenda.discussionPoints:
            lines.append(f"- {pt}")
        lines.append("")

    lines.append("---\n")
    lines.append("### 3. Lembar Keputusan Resmi (Decision Log)")
    lines.append("| No. Keputusan | Uraian Keputusan | Rasional / Pertimbangan | Kategori | Status |")
    lines.append("| :--- | :--- | :--- | :--- | :--- |")
    for dec in data.decisions:
        lines.append(f"| {dec.number} | {dec.decisionText} | {dec.rationale} | {dec.category} | **{dec.status}** |")

    lines.append("\n---\n")
    lines.append("### 4. Tindak Lanjut & Tanggung Jawab (Action Items)")
    for act in data.action_items:
        check = "[x]" if act.status.upper() in ["DONE", "SELESAI", "COMPLETED"] else "[ ]"
        lines.append(f"- {check} **{act.description}** (PIC: `{act.assignee}` | Deadline: `{act.dueDate}` | Status: `{act.status}`)")

    lines.append("\n---\n")
    lines.append("*Dokumen ini disahkan secara otomatis melalui platform NotulenJMM.*")

    full_md = "\n".join(lines)
    clean_title = re.sub(r"[^\w\s-]", "", data.meeting_title).strip().replace(" ", "_")
    filename = f"Notulen_{clean_title or 'MPK13'}.md"

    return {
        "status": "success",
        "filename": filename,
        "markdown": full_md,
    }
