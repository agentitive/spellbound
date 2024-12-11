"use strict";(self.webpackChunkagentitive_site=self.webpackChunkagentitive_site||[]).push([[422],{8784:(e,t,a)=>{a.d(t,{A:()=>p});var l=a(829),n=a(2663),r=a(7244),i=a(1110),s=a(113),o=a(1715);const m={sidebar:"sidebar_mp2U",sidebarItemTitle:"sidebarItemTitle_y6zo",sidebarItemList:"sidebarItemList_z5wB",sidebarItem:"sidebarItem_TH3R",sidebarItemLink:"sidebarItemLink_Z_zA",sidebarItemLinkActive:"sidebarItemLinkActive_mgqs"};function c(e){let{sidebar:t}=e;return l.createElement("aside",{className:"col col--3"},l.createElement("nav",{className:(0,n.A)(m.sidebar,"thin-scrollbar"),"aria-label":(0,o.T)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,n.A)(m.sidebarItemTitle,"margin-bottom--md")},t.title),l.createElement("ul",{className:(0,n.A)(m.sidebarItemList,"clean-list")},t.items.map((e=>l.createElement("li",{key:e.permalink,className:m.sidebarItem},l.createElement(s.A,{isNavLink:!0,to:e.permalink,className:m.sidebarItemLink,activeClassName:m.sidebarItemLinkActive},e.title)))))))}var u=a(45);function d(e){let{sidebar:t}=e;return l.createElement("ul",{className:"menu__list"},t.items.map((e=>l.createElement("li",{key:e.permalink,className:"menu__list-item"},l.createElement(s.A,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active"},e.title)))))}function g(e){return l.createElement(u.GX,{component:d,props:e})}function h(e){let{sidebar:t}=e;const a=(0,i.l)();return t?.items.length?"mobile"===a?l.createElement(g,{sidebar:t}):l.createElement(c,{sidebar:t}):null}function p(e){const{sidebar:t,toc:a,children:i,...s}=e,o=t&&t.items.length>0;return l.createElement(r.A,s,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},l.createElement(h,{sidebar:t}),l.createElement("main",{className:(0,n.A)("col",{"col--7":o,"col--9 col--offset-1":!o}),itemScope:!0,itemType:"http://schema.org/Blog"},i),a&&l.createElement("div",{className:"col col--2"},a))))}},4377:(e,t,a)=>{a.d(t,{A:()=>R});var l=a(829),n=a(2663),r=a(1192),i=a(2971);function s(e){let{children:t,className:a}=e;const{frontMatter:n,assets:s}=(0,r.e)(),{withBaseUrl:o}=(0,i.h)(),m=s.image??n.image;return l.createElement("article",{className:a,itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},m&&l.createElement("meta",{itemProp:"image",content:o(m,{absolute:!0})}),t)}var o=a(113);const m={title:"title_RtrX"};function c(e){let{className:t}=e;const{metadata:a,isBlogPostPage:i}=(0,r.e)(),{permalink:s,title:c}=a,u=i?"h1":"h2";return l.createElement(u,{className:(0,n.A)(m.title,t),itemProp:"headline"},i?c:l.createElement(o.A,{itemProp:"url",to:s},c))}var u=a(1715),d=a(2666);const g={container:"container_L0IA"};function h(e){let{readingTime:t}=e;const a=function(){const{selectMessage:e}=(0,d.W)();return t=>{const a=Math.ceil(t);return e(a,(0,u.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))}}();return l.createElement(l.Fragment,null,a(t))}function p(e){let{date:t,formattedDate:a}=e;return l.createElement("time",{dateTime:t,itemProp:"datePublished"},a)}function E(){return l.createElement(l.Fragment,null," \xb7 ")}function b(e){let{className:t}=e;const{metadata:a}=(0,r.e)(),{date:i,formattedDate:s,readingTime:o}=a;return l.createElement("div",{className:(0,n.A)(g.container,"margin-vert--md",t)},l.createElement(p,{date:i,formattedDate:s}),void 0!==o&&l.createElement(l.Fragment,null,l.createElement(E,null),l.createElement(h,{readingTime:o})))}function f(e){return e.href?l.createElement(o.A,e):l.createElement(l.Fragment,null,e.children)}function v(e){let{author:t,className:a}=e;const{name:r,title:i,url:s,imageURL:o,email:m}=t,c=s||m&&`mailto:${m}`||void 0;return l.createElement("div",{className:(0,n.A)("avatar margin-bottom--sm",a)},o&&l.createElement(f,{href:c,className:"avatar__photo-link"},l.createElement("img",{className:"avatar__photo",src:o,alt:r})),r&&l.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},l.createElement("div",{className:"avatar__name"},l.createElement(f,{href:c,itemProp:"url"},l.createElement("span",{itemProp:"name"},r))),i&&l.createElement("small",{className:"avatar__subtitle",itemProp:"description"},i)))}const A={authorCol:"authorCol_BPbS",imageOnlyAuthorRow:"imageOnlyAuthorRow_ARgd",imageOnlyAuthorCol:"imageOnlyAuthorCol_bMF_"};function N(e){let{className:t}=e;const{metadata:{authors:a},assets:i}=(0,r.e)();if(0===a.length)return null;const s=a.every((e=>{let{name:t}=e;return!t}));return l.createElement("div",{className:(0,n.A)("margin-top--md margin-bottom--sm",s?A.imageOnlyAuthorRow:"row",t)},a.map(((e,t)=>l.createElement("div",{className:(0,n.A)(!s&&"col col--6",s?A.imageOnlyAuthorCol:A.authorCol),key:t},l.createElement(v,{author:{...e,imageURL:i.authorsImageUrls[t]??e.imageURL}})))))}function _(){return l.createElement("header",null,l.createElement(c,null),l.createElement(b,null),l.createElement(N,null))}var P=a(5868),k=a(4098);function T(e){let{children:t,className:a}=e;const{isBlogPostPage:i}=(0,r.e)();return l.createElement("div",{id:i?P.blogPostContainerID:void 0,className:(0,n.A)("markdown",a),itemProp:"articleBody"},l.createElement(k.A,null,t))}var I=a(34),w=a(2219),L=a(1442);function y(){return l.createElement("b",null,l.createElement(u.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))}function F(e){const{blogPostTitle:t,...a}=e;return l.createElement(o.A,(0,L.A)({"aria-label":(0,u.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t})},a),l.createElement(y,null))}const B={blogPostFooterDetailsFull:"blogPostFooterDetailsFull_aLn5"};function C(){const{metadata:e,isBlogPostPage:t}=(0,r.e)(),{tags:a,title:i,editUrl:s,hasTruncateMarker:o}=e,m=!t&&o,c=a.length>0;return c||m||s?l.createElement("footer",{className:(0,n.A)("row docusaurus-mt-lg",t&&B.blogPostFooterDetailsFull)},c&&l.createElement("div",{className:(0,n.A)("col",{"col--9":m})},l.createElement(w.A,{tags:a})),t&&s&&l.createElement("div",{className:"col margin-top--sm"},l.createElement(I.A,{editUrl:s})),m&&l.createElement("div",{className:(0,n.A)("col text--right",{"col--3":c})},l.createElement(F,{blogPostTitle:i,to:e.permalink}))):null}function R(e){let{children:t,className:a}=e;const i=function(){const{isBlogPostPage:e}=(0,r.e)();return e?void 0:"margin-bottom--xl"}();return l.createElement(s,{className:(0,n.A)(i,a)},l.createElement(_,null),l.createElement(T,null,t),l.createElement(C,null))}},34:(e,t,a)=>{a.d(t,{A:()=>c});var l=a(829),n=a(1715),r=a(6608),i=a(1442),s=a(2663);const o={iconEdit:"iconEdit_IdCo"};function m(e){let{className:t,...a}=e;return l.createElement("svg",(0,i.A)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,s.A)(o.iconEdit,t),"aria-hidden":"true"},a),l.createElement("g",null,l.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function c(e){let{editUrl:t}=e;return l.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:r.G.common.editThisPage},l.createElement(m,null),l.createElement(n.A,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},1733:(e,t,a)=>{a.d(t,{A:()=>i});var l=a(829),n=a(2663),r=a(113);function i(e){const{permalink:t,title:a,subLabel:i,isNext:s}=e;return l.createElement(r.A,{className:(0,n.A)("pagination-nav__link",s?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},i&&l.createElement("div",{className:"pagination-nav__sublabel"},i),l.createElement("div",{className:"pagination-nav__label"},a))}},2219:(e,t,a)=>{a.d(t,{A:()=>o});var l=a(829),n=a(2663),r=a(1715),i=a(8889);const s={tags:"tags_dIhu",tag:"tag_wxnY"};function o(e){let{tags:t}=e;return l.createElement(l.Fragment,null,l.createElement("b",null,l.createElement(r.A,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),l.createElement("ul",{className:(0,n.A)(s.tags,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:a}=e;return l.createElement("li",{key:a,className:s.tag},l.createElement(i.A,{label:t,permalink:a}))}))))}},1192:(e,t,a)=>{a.d(t,{e:()=>s,i:()=>i});var l=a(829),n=a(3237);const r=l.createContext(null);function i(e){let{children:t,content:a,isBlogPostPage:n=!1}=e;const i=function(e){let{content:t,isBlogPostPage:a}=e;return(0,l.useMemo)((()=>({metadata:t.metadata,frontMatter:t.frontMatter,assets:t.assets,toc:t.toc,isBlogPostPage:a})),[t,a])}({content:a,isBlogPostPage:n});return l.createElement(r.Provider,{value:i},t)}function s(){const e=(0,l.useContext)(r);if(null===e)throw new n.dV("BlogPostProvider");return e}},2666:(e,t,a)=>{a.d(t,{W:()=>m});var l=a(829),n=a(7824);const r=["zero","one","two","few","many","other"];function i(e){return r.filter((t=>e.includes(t)))}const s={locale:"en",pluralForms:i(["one","other"]),select:e=>1===e?"one":"other"};function o(){const{i18n:{currentLocale:e}}=(0,n.A)();return(0,l.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:i(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),s}}),[e])}function m(){const e=o();return{selectMessage:(t,a)=>function(e,t,a){const l=e.split("|");if(1===l.length)return l[0];l.length>a.pluralForms.length&&console.error(`For locale=${a.locale}, a maximum of ${a.pluralForms.length} plural forms are expected (${a.pluralForms.join(",")}), but the message contains ${l.length}: ${e}`);const n=a.select(t),r=a.pluralForms.indexOf(n);return l[Math.min(r,l.length-1)]}(a,t,e)}}}}]);