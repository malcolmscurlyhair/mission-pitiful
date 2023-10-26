import os
import re
import yaml
import faker
import openai
import unidecode

# A simple script to ask OpenAI for the the biggest N companies in the US,
# pull down their mission statement and an actual plain-language for what
# they are best know for. We omit the first sentence of the mission statement
# so things are a bit vaguer.
#
# To use this, you'll need to add an Open AI access key to you environment
# variables.

openai.api_key = os.getenv('OPEN_AI_API_KEY')

company_names      = './docs/companies.txt'
mission_statements = './docs/mission_statements.yaml'
business_models    = './docs/business_models.yaml'
data_file          = './docs/data.yaml'

HOW_MANY_COMPANIES = 500

# Grab a list of big companies, write them to a text file on disk.
if not os.path.exists(company_names):
  print(f"Fetching the top {HOW_MANY_COMPANIES} companies...")

  response = openai.Completion.create(
    engine     = "text-davinci-003",
    prompt     = f"What are the top {HOW_MANY_COMPANIES} companies in the USA by market capitalization? Just give me the names, one one each line, without number them.",
    max_tokens = 10 * HOW_MANY_COMPANIES,
    n          = 1
  )

  with open(company_names, "w") as file:
    company = unidecode.unidecode(response.choices[0].text.strip())

    if company != "":
      file.write(company)
      file.write('\n')

  print(f"Wrote the company names to {company_names}")

with open(company_names, "r") as file:
  company_names = [line.strip() for line in file.readlines()]

def slugify(name):
  slug = unidecode.unidecode(name)
  slug = slug.replace(' & ', ' and ')
  slug = slug.replace("'s", 's')
  slug = re.sub(r'[^a-z0-9-]', '-', slug.lower().strip())
  slug = re.sub(r'-+', '-', slug)

  while slug.endswith("-"):
    slug = slug[:-1]

  return slug

def clean_up_and_escape(sentence):
  sentence = unidecode.unidecode(sentence.strip())

  if sentence.startswith('"') and sentence.endswith('"'):
    sentence = sentence[1:-1]

  sentence.replace("\n", "\\\n")

  sentence = sentence.replace('"', '\\"')

  return f"\"{sentence}\""

# Grab the mission statement for each company, write them to another YAML file.
if not os.path.exists(mission_statements):
  print(f"Fetching the mission statements for {HOW_MANY_COMPANIES} companies...")

  with open(mission_statements, "w") as file:
    for i, company in enumerate(company_names):
      print(f"  Getting mission statement for {company} ({i + 1} of {HOW_MANY_COMPANIES})")

      response = openai.Completion.create(
        engine     = "text-davinci-003",
        prompt     = f"Give me the the mission statement the company \"{company}\", just the second and third sentences, (or just as many sentences up until you have 50 words), and replace the company name with BLANK. Replace any recognizable names of people or products with BLANK.",
        max_tokens = 300,
        n          = 1
      )

      file.write(f"{slugify(company)}: ")
      file.write(clean_up_and_escape(response.choices[0].text))
      file.write('\n')
      file.flush()

  print(f"Wrote the mission statements to {mission_statements}")

# Grab the actual business model for each company, and again, write it to a YAML file.
if not os.path.exists(business_models):
  print(f"Fetching the actual business models for {HOW_MANY_COMPANIES} companies...")

  with open(business_models, "w") as file:
    for i, company in enumerate(company_names):
      print(f"  Getting business model for for {company} ({i + 1} of {HOW_MANY_COMPANIES})")

      response = openai.Completion.create(
        engine     = "text-davinci-003",
        prompt     = f"In the plainest language, give me the simplest possible description of what the company \"{company}\" does or is best known for. For instance 'Sells carbonanated beverages' for Coca Cola or 'Builds phones and computers' for Apple. Omit the company name and any recognizable product names.",
        max_tokens = 100,
        n          = 1
      )

      file.write(f"{slugify(company)}: ")
      file.write(clean_up_and_escape(response.choices[0].text))
      file.write('\n')
      file.flush()

  print(f"Wrote the business models to {business_models}")

with open(mission_statements, 'r') as file:
  statements = yaml.safe_load(file)

with open(business_models, 'r') as file:
  models = yaml.safe_load(file)

# Generate the final YAML file, that contains all of the information above in a structured
# format, plus a randomly generated codename for each company (so we can build URLs without
# giving the game away.)
if not os.path.exists(data_file):
  print(f"Generating the combined YAML file")

  fake = faker.Faker()

  with open(data_file, "w") as file:
    for i, company in enumerate(company_names):
      if company.strip() == "":
        continue

      slug = slugify(company)

      file.write(f"{slug}:\n")
      file.write(f"  name:              \"{company}\"\n")

      code_name      = f"{fake.color_name()}-{fake.word('adjective')}-{fake.word('noun')}".lower()
      statement      = statements[slug].replace('"', '\\"')
      business_model = models[slug].replace('"', '\\"')

      file.write(f"  code-name:         {code_name}\n")
      file.write(f"  mission-statement: \"{statement}\"\n")
      file.write(f"  business-model:    \"{business_model}\"\n")
