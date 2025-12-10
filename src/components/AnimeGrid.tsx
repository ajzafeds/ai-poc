import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { type Anime } from "@/services/animeApi"

type LayoutMode = 'grid' | 'stack'

interface AnimeGridProps {
  anime: Anime[]
  loading?: boolean
  layout?: LayoutMode
}

export function AnimeGrid({ anime, loading, layout = 'grid' }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-4 p-4">
        {Array.from({ length: 25 }).map((_, i) => (
          <Card key={i} className="overflow-hidden bg-card border-border">
            <Skeleton className="w-full aspect-[2/3]" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {anime.map((item) => (
        <Card
          key={item.mal_id}
          className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={item.images.jpg.image_url || item.images.webp.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/300x450?text=No+Image"
              }}
            />
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{item.type ?? 'Unknown'}</span>
              <span>•</span>
              <span>
                {item.episodes ?? '?'}
                {' '}
                {(item.episodes ?? 0) === 1 ? 'ep' : 'eps'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

