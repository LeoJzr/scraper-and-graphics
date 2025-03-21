import { useState, useEffect } from "react";
import CandleStickChart from "./Graphic";

export default function FetchData() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState(false)

  // Función para obtener los datos guardados en data.json
  const fetchData = () => {
    fetch("http://localhost:3000/api/getData")
      .then((response) => response.json())
      .then((data) => setChartData(data))
      .catch((error) => console.error("Error obteniendo datos:", error));
  };

  // Llamamos a fetchData cuando se monta el componente para mostrar los datos existentes
  useEffect(() => {
    fetchData()
  }, [])

  // Función para ejecutar el scraper (POST a /api/startScrap) y luego actualizar los datos
  const updateData = (dias) => {
    setLoading(true)
    setSelectedDays(dias)

    fetch("http://localhost:3000/api/startScrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dias }),
    })
      .then((response) => response.json())
      .then(() => fetchData()) // Obtener los datos después del scraping
      .catch((error) => console.error("Error ejecutando el scraper:", error))
      .finally(() => setLoading(false))
  }

  return (
    <div className="m-3 min-md:mx-20 mt-10 min-md:mt-5 ">
      <h1 className="">BITCOIN</h1>
      <div className="">
        <CandleStickChart data={chartData} />
      </div>
      <div className="flex gap-5">
        <button
        className={`px-4 py-2 rounded ${selectedDays === 5 ? "bg-blue-500 text-white" : "bg-gray-300"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => updateData(5)}
        disabled={loading}
      >
        5 días
      </button>

      <button
        className={`px-4 py-2 rounded ${selectedDays === 7 ? "bg-blue-500 text-white" : "bg-gray-300"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => updateData(7)}
        disabled={loading}
      >
        7 días
      </button>

      <button
        className={`px-4 py-2 rounded ${selectedDays === 14 ? "bg-blue-500 text-white" : "bg-gray-300"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => updateData(14)}
        disabled={loading}
      >
        14 días
      </button>
      </div>
    </div>
  )
}