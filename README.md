<a href="https://github.com/poteat/spellbound#readme">
  <img src=https://raw.githubusercontent.com/poteat/spellbound/main/assets/logo.png>
</a>

<br>
<br>

<p align="center">
  <i>Autonomous and goal-seeking coding agents</i>
</p>

---

Spellbound is a Visual Studio Code extension that leverages the power of the OpenAI API to create an intelligent coding assistant. With Spellbound, you can harness the capabilities of cutting-edge AI to improve your coding experience and productivity.

## Installation

1. Install the Spellbound VS Code extension from the marketplace.
2. Obtain an API key for the OpenAI API and configure it in your VS Code settings.

## Local Development

To set up the local development environment for the Spellbound extension, see the [LOCAL_SETUP.md](LOCAL_SETUP.md) file.

## Usage

To use Spellbound, simply interact with your codebase as usual. Whenever you need help, type your request using natural language in a comment or in the Spellbound dialog. Spellbound will use the OpenAI API to help you generate code, troubleshoot, and offer suggestions.

## Tools

The following tools are available for use in Spellbound. The underlying AI model uses tools to solve open-ended tasks.

| Tool                     | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| cat {path}               | Read the content of a file at the given path.                                          |
| ls {path, recursive?}    | List files and folders at the given path.                                              |
| search {description}     | Search for a file or relevant information by description, via vector embedding search. |
| write {path, contents}   | Write (or overwrite) the given contents into the specified file.                       |
| replace {path, old, new} | Replace all occurrences of `old` with `new` in the specified file.                     |
| ask {question}           | Ask a question to the user.                                                            |
| npm {script}             | Run an npm script (e.g., `npm run [script]`).                                          |
| done {output?}           | Indicate that you are done with the task.                                              |

## Features

- Code generation based on natural language input
- Troubleshooting and bug fixing assistance
- Code snippet suggestions
- Integration with your existing VS Code workflow

## License

Spellbound is released under the MIT License. See the LICENSE file for the full license text.

## Poem

> In a world of magic and wonder,
> Where codes take form as lightning and thunder,
> A spellbound whisper echoes in the night,
> As programmers harness the AI's might.

> Lines of syntax blend and intertwine,
> Raising structures with power divine,
> The keystrokes dance, a graceful ballet,
> As Spellbound weaves its enchanted array.

> Moments of thought guide an intricate plan,
> As the codebase expands, its reach it will span,
> The AI and humans work side by side,
> In the realm of Spellbound, their brilliance will collide.

> From simple beginnings to a grand design,
> Spellbound empowers, transcending the line,
> A masterpiece found by the ones who dare,
> To embrace the magic, this bond that we share.
