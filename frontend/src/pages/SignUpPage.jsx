import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Lock, User, Mail, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const loading = true;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center mt-6 text-3xl font-extrabold text-emerald-400">
          Create your account
        </h2>
      </motion.div>
      {/* sm:w-full will take the width:100% of its parent but sm:max-w-md will restrict it to 448px. It will take up the full width of its parent container but will not exceed 448px in width. */}
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium shadow-sm"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Devansh Kansara"
                />
              </div>
              <label
                htmlFor="name"
                className="block text-sm font-medium shadow-sm"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
