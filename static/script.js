async function generateBlog() {
  const topic = document.getElementById("topic").value.trim();
  const style = document.getElementById("style").value;
  const tone = document.getElementById("tone").value;
  const audience = document.getElementById("audience").value.trim();
  const word_count = document.getElementById("word_count").value;
  const instructions = document.getElementById("instructions").value.trim();

  const output = document.getElementById("blogOutput");
  const loading = document.getElementById("loading");
  const button = document.getElementById("generateBtn");

  if (!topic) {
    alert("Please enter a blog topic.");
    return;
  }

  loading.style.display = "block";
  output.innerHTML = "";
  button.disabled = true;
  button.textContent = "Generating...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        style: style,
        tone: tone,
        audience: audience,
        word_count: word_count,
        instructions: instructions,
      }),
    });

    const data = await response.json();

    if (data.success) {
      output.innerHTML = formatBlog(data.blog);
    } else {
      output.innerHTML = `
                <p class="error">
                    Error: ${data.error}
                </p>
            `;
    }
  } catch (error) {
    output.innerHTML = `
            <p class="error">
                Unable to connect to the server or Ollama.
                <br>
                Make sure Flask and Ollama are running.
            </p>
        `;
  }

  loading.style.display = "none";
  button.disabled = false;
  button.textContent = "Generate Blog";
}

function formatBlog(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

function copyBlog() {
  const blog = document.getElementById("blogOutput").innerText;

  if (!blog || blog === "Your generated blog will appear here.") {
    alert("Generate a blog first.");
    return;
  }

  navigator.clipboard
    .writeText(blog)
    .then(() => {
      alert("Blog copied successfully!");
    })
    .catch(() => {
      alert("Unable to copy the blog.");
    });
}

function newChat() {
  document.getElementById("topic").value = "";
  document.getElementById("audience").value = "";
  document.getElementById("word_count").value = "500";
  document.getElementById("instructions").value = "";

  document.getElementById("style").value = "Informative";
  document.getElementById("tone").value = "Professional";

  document.getElementById("blogOutput").innerHTML = `
        <p class="placeholder">
            Your generated blog will appear here.
        </p>
    `;
}
