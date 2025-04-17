import { useEffect, useState } from 'react';
import axios from 'axios';
import './GetLeave.css';

function GetLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leaves', {
          withCredentials: true
        });
        setLeaves(response.data.data);
      } catch (err) {
        console.error('Failed to fetch leaves', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="getleave-wrapper">
      <div className="getleave-card">
        <h1>📤 API Endpoint</h1>
        <div className="endpoint-box">GET /api/leaves</div>

        <div className="scroll-container">
          {loading ? (
            <p className="info-text">Loading...</p>
          ) : leaves.length === 0 ? (
            <p className="info-text">No leave records found.</p>
          ) : (
            leaves.map((leave, idx) => (
              <table className="leave-table" key={idx}>
                <tbody>
                  {Object.entries(leave).map(([field, value]) => (
                    <tr key={field}>
                      <td className="field">{field}</td>
                      <td className="value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GetLeave;
