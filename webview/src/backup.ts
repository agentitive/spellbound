export default null

// (function () {
//     const vscode = acquireVsCodeApi();

//     const sendButton = document.querySelector('#input-area button');
//     const inputField = document.querySelector('#input-area input');
//     const messageHistoryContainer = document.querySelector("#message-history");

//     const messages = []

//     sendButton.addEventListener("click", () => {
//       const prompt = inputField.value.trim()
//       if (prompt) {
//         // Pass the prompt to the extension
//         vscode.postMessage({
//           command: "sendPrompt",
//           messages: [...messages, { role: "system", content: prompt }],
//         })
//         inputField.value = ""
//       }
//     })

//     inputField.addEventListener('keypress', (event) => {
//       if (event.key === 'Enter') {
//         event.preventDefault();
//         sendButton.click();
//       }
//     });

//     function addMessage(message) {
//       const messageElement = document.createElement('div');
//       messageElement.className = message.type === 'input' ? 'user-message' : 'response-message';
//       messageElement.textContent = message.content;
//       messageHistoryContainer.appendChild(messageElement);

//       if (message.type === 'input') {
//         messageElement.innerHTML = message.rendered;
//       }

//       if (message.type === 'start' || message.type === 'input') {
//         messages.push({
//           role: message.type === 'input' ? 'system' : 'assistant',
//           content: message.content ?? "",
//         })
//       }
//     }
    
//     // Add a message event listener to handle 'addMessage' command
//     window.addEventListener('message', (event) => {
//       const message = event.data; // The JSON data our extension sent
//       switch (message.command) {
//         case 'sendMessage':
//           switch(message.message.type) {
//             case 'start':
//               addMessage(message.message);
//               break;
//             case 'chunk':
//               const lastResponse = document.querySelector('.response-message:last-child');

//               lastResponse.innerHTML = message.message.rendered;

//               messages[messages.length - 1].content += message.message.content;
//               break;
//             case 'done':
//               // Todo: re-enable the input area
//               break;
//             case 'input':
//               addMessage(message.message);
//               break;
//             case 'tool-result':
//               // Treat the tool result as a prompt (implement 'thought-loop')
//               vscode.postMessage({
//                 command: "sendPrompt",
//                 messages: [...messages, { role: "system", content: message.message.content }]
//               })
//               break;
//           }
//           break;
//       }
//     });
//   })();`