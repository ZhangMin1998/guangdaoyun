(function(e,o){typeof exports=='object'&&typeof module<'u'?module.exports=o():typeof define=='function'&&define.amd?define(o):(e=typeof globalThis<'u'?globalThis:e||self,e.FcDesignerZhCn=o())})(this,function(){'use strict';return{ name:'zh-cn',form:{ field:'\u5B57\u6BB5 ID',title:'\u5B57\u6BB5\u540D\u79F0',info:'\u63D0\u793A\u4FE1\u606F',control:'\u8054\u52A8\u6570\u636E',clear:'\u6E05\u7A7A\u503C',refresh:'\u5237\u65B0',labelPosition:'\u6807\u7B7E\u4F4D\u7F6E',size:'\u8868\u5355\u5C3A\u5BF8',labelWidth:'\u6807\u7B7E\u5BBD\u5EA6',hideRequiredAsterisk:'\u9690\u85CF\u5FC5\u586B\u5B57\u6BB5\u7684\u6807\u7B7E\u65C1\u8FB9\u7684\u7EA2\u8272\u661F\u53F7',showMessage:'\u663E\u793A\u6821\u9A8C\u9519\u8BEF\u4FE1\u606F',inlineMessage:'\u4EE5\u884C\u5185\u5F62\u5F0F\u5C55\u793A\u6821\u9A8C\u4FE1\u606F',submitBtn:'\u662F\u5426\u663E\u793A\u8868\u5355\u63D0\u4EA4\u6309\u94AE',resetBtn:'\u662F\u5426\u663E\u793A\u8868\u5355\u91CD\u7F6E\u6309\u94AE',submit:'\u63D0\u4EA4',reset:'\u91CD\u7F6E' },validate:{ type:'\u5B57\u6BB5\u7C7B\u578B',typePlaceholder:'\u8BF7\u9009\u62E9',trigger:'\u89E6\u53D1\u65B9\u5F0F',mode:'\u9A8C\u8BC1\u65B9\u5F0F',modes:{ required:'\u5FC5\u586B',pattern:'\u6B63\u5219\u8868\u8FBE\u5F0F',min:'\u6700\u5C0F\u503C',max:'\u6700\u5927\u503C',len:'\u957F\u5EA6' },message:'\u9519\u8BEF\u4FE1\u606F',auto:'\u81EA\u52A8\u83B7\u53D6',autoRequired:'\u8BF7\u8F93\u5165{title}',autoMode:'\u8BF7\u8F93\u5165\u6B63\u786E\u7684{title}',requiredPlaceholder:'\u8BF7\u8F93\u5165\u63D0\u793A\u8BED' },tableOptions:{ handle:'\u64CD\u4F5C',add:'\u6DFB\u52A0' },struct:{ title:'\u7F16\u8F91\u6570\u636E',submit:'\u786E \u5B9A',cancel:'\u53D6 \u6D88',error:'\u8F93\u5165\u5185\u5BB9\u683C\u5F0F\u6709\u8BEF' },fetch:{ action:'\u63A5\u53E3',actionRequired:'\u8BF7\u6570\u636E\u63A5\u53E3',method:'\u8BF7\u6C42\u65B9\u5F0F',dataType:'\u63D0\u4EA4\u65B9\u5F0F',data:'\u9644\u5E26\u6570\u636E',headers:'header\u4FE1\u606F',parse:'\u89E3\u6790\u51FD\u6570',parseInfo:'\u89E3\u6790\u63A5\u53E3\u6570\u636E\uFF0C\u8FD4\u56DE\u7EC4\u4EF6\u6240\u9700\u7684\u6570\u636E\u7ED3\u6784',parseValidate:'\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u89E3\u6790\u51FD\u6570' },designer:{ preview:'\u9884 \u89C8',clear:'\u6E05 \u7A7A',clearConfirm:'\u6E05\u7A7A',clearCancel:'\u53D6\u6D88',clearConfirmTitle:'\u6E05\u7A7A\u540E\u5C06\u4E0D\u80FD\u6062\u590D\uFF0C\u786E\u5B9A\u8981\u6E05\u7A7A\u5417\uFF1F',config:{ component:'\u7EC4\u4EF6\u914D\u7F6E',form:'\u8868\u5355\u914D\u7F6E',rule:'\u57FA\u7840\u914D\u7F6E',props:'\u5C5E\u6027\u914D\u7F6E',validate:'\u9A8C\u8BC1\u914D\u7F6E' } },menu:{ main:'\u8868\u5355\u7EC4\u4EF6',aide:'\u8F85\u52A9\u7EC4\u4EF6',layout:'\u5E03\u5C40\u7EC4\u4EF6' },props:{ required:'\u662F\u5426\u5FC5\u586B',options:'\u9009\u9879\u6570\u636E',option:'\u9009\u9879',optionsType:{ json:'JSON\u6570\u636E',fetch:'\u63A5\u53E3\u6570\u636E',struct:'\u9759\u6001\u6570\u636E' } },components:{ radio:{ name:'\u5355\u9009\u6846',props:{ disabled:'\u662F\u5426\u7981\u7528',type:'\u6309\u94AE\u5F62\u5F0F',textColor:'\u6309\u94AE\u5F62\u5F0F\u7684 Radio \u6FC0\u6D3B\u65F6\u7684\u6587\u672C\u989C\u8272',fill:'\u6309\u94AE\u5F62\u5F0F\u7684 Radio \u6FC0\u6D3B\u65F6\u7684\u586B\u5145\u8272\u548C\u8FB9\u6846\u8272' } },checkbox:{ name:'\u591A\u9009\u6846',props:{ type:'\u6309\u94AE\u7C7B\u578B',disabled:'\u662F\u5426\u7981\u7528',min:'\u53EF\u88AB\u52FE\u9009\u7684 checkbox \u7684\u6700\u5C0F\u6570\u91CF',max:'\u53EF\u88AB\u52FE\u9009\u7684 checkbox \u7684\u6700\u5927\u6570\u91CF',textColor:'\u6309\u94AE\u5F62\u5F0F\u7684 Checkbox \u6FC0\u6D3B\u65F6\u7684\u6587\u672C\u989C\u8272',fill:'\u6309\u94AE\u5F62\u5F0F\u7684 Checkbox \u6FC0\u6D3B\u65F6\u7684\u586B\u5145\u8272\u548C\u8FB9\u6846\u8272' } },input:{ name:'\u8F93\u5165\u6846',props:{ type:'\u7C7B\u578B',maxlength:'\u6700\u5927\u8F93\u5165\u957F\u5EA6',minlength:'\u6700\u5C0F\u8F93\u5165\u957F\u5EA6',showWordLimit:'\u662F\u5426\u663E\u793A\u8F93\u5165\u5B57\u6570\u7EDF\u8BA1',placeholder:'\u8F93\u5165\u6846\u5360\u4F4D\u6587\u672C',clearable:'\u662F\u5426\u53EF\u6E05\u7A7A',showPassword:'\u662F\u5426\u663E\u793A\u5207\u6362\u5BC6\u7801\u56FE\u6807',disabled:'\u7981\u7528',prefixIcon:'\u8F93\u5165\u6846\u5934\u90E8\u56FE\u6807',suffixIcon:'\u8F93\u5165\u6846\u5C3E\u90E8\u56FE\u6807',rowInfo:'\u53EA\u5BF9 type="textarea" \u6709\u6548',rows:'\u8F93\u5165\u6846\u884C\u6570',autocomplete:'\u81EA\u52A8\u8865\u5168',readonly:'\u662F\u5426\u53EA\u8BFB',resize:'\u63A7\u5236\u662F\u5426\u80FD\u88AB\u7528\u6237\u7F29\u653E',autofocus:'\u81EA\u52A8\u83B7\u53D6\u7126\u70B9' } },inputNumber:{ name:'\u8BA1\u6570\u5668',props:{ min:'\u8BBE\u7F6E\u8BA1\u6570\u5668\u5141\u8BB8\u7684\u6700\u5C0F\u503C',max:'\u8BBE\u7F6E\u8BA1\u6570\u5668\u5141\u8BB8\u7684\u6700\u5927\u503C',step:'\u8BA1\u6570\u5668\u6B65\u957F',stepStrictly:'\u662F\u5426\u53EA\u80FD\u8F93\u5165 step \u7684\u500D\u6570',disabled:'\u662F\u5426\u7981\u7528\u8BA1\u6570\u5668',controls:'\u662F\u5426\u4F7F\u7528\u63A7\u5236\u6309\u94AE',controlsPosition:'\u63A7\u5236\u6309\u94AE\u4F4D\u7F6E',placeholder:'\u8F93\u5165\u6846\u9ED8\u8BA4 placeholder' } },select:{ name:'\u9009\u62E9\u5668',props:{ multiple:'\u662F\u5426\u591A\u9009',disabled:'\u662F\u5426\u7981\u7528',clearable:'\u662F\u5426\u53EF\u4EE5\u6E05\u7A7A\u9009\u9879',collapseTags:'\u591A\u9009\u65F6\u662F\u5426\u5C06\u9009\u4E2D\u503C\u6309\u6587\u5B57\u7684\u5F62\u5F0F\u5C55\u793A',multipleLimit:'\u591A\u9009\u65F6\u7528\u6237\u6700\u591A\u53EF\u4EE5\u9009\u62E9\u7684\u9879\u76EE\u6570\uFF0C\u4E3A 0 \u5219\u4E0D\u9650\u5236',autocomplete:'autocomplete \u5C5E\u6027',placeholder:'\u5360\u4F4D\u7B26',filterable:'\u662F\u5426\u53EF\u641C\u7D22',allowCreate:'\u662F\u5426\u5141\u8BB8\u7528\u6237\u521B\u5EFA\u65B0\u6761\u76EE',noMatchText:'\u641C\u7D22\u6761\u4EF6\u65E0\u5339\u914D\u65F6\u663E\u793A\u7684\u6587\u5B57',noDataText:'\u9009\u9879\u4E3A\u7A7A\u65F6\u663E\u793A\u7684\u6587\u5B57',reserveKeyword:'\u591A\u9009\u4E14\u53EF\u641C\u7D22\u65F6\uFF0C\u662F\u5426\u5728\u9009\u4E2D\u4E00\u4E2A\u9009\u9879\u540E\u4FDD\u7559\u5F53\u524D\u7684\u641C\u7D22\u5173\u952E\u8BCD',defaultFirstOption:'\u5728\u8F93\u5165\u6846\u6309\u4E0B\u56DE\u8F66\uFF0C\u9009\u62E9\u7B2C\u4E00\u4E2A\u5339\u914D\u9879',popperAppendToBody:'\u662F\u5426\u5C06\u5F39\u51FA\u6846\u63D2\u5165\u81F3 body \u5143\u7D20',automaticDropdown:'\u5BF9\u4E8E\u4E0D\u53EF\u641C\u7D22\u7684 Select\uFF0C\u662F\u5426\u5728\u8F93\u5165\u6846\u83B7\u5F97\u7126\u70B9\u540E\u81EA\u52A8\u5F39\u51FA\u9009\u9879\u83DC\u5355' } },switch:{ name:'\u5F00\u5173',props:{ disabled:'\u662F\u5426\u7981\u7528',width:'\u5BBD\u5EA6\uFF08px\uFF09',activeText:'switch \u6253\u5F00\u65F6\u7684\u6587\u5B57\u63CF\u8FF0',inactiveText:'switch \u5173\u95ED\u65F6\u7684\u6587\u5B57\u63CF\u8FF0',activeValue:'switch \u6253\u5F00\u65F6\u7684\u503C',inactiveValue:'switch \u5173\u95ED\u65F6\u7684\u503C',activeColor:'switch \u6253\u5F00\u65F6\u7684\u80CC\u666F\u8272',inactiveColor:'switch \u5173\u95ED\u65F6\u7684\u80CC\u666F\u8272' } },slider:{ name:'\u6ED1\u5757',props:{ min:'\u6700\u5C0F\u503C',max:'\u6700\u5927\u503C',disabled:'\u662F\u5426\u7981\u7528',step:'\u6B65\u957F',showInput:'\u662F\u5426\u663E\u793A\u8F93\u5165\u6846\uFF0C\u4EC5\u5728\u975E\u8303\u56F4\u9009\u62E9\u65F6\u6709\u6548',showInputControls:'\u5728\u663E\u793A\u8F93\u5165\u6846\u7684\u60C5\u51B5\u4E0B\uFF0C\u662F\u5426\u663E\u793A\u8F93\u5165\u6846\u7684\u63A7\u5236\u6309\u94AE',showStops:'\u662F\u5426\u663E\u793A\u95F4\u65AD\u70B9',range:'\u662F\u5426\u4E3A\u8303\u56F4\u9009\u62E9',vertical:'\u662F\u5426\u7AD6\u5411\u6A21\u5F0F',height:'Slider \u9AD8\u5EA6\uFF0C\u7AD6\u5411\u6A21\u5F0F\u65F6\u5FC5\u586B' } },timePicker:{ name:'\u65F6\u95F4\u9009\u62E9\u5668',props:{ pickerOptions:'\u5F53\u524D\u65F6\u95F4\u65E5\u671F\u9009\u62E9\u5668\u7279\u6709\u7684\u9009\u9879',readonly:'\u5B8C\u5168\u53EA\u8BFB',disabled:'\u7981\u7528',editable:'\u6587\u672C\u6846\u53EF\u8F93\u5165',clearable:'\u662F\u5426\u663E\u793A\u6E05\u9664\u6309\u94AE',placeholder:'\u975E\u8303\u56F4\u9009\u62E9\u65F6\u7684\u5360\u4F4D\u5185\u5BB9',startPlaceholder:'\u8303\u56F4\u9009\u62E9\u65F6\u5F00\u59CB\u65E5\u671F\u7684\u5360\u4F4D\u5185\u5BB9',endPlaceholder:'\u8303\u56F4\u9009\u62E9\u65F6\u5F00\u59CB\u65E5\u671F\u7684\u5360\u4F4D\u5185\u5BB9',isRange:'\u662F\u5426\u4E3A\u65F6\u95F4\u8303\u56F4\u9009\u62E9',arrowControl:'\u662F\u5426\u4F7F\u7528\u7BAD\u5934\u8FDB\u884C\u65F6\u95F4\u9009\u62E9',align:'\u5BF9\u9F50\u65B9\u5F0F',prefixIcon:'\u81EA\u5B9A\u4E49\u5934\u90E8\u56FE\u6807\u7684\u7C7B\u540D',clearIcon:'\u81EA\u5B9A\u4E49\u6E05\u7A7A\u56FE\u6807\u7684\u7C7B\u540D' } },datePicker:{ name:'\u65E5\u671F\u9009\u62E9\u5668',props:{ pickerOptions:'\u5F53\u524D\u65F6\u95F4\u65E5\u671F\u9009\u62E9\u5668\u7279\u6709\u7684\u9009\u9879',readonly:'\u5B8C\u5168\u53EA\u8BFB',disabled:'\u7981\u7528',type:'\u663E\u793A\u7C7B\u578B',editable:'\u6587\u672C\u6846\u53EF\u8F93\u5165',clearable:'\u662F\u5426\u663E\u793A\u6E05\u9664\u6309\u94AE',placeholder:'\u975E\u8303\u56F4\u9009\u62E9\u65F6\u7684\u5360\u4F4D\u5185\u5BB9',startPlaceholder:'\u8303\u56F4\u9009\u62E9\u65F6\u5F00\u59CB\u65E5\u671F\u7684\u5360\u4F4D\u5185\u5BB9',endPlaceholder:'\u8303\u56F4\u9009\u62E9\u65F6\u7ED3\u675F\u65E5\u671F\u7684\u5360\u4F4D\u5185\u5BB9',format:'\u663E\u793A\u5728\u8F93\u5165\u6846\u4E2D\u7684\u683C\u5F0F',align:'\u5BF9\u9F50\u65B9\u5F0F',rangeSeparator:'\u9009\u62E9\u8303\u56F4\u65F6\u7684\u5206\u9694\u7B26',unlinkPanels:'\u5728\u8303\u56F4\u9009\u62E9\u5668\u91CC\u53D6\u6D88\u4E24\u4E2A\u65E5\u671F\u9762\u677F\u4E4B\u95F4\u7684\u8054\u52A8',prefixIcon:'\u81EA\u5B9A\u4E49\u5934\u90E8\u56FE\u6807\u7684\u7C7B\u540D',clearIcon:'\u81EA\u5B9A\u4E49\u6E05\u7A7A\u56FE\u6807\u7684\u7C7B\u540D' } },rate:{ name:'\u8BC4\u5206',props:{ max:'\u6700\u5927\u5206\u503C',disabled:'\u662F\u5426\u4E3A\u53EA\u8BFB',allowHalf:'\u662F\u5426\u5141\u8BB8\u534A\u9009',voidColor:'\u672A\u9009\u4E2D icon \u7684\u989C\u8272',disabledVoidColor:'\u53EA\u8BFB\u65F6\u672A\u9009\u4E2D icon \u7684\u989C\u8272',voidIconClass:'\u672A\u9009\u4E2D icon \u7684\u7C7B\u540D',disabledVoidIconClass:'\u53EA\u8BFB\u65F6\u672A\u9009\u4E2D icon \u7684\u7C7B\u540D',showScore:'\u662F\u5426\u663E\u793A\u5F53\u524D\u5206\u6570\uFF0Cshow-score \u548C show-text \u4E0D\u80FD\u540C\u65F6\u4E3A\u771F',textColor:'\u8F85\u52A9\u6587\u5B57\u7684\u989C\u8272',scoreTemplate:'\u5206\u6570\u663E\u793A\u6A21\u677F' } },colorPicker:{ name:'\u989C\u8272\u9009\u62E9\u5668',props:{ disabled:'\u662F\u5426\u7981\u7528',showAlpha:'\u662F\u5426\u652F\u6301\u900F\u660E\u5EA6\u9009\u62E9',colorFormat:'\u989C\u8272\u7684\u683C\u5F0F' } },row:{ name:'\u6805\u683C\u5E03\u5C40',props:{ gutter:'\u6805\u683C\u95F4\u9694',type:'flex\u5E03\u5C40\u6A21\u5F0F',justify:'flex \u5E03\u5C40\u4E0B\u7684\u6C34\u5E73\u6392\u5217\u65B9\u5F0F',align:'flex \u5E03\u5C40\u4E0B\u7684\u5782\u76F4\u6392\u5217\u65B9\u5F0F' } },col:{ name:'\u683C\u5B50',props:{ span:'\u6805\u683C\u5360\u636E\u7684\u5217\u6570',offset:'\u6805\u683C\u5DE6\u4FA7\u7684\u95F4\u9694\u683C\u6570',push:'\u6805\u683C\u5411\u53F3\u79FB\u52A8\u683C\u6570',pull:'\u6805\u683C\u5411\u5DE6\u79FB\u52A8\u683C\u6570' } },tab:{ name:'\u6807\u7B7E\u9875',props:{ type:'\u98CE\u683C\u7C7B\u578B',closable:'\u6807\u7B7E\u662F\u5426\u53EF\u5173\u95ED',tabPosition:'\u9009\u9879\u5361\u6240\u5728\u4F4D\u7F6E',stretch:'\u6807\u7B7E\u7684\u5BBD\u5EA6\u662F\u5426\u81EA\u6491\u5F00' } },'tab-pane':{ name:'\u6807\u7B7E\u9875',props:{ label:'\u9009\u9879\u5361\u6807\u9898',disabled:'\u662F\u5426\u7981\u7528',name:'\u4E0E\u9009\u9879\u5361\u7ED1\u5B9A\u503C value \u5BF9\u5E94\u7684\u6807\u8BC6\u7B26\uFF0C\u8868\u793A\u9009\u9879\u5361\u522B\u540D',lazy:'\u6807\u7B7E\u662F\u5426\u5EF6\u8FDF\u6E32\u67D3' } },'el-divider':{ name:'\u5206\u5272\u7EBF',props:{ direction:'\u8BBE\u7F6E\u5206\u5272\u7EBF\u65B9\u5411',formCreateChild:'\u8BBE\u7F6E\u5206\u5272\u7EBF\u6587\u6848',contentPosition:'\u8BBE\u7F6E\u5206\u5272\u7EBF\u6587\u6848\u7684\u4F4D\u7F6E' } },cascader:{ name:'\u7EA7\u8054\u9009\u62E9\u5668',props:{ props:'\u914D\u7F6E\u9009\u9879',size:'\u5C3A\u5BF8',placeholder:'\u8F93\u5165\u6846\u5360\u4F4D\u6587\u672C',disabled:'\u662F\u5426\u7981\u7528',clearable:'\u662F\u5426\u652F\u6301\u6E05\u7A7A\u9009\u9879',showAllLevels:'\u8F93\u5165\u6846\u4E2D\u662F\u5426\u663E\u793A\u9009\u4E2D\u503C\u7684\u5B8C\u6574\u8DEF\u5F84',collapseTags:'\u591A\u9009\u6A21\u5F0F\u4E0B\u662F\u5426\u6298\u53E0Tag',separator:'\u9009\u9879\u5206\u9694\u7B26' } },upload:{ name:'\u4E0A\u4F20',props:{ uploadType:'\u4E0A\u4F20\u7C7B\u578B',action:'\u4E0A\u4F20\u7684\u5730\u5740(\u5FC5\u586B)',headers:'\u8BBE\u7F6E\u4E0A\u4F20\u7684\u8BF7\u6C42\u5934\u90E8',multiple:'\u662F\u5426\u652F\u6301\u591A\u9009\u6587\u4EF6',data:'\u4E0A\u4F20\u65F6\u9644\u5E26\u7684\u989D\u5916\u53C2\u6570',name:'\u4E0A\u4F20\u7684\u6587\u4EF6\u5B57\u6BB5\u540D',withCredentials:'\u652F\u6301\u53D1\u9001 cookie \u51ED\u8BC1\u4FE1\u606F',accept:'\u63A5\u53D7\u4E0A\u4F20\u7684\u6587\u4EF6\u7C7B\u578B\uFF08thumbnail-mode \u6A21\u5F0F\u4E0B\u6B64\u53C2\u6570\u65E0\u6548\uFF09',autoUpload:'\u662F\u5426\u5728\u9009\u53D6\u6587\u4EF6\u540E\u7ACB\u5373\u8FDB\u884C\u4E0A\u4F20',disabled:'\u662F\u5426\u7981\u7528',limit:'\u6700\u5927\u5141\u8BB8\u4E0A\u4F20\u4E2A\u6570' } },'el-transfer':{ name:'\u7A7F\u68AD\u6846',props:{ data:'Transfer \u7684\u6570\u636E\u6E90',filterable:'\u662F\u5426\u53EF\u641C\u7D22',filterPlaceholder:'\u641C\u7D22\u6846\u5360\u4F4D\u7B26',targetOrder:'\u53F3\u4FA7\u5217\u8868\u5143\u7D20\u7684\u6392\u5E8F\u7B56\u7565',titles:'\u81EA\u5B9A\u4E49\u5217\u8868\u6807\u9898',buttonTexts:'\u81EA\u5B9A\u4E49\u6309\u94AE\u6587\u6848',format:'\u5217\u8868\u9876\u90E8\u52FE\u9009\u72B6\u6001\u6587\u6848',props:'\u6570\u636E\u6E90\u7684\u5B57\u6BB5\u522B\u540D',leftDefaultChecked:'\u521D\u59CB\u72B6\u6001\u4E0B\u5DE6\u4FA7\u5217\u8868\u7684\u5DF2\u52FE\u9009\u9879\u7684 key \u6570\u7EC4',rightDefaultChecked:'\u521D\u59CB\u72B6\u6001\u4E0B\u53F3\u4FA7\u5217\u8868\u7684\u5DF2\u52FE\u9009\u9879\u7684 key \u6570\u7EC4' } },tree:{ name:'\u6811\u5F62\u63A7\u4EF6',props:{ emptyText:'\u5185\u5BB9\u4E3A\u7A7A\u7684\u65F6\u5019\u5C55\u793A\u7684\u6587\u672C',props:'\u914D\u7F6E\u9009\u9879\uFF0C\u5177\u4F53\u770B\u4E0B\u8868',renderAfterExpand:'\u662F\u5426\u5728\u7B2C\u4E00\u6B21\u5C55\u5F00\u67D0\u4E2A\u6811\u8282\u70B9\u540E\u624D\u6E32\u67D3\u5176\u5B50\u8282\u70B9',defaultExpandAll:'\u662F\u5426\u9ED8\u8BA4\u5C55\u5F00\u6240\u6709\u8282\u70B9',expandOnClickNode:'\u662F\u5426\u5728\u70B9\u51FB\u8282\u70B9\u7684\u65F6\u5019\u5C55\u5F00\u6216\u8005\u6536\u7F29\u8282\u70B9\uFF0C \u9ED8\u8BA4\u503C\u4E3A true\uFF0C\u5982\u679C\u4E3A false\uFF0C\u5219\u53EA\u6709\u70B9\u7BAD\u5934\u56FE\u6807\u7684\u65F6\u5019\u624D\u4F1A\u5C55\u5F00\u6216\u8005\u6536\u7F29\u8282\u70B9\u3002',checkOnClickNode:'\u662F\u5426\u5728\u70B9\u51FB\u8282\u70B9\u7684\u65F6\u5019\u9009\u4E2D\u8282\u70B9\uFF0C\u9ED8\u8BA4\u503C\u4E3A false\uFF0C\u5373\u53EA\u6709\u5728\u70B9\u51FB\u590D\u9009\u6846\u65F6\u624D\u4F1A\u9009\u4E2D\u8282\u70B9\u3002',autoExpandParent:'\u5C55\u5F00\u5B50\u8282\u70B9\u7684\u65F6\u5019\u662F\u5426\u81EA\u52A8\u5C55\u5F00\u7236\u8282\u70B9',checkStrictly:'\u5728\u663E\u793A\u590D\u9009\u6846\u7684\u60C5\u51B5\u4E0B\uFF0C\u662F\u5426\u4E25\u683C\u7684\u9075\u5FAA\u7236\u5B50\u4E0D\u4E92\u76F8\u5173\u8054\u7684\u505A\u6CD5\uFF0C\u9ED8\u8BA4\u4E3A false',accordion:'\u662F\u5426\u6BCF\u6B21\u53EA\u6253\u5F00\u4E00\u4E2A\u540C\u7EA7\u6811\u8282\u70B9\u5C55\u5F00',indent:'\u76F8\u90BB\u7EA7\u8282\u70B9\u95F4\u7684\u6C34\u5E73\u7F29\u8FDB\uFF0C\u5355\u4F4D\u4E3A\u50CF\u7D20',iconClass:'\u81EA\u5B9A\u4E49\u6811\u8282\u70B9\u7684\u56FE\u6807',nodeKey:'\u6BCF\u4E2A\u6811\u8282\u70B9\u7528\u6765\u4F5C\u4E3A\u552F\u4E00\u6807\u8BC6\u7684\u5C5E\u6027\uFF0C\u6574\u68F5\u6811\u5E94\u8BE5\u662F\u552F\u4E00\u7684' } },'el-alert':{ name:'\u63D0\u793A',description:'description',props:{ title:'\u6807\u9898',type:'\u4E3B\u9898',description:'\u8F85\u52A9\u6027\u6587\u5B57',closable:'\u662F\u5426\u53EF\u5173\u95ED',center:'\u6587\u5B57\u662F\u5426\u5C45\u4E2D',closeText:'\u5173\u95ED\u6309\u94AE\u81EA\u5B9A\u4E49\u6587\u672C',showIcon:'\u662F\u5426\u663E\u793A\u56FE\u6807',effect:'\u9009\u62E9\u63D0\u4F9B\u7684\u4E3B\u9898' } },span:{ name:'\u6587\u5B57',props:{ formCreateTitle:'\u6807\u9898',formCreateChild:'\u5185\u5BB9' } },div:{ name:'\u95F4\u8DDD',props:{ height:'\u9AD8\u5EA6' } },'el-button':{ name:'\u6309\u94AE',props:{ formCreateChild:'\u5185\u5BB9',size:'\u5C3A\u5BF8',type:'\u7C7B\u578B',plain:'\u662F\u5426\u6734\u7D20\u6309\u94AE',round:'\u662F\u5426\u5706\u89D2\u6309\u94AE',circle:'\u662F\u5426\u5706\u5F62\u6309\u94AE',loading:'\u662F\u5426\u52A0\u8F7D\u4E2D\u72B6\u6001',disabled:'\u662F\u5426\u7981\u7528\u72B6\u6001',icon:'\u56FE\u6807\u7C7B\u540D' } },'fc-editor':{ name:'\u5BCC\u6587\u672C\u6846',props:{ disabled:'\u662F\u5426\u7981\u7528' } } } }})