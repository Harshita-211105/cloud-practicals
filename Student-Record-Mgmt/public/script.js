async function loadStudents() {
    const res = await fetch("/students");
    const students = await res.json();

    let output = "";

    students.forEach(student => {
        output += `
        <div class="student-card">
            <h3>${student.name}</h3>
            <p><strong>Roll No:</strong> ${student.roll_no}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Year:</strong> ${student.year}</p>
            <button class="edit-btn" onclick="editStudent(${student.id}, '${student.name}', '${student.roll_no}', '${student.email}', '${student.course}', '${student.year}')">Edit</button>
            <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
        `;
    });

    document.getElementById("students").innerHTML = output;
}

async function deleteStudent(id) {
    await fetch("/students/" + id, {
        method: "DELETE"
    });

    loadStudents();
}

async function saveStudent() {
    const id = document.getElementById("studentId").value;

    const student = {
        name: document.getElementById("name").value,
        roll_no: document.getElementById("roll_no").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        year: document.getElementById("year").value
    };

    if (id) {
        await fetch("/students/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    } else {
        await fetch("/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    }

    clearForm();
    loadStudents();
}

function editStudent(id, name, roll_no, email, course, year) {
    document.getElementById("studentId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("roll_no").value = roll_no;
    document.getElementById("email").value = email;
    document.getElementById("course").value = course;
    document.getElementById("year").value = year;
}

function clearForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("roll_no").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    document.getElementById("year").value = "";
}

loadStudents();