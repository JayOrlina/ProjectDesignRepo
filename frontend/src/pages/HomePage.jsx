import Navbar from "../components/Navbar";
import { useState } from "react";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BatchCard   from "../components/BatchCard";
import api from "../lib/axios"
import NotFound from "../components/NotFound";

function HomePage() {
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [batch, setBatch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/batch");
        console.log(res.data);
        setBatch(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading...</div>
        )}

        {batch.length === 0 && !isRateLimited && <NotFound />}

        {batch.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batch.map((batch) => (
              <BatchCard key={batch._id} batch={batch} setBatch={setBatch}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;