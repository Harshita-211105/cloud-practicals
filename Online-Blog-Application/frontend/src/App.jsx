import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: ""
  });

  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:8002";

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data);
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

  const saveBlog = async () => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.author.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/blogs/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/blogs`, formData);
      }

      setFormData({
        title: "",
        content: "",
        author: ""
      });

      setEditId(null);

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const editBlog = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author
    });

    setEditId(blog._id);
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API_URL}/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditId(null);

    setFormData({
      title: "",
      content: "",
      author: ""
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <h2>CloudBlog</h2>
        <p>Online Blog Application</p>
      </nav>

      <section className="hero">
        <div>
          <span>Cloud Hosted MERN Blog</span>

          <h1>Create and manage blog posts easily.</h1>

          <p>
            A full-stack cloud-based blogging platform where users can create,
            update, view, and manage blogs using a web interface.
          </p>
        </div>
      </section>

      <main className="main">
        <section className="form-card">
          <h2>{editId ? "Edit Blog" : "Create Blog Post"}</h2>

          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="content"
            placeholder="Write your blog content..."
            value={formData.content}
            onChange={handleChange}
          />

          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleChange}
          />

          <button onClick={saveBlog}>
            {editId ? "Update Blog" : "Publish Blog"}
          </button>

          {editId && (
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel Edit
            </button>
          )}
        </section>

        <section className="blogs-section">
          <h2>Published Blogs</h2>

          {blogs.length === 0 ? (
            <div className="empty">
              No blogs published yet.
            </div>
          ) : (
            blogs.map((blog) => (
              <div className="blog-card" key={blog._id}>
                <div className="blog-content">
                  <h3>{blog.title}</h3>

                  <p>{blog.content}</p>

                  <span>By {blog.author}</span>
                </div>

                <div className="blog-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => editBlog(blog)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;