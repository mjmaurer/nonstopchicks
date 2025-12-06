interface InfoModalProps {
  onClose: () => void
}

export function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div
      className="absolute inset-0 z-20 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg p-8 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl leading-none"
          type="button"
        >
          ×
        </button>
        <div className="flex justify-center items-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <img src="/full.jpeg" alt="NONSTOP CHICKS" className="w-30 h-30" />
            <h2 className="text-white text-2xl font-bold">NONSTOP CHICKS</h2>
          </div>
        </div>

        <div className="text-gray-300 space-y-4">
          <p>
            Welcome to NONSTOP CHICKS. An endless stream of the finest birds and cutest chicks,
            made possible by the flyest of Ivy League institutions.
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
              Powered by the{' '}
              <a
                href="https://www.allaboutbirds.org/cams/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cornell Lab of Ornithology Bird Cams
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/lewhunt/react-tv-player"
                target="_blank"
                rel="noopener noreferrer"
              >
                react-tv-player
              </a>. Thanks so much to both for making this possible!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}