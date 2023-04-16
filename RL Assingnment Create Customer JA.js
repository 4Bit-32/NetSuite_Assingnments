/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 * Javed Ansari
 */
define([ 'N/record','N/search','N/runtime' ],
/**
 * @param {record} record
 */
function(record,search,runtime) {

	/**
	 * Function called upon sending a GET request to the RESTlet.
	 *
	 * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
	 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	 * @since 2015.1
	 */
	function doGet(requestParams) {

	}

	/**
	 * Function called upon sending a PUT request to the RESTlet.
	 *
	 * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
	 * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
	 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	 * @since 2015.2
	 */
	function doPut(requestBody) {
		

	}

	/**
	 * Function called upon sending a POST request to the RESTlet.
	 *
	 * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
	 * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
	 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	 * @since 2015.2
	 */
	function doPost(requestBody) {
		try {
			 log.debug("In doPost method");
	        //here Calculate Goverance Units
	        var ScriptParam=runtime.getCurrentScript();
			 log.debug('Total Goverance Unite ',ScriptParam.getRemainingUsage());
			 
	        // Here Get The Input Length Of Customers Details
			var customerLength = requestBody.customerDetails.length;
			 log.debug("customerLength", customerLength);
			 
			var response = '';
			//Here Create Array
			var alreadyExist=[];  
			var newCustomer=[];
			
			// if Get The Request From The Postman 
			if (requestBody.customerDetails) {
				
				for (var cu = 0; cu < customerLength; cu++) {
					
					// Get The Request Body From Postman 
					var customerRec = requestBody.customerDetails[cu];
					 log.debug('customerRec', customerRec);
					
					var custName = customerRec.CompanyName;  // Hetre Get The Company Name 
					 log.debug('custName', custName);
					
					var subsidiaryName = customerRec.subsidiary; //Here Get The Subsidiary 
					 log.debug('subsidiaryName', subsidiaryName);
					
					// Here I am  Creating customer Search which will Check Whether customer is Available in System or Not  
					var customerSearchObj = search.create({
	                       type: "customer",
	                       filters:
	                            [ ["entityid","is",custName]  ],
	                       columns:
	                            [  search.createColumn({name: "internalid", label: "Internal ID"}) ] });
				
	      		    var internalId='';
	                var searchResultCount = customerSearchObj.runPaged().count;
	                 log.debug("customerSearchObj result count",searchResultCount);
	                customerSearchObj.run().each(function(result){
	                	
	                     internalId=result.getValue('internalid');  // Here i am Getting The Internal Id Of The Existing Customers
	                
	                return true;
	                  
	                   });
				     log.debug('internalId',internalId);
				    
				    // if Customer Internal Id is Found In The System Then Send Response to Postman
	                if(internalId){
	                	alreadyExist.push({
	                		'Internal Id ':internalId,
	                		'Customer Name':custName
	                	});
	                	
	                	if(newCustomer.length>0){
	                		
	                		response=('These Customers Are Already Exist In System:-> '+JSON.stringify(alreadyExist)+'Customers Created  Successfully:-> '+JSON.stringify(newCustomer));
	 					   
	                	}else{
	                		
	                	    response=('These Customers Are Already Exist In System:-> '+JSON.stringify(alreadyExist));
					   
	                	}
	                	
					 // if Customer Internal Id is Not Found In System Then Create Customer And Send Response To Postman 
	                  }else{  
	                	  // Create Customer Record 
	                    	createCustomer = record.create({
	      						type : record.Type.CUSTOMER
	      					});
                         // Set values In Customer Record 
	      					createCustomer.setValue({
	      						fieldId : "companyname",
	      						value : custName
	      					});
	      					createCustomer.setValue({
	      						fieldId : "subsidiary",
	      						value : subsidiaryName
	      					});
	      					// This Method Is Use To Save The Customer Record 
	      					var saveCustomer = createCustomer.save();
	      					 log.debug("Customer Created  Successfully", saveCustomer);
	      					
	      					newCustomer.push({
	      						'Internal Id':saveCustomer,
		                		'Customer Name ':custName
		                	});
	      					
	      					if(alreadyExist.length>0){
		                		
	      						response=('Customers Created  Successfully:-> '+JSON.stringify(newCustomer)+'And These Customers Are Already Exist In Your System:-> '+JSON.stringify(alreadyExist));
		 					   
		                	}else{
		                		
		                	    response=('Customers Created  Successfully:-> '+JSON.stringify(newCustomer));
						   
		                	}
	      					
	                     }
	      
				}//here Calculate Remaing Goverance Units
				 log.debug('Total Goverance Unite ',ScriptParam.getRemainingUsage());
               return response;
            
			
		}else {
				response = "Error: There is no Request data found";
				return response
			}

		} catch (e) {
			log.error('errro In Post Method ', e);
		}

	}

	/**
	 * Function called upon sending a DELETE request to the RESTlet.
	 *
	 * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
	 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
	 * @since 2015.2
	 */
	function doDelete(requestParams) {

	}
	return {
		'get' : doGet,
		put : doPut,
		post : doPost,
		'delete' : doDelete
	};

});
