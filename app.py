from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is missing. Please add it to your .env file."
    )

# Initialize Gemini client
client = genai.Client(api_key=api_key)


# Medical assistant instructions
MEDICAL_PROMPT = """
You are a medical information assistant.

Your role is to provide general, educational medical information.
You are NOT a doctor and must NOT claim to diagnose the user.

For every medical question:

1. Explain the issue in simple language.
2. Mention common possible causes or explanations when appropriate.
3. Mention common symptoms or warning signs.
4. Provide general self-care or informational guidance when appropriate.
5. Clearly explain when the person should contact a doctor.
6. If symptoms could indicate an emergency, clearly recommend seeking
   emergency medical care.
7. Do not provide a definitive diagnosis.
8. Do not prescribe medications or provide personalized medication dosages.
9. Encourage consultation with a qualified healthcare professional
   when appropriate.

Keep the response clear, structured, and easy to understand.

Always include this disclaimer at the end:

"Medical Disclaimer: This information is for educational purposes only
and is not a substitute for professional medical advice, diagnosis,
or treatment."
"""


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Medical query API
@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    # Check request data
    if not data or "query" not in data:
        return jsonify({
            "error": "Please provide a medical question."
        }), 400

    query = data["query"].strip()

    # Check empty question
    if not query:
        return jsonify({
            "error": "Medical question cannot be empty."
        }), 400

    try:

        # Send query to Gemini
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=f"""
{MEDICAL_PROMPT}

Patient's question:

{query}
"""
        )

        # Return Gemini response
        return jsonify({
            "response": response.text
        })

    except Exception as e:

        print("Gemini API Error:", e)

        return jsonify({
            "error": "Unable to generate a response right now. Please try again."
        }), 500


# Start Flask server
if __name__ == "__main__":
    app.run(debug=True)