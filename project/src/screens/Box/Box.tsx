import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const Box = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("popularity");

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter(product => {
        return selectedPriceRanges.some(range => {
          const [min, max] = range.replace('$', '').split('-').map(Number);
          if (range.includes('+')) {
            return product.price >= min;
          }
          return product.price >= min && product.price <= max;
        });
      });
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(product => {
        return selectedRatings.some(rating => {
          const minRating = parseInt(rating.split('+')[0]);
          return product.rating.rate >= minRating;
        });
      });
    }

    // Sort
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        result.sort((a, b) => b.rating.count - a.rating.count); // popularity
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategories, selectedPriceRanges, selectedRatings, sortOption]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSortOption("popularity");
  };

  // Filter categories from API data
  const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];

  // Filter categories
  const filterCategories = [
    { name: "Category", options: categories },
    {
      name: "Price Range",
      options: ["$0-$50", "$50-$100", "$100-$200", "$200+"],
    },
    {
      name: "Rating",
      options: ["5", "4+", "3+"],
    },
  ];

  // Navigation items
  const navItems = ["Home", "Shop", "Products", "About", "Contact Us"];

  // Footer links
  const footerLinks = {
    "Customer Service": [
      "Contact Us",
      "FAQs",
      "Returns & Exchanges",
      "Shipping Information",
    ],
    "Quick Links": [
      "About Us",
      "Blog",
      "Careers",
      "Privacy Policy",
      "Terms of Service",
    ],
    "Follow Us": ["Social Media Icons"],
  };

  const handleFilterChange = (category: string, option: string) => {
    switch (category) {
      case "Category":
        setSelectedCategories(prev =>
          prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case "Price Range":
        setSelectedPriceRanges(prev =>
          prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case "Rating":
        setSelectedRatings(prev =>
          prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">FAKE STORE</div>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm hover:text-primaryprimary"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">DISCOVER OUR PRODUCTS</h1>
          <p className="text-textsecondary-text max-w-2xl mx-auto">
            Explore our collection of high-quality products from the Fake Store API.
            Find the perfect item that suits your needs and preferences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">FILTER BY</h2>
                <Button
                  variant="link"
                  className="text-primaryprimary text-xs p-0"
                  onClick={handleReset}
                >
                  RESET FILTERS
                </Button>
              </div>

              <div className="space-y-6">
                <div className="mb-4">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <ScrollArea className="h-[calc(100vh-300px)]">
                  {filterCategories.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-medium mb-2 uppercase text-sm">
                        {category.name}
                      </h3>
                      <div className="space-y-2">
                        {category.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox 
                              id={`${category.name}-${optIndex}`}
                              checked={
                                category.name === "Category"
                                  ? selectedCategories.includes(option)
                                  : category.name === "Price Range"
                                  ? selectedPriceRanges.includes(option)
                                  : selectedRatings.includes(option)
                              }
                              onCheckedChange={() => handleFilterChange(category.name, option)}
                            />
                            <label
                              htmlFor={`${category.name}-${optIndex}`}
                              className="text-sm text-textsecondary-text"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {index < filterCategories.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-textsecondary-text">
                Showing {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-textsecondary-text">
                  Sort by:
                </span>
                <select 
                  className="text-sm border rounded p-1"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-gray-200 rounded-md"
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain w-full h-full p-4 transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
                          <span className="font-bold text-sm ml-2">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-textsecondary-text">{product.category}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-textsecondary-text mr-1">★ {product.rating.rate}</span>
                            <span className="text-xs text-textsecondary-text">({product.rating.count})</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold mb-4">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
              <p className="text-xs text-gray-400 mb-4">
                Subscribe to our newsletter to receive updates and exclusive
                offers.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white text-xs rounded-r-none"
                />
                <Button className="bg-primaryprimary hover:bg-primaryprimary/90 rounded-l-none text-xs">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              © 2023 Fake Store. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="flex space-x-2">
                {["Visa", "Mastercard", "PayPal", "Apple Pay"].map(
                  (payment, i) => (
                    <div
                      key={i}
                      className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-[10px]"
                    >
                      {payment.charAt(0)}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};