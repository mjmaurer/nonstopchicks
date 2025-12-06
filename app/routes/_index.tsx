import type { Route } from "./+types/_index"
import { useLoaderData } from "react-router"
import { getYouTubeData } from "../services/youtube.server"
import type { AppData } from "../types"
import { useState } from "react"
import { TVWrapper } from "../components/TVWrapper"
import { ControlPanel } from "../components/ControlPanel"
import { InfoModal } from "../components/InfoModal"
import { useStationLogic } from "../hooks/useStationLogic"

export async function loader(): Promise<AppData> {
  const data = await getYouTubeData()
  return data
}

export default function Index({ }: Route.ComponentProps) {
  const data = useLoaderData<AppData>()
  const [showControls, setShowControls] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const {
    mode,
    setMode,
    selectedPlaylistId,
    setSelectedPlaylistId,
    selectedVideoId,
    setSelectedVideoId,
    selectedStreamId,
    setSelectedStreamId,
    queue,
    currentIndex,
    handleNext,
    handlePrevious,
    goToVideo
  } = useStationLogic(data)

  const currentVideo = queue[currentIndex]
  const currentVideoUrl = currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.id}` : ""

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* TV Player - Z-Index 0 */}
      <div className="absolute inset-0">
        <TVWrapper
          url={currentVideoUrl}
          title={currentVideo?.title}
          mediaCount={queue.length}
          mediaIndex={currentIndex}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onMenuPress={() => setShowControls(!showControls)}
          onInfoPress={() => setShowInfo(true)}
        />
      </div>

      {/* Control Overlay - Z-Index 10 */}
      {showControls && (
        <div className="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 bg-opacity-95 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-semibold">Cornell Bird Cams TV</h2>
              <button
                onClick={() => setShowControls(false)}
                className="text-white hover:text-gray-300 text-2xl leading-none"
                type="button"
              >
                ×
              </button>
            </div>

            <ControlPanel
              mode={mode}
              setMode={setMode}
              playlists={data.playlists}
              liveStreams={data.liveStreams}
              selectedPlaylistId={selectedPlaylistId}
              setSelectedPlaylistId={setSelectedPlaylistId}
              selectedVideoId={selectedVideoId}
              setSelectedVideoId={setSelectedVideoId}
              selectedStreamId={selectedStreamId}
              setSelectedStreamId={setSelectedStreamId}
              goToVideo={goToVideo}
            />
          </div>
        </div>
      )}

      {/* Info Modal - Z-Index 20 */}
      {showInfo && (
        <InfoModal onClose={() => setShowInfo(false)} />
      )}
    </div>
  )
}

export { type Route }