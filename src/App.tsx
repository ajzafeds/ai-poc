import { useEffect, useState } from 'react'
import { fetchAnime, type AnimeApiResponse } from './services/animeApi'
import { AnimeGrid } from './components/AnimeGrid'
import './App.css'

function App() {
  const [animeData, setAnimeData] = useState<AnimeApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAnime({
          page: '1',
          size: '24',
          sortBy: 'ranking',
          sortOrder: 'asc',
        })
        setAnimeData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadAnime()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 px-4 text-foreground">Anime Collection</h1>
        {error && (
          <div className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}
        {animeData && (
          <div className="mb-4 px-4 text-sm text-muted-foreground">
            Showing {animeData.data.length} of {animeData.meta.totalData} anime
          </div>
        )}
        <AnimeGrid anime={animeData?.data || []} loading={loading} />
      </div>
    </div>
  )
}

export default App
