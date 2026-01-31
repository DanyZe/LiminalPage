# SFX playback options

The enter/exit sound effects are fetched successfully (200 OK) but the browser cannot decode them: both Web Audio API and the HTML Audio element fail with "Unable to decode audio data" / "no supported source". This means the MP3 files use a format or codec that the browser’s decoders don’t support.

**Preferred:** Use OGG. The app tries OGG first, then MP3. Add `enter-1.ogg` … `enter-5.ogg` and `exit-1.ogg` … `exit-5.ogg` to `public/sounds/`. **Alternative:** Re-encode the MP3s:

## Option 1: FFmpeg (recommended)

If you have [FFmpeg](https://ffmpeg.org/) installed, run from the project root:

**Backup originals (optional):**
```powershell
Copy-Item -Path "public\sounds\enter-*.mp3" -Destination "public\sounds\backup\"
Copy-Item -Path "public\sounds\exit-*.mp3" -Destination "public\sounds\backup\"
```

**Re-encode enter and exit SFX to standard MP3 (44.1 kHz, 128 kbps CBR, stereo):**
```powershell
cd public/sounds
ffmpeg -i enter-1.mp3 -ar 44100 -b:a 128k -ac 2 enter-1-new.mp3
ffmpeg -i enter-2.mp3 -ar 44100 -b:a 128k -ac 2 enter-2-new.mp3
ffmpeg -i enter-3.mp3 -ar 44100 -b:a 128k -ac 2 enter-3-new.mp3
ffmpeg -i enter-4.mp3 -ar 44100 -b:a 128k -ac 2 enter-4-new.mp3
ffmpeg -i enter-5.mp3 -ar 44100 -b:a 128k -ac 2 enter-5-new.mp3
ffmpeg -i exit-1.mp3 -ar 44100 -b:a 128k -ac 2 exit-1-new.mp3
ffmpeg -i exit-2.mp3 -ar 44100 -b:a 128k -ac 2 exit-2-new.mp3
ffmpeg -i exit-3.mp3 -ar 44100 -b:a 128k -ac 2 exit-3-new.mp3
ffmpeg -i exit-4.mp3 -ar 44100 -b:a 128k -ac 2 exit-4-new.mp3
ffmpeg -i exit-5.mp3 -ar 44100 -b:a 128k -ac 2 exit-5-new.mp3
```

Then replace the originals with the new files (or overwrite by using the same filenames and writing to a temp name first, then moving).

**One-liner to overwrite in place (PowerShell, from `public/sounds`):**
```powershell
foreach ($f in @("enter-1","enter-2","enter-3","enter-4","enter-5","exit-1","exit-2","exit-3","exit-4","exit-5")) {
  ffmpeg -y -i "$f.mp3" -ar 44100 -b:a 128k -ac 2 "$f-tmp.mp3"
  Move-Item -Force "$f-tmp.mp3" "$f.mp3"
}
```

## Option 2: Audacity (or similar)

1. Open each `enter-*.mp3` and `exit-*.mp3` in Audacity.
2. **File → Export → Export as MP3**.
3. Set: **44,100 Hz**, **Stereo**, **128 kbps (CBR)**.
4. Save over the original (or save as new and then replace).

## After re-encoding

Redeploy the site so the new files are served. No code changes are required; the app already requests `/sounds/enter-N.mp3` and `/sounds/exit-N.mp3`.
