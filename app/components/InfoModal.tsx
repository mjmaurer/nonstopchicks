interface InfoModalProps {
  onClose: () => void
}

export function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div className="absolute inset-0 z-20 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Cornell Bird Cams TV</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl leading-none"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="text-gray-300 space-y-4">
          <p>
            Welcome to Cornell Bird Cams TV, an immersive viewing experience for the
            Cornell Lab of Ornithology's bird cams.
          </p>

          <p>
            Watch live bird cams or explore recorded highlights from various species.
            Use the menu to switch between live and recorded content, browse by
            species categories, or select specific videos.
          </p>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-2">Controls:</h3>
            <ul className="text-sm space-y-1">
              <li>• Use arrow keys to navigate player controls</li>
              <li>• Press the Menu button to access viewing options</li>
              <li>• Next/Previous buttons cycle through the current queue</li>
              <li>• Play/Pause to control video playback</li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Powered by the Cornell Lab of Ornithology Bird Cams
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}