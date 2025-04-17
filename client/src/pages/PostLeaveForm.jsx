import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './PostLeaveForm.css';
import Navbar from '../components/Navbar.jsx';



function PostLeaveForm() {
  const { provider } = useParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ message: '', type: '' }); // type: 'error' | 'success'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leave_start: '',
    leave_end: '',
    leave_reason: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Submitting...');
  
    try {
      const res = await axios.post('http://localhost:5000/api/leaves', formData, {
        withCredentials: true
      });
  
      setPopup({ message: '✅ Leave submitted successfully!', type: 'success' });
  
      setTimeout(() => {
        setPopup({ message: '', type: '' });
        navigate(`/erp/${provider}`);
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||   // ✅ This line shows the actual Error thrown
        '❌ Failed to submit leave';
    
      setPopup({ message, type: 'error' });
    
      setTimeout(() => setPopup({ message: '', type: '' }), 4000);
    }
  
    // ✅ Reset status regardless of outcome
    setStatus('');
  };

  return (
    <>
    <Navbar />
    <div className="leaveform-wrapper">
      <div className="leaveform-card">
        <h1>Fill Leave Request</h1>
        <form onSubmit={handleSubmit}>
          {popup.message && (
            <div className={`popup ${popup.type}`}>
              {popup.message}
            </div>
          )}
          <label>Full Name </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label>Email </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Leave Start </label>
          <input type="date" name="leave_start" value={formData.leave_start} onChange={handleChange} />

          <label>Leave End </label>
          <input type="date" name="leave_end" value={formData.leave_end} onChange={handleChange} />

          <label>Leave Reason</label>
          <textarea name="leave_reason" value={formData.leave_reason} onChange={handleChange} rows="3" />

          <button type="submit">Submit Leave</button>
        </form>

        {status && <p className="status">{status}</p>}
      </div>
      </div>
      </>
  );
}

export default PostLeaveForm;
