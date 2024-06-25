from openai import OpenAI, AssistantEventHandler
import time, json

client = OpenAI(api_key="sk-proj-qlgDp6WBcaaGXYrc1IJeT3BlbkFJUosuNsTcSO0Z13w2PQzN")
MODEL = "gpt-3.5-turbo"
KB_PATH = "./services/prompts/combination-kb.md"
QUERY_TEMPLATE_PATH = "./services/prompts/query.md"
MIN_WORDS = 1000
SEVERITIES = ['High', 'Medium', 'Low', 'Informational']

def read_file(path):
    with open (path, "r", encoding="utf-8") as f:
        return f.read()

def build_query(contract_code, severity) -> str:
    query_template = read_file(QUERY_TEMPLATE_PATH)
    query = query_template.replace("{{source_code}}", contract_code).replace("{{min_words}}", str(MIN_WORDS)).replace("{{severity_type}}", severity)
    print(query)
    return query

def build_thread(query):
    file = client.files.create(
        file=open(KB_PATH, "rb"),
        purpose='assistants'
    )

    assistant = client.beta.assistants.create(
        name="Smart Contract Specialist",
        model=MODEL,
        tools=[{"type": "code_interpreter"}],
        tool_resources={"code_interpreter": {"file_ids": [file.id]}}
    )

    thread = client.beta.threads.create(messages=[{
        "role": "user",
        "content": query
    }])

    return (assistant, thread)

def generate(contract_code, severity):
    query = build_query(contract_code, severity)
    assistant, thread = build_thread(query)

    with client.beta.threads.runs.stream(
        assistant_id=assistant.id,
        thread_id=thread.id,
    )as stream:
        for text in stream.text_deltas:
            print(text, end="", flush=True)
            yield(text)
