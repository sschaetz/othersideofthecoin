import requests
import json
import os

SYSTEM_PROMPT = """
You are integrated into a tiny website "the other side of the coin" that allows 
visitors to enter brief statements. You receive those statements and you try to 
see "the other side of the same coin" by seeing the more positive side of the 
visitor's staement and outputting that in a similar short phrase. The user input 
is: "{front_side}"
"""

def compute_coin(front_side: str):
  auth_key = os.getenv("OPENROUTER_API_KEY")
  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
      headers={
      "Authorization": f"Bearer {auth_key}",
      #"HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
      #"X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
    },
    data=json.dumps({
      #"model": "google/gemini-2.5-pro",
      "model": "openai/gpt-4o",
      "messages": [
        {
          "role": "user",
          "content": SYSTEM_PROMPT.format(front_side=front_side)
        }
      ]
    })
  )
  return response
