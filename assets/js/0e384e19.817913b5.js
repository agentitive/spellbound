"use strict";(self.webpackChunkagentitive_site=self.webpackChunkagentitive_site||[]).push([[671],{9545:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var a=n(7361),l=(n(6393),n(158));const i={sidebar_position:1},r="Spellbound",o={unversionedId:"intro",id:"intro",title:"Spellbound",description:"Spellbound is a Visual Studio Code extension that leverages the power of the OpenAI API to create an intelligent coding assistant. With Spellbound, you can harness the capabilities of cutting-edge AI to improve your coding experience and productivity.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/docs/intro",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docs",next:{title:"Local Setup",permalink:"/docs/local_dev"}},s={},d=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"Extension Settings",id:"extension-settings",level:2},{value:"Configuring Settings",id:"configuring-settings",level:3},{value:"Tools",id:"tools",level:2},{value:"Features",id:"features",level:2},{value:"Local Development",id:"local-development",level:2},{value:"License",id:"license",level:2}],p={toc:d},u="wrapper";function m(e){let{components:t,...n}=e;return(0,l.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"spellbound"},"Spellbound"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Spellbound")," is a ",(0,l.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=mpoteat-vsce.spellbound"},"Visual Studio Code extension")," that leverages the power of the OpenAI API to create an intelligent coding assistant. With ",(0,l.kt)("em",{parentName:"p"},"Spellbound"),", you can harness the capabilities of cutting-edge AI to improve your coding experience and productivity."),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"Install the Spellbound VS Code extension from the marketplace."),(0,l.kt)("li",{parentName:"ol"},"Obtain an API key for the OpenAI API and configure it in your VS Code settings."),(0,l.kt)("li",{parentName:"ol"},"Obtain a Pinecone API key, create a Pinecone index, and configure it in your VS Code settings.")),(0,l.kt)("h2",{id:"usage"},"Usage"),(0,l.kt)("p",null,"To use Spellbound, simply interact with your codebase as usual. Whenever you need help, type your request in the Spellbound dialog. Spellbound will use the OpenAI API to help you generate code, troubleshoot, and offer suggestions."),(0,l.kt)("p",null,'Spellbound uses a "thought/action" control loop to create an autonomous coding agent, as described in the ',(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("a",{parentName:"strong",href:"https://arxiv.org/abs/2210.03629"},"ReAct paper")),". The agent is able to take actions based on its current thoughts, and its future thoughts are influenced by the results of its actions."),(0,l.kt)("h2",{id:"extension-settings"},"Extension Settings"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Scope"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"spellbound.model"),(0,l.kt)("td",{parentName:"tr",align:null},"Select the AI model used by the Spellbound extension"),(0,l.kt)("td",{parentName:"tr",align:null},"gpt-4"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"spellbound.openai_api_key"),(0,l.kt)("td",{parentName:"tr",align:null},"Enter your OpenAI API key here, used for inference."),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"machine")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"spellbound.pinecone_api_key"),(0,l.kt)("td",{parentName:"tr",align:null},"Enter your Pinecone API key here, used for search."),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"machine")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"spellbound.pinecone_index"),(0,l.kt)("td",{parentName:"tr",align:null},"Enter your Pinecone index name here, used for search"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"machine")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"spellbound.pinecone_environment"),(0,l.kt)("td",{parentName:"tr",align:null},"Enter your Pinecone environment here, used for search"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"machine")))),(0,l.kt)("h3",{id:"configuring-settings"},"Configuring Settings"),(0,l.kt)("p",null,'To configure the extension settings, open the Settings editor in Visual Studio Code by clicking on the gear icon in the lower left corner and selecting "Settings" from the menu. In the search bar, type "Spellbound" to filter the settings related to the extension. You can then enter your API keys and select the preferred model from the available options.'),(0,l.kt)("p",null,"Environment variables ",(0,l.kt)("inlineCode",{parentName:"p"},"OPENAI_API_KEY")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"PINECONE_API_KEY")," will be used in place of the settings if they are set."),(0,l.kt)("h2",{id:"tools"},"Tools"),(0,l.kt)("p",null,"The following tools are available for use in Spellbound. The underlying AI model uses tools to solve open-ended tasks."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Tool"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"cat {path}"),(0,l.kt)("td",{parentName:"tr",align:null},"Read the content of a file at the given path.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ls {path, recursive?}"),(0,l.kt)("td",{parentName:"tr",align:null},"List files and folders at the given path.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"search {description}"),(0,l.kt)("td",{parentName:"tr",align:null},"Search for a file or relevant information by description, via vector embedding search.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"write {path, contents}"),(0,l.kt)("td",{parentName:"tr",align:null},"Write (or overwrite) the given contents into the specified file.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"replace {path, old, new}"),(0,l.kt)("td",{parentName:"tr",align:null},"Replace all occurrences of ",(0,l.kt)("inlineCode",{parentName:"td"},"old")," with ",(0,l.kt)("inlineCode",{parentName:"td"},"new")," in the specified file.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"ask {question}"),(0,l.kt)("td",{parentName:"tr",align:null},"Ask a question to the user.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"npm {script}"),(0,l.kt)("td",{parentName:"tr",align:null},"Run an npm script (e.g., ",(0,l.kt)("inlineCode",{parentName:"td"},"npm run [script]"),").")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"done {output?}"),(0,l.kt)("td",{parentName:"tr",align:null},"Indicate that you are done with the task.")))),(0,l.kt)("h2",{id:"features"},"Features"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Code generation based on natural language input"),(0,l.kt)("li",{parentName:"ul"},"Troubleshooting and bug fixing assistance"),(0,l.kt)("li",{parentName:"ul"},"Documentation writing and code critique"),(0,l.kt)("li",{parentName:"ul"},"Autonomous and goal-seeking coding agents"),(0,l.kt)("li",{parentName:"ul"},"Integration with your existing VS Code workflow")),(0,l.kt)("h2",{id:"local-development"},"Local Development"),(0,l.kt)("p",null,"To set up the local development environment for the Spellbound extension, see the ",(0,l.kt)("a",{parentName:"p",href:"/docs/local_dev"},"local development docs")," file."),(0,l.kt)("h2",{id:"license"},"License"),(0,l.kt)("p",null,"Spellbound is released under the MIT License. See the LICENSE file for the full license text."))}m.isMDXComponent=!0}}]);