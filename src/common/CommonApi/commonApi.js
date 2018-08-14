import  $http from '../utils/Http';
import ENV_VARIABLE from '../utils/Environment';

export function getSession (){
	return new Promise(function(resolve, reject) {
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'phoenix/user/isLoggedIn',(res)=>{
			if(res.http_code !=200){
				reject(res.message)
			} else {
				resolve(res.message)
			}
     })

   })

}
function getCategoryInfo(categoryData,catInfo){
      catInfo[categoryData.categoryName]={
        	categoryName:categoryData.categoryName,
        	categoryDisplayName:categoryData.categoryDisplayName,
        	brand: categoryData.brand
        }
		if(categoryData.subCategories.length == 0)return;
        for(var j=0;j<categoryData.subCategories.length;j++){
        	getCategoryInfo(categoryData.subCategories[j],catInfo[categoryData.categoryName]);
        }
}


export function getCategory (){
	return new Promise(function(resolve, reject) {
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'product/api/v1.0/category/',(res)=>{
		    var Categorydata=res.message[0].subCategories
		    var catInfo={}
		    for(var i=0;i<Categorydata.length;i++){
	                getCategoryInfo(Categorydata[i],catInfo)
		    }
		    res['categoryInfo']=catInfo;
		    resolve(res)
     })

   })

}


export function getState (){
	return new Promise(function(resolve, reject) {
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/states',(res)=>{
			
	      resolve(res.message)
     })

   })

}

export function userLogout (){
	return new Promise(function(resolve, reject) {
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'phoenix/user/logout',JSON.stringify({}),(res)=>{
			if(res.http_code !=200){
				reject(res.message)
			} else {
				resolve(res.message)
			}
     })

   })
}

export function getCompanyDetail (companyId){
	return new Promise(function(resolve, reject) {
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/company/'+companyId,(res)=>{
			if(res.http_code !=200){
				reject(res)
			} else {
				resolve(res)
			}
     })

   })

}
export function getEnterpriseList (companyId){
	return new Promise(function(resolve, reject) {
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/',(res)=>{
			if(res.http_code !=200){
				reject(res)
			} else {
				resolve(res)
			}
     })

   })

}

export function getCompanyList (_eId){
	return new Promise(function(resolve, reject) {
        
      $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/'+_eId+'/company',(res)=>{
        
        if(res.http_code !=200){
            reject(res)
        } else {
            resolve(res)
        }
    }) 


   })

}

export function dateConvert(data) {
    var date = new Date(data);
    var t=new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    t = t.toLocaleDateString('en-GB', {day : '2-digit',month : 'short',year : 'numeric'}).split(' ').join(' ');  
    return t;
};
export function splitCamelCase(input) {
    if (!input)
        return;
    var j = 0;
    var splitString = "";
    var i = 0;
    for (i = 1; i < input.length; i++) {
        if (input.charAt(i) == input.charAt(i).toUpperCase()) {
            splitString = splitString + " " + input.slice(j, i);
            j = i;
        }
    }
    splitString = splitString + " " + input.slice(j, i);
    return splitString.replace("And", "and").replace("and", " and").replace("S and", "Sand").replace("L andscaping", "Landscaping").replace("H and Tools", "Hand Tools").replace("inter", "Inter").replace("intra", "Intra").replace("T M T", "TMT").substr(1, splitString.length);
  }
  export function convertFromDate(inputFormat) {
    var d = inputFormat.setHours(0,0,0,0);
    return d;
  }
  export function convertToDate(inputFormat) {
      var d = inputFormat.setHours(23,59,59,59);
      return d;
}
export function amountConvert(data){
    var t = data.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    return t;
}