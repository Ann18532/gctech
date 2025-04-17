import { useEffect, useState } from 'react';
import axios from 'axios';
import './GetLeave.css';

function GetLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="getleave-wrapper">
      <h1>🗂 Your Leave Records</h1>

      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="leave-list">
          {leaves.map((leave, idx) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default GetLeave;
