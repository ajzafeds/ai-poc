import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { type Anime } from "@/services/animeApi"

interface AnimeGridProps {
  anime: Anime[]
  loading?: boolean
}

export function AnimeGrid({ anime, loading }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {anime.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={item.thumb || item.image}
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
              <span className="capitalize">{item.type}</span>
              <span>•</span>
              <span>{item.episodes} {item.episodes === 1 ? 'ep' : 'eps'}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

