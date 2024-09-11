import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="relative overflow-hidden h-96 w-full group rounded-lg">
      <Link to={"/category" + category.href}>
        <div className="w-full h-full cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50" />
          <img
            src={category.imageUrl}
            alt={category.name}
            className="transition-transform duration-500 group-hover:scale-110 ease-out"
            loading="lazy"
          />
          <div className="z-20 absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-2xl text-white font-bold mb-2">
              {category.name}
            </h3>
            <p className="text-gray-200 text-sm">Explore {category.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
