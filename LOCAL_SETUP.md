# Local Setup

This document provides instructions for setting up the local development environment for the Spellbound VS Code extension.

## Prerequisites

- Node.js (v19.x.x recommended)
- Visual Studio Code (v1.77.0 or later)

## Rush Monorepo

The Spellbound repository is a [Rush](https://rushjs.io/) monorepo. This means that the repository contains multiple projects, each of which is a separate Node.js package. Rush uses [pnpm](https://pnpm.io/) under the hood.

Installing Rush:

```
npm install -g @microsoft/rush pnpm
```

## Steps to set up the local development environment

1. Clone the repository using `git`:

   ```
   git clone https://github.com/agentitive/spellbound.git
   ```

2. Change into the cloned directory:

   ```
   cd spellbound
   ```

3. Install dependencies:

   ```
   rush update
   ```

4. Compile the projects:

   ```
   rush build
   ```

5. Open the project folder in Visual Studio Code:

   ```
   code .
   ```

6. Press `F5` to launch the extension in a new VS Code window.
