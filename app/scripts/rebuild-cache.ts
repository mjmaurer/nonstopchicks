import { rebuildCache } from "../services/youtube.server"

async function main(): Promise<void> {
  console.log("Rebuilding YouTube cache...")
  const data = await rebuildCache()
  console.log(`Cache rebuilt. Live: ${data.liveStreams.length}, Playlists: ${data.playlists.length}`)
}

main().catch((err) => {
  console.error("Failed to rebuild cache:", err)
  process.exit(1)
})
