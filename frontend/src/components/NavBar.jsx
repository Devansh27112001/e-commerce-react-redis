import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";

import React from "react";
import { useUserStore } from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";

const NavBar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center flex-wrap">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center flex space-x-2"
          >
            E-commerce
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link to="/" className="">
              Home
            </Link>
            {user && (
              <Link
                to="/cart"
                className="relative group hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                  {cart.length}
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to="/admin-dashboard"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                onClick={logout}
              >
                <LogOut size={18} className="mr-1" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="text-white bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-md flex itmems-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign up
                </Link>
                <Link
                  to={"/login"}
                  className="text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Log in
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
