export interface VideoItem {
  id: string
  title: string
  thumbnail: string
}

export interface Playlist {
  id: string
  title: string
  videos: VideoItem[]
}

export interface AppData {
  liveStreams: VideoItem[]
  playlists: Playlist[]
}

export type Mode = "live" | "recorded"

export interface StationState {
  mode: Mode
  selectedPlaylistId: string | null
  selectedVideoId: string | null
  queue: VideoItem[]
  currentIndex: number
}