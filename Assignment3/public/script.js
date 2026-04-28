async function loadPosts() {
    const res = await fetch("/posts");
    const data = await res.json();

    let output = "";

    data.forEach(post => {
        output += `
        <div class="post">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
        </div>
        `;
    });

    document.getElementById("posts").innerHTML = output;
}

async function addPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadPosts();
}

async function deletePost(id) {
    await fetch("/posts/" + id, {
        method: "DELETE"
    });

    loadPosts();
}

loadPosts();