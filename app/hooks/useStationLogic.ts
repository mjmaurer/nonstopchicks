import { useState, useEffect, useCallback, useMemo } from "react"
import type { AppData, Mode, VideoItem } from "../types"

export function useStationLogic(data: AppData) {
  const [mode, setMode] = useState<Mode>("live")
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Generate queue based on current state
  const queue = useMemo((): VideoItem[] => {
    if (mode === "live") {
      // Return live streams, shuffled and limited to 20
      const shuffled = [...data.liveStreams].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 20)
    } else {
      // Recorded mode
      if (selectedVideoId) {
        // Find specific video across all playlists
        for (const playlist of data.playlists) {
          const video = playlist.videos.find(v => v.id === selectedVideoId)
          if (video) return [video]
        }
        return []
      } else if (selectedPlaylistId) {
        // Return videos from selected playlist
        const playlist = data.playlists.find(p => p.id === selectedPlaylistId)
        return playlist?.videos || []
      } else {
        // Return random videos from all playlists, limited to 20
        const allVideos = data.playlists.flatMap(p => p.videos)
        const shuffled = [...allVideos].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 20)
      }
    }
  }, [mode, selectedPlaylistId, selectedVideoId, data])

  // Reset index when queue changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [queue])

  // Reset selections when mode changes
  useEffect(() => {
    setSelectedPlaylistId(null)
    setSelectedVideoId(null)
  }, [mode])

  const handleNext = useCallback(() => {
    if (queue.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % queue.length)
  }, [queue.length])

  const handlePrevious = useCallback(() => {
    if (queue.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length)
  }, [queue.length])

  const goToVideo = useCallback((videoId: string) => {
    const index = queue.findIndex(v => v.id === videoId)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [queue])

  const clearPlaylistSelection = useCallback(() => {
    setSelectedPlaylistId(null)
  }, [])

  const clearVideoSelection = useCallback(() => {
    setSelectedVideoId(null)
  }, [])

  return {
    mode,
    setMode,
    selectedPlaylistId,
    setSelectedPlaylistId,
    selectedVideoId,
    setSelectedVideoId,
    queue,
    currentIndex,
    handleNext,
    handlePrevious,
    goToVideo,
    clearPlaylistSelection,
    clearVideoSelection
  }
}