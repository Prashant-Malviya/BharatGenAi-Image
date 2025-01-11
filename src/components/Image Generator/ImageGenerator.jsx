import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import genAi from '../Assets/lord hanuman.jpg'

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const api = import.meta.env.VITE_API_URL;

  const imgGenerator = async () => {
    const prompt = inputRef.current.value.trim();

    if (!prompt) return;

    setLoading(true);

    try {
      const response = await axios.get(`${api}/prompt/${prompt}`);
      const responseData = response.config.url;
      setImageUrl(responseData);
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
  
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const blobUrl = URL.createObjectURL(blob);
  
      // Create a temporary link element for download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "generated_image.jpg");
      
      // Append the link to the document, trigger click, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Release the blob URL to free memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-900 text-white">
      <h1 className="text-4xl md:text-6xl font-bold text-orange-500">
        BharatGenAi <span className="text-white">Image</span>
      </h1>

      <motion.div
        className="relative w-full max-w-lg p-3 m-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={imageUrl || genAi}
          alt="Generated"
          className={`rounded-lg w-full h-auto object-cover transition-transform ${
            loading ? "animate-pulse" : ""
          }`}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <span className="text-xl animate-bounce">Loading...</span>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-3xl p-3 mx-3 md:mx-auto lg:mx-auto relative bottom-14 lg:left-14 md:left-14">
        <input
          type="text"
          ref={inputRef}
          placeholder="Describe what you want to see..."
          className="w-full px-4 py-2 text-lg text-black rounded-full outline-none focus:ring-4 focus:ring-orange-500"
        />
        <motion.button
          className="px-6 py-3 text-lg font-medium bg-orange-500 rounded-full hover:bg-orange-600 shadow-lg hover:shadow-orange-600/50"
          onClick={imgGenerator}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Generate Image
        </motion.button>

        {imageUrl && !loading && (
        <motion.button
          className="mt-3 mb-3 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-green-600/50"
          onClick={handleDownload}
          whileHover={{ scale: 1.1, rotate: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          Download Image
        </motion.button>
      )}
      </div>

      {/* Download Button */}
      
    </div>
  );
}

export default ImageGenerator;
