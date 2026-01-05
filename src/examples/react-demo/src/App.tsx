import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { generatePdf } from 'smart-pdf';

const App: React.FC = () => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const docRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Destroy any existing chart before creating a new one (prevents duplicate render errors)
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartCanvasRef.current) {
      chartInstanceRef.current = new Chart(chartCanvasRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Monthly Revenue',
              data: [1200, 1900, 1500, 2000, 2500, 3000],
              borderColor: '#3b82f6',
              borderWidth: 2,
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: 'Month' } },
            y: { title: { display: true, text: 'Revenue ($)' } },
          },
        },
      });
    }

    // ✅ Proper cleanup
    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  const handleGeneratePdf = async () => {
    if (docRef.current) {
      await generatePdf(docRef.current, {
        fileName: 'SmartPDF_Test.pdf',
        margin: 12,
        scale: 2,
      });
    }
  };

  return (
    <div className="app-container" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Smart PDF Demo Document</h1>

      <div
        ref={docRef}
        style={{
          background: '#fff',
          padding: '20px',
          maxWidth: '800px',
          margin: '2rem auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* PAGE CONTENT START */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>1. Introduction</h2>
          <p>
            This document tests the Smart PDF engine. It includes a combination of text blocks, a
            table, an image, and a chart rendered from the browser DOM. The PDF should correctly
            paginate and preserve layout without splitting rows or cutting charts in half.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>2. Table of Monthly Expenses</h2>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Month</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Utilities</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Groceries</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['January', 500, 120, 250],
                ['February', 500, 110, 270],
                ['March', 520, 115, 260],
                ['April', 500, 125, 280],
              ].map(([month, rent, util, food]) => (
                <tr key={month}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{month}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${rent}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${util}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${food}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    ${+rent + +util + +food}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>3. Sample Chart</h2>
          <div style={{ height: '300px' }}>
            <canvas ref={chartCanvasRef} />
          </div>
        </section>

        <section>
          <h2>4. Summary</h2>
          <p>
            Smart PDF should render this page with the correct layout, spacing, and scaling. The
            chart should be captured correctly, the table should not split rows across pages, and
            all sections should be paginated cleanly.
          </p>
        </section>
        {/* PAGE CONTENT END */}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleGeneratePdf}
          style={{
            background: '#3b82f6',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Generate Smart PDF
        </button>
      </div>
    </div>
  );
};

export default App;
