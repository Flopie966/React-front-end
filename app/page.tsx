"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

interface EbayProduct {
  id: string
  title: string
  price: string
  image: string
  url: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

// --- Upload Area Component ---
function UploadArea({ onFileSelect, error }: { onFileSelect: (file: File) => void; error: string | null }) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div
      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById("file-input")?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload product image"
      onKeyPress={e => { if (e.key === "Enter") document.getElementById("file-input")?.click() }}
    >
      <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" aria-hidden />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Product Image</h3>
      <p className="text-slate-600 mb-4">Drag and drop an image here, or click to select</p>
      <p className="text-sm text-slate-500">Supports JPG, PNG, and WebP formats</p>
      <input id="file-input" type="file" accept="image/*" onChange={handleFileInput} className="hidden" aria-label="File input" />
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  )
}

// --- Image Preview Component ---
function ImagePreview({ imagePreview, onSearch, onReset, isSearching }: {
  imagePreview: string
  onSearch: () => void
  onReset: () => void
  isSearching: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="relative max-w-md mx-auto">
        <AspectRatio ratio={1}>
          <Image
            src={imagePreview || "/placeholder.svg"}
            alt="Selected product"
            fill
            className="object-cover rounded-lg"
          />
        </AspectRatio>
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          onClick={onSearch}
          disabled={isSearching}
          size="lg"
          className="min-w-40 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
          variant="outline"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <span className="mr-2 text-lg">🐼</span>
              Find similar
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onReset}>
          Upload New Image
        </Button>
      </div>
    </div>
  )
}

// --- Results Grid Component ---
function ResultsGrid({ products, isLoadingMore, hasMoreResults }: {
  products: EbayProduct[]
  isLoadingMore: boolean
  hasMoreResults: boolean
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        {products.length} result{products.length === 1 ? '' : 's'} found
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card key={`${product.id || product.url || index}-${index}`} className="overflow-hidden hover:shadow-xl transition-shadow border border-slate-200">
            <div className="relative">
              <AspectRatio ratio={1}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title || "Product image"}
                  fill
                  className="object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm">{product.title}</h3>
              <p className="text-lg font-bold text-green-600 mb-3">{product.price}</p>
              <Button asChild className="w-full" size="sm">
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  View on eBay
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {isLoadingMore && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        </div>
      )}
      {!hasMoreResults && products.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-slate-500">You&apos;ve reached the end of the results</p>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchResults, setSearchResults] = useState<EbayProduct[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [hasMoreResults, setHasMoreResults] = useState(true)
  const [page, setPage] = useState(1)
  const [caption, setCaption] = useState<string | null>(null)
  const [captionEdit, setCaptionEdit] = useState<string>("")
  const [isCaptionSubmitting, setIsCaptionSubmitting] = useState(false)

  const handleImageSelect = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be less than 5MB.")
      return
    }
    setSelectedImage(file)
    setError(null)
    setSearchResults([])
    setHasSearched(false)
    setPage(1)
    setHasMoreResults(true)
    setCaption(null)
    setCaptionEdit("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedImage(null)
    setImagePreview(null)
    setSearchResults([])
    setError(null)
    setHasSearched(false)
    setPage(1)
    setHasMoreResults(true)
    setCaption(null)
    setCaptionEdit("")
  }, [])

  const loadResults = useCallback(async (pageNum: number, isInitialSearch = false) => {
    if (!selectedImage) return
    if (isInitialSearch) {
      setIsSearching(true)
      setError(null)
      setHasSearched(true)
      setCaption(null)
      setCaptionEdit("")
    } else {
      setIsLoadingMore(true)
    }
    try {
      const formData = new FormData()
      formData.append("file", selectedImage)
      // Externe API verwacht geen 'page', alleen 'file'
      const response = await fetch("/api/search", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setCaption(data.caption || null)
      setCaptionEdit(data.caption || "")
      // De resultaten zitten in data.results
      if (isInitialSearch) {
        setSearchResults(data.results || [])
      } else {
        setSearchResults((prev) => [...prev, ...(data.results || [])])
      }
      // Externe API geeft geen hasMore, dus na 1x zoeken is er geen 'meer'
      setHasMoreResults(false)
    } catch {
      setError("Search failed. Please try again with another image.")
      if (isInitialSearch) setSearchResults([])
      setCaption(null)
      setCaptionEdit("")
    } finally {
      setIsSearching(false)
      setIsLoadingMore(false)
    }
  }, [selectedImage])

  const handleSearch = useCallback(() => {
    setPage(1)
    loadResults(1, true)
  }, [loadResults])

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreResults) {
      const nextPage = page + 1
      setPage(nextPage)
      loadResults(nextPage, false)
    }
  }, [page, isLoadingMore, hasMoreResults, loadResults])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore()
      }
    }
    if (searchResults.length > 0 && hasMoreResults) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [loadMore, searchResults.length, hasMoreResults])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Visual Product Search</h2>
          <p className="mt-2 text-lg text-slate-600 max-w-xl mx-auto">Upload an image to find similar products on eBay</p>
        </section>
        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardContent className="p-6">
              {!imagePreview ? (
                <UploadArea onFileSelect={handleImageSelect} error={error} />
              ) : (
                <ImagePreview
                  imagePreview={imagePreview}
                  onSearch={handleSearch}
                  onReset={handleReset}
                  isSearching={isSearching}
                />
              )}
            </CardContent>
          </Card>
        </div>
        {/* Loading State */}
        {isSearching && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Finding most similar products...</span>
            </div>
          </div>
        )}
        {/* Error State */}
        {error && !isSearching && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <p className="text-red-800">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}
        {/* No Results State */}
        {hasSearched && !isSearching && searchResults.length === 0 && !error && (
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-yellow-800 text-center">No similar products found.</p>
          </div>
        )}
        {caption && (
          <div className="max-w-2xl mx-auto mb-4 flex flex-col items-center">
            <label htmlFor="caption-edit" className="mb-2 text-blue-800 font-medium">Caption (edit to improve description):</label>
            <textarea
              id="caption-edit"
              className="w-full border border-blue-200 rounded p-2 mb-2 text-blue-900"
              rows={2}
              value={captionEdit}
              onChange={e => setCaptionEdit(e.target.value)}
              disabled={isCaptionSubmitting}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              onClick={async () => {
                if (!selectedImage || !captionEdit) return
                setIsCaptionSubmitting(true)
                try {
                  const formData = new FormData()
                  formData.append("file", selectedImage)
                  formData.append("caption", captionEdit)
                  const response = await fetch("/api/search", {
                    method: "POST",
                    body: formData,
                  })
                  if (!response.ok) throw new Error("Failed to update caption")
                  const data = await response.json()
                  setCaption(data.caption || captionEdit)
                  setCaptionEdit(data.caption || captionEdit)
                  setSearchResults(data.results || [])
                } catch {
                  // Optionally show error
                } finally {
                  setIsCaptionSubmitting(false)
                }
              }}
              disabled={isCaptionSubmitting || !captionEdit || captionEdit === caption}
            >
              {isCaptionSubmitting ? "Updating..." : "Update Description & Search"}
            </button>
          </div>
        )}
        {searchResults.length > 0 && (
          <ResultsGrid
            products={searchResults}
            isLoadingMore={isLoadingMore}
            hasMoreResults={hasMoreResults}
          />
        )}
      </div>
      {/* Affiliate Disclosure */}
      <div className="w-full flex justify-center my-8">
        <a href="/about" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg font-semibold shadow">
          About MoneyBear
        </a>
      </div>
      <footer className="w-full text-center py-4 text-xs text-slate-500 bg-transparent mt-8">
        As an EBAY partner, we may be compensated if you make a purchase through links on our site.
      </footer>
    </div>
  )
}
