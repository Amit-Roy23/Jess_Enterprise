export interface QuoteBasketItem {
  productId: string;
  name: string;
  slug: string;
  categoryName?: string;
  quantity: number;
  note?: string;
  imageUrl?: string;
}

const STORAGE_KEY = "jess_quote_basket";

export function getQuoteBasket(): QuoteBasketItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to parse quote basket from localStorage:", err);
    return [];
  }
}

export function saveQuoteBasket(items: QuoteBasketItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("basket-updated"));
  } catch (err) {
    console.error("Failed to save quote basket to localStorage:", err);
  }
}

export function addToQuoteBasket(item: Omit<QuoteBasketItem, "quantity"> & { quantity?: number }): void {
  const current = getQuoteBasket();
  const existingIndex = current.findIndex((i) => i.slug === item.slug);

  const addQty = item.quantity && item.quantity > 0 ? item.quantity : 1;

  if (existingIndex > -1) {
    current[existingIndex].quantity += addQty;
    if (item.note) current[existingIndex].note = item.note;
  } else {
    current.push({
      ...item,
      quantity: addQty,
    });
  }

  saveQuoteBasket(current);
}

export function updateQuoteItemQuantity(slug: string, quantity: number): void {
  const current = getQuoteBasket();
  if (quantity <= 0) {
    removeFromQuoteBasket(slug);
    return;
  }
  const item = current.find((i) => i.slug === slug);
  if (item) {
    item.quantity = quantity;
    saveQuoteBasket(current);
  }
}

export function updateQuoteItemNote(slug: string, note: string): void {
  const current = getQuoteBasket();
  const item = current.find((i) => i.slug === slug);
  if (item) {
    item.note = note;
    saveQuoteBasket(current);
  }
}

export function removeFromQuoteBasket(slug: string): void {
  const current = getQuoteBasket();
  const filtered = current.filter((i) => i.slug !== slug);
  saveQuoteBasket(filtered);
}

export function clearQuoteBasket(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("basket-updated"));
  } catch (err) {
    console.error("Failed to clear quote basket:", err);
  }
}
