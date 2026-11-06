from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate_blog():
    data = request.get_json()

    topic = data.get("topic", "")
    style = data.get("style", "Informative")
    tone = data.get("tone", "Professional")
    audience = data.get("audience", "General Audience")
    word_count = data.get("word_count", "500")
    instructions = data.get("instructions", "")

    prompt = f"""
You are an expert professional blog writer.

Generate a high-quality and engaging blog article based on the following requirements:

Topic: {topic}
Writing Style: {style}
Tone: {tone}
Target Audience: {audience}
Word Count: Approximately {word_count} words
Additional Instructions: {instructions}

Follow this structure:

1. Title
2. Introduction
3. Main Content
4. Conclusion

Requirements:
- Make the content professional, engaging, and easy to understand.
- Use clear headings and paragraphs.
- Stay focused on the given topic.
- Follow the requested writing style and tone.
- Consider the target audience.
- Follow the requested approximate word count.
- Do not include unnecessary explanations outside the blog.
"""

    try:
        response = requests.post(
    OLLAMA_URL,
    json={
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 1000,
            "top_k": 40,
            "top_p": 0.9
        }
    },
    timeout=120
)

        result = response.json()

        return jsonify({
            "success": True,
            "blog": result.get("response", "")
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(debug=True)