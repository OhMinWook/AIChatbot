from pathlib import Path
from jinja2 import Environment, FileSystemLoader

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]
templates = "templates"
env = Environment(loader=FileSystemLoader(ROOT / templates))

base_answer = "답변을 찾지 못하였습니다."

pattern1_template = env.get_template("pattern1.j2")
pattern1_1_template = env.get_template("pattern1_1.j2")
pattern2_template = env.get_template("pattern2.j2")
instruction_template = env.get_template("instruction.j2")
response_prompt_template = env.get_template("response_prompt.j2")
rewrite_template = env.get_template("query_rewrite.j2")


pattern1 = pattern1_template.render()
pattern1_1 = pattern1_1_template.render()
pattern2 = pattern2_template.render()
instruction = instruction_template.render(base_answer=base_answer)
query_rewrite = rewrite_template.render()
response_prompt = response_prompt_template.render()
