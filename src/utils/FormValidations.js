var validations = {
	'name':{
	    'regex':/^[a-zA-Z ]+$/,
		min:1,
		max:50,
	   'errorMessage':'Please enter valid name'
	},

	'alphanumeric':{
	    'regex':/^\S+[a-zA-Z0-9_ ]*$/,
		min:1,		
	   'errorMessage':'Please enter valid text'
	},
	'address':{
		'regex':/^[a-zA-Z0-9\s\,\''\-]*$/,
		'min':1,
		'max':50,
		'errorMessage':'Please enter valid  address'

	},
	'email':{
		'regex':/^\S+@(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
		'min':1,
		'max':50,
		'errorMessage':'Please enter valid email address'
	},
	'mobile':{
		'regex':/^[6789]\d{9}$/,
		'min':10,
		'max':10,
		'regallow':/^[0-9]+$/,
		'errorMessage':"Please enter valid mobile number"
	},
	'company':{
		'regex':'',
		'min':1,
		'max':100
	},
	'amount':{
		'regex':/^\d*\.{0,1}\d{0,2}$/,
		'min':1,
		'max':10,
		'regallow':/^\d*\.{0,1}\d{0,2}$/,
		'errorMessage':'Amount should be greater than 0'
	},
	'otp':{
		'regex':/^[0-9]+$/,
		'min':6,
		'max':6,
		'regallow':/^[0-9]+$/,
		'errorMessage':"Please enter 6 digits OTP number"
	},
	'loanId':{
		'regex':'',
		'min':1,
		'max':20
	},
	'pin':{
		'regex':/^[0-9]+$/,
		'min':6,
		'max':6,
		'regallow':/^[0-9]+$/,
		'errorMessage':"Please enter 6 digits pin number"
	},
	'year':{
		'regex':/^[0-9]+$/,
		'min':4,
		'max':4,
		'regallow':/^[0-9]+$/,
		'errorMessage':"Please enter 4 digits year"
	},
	'gst':{
		'regex':/^[0-3][0-9][a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z0-9]{1}[zZ]{1}[A-Za-z0-9]{1}$/,
		'min':15,
		'max':15,
		'errorMessage':"Please enter valid GST number"
	},
	
	'password':{
		'regex':/^\S+$/,
		'min':6,
		'max':100
	},
	'userid':{
		'regex':'',
		'min':5,
		'max':100
	},
	'numberOnly':{
		'regex':/^[0-9]+$/,
		'min':1,
		'max':1000000,
		'regallow':/^[0-9]+$/,
		'errorMessage':""
	},
	'percentage':{
		"regex":/^\d{0,2}(\.\d{0,2})?$/,
		
		'regallow':/^\d{0,2}(\.\d{0,2})?$/
	},
	'advPercentage':{
		'regex':/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/i,
		'regallow':/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/i,
		'errorMessage':"Please enterbetweem 0-100"
	}

}

exports.getAllValidations = function(){
	return validations;
}

exports.validate = function(type,data){
	var result = {'data':data,'error':''};
	
	if(validations[type] != undefined){
		if(validations[type].regallow!=undefined)
	{
		
		var regObj = new RegExp(validations[type].regallow);
		if(!regObj.test(result.data))
			result.data = result.data.substring(0,result.data.length-1);
	}
	if(result.data.length > validations[type].max)
		result.data = result.data.substring(0,result.data.length-1);

	var regObj = new RegExp(validations[type].regex);
	if(!regObj.test(result.data)) 
		result.error = validations[type].errorMessage;

	if(result.data.length < validations[type].min)	
		result.error = "Minimum length "+validations[type].min;

	if(result.data.length > validations[type].max)
		result.error = "Maximum "+validations[type].max+" character is required";
	if(type == "amount")
		result.data = Number(result.data);
	
	return result;
	}
	else
		return result;
	 
}

exports.getValidationArray = function(obj){
	return Object.keys(obj).filter(function(key){
		return obj[key] != '';
	});
}
