import fs from "fs"
import path from "path"
import type { AppData, VideoItem, Playlist } from "../types"

const CACHE_FILE = path.join(process.cwd(), "server-cache", "youtube-data.json")
const CACHE_TTL = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const CORNELL_LAB_CHANNEL_ID = "UCZXZQxS3d6NpR-eH_gdDwYA"

interface CacheData {
  timestamp: number
  data: AppData
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string }
    snippet: {
      title: string
      thumbnails: { medium: { url: string } }
    }
  }>
}

interface YouTubePlaylistsResponse {
  items: Array<{
    id: string
    snippet: {
      title: string
    }
  }>
}

interface YouTubePlaylistItemsResponse {
  items: Array<{
    snippet: {
      resourceId: { videoId: string }
      title: string
      thumbnails?: { medium: { url: string } }
    }
  }>
}

async function fetchFromYouTube(endpoint: string): Promise<any> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not found, using mock data")
    return getMockData(endpoint)
  }

  const url = `https://www.googleapis.com/youtube/v3/${endpoint}&key=${apiKey}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("YouTube API fetch failed:", error)
    return getMockData(endpoint)
  }
}

function getMockData(endpoint: string): any {
  if (endpoint.includes("search")) {
    return {
      items: [
        {
          id: { videoId: "dQw4w9WgXcQ" },
          snippet: {
            title: "Live Cornell Bird Cam - Red-tailed Hawk",
            thumbnails: { medium: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" } }
          }
        },
        {
          id: { videoId: "jNQXAC9IVRw" },
          snippet: {
            title: "Live Cornell Bird Cam - House Finch",
            thumbnails: { medium: { url: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" } }
          }
        }
      ]
    }
  } else if (endpoint.includes("playlists")) {
    return {
      items: [
        { id: "PLrAXtmRdnEQy8PPaQ6OAz5KWRqkbG3v4x", snippet: { title: "Red-tailed Hawk" } },
        { id: "PLrAXtmRdnEQy8PPaQ6OAz5KWRqkbG3v4y", snippet: { title: "House Finch" } },
        { id: "PLrAXtmRdnEQy8PPaQ6OAz5KWRqkbG3v4z", snippet: { title: "Blue Jay" } }
      ]
    }
  } else if (endpoint.includes("playlistItems")) {
    return {
      items: [
        {
          snippet: {
            resourceId: { videoId: "9bZkp7q19f0" },
            title: "Red-tailed Hawk Nest Cam Highlights",
            thumbnails: { medium: { url: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg" } }
          }
        },
        {
          snippet: {
            resourceId: { videoId: "gCKhktcbfQM" },
            title: "Red-tailed Hawk Feeding",
            thumbnails: { medium: { url: "https://i.ytimg.com/vi/gCKhktcbfQM/mqdefault.jpg" } }
          }
        }
      ]
    }
  }
  return { items: [] }
}

async function fetchLiveStreams(): Promise<VideoItem[]> {
  const endpoint = `search?part=snippet&channelId=${CORNELL_LAB_CHANNEL_ID}&eventType=live&type=video&maxResults=10`
  const data: YouTubeSearchResponse = await fetchFromYouTube(endpoint)

  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url
  }))
}

async function fetchPlaylists(): Promise<Playlist[]> {
  const endpoint = `playlists?part=snippet&channelId=${CORNELL_LAB_CHANNEL_ID}&maxResults=20`
  const data: YouTubePlaylistsResponse = await fetchFromYouTube(endpoint)

  const playlists: Playlist[] = []

  for (const playlist of data.items) {
    const videos = await fetchPlaylistItems(playlist.id)
    playlists.push({
      id: playlist.id,
      title: playlist.snippet.title,
      videos
    })
  }

  return playlists
}

async function fetchPlaylistItems(playlistId: string): Promise<VideoItem[]> {
  const endpoint = `playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`
  const data: YouTubePlaylistItemsResponse = await fetchFromYouTube(endpoint)

  return data.items
    .filter(item => item.snippet.resourceId?.videoId)
    .map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || ""
    }))
}

function readCache(): CacheData | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null
    }

    const cacheContent = fs.readFileSync(CACHE_FILE, "utf-8")
    const cacheData: CacheData = JSON.parse(cacheContent)

    // Check if cache is still valid
    const now = Date.now()
    if (now - cacheData.timestamp > CACHE_TTL) {
      return null
    }

    return cacheData
  } catch (error) {
    console.error("Error reading cache:", error)
    return null
  }
}

function writeCache(data: AppData): void {
  try {
    // Ensure directory exists
    const cacheDir = path.dirname(CACHE_FILE)
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }

    const cacheData: CacheData = {
      timestamp: Date.now(),
      data
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2))
  } catch (error) {
    console.error("Error writing cache:", error)
  }
}

export async function getYouTubeData(): Promise<AppData> {
  // Check cache first
  const cached = readCache()
  if (cached) {
    console.log("Returning cached YouTube data")
    return cached.data
  }

  console.log("Fetching fresh YouTube data")

  try {
    const [liveStreams, playlists] = await Promise.all([
      fetchLiveStreams(),
      fetchPlaylists()
    ])

    const data: AppData = {
      liveStreams,
      playlists
    }

    // Cache the result
    writeCache(data)

    return data
  } catch (error) {
    console.error("Error fetching YouTube data:", error)

    // Return empty data as fallback
    return {
      liveStreams: [],
      playlists: []
    }
  }
}