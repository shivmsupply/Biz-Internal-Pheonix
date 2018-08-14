var ENV_VARIABLE = require('./Environment');
exports.get = function(url,callback){//Get method request
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
        	callback(JSON.parse(xmlHttp.responseText));
        }   
    }
    xmlHttp.withCredentials = true;
    xmlHttp.open("GET", ENV_VARIABLE.BASE_API+url, true); // true for asynchronous 
    xmlHttp.send(null);
}

exports.post = function(url,body,callback,isPdf){//Post method request
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", ENV_VARIABLE.BASE_API+url, true);
    if(isPdf){
        xmlHttp.responseType = "arraybuffer";
    }
	xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.withCredentials = true;
	xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4){
            if(isPdf===true){
                callback(xmlHttp.response);
            }else{
                if(JSON.parse(xmlHttp.responseText).message === "Invalid Session")
                {
                 window.open(ENV_VARIABLE.HOST_NAME + 'financial-services','_self');
                }else{
                callback(JSON.parse(xmlHttp.responseText));
            }
            }
            
        	
        }
           
    }
    xmlHttp.send(body);
}
exports.postCall = function(body,callback){//Post method request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", ENV_VARIABLE.HOST_NAME+'customer/api/v1.0/click2call', true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(JSON.parse(xmlHttp.responseText));
           
    }
    xmlHttp.send(body);
}
exports.postWithUrl = function(url,body,callback,isPdf){
	
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true);
    if(isPdf){
        xmlHttp.responseType = "arraybuffer";
    }
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.withCredentials = true;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
            if(isPdf===true){
                callback(xmlHttp.response);
            }
            else
            callback(JSON.parse(xmlHttp.responseText));}
           
    }
    xmlHttp.send(body);
}
exports.putWithUrl = function(url,body,callback){
    if(body == '')
    body= null;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.withCredentials = true;
    xmlHttp.onreadystatechange = function() { 

        
        if (xmlHttp.readyState == 4){
            if(xmlHttp.responseURL.includes('report'))
            callback(xmlHttp.responseText);
            else
            callback(JSON.parse(xmlHttp.responseText));
        }

           
    }
    xmlHttp.send(body);
}

exports.getWithUrl = function(url,callback,isPdf){
    var xmlHttp = new XMLHttpRequest(); 
     if(isPdf){
        xmlHttp.responseType = "arraybuffer";
    }
    xmlHttp.onreadystatechange = function() { 
       
        if (xmlHttp.readyState == 4){
            
            if(isPdf===true){
                callback(xmlHttp.response);
            }
            else
            callback(JSON.parse(xmlHttp.responseText));
        }   
    }
    xmlHttp.withCredentials = true;
    xmlHttp.open("GET", url, true); // true for asynchronous
	if(url.indexOf("categoryHSNMapping") == -1 && url.indexOf("sacMapping") == -1)
    xmlHttp.setRequestHeader('cache-control', 'no-cache'); 
    xmlHttp.send(null);
}
exports.delete = function(url,callback){//Get method request
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
        	callback(JSON.parse(xmlHttp.responseText));
        }   
    }
    xmlHttp.withCredentials = true;
    xmlHttp.open("DELETE", ENV_VARIABLE.BASE_API+url, true); // true for asynchronous 
    xmlHttp.send(null);
}
exports.deleteWithUrl = function(url,callback){//Get method request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
       
        if (xmlHttp.readyState == 4){
            callback(JSON.parse(xmlHttp.responseText));
        }   
    }
    xmlHttp.withCredentials = true;
    xmlHttp.open("DELETE", url, true); // true for asynchronous 
    xmlHttp.send(null);
}