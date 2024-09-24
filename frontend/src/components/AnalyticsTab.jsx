import { useEffect, useState } from "react";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";

function AnalyticsTab() {
  const { getAnalyticsData, getDailySalesData } = useAnalyticsStore();
  useEffect(() => {
    getAnalyticsData();
  }, []);
  return <div>Analytics Tab</div>;
}

export default AnalyticsTab;
