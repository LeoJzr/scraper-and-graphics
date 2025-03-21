import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandleStickChart = ({data}) =>{
    const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    // Definir el ancho dinámico del gráfico
    const width = chartContainerRef.current.clientWidth;
    const height = 500; // Altura fija, ajustable

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
    });

    chartRef.current = chart;

    const candleStickSeries = chart.addCandlestickSeries();
    candleStickSeries.setData(data);
    chart.timeScale().fitContent();

    // Resize automático usando ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [data]);
    
    return <div ref={chartContainerRef} />
}

export default CandleStickChart