import { useState, useEffect } from "react";
import CandleStickChart from "./Graphic";

export default function FetchData() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener los datos guardados en data.json
  const fetchData = () => {
    fetch("http://localhost:3000/api/getData")
      .then((response) => response.json())
      .then((data) => setChartData(data))
      .catch((error) => console.error("Error obteniendo datos:", error));
  };

  // Llamamos a fetchData cuando se monta el componente para mostrar los datos existentes
  useEffect(() => {
    fetchData();
  }, []);

  // Función para ejecutar el scraper (POST a /api/startScrap) y luego actualizar los datos
  const updateData = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/startScrap", { method: "POST" })
      .then((response) => response.json())
      .then(() => fetchData()) // Una vez que el scraper termina, obtenemos los nuevos datos
      .catch((error) => console.error("Error ejecutando el scraper:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="m-3 min-md:mx-20 mt-10 min-md:mt-5 ">
      <h1 className="">BITCOIN</h1>
      <div className="">
        <CandleStickChart data={chartData} />
      </div>
      <div>
        <button onClick={updateData} disabled={loading} className="border cursor-pointer rounded hover:bg-blue-500/60 px-1 transition-all duration-200">
            {loading ? "Cargando..." : "Actualizar Datos"}
        </button>
      </div>
    </div>
  )
}