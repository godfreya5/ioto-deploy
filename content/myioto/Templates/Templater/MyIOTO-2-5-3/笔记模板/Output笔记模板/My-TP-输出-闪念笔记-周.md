<%*
/*
** type: template
** for: output
*/
_%>
<%*
const today = tp.date.now("YYYY-MM-DD");
const monday = tp.date.weekday("YYYY-MM-DD", 0);
const tuesday = tp.date.weekday("YYYY-MM-DD", 1);
const wednesday = tp.date.weekday("YYYY-MM-DD", 2);
const thursday = tp.date.weekday("YYYY-MM-DD", 3);
const friday = tp.date.weekday("YYYY-MM-DD", 4);
const saturday = tp.date.weekday("YYYY-MM-DD", 5);
const sunday = tp.date.weekday("YYYY-MM-DD", 6);
-%>
# 每周闪念

## 周一 <% monday %>
<%* if(today === monday) { _%>
- 
<%* } _%>

## 周二 <% tuesday %>
<%* if(today === tuesday) { _%>
- 
<%* } _%>

## 周三 <% wednesday %>
<%* if(today === wednesday) { _%>
- 
<%* } _%>

## 周四 <% thursday %>
<%* if(today === thursday) { _%>
- 
<%* } _%>

## 周五 <% friday %>
<%* if(today === friday) { _%>
- 
<%* } _%>

## 周六 <% saturday %>
<%* if(today === saturday) { _%>
- 
<%* } _%>

## 周日 <% sunday %>
<%* if(today === sunday) { _%>
- 
<%* } _%>