log.debug('In beforeSubmit Function ');
	    var newRec =  scriptContext.newRecord;
	    var type = scriptContext.type;
	   
         if(type ===  scriptContext.UserEventType.CREATE || type === scriptContext.UserEventType.EDIT){
               log.debug('In beforeSubmit Function ');
				var newRec =  scriptContext.newRecord;
				// Here Get The Claim Number 
				var claimNumber = newRec.getValue({
					fieldId : 'custentity_cust_claim_number_ja'
				});

               log.debug('claimNumber',claimNumber);
               // if Claim Number  Is Get Then Go to this Condition 
				if(claimNumber)
				{
					  var entitySearchObj = search.create({
					   type: "entity",
					   filters:
					   [
						  ["custentity_cust_claim_number_ja","is",claimNumber]
					   ],
					   columns:
					   [
						  search.createColumn({name: "custentity_cust_claim_number_ja", label: "Claim Number JA"})
					   ]
					});
					var claim_Num;
					var searchResultCount = entitySearchObj.runPaged().count;
					log.debug("entitySearchObj result count",searchResultCount);
					entitySearchObj.run().each(function(result){
						
					   claim_Num = result.getValue('custentity_cust_claim_number_ja');
					   
					   return true;
					   
					});
             log.debug('claim_Num ',claim_Num);

			 if( claim_Num===claimNumber){
				
               log.debug('A project With The Same Claim Number Exist in NetSuite');
                var err= error.create({
             	  name:" Claim No Already Exist",
             	  message:"A project With The Same Claim Number Exist in NetSuite",
             	  notifyoff:false
               });
                throw err.message
             }
            }
	   }if(type === scriptContext.UserEventType.DELETE){
	           var recId =newRec.id;
	           
	           log.debug('Project is Deleted Succesfully',recId);
	         }