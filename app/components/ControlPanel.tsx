import type { Mode, Playlist, VideoItem } from "../types"

interface ControlPanelProps {
  mode: Mode
  setMode: (mode: Mode) => void
  playlists: Playlist[]
  liveStreams: VideoItem[]
  selectedPlaylistId: string | null
  setSelectedPlaylistId: (id: string | null) => void
  selectedVideoId: string | null
  setSelectedVideoId: (id: string | null) => void
  selectedStreamId: string | null
  setSelectedStreamId: (id: string | null) => void
  goToVideo: (videoId: string) => void
}

export function ControlPanel({
  mode,
  setMode,
  playlists,
  liveStreams,
  selectedPlaylistId,
  setSelectedPlaylistId,
  selectedVideoId,
  setSelectedVideoId,
  selectedStreamId,
  setSelectedStreamId,
  goToVideo
}: ControlPanelProps) {
  const selectedPlaylist = selectedPlaylistId
    ? playlists.find(p => p.id === selectedPlaylistId)
    : null

  const selectedStream = selectedStreamId
    ? liveStreams.find(s => s.id === selectedStreamId)
    : null

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
  }

  const handlePlaylistChange = (playlistId: string) => {
    setSelectedPlaylistId(playlistId === "" ? null : playlistId)
    setSelectedVideoId(null) // Reset video selection when playlist changes
  }

  const handleVideoChange = (videoId: string) => {
    const newVideoId = videoId === "" ? null : videoId
    setSelectedVideoId(newVideoId)
    if (newVideoId) {
      goToVideo(newVideoId)
    }
  }

  const handleLiveStreamChange = (streamId: string) => {
    const newStreamId = streamId === "" ? null : streamId
    setSelectedStreamId(newStreamId)
    if (newStreamId) {
      goToVideo(newStreamId)
    }
  }

  const clearPlaylistSelection = () => {
    setSelectedPlaylistId(null)
    setSelectedVideoId(null)
  }

  const clearVideoSelection = () => {
    setSelectedVideoId(null)
  }

  const clearStreamSelection = () => {
    setSelectedStreamId(null)
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">Mode</label>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => handleModeChange("live")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "live"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            type="button"
          >
            Live
          </button>
          <button
            onClick={() => handleModeChange("recorded")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "recorded"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            type="button"
          >
            Recorded
          </button>
        </div>
      </div>

      {/* Live Mode Controls */}
      {mode === "live" && (
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Live Streams
            {selectedStreamId && (
              <button
                onClick={clearStreamSelection}
                className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                type="button"
              >
                × Clear
              </button>
            )}
          </label>
          {liveStreams.length > 0 ? (
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStreamId || ""}
              onChange={(e) => handleLiveStreamChange(e.target.value)}
            >
              <option value="">Random Live Streams ({liveStreams.length})</option>
              {liveStreams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.title}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-sm">No live streams available</p>
          )}
        </div>
      )}

      {/* Recorded Mode Controls */}
      {mode === "recorded" && (
        <div className="space-y-4">
          {/* Category/Playlist Dropdown */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Category
              {selectedPlaylistId && (
                <button
                  onClick={clearPlaylistSelection}
                  className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                  type="button"
                >
                  × Clear
                </button>
              )}
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPlaylistId || ""}
              onChange={(e) => handlePlaylistChange(e.target.value)}
            >
              <option value="">All Categories (Random)</option>
              {playlists.map(playlist => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.title} ({playlist.videos.length})
                </option>
              ))}
            </select>
          </div>

          {/* Video Dropdown - Only show if playlist is selected */}
          {selectedPlaylist && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Video
                {selectedVideoId && (
                  <button
                    onClick={clearVideoSelection}
                    className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                    type="button"
                  >
                    × Clear
                  </button>
                )}
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedVideoId || ""}
                onChange={(e) => handleVideoChange(e.target.value)}
              >
                <option value="">All Videos in {selectedPlaylist.title}</option>
                {selectedPlaylist.videos.map(video => (
                  <option key={video.id} value={video.id}>
                    {video.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Current Selection Info */}
      <div className="pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-xs">
          {mode === "live" ? (
            selectedStreamId && selectedStream ? (
              `Showing: ${selectedStream.title}`
            ) : (
              `Showing ${liveStreams.length} live streams (random)`
            )
          ) : selectedVideoId ? (
            "Showing specific video"
          ) : selectedPlaylistId ? (
            `Showing ${selectedPlaylist?.videos.length || 0} videos from ${selectedPlaylist?.title}`
          ) : (
            `Showing random selection from ${playlists.reduce((sum, p) => sum + p.videos.length, 0)} total videos`
          )}
        </p>
      </div>
    </div>
  )
}