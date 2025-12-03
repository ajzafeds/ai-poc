import { useEffect, useState } from 'react'
import { fetchAnime, type AnimeApiResponse } from './services/animeApi'
import { AnimeGrid } from './components/AnimeGrid'
import { datadogRum } from './services/datadog'
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

  const triggerRuntimeError = () => {
    // Test runtime error for Datadog
    throw new Error('Test runtime error for Datadog - This is a test error to verify error tracking')
  }

  const triggerManualDatadogError = () => {
    // Manually report an error to Datadog
    datadogRum.addError(new Error('Manual Datadog error - This error was manually reported to Datadog'), {
      source: 'custom',
      customContext: {
        testType: 'manual',
        timestamp: new Date().toISOString(),
      },
    })
    alert('Error manually reported to Datadog!')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-foreground">Anime Collection</h1>
          <div className="flex gap-2">
            <button
              onClick={triggerRuntimeError}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Test Runtime Error
            </button>
            <button
              onClick={triggerManualDatadogError}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Test Manual Error
            </button>
          </div>
        </div>
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
