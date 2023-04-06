# Spellbound Architecture Overview

The Spellbound codebase can be categorized into multiple parts:

1. `apps/spellbound`: This is the main extension folder containing the source code for the Spellbound VS Code extension.
   - `src`: Contains the source code of the extension, including commands, tools, and APIs.
   - `assets`: Contains the assets used by the extension, such as images and sample markdown files.

2. `apps/spellbound-ui`: This folder contains the React-based user interface used in the extension's chatbox.
   - `src`: Contains the source code for the UI, including components, utilities, styles, and Redux store.

3. `apps/spellbound-shared`: This folder contains shared TypeScript code used by both the extension and the UI.
   - `src`: Contains the shared code, such as TypeScript type definitions and the BiDirectional Reactive Procedural Script (biRPC) library for communication between webviews and extensions.

4. `apps/agentitive-site`: This folder contains the source code for the documentation site generated with Docusaurus.
   - `docs`: Contains markdown files for the documentation.
   - `src`: Contains custom components and CSS for the documentation site.

5. Other folders and configuration files:
   - `.vscode`: Configurations for the workspace.
   - `rigs`: Contains various configurations and scripts for the repository.
