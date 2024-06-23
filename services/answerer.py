from openai import OpenAI
from time import sleep

client = OpenAI(api_key="sk-proj-qlgDp6WBcaaGXYrc1IJeT3BlbkFJUosuNsTcSO0Z13w2PQzN")
MODEL = "gpt-3.5-turbo"
MIN_WORDS = 1000

def read_file(path):
    with open (path, "r", encoding="utf-8") as f:
        return f.read()

def generate(contract_code):
    kb_path = "./services/prompts/combination-kb.md"
    kb = read_file(kb_path)

    query_template_path = "./services/prompts/query.md"
    query_template = read_file(query_template_path)

    query = query_template.replace("{{source_code}}", contract_code).replace("{{min_words}}", str(MIN_WORDS))
    # print(query)

    try:
        stream = client.chat.completions.create(
            messages=[{"role": "user", "content": query}],
            model=MODEL,
            stream=True,
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
        
    except Exception as e:
        print(f"Error querying: {e}")
        return {}