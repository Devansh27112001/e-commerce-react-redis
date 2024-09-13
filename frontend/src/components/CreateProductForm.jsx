import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { categories } from "../lib/index";

function CreateProductForm() {
  const [newProduct, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });
  return <div className="mx-auto">Create Product form</div>;
}

export default CreateProductForm;
