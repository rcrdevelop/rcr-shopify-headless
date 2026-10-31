import { defineStore, acceptHMRUpdate } from "pinia";
import {
  seedProducts,
  type CartLine,
  type Order,
  type Product
} from "@/data/catalog";

const KEY = "rcr-shop-v1";
export const FREE_SHIPPING = 80;

interface Persisted {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
}

export const useShopStore = defineStore("shop", {
  state: () => {
    const s = load();
    return {
      products: seedProducts(),
      cart: s.cart,
      wishlist: s.wishlist,
      orders: s.orders,
      cartOpen: false,
      adminView: false,
      coupon: "" as string,
      q: "",
      category: null as string | null,
      maxPrice: 220,
      sort: "relevance" as "relevance" | "priceAsc" | "priceDesc" | "rating"
    };
  },

  getters: {
    filtered(state): Product[] {
      const q = state.q.trim().toLowerCase();
      let list = state.products.filter(p => {
        if (
          q &&
          !`${p.name} ${p.category} ${p.tags.join(" ")}`
            .toLowerCase()
            .includes(q)
        )
          return false;
        if (state.category && p.category !== state.category) return false;
        if (p.price > state.maxPrice) return false;
        return true;
      });
      switch (state.sort) {
        case "priceAsc":
          list = [...list].sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          list = [...list].sort((a, b) => b.price - a.price);
          break;
        case "rating":
          list = [...list].sort((a, b) => b.rating - a.rating);
          break;
      }
      return list;
    },
    cartLines(state) {
      return state.cart
        .map(l => {
          const product = state.products.find(p => p.id === l.productId);
          const variant = product?.variants.find(v => v.id === l.variantId);
          return product && variant ? { line: l, product, variant } : null;
        })
        .filter(Boolean) as {
        line: CartLine;
        product: Product;
        variant: NonNullable<Product["variants"][number]>;
      }[];
    },
    cartCount(): number {
      return this.cartLines.reduce((s, l) => s + l.line.qty, 0);
    },
    subtotal(): number {
      return this.cartLines.reduce(
        (s, l) => s + l.product.price * l.line.qty,
        0
      );
    },
    discount(): number {
      return this.coupon.toUpperCase() === "DEMO20" ? this.subtotal * 0.2 : 0;
    },
    shipping(): number {
      const s = this.subtotal - this.discount;
      return s === 0 || s >= FREE_SHIPPING ? 0 : 6.9;
    },
    tax(): number {
      return (this.subtotal - this.discount) * 0.16;
    },
    total(): number {
      return this.subtotal - this.discount + this.shipping + this.tax;
    },
    revenueToday(state): number {
      return state.orders.reduce((s, o) => s + o.total, 0);
    }
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            cart: this.cart,
            wishlist: this.wishlist,
            orders: this.orders
          } satisfies Persisted)
        );
      } catch {
        /* ignore */
      }
    },
    addToCart(productId: string, variantId: string, qty = 1) {
      const l = this.cart.find(
        x => x.productId === productId && x.variantId === variantId
      );
      if (l) l.qty += qty;
      else this.cart.push({ productId, variantId, qty });
      this.persist();
    },
    setQty(productId: string, variantId: string, qty: number) {
      if (qty <= 0) {
        this.cart = this.cart.filter(
          x => !(x.productId === productId && x.variantId === variantId)
        );
      } else {
        const l = this.cart.find(
          x => x.productId === productId && x.variantId === variantId
        );
        if (l) l.qty = qty;
      }
      this.persist();
    },
    toggleWish(id: string) {
      const i = this.wishlist.indexOf(id);
      if (i >= 0) this.wishlist.splice(i, 1);
      else this.wishlist.push(id);
      this.persist();
    },
    placeOrder(customer: Order["customer"], shippingMethod: string): Order {
      const o: Order = {
        id: `o-${Date.now().toString(36)}`,
        number: `RCR-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        items: this.cartLines.map(l => ({
          name: l.product.name,
          variant: `${l.variant.size} / ${l.variant.color}`,
          qty: l.line.qty,
          price: l.product.price
        })),
        subtotal: this.subtotal,
        discount: this.discount,
        shipping: this.shipping,
        tax: this.tax,
        total: this.total,
        status: "Pagado",
        customer,
        shippingMethod
      };
      this.orders.unshift(o);
      this.cart = [];
      this.coupon = "";
      this.persist();
      return o;
    },
    advanceStatus(id: string) {
      const o = this.orders.find(x => x.id === id);
      const flow: Order["status"][] = [
        "Pagado",
        "Preparando",
        "Enviado",
        "Entregado"
      ];
      if (o) {
        const i = flow.indexOf(o.status);
        o.status = flow[Math.min(i + 1, flow.length - 1)]!;
        this.persist();
      }
    }
  }
});

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Persisted;
      return {
        cart: d.cart ?? [],
        wishlist: d.wishlist ?? [],
        orders: d.orders ?? []
      };
    }
  } catch {
    /* ignore */
  }
  return { cart: [], wishlist: [], orders: [] };
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShopStore, import.meta.hot));
}
