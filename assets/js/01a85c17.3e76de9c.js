"use strict";(self.webpackChunkagentitive_site=self.webpackChunkagentitive_site||[]).push([[209],{8784:(e,t,a)=>{a.d(t,{A:()=>E});var l=a(829),r=a(2663),s=a(7244),n=a(1110),i=a(113),c=a(1715);const m={sidebar:"sidebar_mp2U",sidebarItemTitle:"sidebarItemTitle_y6zo",sidebarItemList:"sidebarItemList_z5wB",sidebarItem:"sidebarItem_TH3R",sidebarItemLink:"sidebarItemLink_Z_zA",sidebarItemLinkActive:"sidebarItemLinkActive_mgqs"};function o(e){let{sidebar:t}=e;return l.createElement("aside",{className:"col col--3"},l.createElement("nav",{className:(0,r.A)(m.sidebar,"thin-scrollbar"),"aria-label":(0,c.T)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,r.A)(m.sidebarItemTitle,"margin-bottom--md")},t.title),l.createElement("ul",{className:(0,r.A)(m.sidebarItemList,"clean-list")},t.items.map((e=>l.createElement("li",{key:e.permalink,className:m.sidebarItem},l.createElement(i.A,{isNavLink:!0,to:e.permalink,className:m.sidebarItemLink,activeClassName:m.sidebarItemLinkActive},e.title)))))))}var b=a(45);function d(e){let{sidebar:t}=e;return l.createElement("ul",{className:"menu__list"},t.items.map((e=>l.createElement("li",{key:e.permalink,className:"menu__list-item"},l.createElement(i.A,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active"},e.title)))))}function g(e){return l.createElement(b.GX,{component:d,props:e})}function u(e){let{sidebar:t}=e;const a=(0,n.l)();return t?.items.length?"mobile"===a?l.createElement(g,{sidebar:t}):l.createElement(o,{sidebar:t}):null}function E(e){const{sidebar:t,toc:a,children:n,...i}=e,c=t&&t.items.length>0;return l.createElement(s.A,i,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},l.createElement(u,{sidebar:t}),l.createElement("main",{className:(0,r.A)("col",{"col--7":c,"col--9 col--offset-1":!c}),itemScope:!0,itemType:"http://schema.org/Blog"},n),a&&l.createElement("div",{className:"col col--2"},a))))}},3956:(e,t,a)=>{a.r(t),a.d(t,{default:()=>E});var l=a(829),r=a(2663),s=a(1715);const n=()=>(0,s.T)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});var i=a(1045),c=a(6608),m=a(8784),o=a(8889);const b={tag:"tag_ZH28"};function d(e){let{letterEntry:t}=e;return l.createElement("article",null,l.createElement("h2",null,t.letter),l.createElement("ul",{className:"padding--none"},t.tags.map((e=>l.createElement("li",{key:e.permalink,className:b.tag},l.createElement(o.A,e))))),l.createElement("hr",null))}function g(e){let{tags:t}=e;const a=function(e){const t={};return Object.values(e).forEach((e=>{const a=function(e){return e[0].toUpperCase()}(e.label);t[a]??=[],t[a].push(e)})),Object.entries(t).sort(((e,t)=>{let[a]=e,[l]=t;return a.localeCompare(l)})).map((e=>{let[t,a]=e;return{letter:t,tags:a.sort(((e,t)=>e.label.localeCompare(t.label)))}}))}(t);return l.createElement("section",{className:"margin-vert--lg"},a.map((e=>l.createElement(d,{key:e.letter,letterEntry:e}))))}var u=a(7600);function E(e){let{tags:t,sidebar:a}=e;const s=n();return l.createElement(i.e3,{className:(0,r.A)(c.G.wrapper.blogPages,c.G.page.blogTagsListPage)},l.createElement(i.be,{title:s}),l.createElement(u.A,{tag:"blog_tags_list"}),l.createElement(m.A,{sidebar:a},l.createElement("h1",null,s),l.createElement(g,{tags:t})))}}}]);