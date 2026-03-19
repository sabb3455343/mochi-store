"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  ChevronRight,
  Heart,
  Home,
  Laptop,
  MapPin,
  Menu,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Watch,
  Zap,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Category = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  bg: string;
};

type FlashSaleItem = {
  id: number;
  title: string;
  price: string;
  oldPrice: string;
  discount: string;
  color: string;
};

type ProductItem = {
  id: number;
  title: string;
  price: string;
  rating: number;
  sold: number;
  category: string;
  badge?: string;
  color: string;
};

const categories: Category[] = [
  { name: "Women's Fashion", icon: Shirt },
  { name: "Beauty & Skincare", icon: Sparkles },
  { name: "Phones & Gadgets", icon: Smartphone },
  { name: "Electronics", icon: Laptop },
  { name: "Home & Living", icon: Home },
  { name: "Watches & Accessories", icon: Watch },
  { name: "Mother & Baby", icon: Baby },
  { name: "Groceries & Pets", icon: Heart },
];

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Mega Beauty Sale",
    subtitle: "Up to 60% off skincare, cute desk items, and gadgets.",
    cta: "Shop Beauty Deals",
    bg: "from-orange-500 via-rose-500 to-pink-500",
  },
  {
    id: 2,
    title: "Gadget Week",
    subtitle: "Smart daily-use gadgets at special BDT prices.",
    cta: "Explore Gadgets",
    bg: "from-sky-500 via-cyan-500 to-indigo-500",
  },
  {
    id: 3,
    title: "Cute Picks Collection",
    subtitle: "Giftable products for your desk, room, and routine.",
    cta: "See Cute Picks",
    bg: "from-fuchsia-500 via-pink-500 to-orange-400",
  },
];

const flashSale: FlashSaleItem[] = [
  {
    id: 1,
    title: "Hydra Glow Serum",
    price: "৳600",
    oldPrice: "৳850",
    discount: "-29%",
    color: "from-pink-200 to-rose-100",
  },
  {
    id: 2,
    title: "Mini Desk Lamp",
    price: "৳2,450",
    oldPrice: "৳3,100",
    discount: "-21%",
    color: "from-sky-200 to-cyan-100",
  },
  {
    id: 3,
    title: "Cute Mirror Stand",
    price: "৳1,190",
    oldPrice: "৳1,650",
    discount: "-28%",
    color: "from-fuchsia-200 to-pink-100",
  },
  {
    id: 4,
    title: "Pocket Beauty Fan",
    price: "৳1,590",
    oldPrice: "৳2,050",
    discount: "-22%",
    color: "from-emerald-200 to-teal-100",
  },
  {
    id: 5,
    title: "Wireless Earbuds",
    price: "৳2,990",
    oldPrice: "৳3,750",
    discount: "-20%",
    color: "from-violet-200 to-indigo-100",
  },
  {
    id: 6,
    title: "Soft Bloom Cleanser",
    price: "৳990",
    oldPrice: "৳1,350",
    discount: "-27%",
    color: "from-orange-200 to-amber-100",
  },
];

const allProducts: ProductItem[] = [
  {
    id: 1,
    title: "Cloud Dew Serum",
    price: "৳600",
    rating: 4.8,
    sold: 240,
    category: "Beauty & Skincare",
    badge: "Hot",
    color: "from-rose-200 to-orange-100",
  },
  {
    id: 2,
    title: "Bunny Cable Organizer",
    price: "৳650",
    rating: 4.7,
    sold: 520,
    category: "Phones & Gadgets",
    badge: "Popular",
    color: "from-violet-200 to-pink-100",
  },
  {
    id: 3,
    title: "Mini Glow Lamp",
    price: "৳2,650",
    rating: 4.9,
    sold: 180,
    category: "Home & Living",
    badge: "Best Seller",
    color: "from-sky-200 to-cyan-100",
  },
  {
    id: 4,
    title: "Mochi Mirror Stand",
    price: "৳1,350",
    rating: 4.8,
    sold: 390,
    category: "Beauty & Skincare",
    badge: "Cute Pick",
    color: "from-fuchsia-200 to-rose-100",
  },
  {
    id: 5,
    title: "Hydrating Toner",
    price: "৳1,150",
    rating: 4.6,
    sold: 620,
    category: "Beauty & Skincare",
    badge: "Trending",
    color: "from-pink-200 to-red-100",
  },
  {
    id: 6,
    title: "USB Portable Fan",
    price: "৳1,450",
    rating: 4.7,
    sold: 275,
    category: "Phones & Gadgets",
    badge: "New",
    color: "from-emerald-200 to-lime-100",
  },
  {
    id: 7,
    title: "Phone Tripod Stand",
    price: "৳1,290",
    rating: 4.5,
    sold: 315,
    category: "Phones & Gadgets",
    badge: "Deal",
    color: "from-indigo-200 to-sky-100",
  },
  {
    id: 8,
    title: "Cute Desk Basket",
    price: "৳890",
    rating: 4.8,
    sold: 440,
    category: "Home & Living",
    badge: "Gift",
    color: "from-yellow-200 to-orange-100",
  },
];

function FlashSaleCard({ item }: { item: FlashSaleItem }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ duration: 0.18 }}>
      <Card className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <div className={`relative h-44 bg-gradient-to-br ${item.color}`}>
          <div className="absolute right-3 top-3 rounded-full bg-orange-600 px-2 py-1 text-xs font-semibold text-white">
            {item.discount}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="min-h-[44px] text-sm font-medium leading-5 text-slate-800">
            {item.title}
          </h3>
          <p className="mt-2 text-lg font-bold text-orange-600">{item.price}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-slate-400 line-through">{item.oldPrice}</span>
            <span className="font-semibold text-orange-600">{item.discount}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProductCard({ item }: { item: ProductItem }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.18 }}>
      <Card className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <div className={`relative h-48 bg-gradient-to-br ${item.color}`}>
          {item.badge && (
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-orange-600">
              {item.badge}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-slate-900/80 p-3 text-center text-sm text-white transition duration-300 group-hover:translate-y-0">
            Add to cart
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="min-h-[44px] text-sm font-medium leading-5 text-slate-800">
            {item.title}
          </h3>
          <p className="mt-2 text-lg font-bold text-orange-600">{item.price}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
            <span>{item.rating}</span>
            <span>•</span>
            <span>{item.sold} sold</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 45,
    seconds: 20,
  });

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);

    return () => clearInterval(bannerTimer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          return { hours: 6, minutes: 45, seconds: 20 };
        }

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allProducts.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(term);
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const filterTabs = ["All", "Beauty & Skincare", "Phones & Gadgets", "Home & Living"];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 shadow-sm">
        <div className="bg-orange-600 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 opacity-95">
              <span>Save More on App</span>
              <span>Sell on MochiAura</span>
              <span>Customer Care</span>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <span>Track My Order</span>
              <span>Login</span>
              <span>Sign Up</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-500">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              className="rounded-lg bg-white/15 p-2 text-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="shrink-0 text-3xl font-black tracking-tight text-white">
              MochiAura
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search in MochiAura"
                className="h-12 rounded-md border-0 bg-white pl-11 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-white/50"
              />
            </div>

            <Button className="hidden bg-white text-orange-600 hover:bg-orange-50 md:inline-flex">
              Search
            </Button>

            <button className="rounded-full p-2 text-white" aria-label="Cart">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-b bg-white md:hidden">
            <div className="flex flex-col gap-3 px-4 py-4 text-sm">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href="#categories"
                  className="text-slate-700"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <Card className="hidden rounded-md border-0 bg-white lg:block">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <a
                      key={category.name}
                      href="#categories"
                      className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {category.name}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
              <div className="overflow-hidden rounded-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroSlides[activeSlide].id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className={`rounded-md bg-gradient-to-r ${heroSlides[activeSlide].bg} text-white`}
                  >
                    <div className="grid gap-6 p-8 md:grid-cols-2 md:items-center">
                      <div>
                        <Badge className="border-0 bg-white/20 text-white">
                          Mega Campaign
                        </Badge>
                        <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                          {heroSlides[activeSlide].title}
                        </h1>
                        <p className="mt-4 max-w-md text-sm text-orange-50 md:text-base">
                          {heroSlides[activeSlide].subtitle}
                        </p>
                        <div className="mt-6 flex gap-3">
                          <Button className="bg-white text-orange-600 hover:bg-orange-50">
                            {heroSlides[activeSlide].cta}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                          >
                            View Deals
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white/20 p-4">
                            <p className="text-xs uppercase text-orange-50">Orders</p>
                            <p className="mt-2 text-2xl font-bold">12k+</p>
                          </div>
                          <div className="rounded-xl bg-white/20 p-4">
                            <p className="text-xs uppercase text-orange-50">Sellers</p>
                            <p className="mt-2 text-2xl font-bold">900+</p>
                          </div>
                          <div className="rounded-xl bg-white/20 p-4">
                            <p className="text-xs uppercase text-orange-50">Products</p>
                            <p className="mt-2 text-2xl font-bold">20k+</p>
                          </div>
                          <div className="rounded-xl bg-white/20 p-4">
                            <p className="text-xs uppercase text-orange-50">Discount</p>
                            <p className="mt-2 text-2xl font-bold">70%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-3 flex justify-center gap-2 bg-white py-3">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition ${
                        activeSlide === index ? "w-8 bg-orange-500" : "w-2.5 bg-slate-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="rounded-md border-0 bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase opacity-90">Fast Delivery</p>
                    <h3 className="mt-2 text-2xl font-bold">Deliver Nationwide</h3>
                    <p className="mt-2 text-sm text-sky-50">
                      Add courier, COD, and shipping details here.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-md border-0 bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Ship to Dhaka
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Set delivery area, COD, and shipping estimate.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-md border-0 bg-white">
                  <CardContent className="grid grid-cols-3 gap-3 p-4 text-center">
                    <div>
                      <Truck className="mx-auto h-5 w-5 text-orange-600" />
                      <p className="mt-2 text-xs text-slate-600">Fast Shipping</p>
                    </div>
                    <div>
                      <ShieldCheck className="mx-auto h-5 w-5 text-orange-600" />
                      <p className="mt-2 text-xs text-slate-600">Trusted Shop</p>
                    </div>
                    <div>
                      <Zap className="mx-auto h-5 w-5 text-orange-600" />
                      <p className="mt-2 text-xs text-slate-600">Hot Deals</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="mt-8">
          <Card className="rounded-md border-0 bg-white">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-xl font-bold text-slate-900">Categories</h2>
                <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4 lg:grid-cols-8">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.name}
                      whileHover={{ y: -3 }}
                      className="bg-white p-5 text-center transition hover:bg-orange-50"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        {category.name}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="rounded-md border-0 bg-white">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Flash Sale</h2>
                  <p className="mt-1 text-sm text-orange-600">Ending soon</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Ends in</span>
                  {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, i) => (
                    <div
                      key={i}
                      className="rounded bg-slate-900 px-2 py-1 text-sm font-bold text-white"
                    >
                      {String(value).padStart(2, "0")}
                    </div>
                  ))}
                </div>

                <Button className="bg-orange-600 text-white hover:bg-orange-700">
                  Shop All Products
                </Button>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {flashSale.map((item) => (
                  <FlashSaleCard key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Just For You</h2>

            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === tab
                      ? "bg-orange-600 text-white"
                      : "bg-white text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}