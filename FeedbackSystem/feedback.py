import json
import requests
import time
from datetime import datetime


# 💪 Improve response using Together.ai API (e.g., OpenChat or Mixtral)
def improve_response(user_input, original_response, comment):
    prompt = f"""
You are a helpful assistant improving chatbot replies.

Only rewrite the Bot Response if the Feedback is clear, constructive, and provides specific suggestions or reasoning.
If the Feedback is vague, emotional, or non-actionable, ONLY RETURN THE BOT RESPONSE WITHOUT EXPLANATIONS, NOTES, OR QUOTATION MARKS.

Respond ONLY with the final version of the response — no explanations, formatting, or extra comments.

User: "{user_input}"
This is the BOT response: {original_response}
Feedback: "{comment}"

"""

    api_key = "tgp_v1__iBtBIBSRuCSLcXXWhCSGL77EdpybkJu3UNVw4CIwUY"  # Replace with your actual key
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 200
    }

    response = requests.post(url, headers=headers, json=payload)
    time.sleep(1.1)  # Avoid hitting rate limit (1 QPS)

    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content'].strip()
    else:
        print("Together API error:", response.status_code, response.text)
        return original_response + " (Could not improve due to API error)"


# 📝 Log feedback and improve immediately if rating <= 3
def log_and_improve_feedback(user_input, bot_response, rating, emotion, comment, feedback_file='feedback.json',
                             improved_file='improved_feedback.jsonl'):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    feedback_entry = {
        "user_input": user_input,
        "bot_response": bot_response,
        "rating": rating,
        "emotion": emotion,
        "comment": comment,
        "timestamp": timestamp
    }

    try:
        with open(feedback_file, 'r') as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    if feedback_entry not in data:
        data.append(feedback_entry)

    with open(feedback_file, 'w') as file:
        json.dump(data, file, indent=2)

    # If low rating, immediately improve and store in .jsonl
    if int(rating) <= 3:
        improved_response = improve_response(user_input, bot_response, comment)
        improved_entry = {
            "messages": [
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": improved_response}
            ]
        }
        with open(improved_file, 'a') as out:
            out.write(json.dumps(improved_entry) + '\n')


# ✅ Example usage
if __name__ == '__main__':
    ## PUT FEEDBACK HERE
    log_and_improve_feedback(
        user_input="Why do we have to switch tools?",
        bot_response="To improve collaboration and reduce outdated workflows. [ADKAR - Awareness]",
        rating=3,
        emotion="Confused",
        comment="not very clear."
    )