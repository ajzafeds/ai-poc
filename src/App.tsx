import { useEffect, useState } from 'react'
import { fetchAnime, type AnimeApiResponse, type Anime } from './services/animeApi'
import { AnimeGrid } from './components/AnimeGrid'
import './App.css'

function App() {
  const [animeData, setAnimeData] = useState<AnimeApiResponse | null>(null)
  const [allAnime, setAllAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true)  
      setError(null)
      try {
        const data = await fetchAnime({
          page: 1,
          limit: 24,
          sfw: true,
        })
        setAnimeData(data)
        setAllAnime(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadAnime()
  }, [])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      // Bug: page state is never updated, so it always stays at 1
      // setPage(nextPage)
      
      const data = await fetchAnime({
        page: page, // Bug: uses current page instead of nextPage
        limit: 24,
        sfw: true,
      })
      
      // Append new data to existing list
      setAllAnime(prev => [...prev, ...data.data])
      setAnimeData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-foreground">Anime Collection</h1>
          <div className="flex gap-2" />
        </div>
        {error && (
          <div className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}
        {animeData && (
          <div className="mb-4 px-4 text-sm text-muted-foreground">
            Showing {allAnime.length} of {animeData.pagination.items.total} anime (Page: {animeData.pagination.current_page})
          </div>
        )}
        <AnimeGrid anime={allAnime} loading={loading} layout="grid" />
        {animeData && animeData.pagination.has_next_page && (
          <div className="flex justify-center mt-6 px-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
