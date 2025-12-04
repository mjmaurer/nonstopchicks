# Implementation Plan: Cornell Bird Cams TV

## 1. Project Overview

A single-page Remix application acting as an immersive "TV Station" for the Cornell Lab Bird Cams. The
app uses react-tv-player to render a full-screen video experience. It aggregates data from the YouTube
Data API, caches it server-side to preserve quotas, and serves it to the client for a seamless viewing
experience.

## 2. Technical Stack & Requirements

- Framework: Remix (SPA mode / Single Route)
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Linting/Formatting: Biome
- Player Library: react-tv-player
- Deployment: Docker
- Data Source: YouTube Data API v3
- Caching:
  - Server Data: File-system JSON cache (TTL: 2 hours)
  - Browser: HTTP Cache-Control headers (TTL: 1 hour)

## 3. Data Architecture

### Backend (Remix Loader)

The loader will act as the data aggregator. To prevent hitting YouTube API limits:

1 Check Cache: Look for a local file server-cache/youtube-data.json.
2 Validate: If the file exists and is younger than 2 hours, parse and return it.
3 Fetch (if stale): - Live Streams: Query search endpoint (channelId=CornellLab, eventType=live, type=video). - Playlists (Categories): Query playlists endpoint (channelId=CornellLab). - Recorded Videos: Query playlistItems for each playlist found.
4 Transform: Sanitize data into a lightweight JSON structure.
5 Save: Write to server-cache/youtube-data.json.
6 Return: Send JSON to the frontend.

### Data Model (JSON Structure)

```typescript
interface AppData {
  liveStreams: VideoItem[];
  playlists: {
    id: string;
    title: string; // e.g., "Red-tailed Hawks"
    videos: VideoItem[];
  }[];
}

interface VideoItem {
  id: string; // YouTube Video ID
  title: string;
  thumbnail: string;
}
```

## 4. Frontend Design

### Layout

- Z-Index 0: react-tv-player taking up 100vw/100vh.
- Z-Index 10: UI Overlay (hidden by default, toggled via a "Menu" button in the player or a floating
  trigger).
- Z-Index 20: Info Modal.

### State Management

- Mode: 'live' | 'recorded'
- Filters: selectedPlaylistId (nullable), selectedVideoId (nullable).
- Playlist Queue: An array of VideoItem derived from the current Mode and Filters.
  - Default Behavior: If no specific video is selected, shuffle the available list and slice 20
    items.
- Player State: Handled internally by react-tv-player (playing, index), but synced with our Queue.

### UI Components

1 Player Wrapper: Configures react-tv-player with custom buttons.
2 Control Panel (Overlay): - Mode Toggle: Switch between Live/Recorded. - Live Dropdown: Visible only in Live mode. - Category Dropdown: Visible in Recorded mode (Source: Playlists). - Video Dropdown: Visible in Recorded mode if Category is selected. - Note: Dropdowns will include an 'X' button to clear selection (resetting to random/all).
3 Info Modal: Simple Tailwind modal with site details.

## 5. Implementation Steps

### Phase 1: Project Initialization

1 Initialize Remix with Vite and TypeScript.
2 Install dependencies: react-tv-player, react-player (peer dep), tailwindcss, @biomejs/biome.
3 Configure Biome (biome.json) for linting/formatting.
4 Setup Tailwind CSS.

### Phase 2: Backend & YouTube Integration

1 Create app/services/youtube.server.ts.
2 Implement fetchLiveStreams(), fetchPlaylists(), and fetchPlaylistItems().
3 Implement getYouTubeData() which orchestrates the fetching and handles the File System Caching
(reading/writing JSON to disk).
4 Create the Loader in app/routes/\_index.tsx: - Call getYouTubeData. - Set Cache-Control: public, max-age=3600 (1 hour). - Return the data.

### Phase 3: Frontend Logic (The "Brain")

1 Define TypeScript interfaces for the data.
2 In \_index.tsx, use useLoaderData.
3 Create a useStationLogic hook to handle: - Filtering data based on Mode (Live vs Recorded). - Handling Dropdown selections. - Generating the "Queue" (Random 20 vs Specific Selection). - Handling "Next/Prev" logic (cycling through the queue).

### Phase 4: UI Implementation

1 Info Modal: Create a simple <Dialog> component.
2 Control Overlay: Build the form with Tailwind. - Implement the Mode Toggle. - Implement <Select> components with a clear ('x') button.
3 Player Integration: - Render <TVPlayer />. - Map the "Queue" to the player's url prop (or mediaList logic if using the player's internal
playlist features, though managing url explicitly via React state is often more robust for custom
filtering). - Inject a "Menu" or "Info" button into customButtons prop to trigger our overlays.

### Phase 5: Docker & Deployment

1 Create Dockerfile. - Base image: node:20-alpine. - Build steps: npm install, npm run build. - Runtime: Expose port 3000, start remix server. - Important: Ensure the server-cache directory exists and is writable in the container.

## 6. File Structure Preview

```
app/
├── components/
│   ├── ControlPanel.tsx    # Dropdowns and Mode toggles
│   ├── InfoModal.tsx       # Site info
│   └── TVWrapper.tsx       # react-tv-player implementation
├── routes/
│   └── _index.tsx          # Main entry, Loader, State orchestration
├── services/
│   └── youtube.server.ts   # API fetching and File Caching logic
├── styles/
│   └── tailwind.css
└── root.tsx
Dockerfile
biome.json
vite.config.ts
```
