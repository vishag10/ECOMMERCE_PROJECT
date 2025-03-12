import React from 'react'

function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">ABOUT PRADA</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">GET HELP</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Order Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping & Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">SHOP</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Vegetables</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Fruits</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Dairy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Groceries</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">FOLLOW US</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17v-6H9v-2h2V9.5C11 7.57 12.57 6 14.5 6H16v2h-1.5c-.55 0-1 .45-1 1v2H16v2h-2.5v6H11z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8a1.25 1.25 0 0 1-1.25-1.25A1.25 1.25 0 0 1 17.25 5.5zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
            <p>© 2025 prada PvtLtd. All Rights Reserved.</p>
          </div>
        </div>

        {/* <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style> */}
      </footer>
  )
}

export default Footer