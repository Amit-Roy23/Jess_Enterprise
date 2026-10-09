import { connectDB } from "@/lib/db";
import {
  Category,
  Product,
  Service,
  GalleryItem,
  Client,
  SiteSettings,
  type ICategory,
  type IProduct,
  type IService,
  type IGalleryItem,
  type IClient,
  type ISiteSettings,
} from "@/models";

export async function getSiteSettings(): Promise<Partial<ISiteSettings>> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (settings) {
      return JSON.parse(JSON.stringify(settings));
    }
  } catch (error) {
    console.error("Error fetching site settings:", error);
  }

  // Safe fallback default
  return {
    companyName: "Jess Enterprises",
    tagline: "Innovative Services",
    phones: {
      mobile: "9158391519",
      office: "9225901519",
    },
    email: "jess.enterprises14@gmail.com",
    address: "Goa, India",
    licenceNumber: "22000126-CLM (Authorised)",
    gstin: "30AZCPG5317P1ZG",
    udyam: "UDYAM-GA-01-0024091 (Micro)",
    businessHours: "Monday – Saturday: 9:00 AM – 6:30 PM",
  };
}

export async function getCategories(): Promise<ICategory[]> {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProducts(options?: {
  categorySlug?: string;
  vertical?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<(IProduct & { categoryDetails?: ICategory })[]> {
  try {
    await connectDB();

    const query: Record<string, unknown> = { isActive: true };

    if (options?.featuredOnly) {
      query.isFeatured = true;
    }

    if (options?.categorySlug) {
      const cat = await Category.findOne({ slug: options.categorySlug }).lean();
      if (cat) {
        query.category = cat._id;
      }
    }

    if (options?.search) {
      const escaped = options.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    let productQuery = Product.find(query)
      .populate("category")
      .sort({ order: 1, createdAt: -1 });

    if (options?.limit) {
      productQuery = productQuery.limit(options.limit);
    }

    const products = await productQuery.lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<(IProduct & { category: ICategory }) | null> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category")
      .lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 4
): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({
      category: categoryId,
      _id: { $ne: currentProductId },
      isActive: true,
    })
      .populate("category")
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function getServices(): Promise<IService[]> {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<IService | null> {
  try {
    await connectDB();
    const service = await Service.findOne({ slug, isActive: true }).lean();
    if (!service) return null;
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return null;
  }
}

export async function getClients(): Promise<IClient[]> {
  try {
    await connectDB();
    const clients = await Client.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(clients));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getGalleryItems(
  material?: string
): Promise<IGalleryItem[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = { isActive: true };
    if (material && material !== "ALL") {
      query.material = material;
    }
    const items = await GalleryItem.find(query).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}
