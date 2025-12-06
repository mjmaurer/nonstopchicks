// @ts-ignore - react-tv-player has type issues with React 19
import { TVPlayer, useTVPlayerStore, type TVPlayerButtonProps } from "react-tv-player";
import { faCircleInfo, faCrow } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface TVWrapperProps {
  url: string
  title?: string
  mediaCount: number
  mediaIndex: number
  onNext: () => void
  onPrevious: () => void
  onMenuPress: () => void
  onInfoPress: () => void
}

export function TVWrapper({
  url,
  title,
  mediaCount,
  mediaIndex,
  onNext,
  onPrevious,
  onMenuPress,
  onInfoPress
}: TVWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const customButtons: TVPlayerButtonProps[] = [
    {
      action: "custom",
      align: "left",
      label: "Info",
      faIcon: faCircleInfo,
      onPress: onInfoPress
    },
    {
      action: "custom",
      align: "left",
      label: "Menu",
      faIcon: faCrow,
      onPress: onMenuPress
    },
    {
      action: "previous",
      align: "center",
      disable: mediaCount <= 1
    },
    {
      action: "skipback",
      align: "center"
    },
    {
      action: "playpause",
      align: "center"
    },
    {
      action: "skipforward",
      align: "center"
    },
    {
      action: "next",
      align: "center",
      disable: mediaCount <= 1
    },
    {
      action: "mute",
      align: "right"
    },
    // {
    //   action: "fullscreen",
    //   align: "right"
    // }
  ]

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Cornell Bird Cams TV</h2>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Cornell Bird Cams TV</h2>
          <p className="text-gray-300">No video available. Press Menu to select content.</p>
          <button
            onClick={onMenuPress}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
            type="button"
          >
            Open Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <TVPlayer
      url={url}
      title={title}
      playing={true}
      muted={true}
      customButtons={customButtons}
      mediaCount={mediaCount}
      mediaIndex={mediaIndex}
      playsinline={true}
      onNextPress={onNext}
      onPreviousPress={onPrevious}
      onEnded={onNext}
      hideControlsOnArrowUp={true}
    />
  )
}