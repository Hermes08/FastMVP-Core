import { createClient } from 'pexels'

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'JFuQoW8BHd6b6LaJczc643unwipWdNTIqKoVctsDaAYCPKAaTh0ZNuXH'

export const pexelsClient = createClient(PEXELS_API_KEY)

export type PexelsPhoto = {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color?: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  alt?: string
}

export type PexelsVideoFile = {
  id: number
  quality: 'hd' | 'sd' | 'hls'
  file_type: string
  width: number
  height: number
  link: string
}

export type PexelsVideo = {
  id: number
  width: number
  height: number
  duration: number
  url: string
  image: string
  video_files: PexelsVideoFile[]
}

export async function searchPhotos(query: string, perPage = 15, page = 1) {
  const res = await pexelsClient.photos.search({ query, per_page: perPage, page })
  return res
}

export async function curatedPhotos(perPage = 15, page = 1) {
  const res = await pexelsClient.photos.curated({ per_page: perPage, page })
  return res
}

export async function getPhoto(id: number) {
  const res = await pexelsClient.photos.show({ id })
  return res as PexelsPhoto
}

export async function searchVideos(query: string, perPage = 15, page = 1) {
  const res = await pexelsClient.videos.search({ query, per_page: perPage, page })
  return res
}

export async function popularVideos(perPage = 15, page = 1) {
  const res = await pexelsClient.videos.popular({ per_page: perPage, page })
  return res
}
