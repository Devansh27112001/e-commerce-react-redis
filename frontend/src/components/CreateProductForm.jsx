import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { categories } from "../lib/index";
import { useProductStore } from "../stores/useProductStore";

function CreateProductForm() {
  const { loading: isLoading, createProduct } = useProductStore();
  const [newProduct, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(newProduct);
    await createProduct(newProduct);
    setProduct({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
    });
  }

  const fileUploadHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // read file as data url: base64 format
    }
  };
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            onChange={(e) =>
              setProduct({ ...newProduct, name: e.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            rows={3}
            required
            id="description"
            name="description"
            value={newProduct.description}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            onChange={(e) =>
              setProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            onChange={(e) =>
              setProduct({ ...newProduct, price: e.target.value })
            }
            required
            step={0.01}
            min={0}
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            onChange={(e) =>
              setProduct({ ...newProduct, category: e.target.value })
            }
            required
          >
            <option value={""}>Select Category</option>
            {categories.map((category) => (
              <option value={category.name.toLowerCase()} key={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center">
          <input
            type="file"
            id="image"
            name="image"
            className="sr-only"
            accept="image/*"
            onChange={fileUploadHandler}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent bg-emerald-600 rounded-md text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader
                className="w-5 h-5 mr-2 animate-spin"
                aria-hidden="true"
              />
              Loading..
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              Create product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default CreateProductForm;
