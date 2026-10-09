"use client";

import React, { useState } from "react";
import { Plus, Minus, Check, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToQuoteBasket } from "@/lib/quote-store";

interface AddToQuoteButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  categoryName?: string;
  imageUrl?: string;
}

export function AddToQuoteButton({
  productId,
  productName,
  productSlug,
  categoryName,
  imageUrl,
}: AddToQuoteButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToQuoteBasket({
      productId,
      name: productName,
      slug: productSlug,
      categoryName,
      quantity,
      imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Jess Enterprises, I would like to request quotation details for: ${productName} (Quantity: ${quantity}).`
  );
  const whatsappUrl = `https://wa.me/919225901519?text=${whatsappMessage}`;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quantity:
        </span>
        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-[36px] text-center select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          size="lg"
          variant={added ? "secondary" : "primary"}
          onClick={handleAdd}
          className="w-full gap-2 font-bold shadow-sm"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800">Added to Basket ({quantity})</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Add to Quote Basket</span>
            </>
          )}
        </Button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            size="lg"
            variant="outline"
            className="w-full gap-2 font-bold border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <MessageSquare className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <span>Enquire on WhatsApp</span>
          </Button>
        </a>
      </div>
    </div>
  );
}

export default AddToQuoteButton;
