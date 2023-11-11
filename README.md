# Mission Pitiful

Have you ever read a website and thought: I have no idea what this company 
does? This application is a little quiz that asks the user to match a number of 
anonymized mission statements to a company, then collects some totals to see 
which are most often guessed wrong.

## Architecture

The mission statements and company data are pulled from OpenAI by code in the
[`/research`](/research) directory. The [`/grab.py`](/research/grab.py) 
scripts asks OpenAI for a list of companies, their mission statements, and a 
succinct description of what each company does, then writes it to disk.

The final output is written to (`/research/docs/data.json`)
[/research/docs/data.json], which then forms the basis of the quiz. This 
data is then migrated (via the magic of cut-and-paste) to 
[`/web/src/lib/quiz.ts`](/web/src/lib/quiz.ts), around which the web app is 
build.

The web app is written using [Svelte](https://svelte.dev/docs/introduction) 
using [Tailwind](https://tailwindcss.com/docs) for styling. It's a simple 
app with a handful of pages, that quizzes the user on 10 mission statements 
then gives them a score. Following the Svelte Sverdle template example, I've 
tried to use progressive enhancement, so the app will work even with 
JavaScript disable.

## Deployment

I haven't figured this out yet.
