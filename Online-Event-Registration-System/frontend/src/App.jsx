import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    eventName: ""
  });

  const API_URL = "http://localhost:8001";

  const fetchRegistrations = async () => {
    const res = await axios.get(`${API_URL}/registrations`);
    setRegistrations(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const registerUser = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
  
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }
  
    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    if (!phonePattern.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  
    if (!formData.eventName.trim()) {
      alert("Please enter the event name.");
      return;
    }
  
    await axios.post(`${API_URL}/registrations`, formData);
  
    setFormData({
      name: "",
      email: "",
      phone: "",
      college: "",
      eventName: ""
    });
  
    fetchRegistrations();
    alert("Registration submitted successfully.");
  };

  const deleteRegistration = async (id) => {
    try {
      await axios.delete(`${API_URL}/registrations/${id}`);
      fetchRegistrations();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <h2>EventCloud</h2>
        <p>Online Event Registration System</p>
      </nav>

      <section className="hero">
        <div>
          <span>Cloud Hosted MERN Application</span>
          <h1>Register for events easily.</h1>
          <p>
            A full-stack event registration system where user details are stored
            in a cloud-hosted MongoDB database.
          </p>
        </div>
      </section>

      <main className="main">

        <section className="form-card">
          <h2>Register Now</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="college"
            placeholder="College / Organisation"
            value={formData.college}
            onChange={handleChange}
          />

          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={handleChange}
          />

          <button onClick={registerUser}>Submit Registration</button>
        </section>

        <section className="registrations">
          <h2>Registered Participants</h2>

          {registrations.length === 0 ? (
            <div className="empty">No registrations yet.</div>
          ) : (
            registrations.map((user) => (
              <div className="registration-card" key={user._id}>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                  <p>{user.college || "Not specified"}</p>
                  <span>{user.eventName}</span>
                </div>

                <button onClick={() => deleteRegistration(user._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;