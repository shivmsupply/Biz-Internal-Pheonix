/*Environment Setup */
exports.ENVIRONMENT = 'local';
exports.COM_Serv =  "https://www.msupply.com/customer/api/v1.0/";
if(location.hostname === "phoenix.stg.msupply.biz"){
   exports.ENVIRONMENT = 'staging';   
   exports.BASE_API = 'http://api.stg.msupply.biz/';
   exports.STATIC_URL = 'http://static.stg.msupply.biz/InternalPanelApp/';
   exports.HOST_NAME =  "http://api.stg.msupply.biz/";
   if (window.navigator.userAgent.indexOf("Mac") != -1)
   exports.IMAGE_URL = "http://static.stg.msupply.biz/InternalPanelApp/assets/images/";
 else  
   exports.IMAGE_URL = "http://static.stg.msupply.biz/InternalPanelApp/assets/images/";  
}
else if(location.hostname === "phoenix.msupply.biz"){
  exports.ENVIRONMENT = 'production';
  exports.BASE_API = 'https://api.msupply.biz/';
  exports.STATIC_URL = 'https://static.msupply.biz/InternalPanelApp/';
  exports.HOST_NAME =  "https://api.msupply.biz/";
  if (window.navigator.userAgent.indexOf("Mac") != -1)
  exports.IMAGE_URL = "https://static.msupply.biz/InternalPanelApp/assets/images/";
else  
  exports.IMAGE_URL = "https://static.msupply.biz/InternalPanelApp/assets/images/";  
}
else if(window.location.hostname != "stg.msupply.biz"){
  exports.STATIC_URL = "http://" + window.location.host +"/"; 
  exports.BASE_API = 'http://api.stg.msupply.biz/';
  exports.HOST_NAME =  "http://api.stg.msupply.biz/";
   if (window.navigator.userAgent.indexOf("Mac") != -1)
     exports.IMAGE_URL = "http://" + window.location.host +"/"+"assets/images/";
   else  
     exports.IMAGE_URL = "http://" + window.location.host +"/"+"assets/images/"; 
}
