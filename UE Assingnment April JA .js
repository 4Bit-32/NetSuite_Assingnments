/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/search'],
/**
 * @param {error} error
 * @param {search} search
 */
function(error, search) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

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
                throw error.create({
             	  name:" Claim No Already Exist",
             	  message:"A project With The Same Claim Number Exist in NetSuite",
             	  notifyoff:false
               });
                
             }
            }
	   }if(type === scriptContext.UserEventType.DELETE){
	           var recId =newRec.id;
	           
	           log.debug('Project is Deleted Succesfully',recId);
	         }
     }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
