define(["underscore","services/husky/translator"],function(a,b){"use strict";var c=function(c){for(var d=a.keys(c),e=d.length,f={},g=0;g<e;g++){var h=d[g];f[h]=b.translate(c[h])}return f},d=c({filterAll:"sulu_article.list.filter.all",from:"sulu_article.authored-selection-overlay.from",to:"sulu_article.authored-selection-overlay.to",published:"public.published",unpublished:"public.unpublished",publishedWithDraft:"public.published-with-draft",shadowArticle:"sulu_article.shadow_article",filterByAuthor:"sulu_article.list.filter.by-author",filterMe:"sulu_article.list.filter.me",filterByCategory:"sulu_article.list.filter.by-category",filterByTag:"sulu_article.list.filter.by-tag",filterByPage:"sulu_article.list.filter.by-page",filterByTimescale:"sulu_article.list.filter.by-timescale"}),e={draftIcon:a.template('<span class="draft-icon" title="<%= title %>"/>'),publishedIcon:a.template('<span class="published-icon" title="<%= title %>"/>'),shadowIcon:a.template('<span class="fa-share" title="<%= title %>"></span>')};return{translations:d,getAuthoredTitle:function(a){if(!a)return d.filterAll;var b=[];return a.from&&(b.push(d.from),b.push(App.date.format(a.from+"T00:00"))),a.to&&(b.push(b.length>0?d.to.toLowerCase():d.to),b.push(App.date.format(a.to+"T00:00"))),0===b.length?d.filterAll:b.join(" ")},getPublishedTitle:function(a){return a?"published"===a?d.published:d.unpublished:d.filterAll},getFilterTitle:function(a){if(!a)return d.filterAll;switch(a.filterKey){case"filterByAuthor":return d.filterByAuthor+" "+a.contact.firstName+" "+a.contact.lastName;case"me":return d.filterMe;case"filterByCategory":return d.filterByCategory+" "+a.category.name;case"filterByTag":return d.filterByTag+" "+a.tag.name;case"filterByPage":return d.filterByPage+" "+a.page.title}return d.filterAll},generateWorkflowBadge:function(a,b){var c="",f=d.unpublished;return a.published&&!a.publishedState&&(f=d.publishedWithDraft,c+=e.publishedIcon({title:f})),a.publishedState||(c+=e.draftIcon({title:f})),b.title=c,b.cssClass="badge-none",b},generateLocalizationBadge:function(a,b,c){return a.localizationState&&"ghost"===a.localizationState.state&&a.localizationState.locale!==c?(b.title=a.localizationState.locale,b):!(!a.localizationState||"shadow"!==a.localizationState.state)&&(b.title=e.shadowIcon({title:d.shadow}),b.cssClass="badge-none badge-color-black",b)}}});