const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'JFuQoW8BHd6b6LaJczc643unwipWdNTIqKoVctsDaAYCPKAaTh0ZNuXH'

export async function fetchPexelsImages(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.photos?.map((photo: any) => photo.src.large) || []
  } catch (error) {
    console.error('Error fetching Pexels images:', error)
    return []
  }
}
