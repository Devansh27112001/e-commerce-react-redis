import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, //This groups all the documents together
        totalSales: { $sum: 1 }, //Counts the total no. of orders
        totalRevenue: { $sum: "$totalAmount" }, //Sums every order's total amount and puts it is totalRevenue
      },
    },
  ]);

  // We used salesData[0] as we have grouped all the documents together and we will get an array that has only one object.
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    // So, basically we first of all getting data by the matching the 'createdAt field has to be between startdate and endDate', then we are grouping them by createdAt, and for that particular createdAt, we are getting the total sales on that particular createdAt date and also the revenue. At last we are sorting the _id, that is our createdAt date in ascending order.

    // This will look something like this. So, it has dates that are between the currentDate and the 7 days prior to the currentDate, It has the total sales and revenue for a particular date in a period of 7 days
    // [
    //   { _id: '2023-01-01', sales: 10, revenue: 100 },
    //   { _id: '2023-01-02', sales: 5, revenue: 50 },
    //   { _id: '2023-01-03', sales: 8, revenue: 80 },
    //   { _id: '2023-01-04', sales: 3, revenue: 30 },
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            // The start date is 7 days prior to the today's date
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05', '2023-01-06', '2023-01-07']
    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      // Because we ahave grouped our data accoring to createdAt. So, the _id will contain the date in string format.
      const foundData = dailySalesData.find((item) => item._id === date);
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
