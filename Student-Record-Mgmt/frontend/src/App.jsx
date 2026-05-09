import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_URL = "http://localhost:8003";

  const [students, setStudents] = useState([]);
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    course: "",
    year: ""
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveStudent = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || !formData.rollNo || !formData.email || !formData.course || !formData.year) {
      alert("Please fill all fields.");
      return;
    }

    if (!emailPattern.test(formData.email)) {
      alert("Enter valid email.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/students/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/students`, formData);
      }

      setFormData({
        name: "",
        rollNo: "",
        email: "",
        course: "",
        year: ""
      });

      setEditId(null);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Error occurred");
    }
  };

  const editStudent = (student) => {
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      course: student.course,
      year: student.year
    });

    setEditId(student._id);
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      fetchStudents();
      setSearchedStudent(null);
    } catch (error) {
      console.log(error);
    }
  };

  const searchStudent = async () => {
    if (!searchRollNo.trim()) return;

    try {
      const res = await axios.get(`${API_URL}/students/search/${searchRollNo}`);
      setSearchedStudent(res.data);
    } catch (error) {
      alert("Student not found");
      setSearchedStudent(null);
    }
  };

  const cancelEdit = () => {
    setEditId(null);

    setFormData({
      name: "",
      rollNo: "",
      email: "",
      course: "",
      year: ""
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <h2>StudentCloud</h2>
        <p>Student Record Management System</p>
      </nav>

      <section className="hero">
        <div>
          <span>Cloud Hosted MERN Application</span>
          <h1>Manage student records efficiently.</h1>
          <p>
            A full-stack student record management system where users can add,
            update, search, retrieve, and manage student data.
          </p>
        </div>
      </section>

      <main className="main">
        <section className="form-card">
          <h2>{editId ? "Update Student" : "Add Student"}</h2>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
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
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
          />

          <button onClick={saveStudent}>
            {editId ? "Update Student" : "Add Student"}
          </button>

          {editId && (
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel Edit
            </button>
          )}
        </section>

        <section className="students-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Roll Number"
              value={searchRollNo}
              onChange={(e) => setSearchRollNo(e.target.value)}
            />

            <button onClick={searchStudent}>Search</button>
          </div>

          {searchedStudent && (
            <div className="search-result">
              <h3>{searchedStudent.name}</h3>
              <p>Roll No: {searchedStudent.rollNo}</p>
              <p>Email: {searchedStudent.email}</p>
              <p>Course: {searchedStudent.course}</p>
              <p>Year: {searchedStudent.year}</p>

              <div className="student-buttons">
                <button className="edit-btn" onClick={() => editStudent(searchedStudent)}>
                  Edit
                </button>

                <button className="delete-btn" onClick={() => deleteStudent(searchedStudent._id)}>
                  Delete
                </button>
              </div>
            </div>
          )}

          <button
            className="view-btn"
            onClick={() => setShowAllStudents(!showAllStudents)}
          >
            {showAllStudents ? "Hide Students" : "View All Students"}
          </button>

          {showAllStudents && (
            <>
              <h2>All Students</h2>

              {students.length === 0 ? (
                <div className="empty">No student records found.</div>
              ) : (
                students.map((student) => (
                  <div className="student-card" key={student._id}>
                    <div>
                      <h3>{student.name}</h3>
                      <p>Roll No: {student.rollNo}</p>
                      <p>{student.email}</p>
                      <span>
                        {student.course} • Year {student.year}
                      </span>
                    </div>

                    <div className="student-buttons">
                      <button className="edit-btn" onClick={() => editStudent(student)}>
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => deleteStudent(student._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;