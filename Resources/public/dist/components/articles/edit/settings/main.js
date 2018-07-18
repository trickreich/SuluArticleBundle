define(["underscore","jquery","config","sulusecurity/components/users/models/user","sulucontact/models/contact","services/suluarticle/article-manager","services/suluarticle/article-router","text!/admin/articles/template/settings.html"],function(a,b,c,d,e,f,g,h){"use strict";var i={templates:{form:h},translations:{author:"sulu_article.author",authored:"sulu_article.form.settings.changelog.authored",authoredOnly:"sulu_article.form.settings.changelog.authored-only",changelog:"sulu_article.form.settings.changelog",changed:"sulu_article.form.settings.changelog.changed",changedOnly:"sulu_article.form.settings.changelog.changed-only",created:"sulu_article.form.settings.changelog.created",createdOnly:"sulu_article.form.settings.changelog.created-only",shadowArticle:"sulu_article.shadow_article",shadowEnable:"sulu_article.form.settings.shadow.enable",publishedShadow:"sulu_article.published-shadow",shadowBaseLanguage:"sulu_article.form.settings.shadow.base_language",webspaceSettings:"sulu_article.form.settings.webspace_settings",webspaceSettingsCustomizeEnable:"sulu_article.form.settings.webspace_settings.customize_enable",webspaceSettingsMainWebspace:"sulu_article.form.settings.webspace_settings.main_webspace",webspaceSettingsAdditionalWebspaces:"sulu_article.form.settings.webspace_settings.additional_webspaces"}},j=function(){return this.sandbox.dom.prop("#shadow_on_checkbox","checked")},k=function(){return this.sandbox.dom.prop("#customize_on_checkbox","checked")};return{type:"form-tab",defaults:i,authorFullname:null,disableWebspaceSettingsForm:!1,parseData:function(a){return a.routePath&&"object"==typeof a.routePath&&a.routePath.hasOwnProperty("page")&&(this.disableWebspaceSettingsForm=!0),{id:a.id,author:a.author,authored:a.authored,creator:a.creator,changer:a.changer,created:a.created,changed:a.changed,concreteLanguages:a.concreteLanguages,enabledShadowLanguages:a.enabledShadowLanguages,shadowOn:a.shadowOn,shadowBaseLanguage:a.shadowBaseLanguage,mainWebspace:a.mainWebspace,additionalWebspaces:a.additionalWebspaces}},render:function(a){this.data=a,this.$el.html(this.getTemplate()),this.createForm(a),c.get("sulu-content").versioning.enabled&&this.sandbox.start([{name:"datagrid@husky",options:{el:"#versions",instanceName:"versions",url:f.getVersionsUrl(a.id,this.options.locale),resultKey:"versions",actionCallback:this.restoreVersion.bind(this),viewOptions:{table:{actionIcon:"history",actionColumn:"authored",selectItem:!1}},matchings:[{name:"authored",attribute:"authored",content:this.sandbox.translate("sulu-document-manager.version.authored"),type:"datetime"},{name:"author",attribute:"author",content:this.sandbox.translate("sulu-document-manager.version.author")}]}}]),c.get("sulu_article").showWebspaceSettings&&(this.updateWebspaceSettingsComponents(!0),this.updateVisibilityForWebspaceSettingsCustomizeCheckbox(!0)),this.startShadowSelect(),this.updateVisibilityForShadowCheckbox(!0),this.rendered()},startShadowSelect:function(){var a,b=[],c=null;void 0!==this.data.enabledShadowLanguages[this.options.locale]&&(c=this.data.enabledShadowLanguages[this.options.locale]),this.sandbox.util.each(this.data.concreteLanguages,function(a,d){if(this.options.locale!==d){var e=!1;c===d&&(e=!0),b.push({id:d,name:d,disabled:e})}}.bind(this)),a=this.data.shadowBaseLanguage,0===b.length&&(b=[{id:-1,name:this.sandbox.translate("sulu.content.form.settings.shadow.no_base_language"),disabled:!0}]),this.sandbox.start([{name:"select@husky",options:{el:"#shadow_base_language_select",instanceName:"settings",multipleSelect:!1,defaultLabel:this.sandbox.translate("sulu.content.form.settings.shadow.select_base_language"),data:b,preSelectedElements:[a]}}]),this.data.shadowOn&&this.sandbox.dom.attr("#shadow_on_checkbox","checked",!0)},updateVisibilityForShadowCheckbox:function(a){var b=j.call(this),c=this.sandbox.dom.find("#shadow-container .input-description");b?(this.sandbox.emit("sulu.article.show-save-items","shadow"),c.show()):(this.sandbox.emit("sulu.article.show-save-items","content"),c.hide()),a||this.sandbox.emit("sulu.tab.dirty")},getSelectedMainWebspace:function(){var a=void 0;return this.sandbox.emit("husky.select.main_webspace_select.get-checked",function(b){a=b[0]}.bind(this)),a},getSelectedAdditionalWebspace:function(){var a=void 0;return this.sandbox.emit("husky.select.additional_webspace_multi_select.get-checked",function(b){a=b}.bind(this)),a},updateWebspaceSettingsComponents:function(a){var d,e,f=c.get("sulu_article");a?(d=this.data.mainWebspace?this.data.mainWebspace:f.defaultMainWebspace,e=this.data.additionalWebspaces?this.data.additionalWebspaces:f.defaultAdditionalWebspaces):(d=this.getSelectedMainWebspace(),e=this.getSelectedAdditionalWebspace());var g=[],h=[],i=[],j=[];return this.sandbox.util.each(f.webspaces,function(a,b){return g.push(b),d===b.id?void i.push(b.id):(h.push(b),void(e.indexOf(b.id)>-1&&j.push(b.id)))}.bind(this)),a?(this.disableWebspaceSettingsForm&&b("#customize_on_checkbox").attr("disabled","disabled"),this.sandbox.start([{name:"select@husky",options:{disabled:this.disableWebspaceSettingsForm,el:"#main_webspace_select",instanceName:"main_webspace_select",multipleSelect:!1,data:g,preSelectedElements:[i],defaultLabel:this.sandbox.translate("dropdown.please-choose")}}]),this.sandbox.start([{name:"select@husky",options:{disabled:this.disableWebspaceSettingsForm,el:"#additional_webspace_multi_select",instanceName:"additional_webspace_multi_select",multipleSelect:!0,data:h,preSelectedElements:j,defaultLabel:this.sandbox.translate("dropdown.please-choose"),checkedAllLabel:this.sandbox.translate("public.all")}}]),void(this.data.mainWebspace&&this.sandbox.dom.attr("#customize_on_checkbox","checked",!0))):(this.sandbox.emit("husky.select.main_webspace_select.update",g,i,!1),void this.sandbox.emit("husky.select.additional_webspace_multi_select.update",h,j,!1))},updateVisibilityForWebspaceSettingsCustomizeCheckbox:function(a){var b=k.call(this),c=this.sandbox.dom.find("#webspace-settings-info-default"),d=this.sandbox.dom.find("#webspace-settings-customize-form");b?(c.hide(),d.show()):(d.hide(),c.show()),a||this.sandbox.emit("sulu.tab.dirty")},rendered:function(){this.updateChangelog(this.data),this.bindDomEvents(),this.bindEvents(),this.listenForChange()},submit:function(b){if(this.sandbox.form.validate(this.formId)){var c=this.sandbox.form.getData(this.formId),d=this.sandbox.dom.data("#shadow_base_language_select","selectionValues");c.mainWebspace=null,c.additionalWebspaces=null,k.call(this)&&(c.mainWebspace=this.getSelectedMainWebspace(),c.additionalWebspaces=this.getSelectedAdditionalWebspace()),c.shadowOn=j.call(this),c.shadowBaseLanguage=null,c.shadowOn&&d&&d.length>0&&(c.shadowBaseLanguage=d[0]),a.each(c,function(a,b){this.data[b]=a}.bind(this)),this.save(this.data,b)}},save:function(a,b){f.save(a,a.id,this.options.locale,b).then(function(b){this.saved(a),this.sandbox.emit("sulu.tab.saved",b.id,b)}.bind(this)).fail(function(b){this.sandbox.emit("sulu.article.error",b.status,b.responseJSON.code||0,a)}.bind(this))},saved:function(a){this.data=this.parseData(a)},getTemplate:function(){return this.templates.form({translations:this.translations,config:c.get("sulu_article")})},getFormId:function(){return"#settings-form"},listenForChange:function(){this.sandbox.dom.on(this.formId,"change keyup",this.setDirty.bind(this)),this.sandbox.on("sulu.content.changed",this.setDirty.bind(this)),this.sandbox.on("husky.ckeditor.changed",this.setDirty.bind(this))},setAuthorChangelog:function(a,b,c){var d,e=this.sandbox.date.format(b,!0);a||c||(a=this.authorFullname),a?(this.authorFullname=a,d=this.sandbox.util.sprintf(this.translations.authored,{author:a,authored:e})):(this.authorFullname=null,d=this.sandbox.util.sprintf(this.translations.authoredOnly,{authored:e})),this.sandbox.dom.text("#author",d)},setCreationChangelog:function(a,b){var c,d=this.sandbox.date.format(b,!0);c=a?this.sandbox.util.sprintf(this.translations.created,{creator:a,created:d}):this.sandbox.util.sprintf(this.translations.createdOnly,{created:d}),this.sandbox.dom.text("#created",c)},setChangeChangelog:function(a,b){var c,d=this.sandbox.date.format(b,!0);c=a?this.sandbox.util.sprintf(this.translations.changed,{changer:a,changed:d}):this.sandbox.util.sprintf(this.translations.changedOnly,{changed:d}),this.sandbox.dom.text("#changed",c)},updateChangelog:function(a){var c=b.Deferred(),d=b.Deferred(),e=b.Deferred();a.creator&&a.changer&&a.creator===a.changer?this.loadUser(a.creator).done(function(b){c.resolve(b.get("fullName"),a.created),d.resolve(b.get("fullName"),a.changed)}.bind(this)).fail(function(){c.resolve(null,a.created),d.resolve(null,a.changed)}.bind(this)):(this.loadUser(a.creator).done(function(b){c.resolve(b.get("fullName"),a.created)}.bind(this)).fail(function(){c.resolve(null,a.created)}.bind(this)),this.loadUser(a.changer).done(function(b){d.resolve(b.get("fullName"),a.changed)}.bind(this)).fail(function(){d.resolve(null,a.changed)}.bind(this))),a.author?this.loadContact(a.author).done(function(b){e.resolve(b.get("fullName"),new Date(a.authored))}.bind(this)).fail(function(){e.resolve(null,new Date(a.authored))}.bind(this)):e.resolve(null,new Date(a.authored)),this.sandbox.data.when(c,d,e).then(function(a,b,c){this.setCreationChangelog(a[0],a[1]),this.setChangeChangelog(b[0],b[1]),this.setAuthorChangelog(c[0],c[1]),this.sandbox.dom.show("#changelog-container")}.bind(this))},loadUser:function(a){var c=b.Deferred();if(!a)return c.reject(),c;var e=new d({id:a});return e.fetch({global:!1,success:function(a){c.resolve(a)}.bind(this),error:function(){c.reject()}.bind(this)}),c},loadContact:function(a){var c=b.Deferred(),d=new e({id:a});return d.fetch({global:!1,success:function(a){c.resolve(a)}.bind(this),error:function(){c.reject()}.bind(this)}),c},bindDomEvents:function(){this.sandbox.dom.on("#change-author","click",function(){this.openAuthorSelection()}.bind(this)),this.sandbox.dom.on("#shadow_on_checkbox","click",function(){this.updateVisibilityForShadowCheckbox(!1)}.bind(this)),this.sandbox.dom.on("#customize_on_checkbox","click",function(){this.updateVisibilityForWebspaceSettingsCustomizeCheckbox(!1)}.bind(this))},bindEvents:function(){this.sandbox.on("husky.select.main_webspace_select.selected.item",function(){this.updateWebspaceSettingsComponents()}.bind(this))},openAuthorSelection:function(){var a=b("<div/>"),c=b("<div/>");this.$el.append(a),this.sandbox.start([{name:"overlay@husky",options:{el:a,instanceName:"author-selection",openOnStart:!0,removeOnClose:!0,skin:"medium",slides:[{title:this.translations.author,okCallback:function(){this.sandbox.emit("sulu.content.contents.get-author")}.bind(this),data:c}]}}]),this.sandbox.once("husky.overlay.author-selection.initialized",function(){this.sandbox.start([{name:"content/settings/author-selection@sulucontent",options:{el:c,locale:this.options.locale,data:{author:this.data.author,authored:this.data.authored},nullableAuthor:!this.options.config.defaultAuthor,selectCallback:function(a){this.setAuthor(a),this.sandbox.emit("husky.overlay.author-selection.close")}.bind(this)}}])}.bind(this))},setAuthor:function(a){return this.setDirty(),this.data.authored=a.authored,this.data.author=a.author,a.authorItem?void this.setAuthorChangelog(a.authorItem.firstName+" "+a.authorItem.lastName,new Date(a.authored)):void this.setAuthorChangelog(null,new Date(a.authored),!0)},restoreVersion:function(a,b){this.sandbox.sulu.showConfirmationDialog({callback:function(c){if(c)return this.sandbox.emit("husky.overlay.alert.show-loader"),f.restoreVersion(this.options.id,a,b.locale).always(function(){this.sandbox.emit("husky.overlay.alert.hide-loader")}.bind(this)).then(function(){this.sandbox.emit("husky.overlay.alert.close"),g.toEditForce(this.data.id,this.options.locale)}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","sulu.content.restore-error-description","sulu.content.restore-error-title")}.bind(this)),!1}.bind(this),title:this.sandbox.translate("sulu-document-manager.restore-confirmation-title"),description:this.sandbox.translate("sulu-document-manager.restore-confirmation-description")})}}});