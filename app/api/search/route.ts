import { type NextRequest, NextResponse } from "next/server"

// Mock eBay products for demonstration - expanded dataset
const mockProducts = [
  {
    id: "1",
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium Unlocked",
    price: "$1,199.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/1",
  },
  {
    id: "2",
    title: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    price: "$1,299.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/2",
  },
  {
    id: "3",
    title: "Apple iPhone 14 Pro 128GB Deep Purple",
    price: "$899.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/3",
  },
  {
    id: "4",
    title: "Google Pixel 8 Pro 256GB Obsidian",
    price: "$799.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/4",
  },
  {
    id: "5",
    title: "OnePlus 12 512GB Flowy Emerald",
    price: "$699.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/5",
  },
  {
    id: "6",
    title: "Xiaomi 14 Ultra 512GB Black",
    price: "$649.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/6",
  },
  {
    id: "7",
    title: "Apple MacBook Pro 16-inch M3 Max",
    price: "$2,499.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/7",
  },
  {
    id: "8",
    title: "Dell XPS 13 Plus Intel i7 32GB RAM",
    price: "$1,899.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/8",
  },
  {
    id: "9",
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: "$349.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/9",
  },
  {
    id: "10",
    title: "Apple AirPods Pro 2nd Generation",
    price: "$249.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/10",
  },
  {
    id: "11",
    title: "Nintendo Switch OLED Console",
    price: "$349.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/11",
  },
  {
    id: "12",
    title: "PlayStation 5 Console",
    price: "$499.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/12",
  },
  {
    id: "13",
    title: "Apple Watch Series 9 45mm GPS",
    price: "$429.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/13",
  },
  {
    id: "14",
    title: "Samsung Galaxy Watch 6 Classic",
    price: "$379.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/14",
  },
  {
    id: "15",
    title: "iPad Pro 12.9-inch M2 256GB",
    price: "$1,099.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/15",
  },
  {
    id: "16",
    title: "Microsoft Surface Pro 9",
    price: "$999.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/16",
  },
  {
    id: "17",
    title: "Canon EOS R5 Mirrorless Camera",
    price: "$3,899.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/17",
  },
  {
    id: "18",
    title: "Sony Alpha a7 IV Full Frame Camera",
    price: "$2,499.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/18",
  },
  {
    id: "19",
    title: "Dyson V15 Detect Cordless Vacuum",
    price: "$749.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/19",
  },
  {
    id: "20",
    title: "KitchenAid Stand Mixer Artisan Series",
    price: "$379.99",
    image: "/placeholder.svg?height=300&width=300",
    url: "https://ebay.com/item/20",
  },
]

const ITEMS_PER_PAGE = 8

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const page = Number.parseInt(formData.get("page") as string) || 1

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP images are allowed." }, { status: 400 })
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum allowed size is 5MB." }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, page === 1 ? 2000 : 1000))

    // Calculate pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Shuffle products for variety (in real app, this would be based on image similarity)
    const shuffledProducts = [...mockProducts].sort(() => Math.random() - 0.5)
    const paginatedProducts = shuffledProducts.slice(startIndex, endIndex)

    const hasMore = endIndex < shuffledProducts.length

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      hasMore,
      page,
      totalResults: shuffledProducts.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
