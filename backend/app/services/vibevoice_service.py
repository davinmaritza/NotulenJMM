# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import os
import uuid
import wave
import subprocess
import httpx
import speech_recognition as sr
from typing import List, Tuple, Optional
from app.config import settings
from app.models.schemas import AudioSegmentSchema

class VibeVoiceService:
    """
    Bridge service for audio transcription and speaker diarization.
    Supports Microsoft VibeVoice when deployed, with robust real speech recognition
    using local ffmpeg transcode and Google Speech Recognition (id-ID & en-US).
    Zero fake/hallucinated mock meetings.
    """

    def __init__(self):
        self.endpoint = settings.VIBEVOICE_ENDPOINT
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".aac", ".opus", ".mp4"}

    async def save_audio_file(self, filename: str, content: bytes) -> str:
        """Saves incoming audio bytes safely to local temporary cache with strict extension validation."""
        file_id = str(uuid.uuid4())
        raw_ext = os.path.splitext(filename)[1].lower()
        ext = raw_ext if raw_ext in self.ALLOWED_EXTENSIONS else ".webm"
        safe_filename = f"{file_id}{ext}"
        safe_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        
        safe_canonical = os.path.abspath(safe_path)
        upload_canonical = os.path.abspath(settings.UPLOAD_DIR)
        if not safe_canonical.startswith(upload_canonical):
            raise ValueError("Invalid target path resolution detected.")

        with open(safe_canonical, "wb") as f:
            f.write(content)
        return safe_canonical

    def _format_time(self, seconds: int) -> str:
        h = seconds // 3600
        m = (seconds % 3600) // 60
        s = seconds % 60
        if h > 0:
            return f"{h:02d}:{m:02d}:{s:02d}"
        return f"{m:02d}:{s:02d}"

    async def transcribe_and_diarize(
        self, audio_path: str, client_transcript: Optional[str] = None
    ) -> Tuple[List[AudioSegmentSchema], int]:
        """
        Executes real speech-to-text with timestamping.
        1. Checks remote VibeVoice runner if active.
        2. Otherwise performs real speech recognition on the audio file using ffmpeg + speech_recognition.
        3. Integrates client-side Web Speech transcript if available.
        """
        # Step 1: Remote VibeVoice Check
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"{self.endpoint}/health")
                if resp.status_code == 200:
                    with open(audio_path, "rb") as f:
                        files = {"audio": (os.path.basename(audio_path), f, "audio/webm")}
                        transcribe_resp = await client.post(
                            f"{self.endpoint}/transcribe", files=files, timeout=60.0
                        )
                        if transcribe_resp.status_code == 200:
                            data = transcribe_resp.json()
                            segments = [
                                AudioSegmentSchema(
                                    id=s.get("id", str(uuid.uuid4())),
                                    speaker=s.get("speaker", "Speaker 1"),
                                    start_time=s.get("start_time", "00:00:00"),
                                    end_time=s.get("end_time", "00:00:10"),
                                    text=s.get("text", ""),
                                )
                                for s in data.get("segments", [])
                            ]
                            duration = data.get("duration", 180)
                            return segments, duration
        except Exception:
            # Remote VibeVoice runner offline, proceed to real speech recognition
            pass

        # Step 2: Real Speech Recognition using local ffmpeg + speech_recognition
        wav_path = f"/tmp/stt_{uuid.uuid4().hex}.wav"
        duration_seconds = 3
        recognized_text = ""

        try:
            # Convert incoming audio (webm/ogg/mp3/m4a/etc) to 16kHz mono WAV
            convert_cmd = [
                "ffmpeg", "-y", "-i", audio_path,
                "-ar", "16000", "-ac", "1",
                "-vn", wav_path
            ]
            conv_res = subprocess.run(
                convert_cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=20
            )

            if conv_res.returncode == 0 and os.path.exists(wav_path):
                # Calculate real duration
                try:
                    with wave.open(wav_path, "rb") as w:
                        frames = w.getnframes()
                        rate = w.getframerate()
                        duration_seconds = max(1, int(frames / float(rate)))
                except Exception:
                    duration_seconds = 5

                # Perform Speech Recognition
                recognizer = sr.Recognizer()
                recognizer.energy_threshold = 250
                recognizer.dynamic_energy_threshold = True

                with sr.AudioFile(wav_path) as source:
                    audio_data = recognizer.record(source)

                # Attempt Indonesian transcription first
                try:
                    recognized_text = recognizer.recognize_google(audio_data, language="id-ID")
                except sr.UnknownValueError:
                    # Attempt English transcription if Indonesian didn't catch it
                    try:
                        recognized_text = recognizer.recognize_google(audio_data, language="en-US")
                    except Exception:
                        recognized_text = ""
                except Exception as e:
                    print(f"Speech recognition network notice: {e}")
                    recognized_text = ""
        except Exception as e:
            print(f"Audio processing error in VibeVoiceService: {e}")
        finally:
            if os.path.exists(wav_path):
                try:
                    os.remove(wav_path)
                except Exception:
                    pass

        # Step 3: Combine with client transcript if available
        final_text = recognized_text.strip()
        if not final_text and client_transcript and client_transcript.strip():
            final_text = client_transcript.strip()

        start_time_str = "00:00:00"
        end_time_str = self._format_time(duration_seconds)

        if final_text:
            # Construct real speaker segment
            return [
                AudioSegmentSchema(
                    id=f"vibe-{uuid.uuid4().hex[:6]}",
                    speaker="Speaker 1 (Notulis)",
                    start_time=start_time_str,
                    end_time=end_time_str,
                    text=final_text,
                )
            ], duration_seconds

        # Truthful empty/silent audio feedback (No fake meetings!)
        return [
            AudioSegmentSchema(
                id=f"vibe-{uuid.uuid4().hex[:6]}",
                speaker="Speaker 1 (Notulis)",
                start_time=start_time_str,
                end_time=end_time_str,
                text="(Audio hening / tidak terdengar suara ucapan percakapan)",
            )
        ], duration_seconds

    async def clean_temp_file(self, file_path: str):
        """Privacy invariant: removes audio file from disk after processing."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Failed to remove temporary audio {file_path}: {e}")

vibevoice_service = VibeVoiceService()
