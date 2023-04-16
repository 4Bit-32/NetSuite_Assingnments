/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(
		[ 'N/record', 'N/redirect', 'N/runtime', 'N/ui/serverWidget',
				'N/search' ],
		/**
		 * @param {record} record
		 * @param {redirect} redirect
		 * @param {runtime} runtime
		 * @param {serverWidget} serverWidget
		 */
		function(record, redirect, runtime, serverWidget, search) {

			/**
			 * Definition of the Suitelet script trigger point.
			 *
			 * @param {Object} context
			 * @param {ServerRequest} context.request - Encapsulation of the incoming request
			 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
			 * @Since 2015.2
			 */
			function onRequest(context) {

				try {

					//here Calculate Remaing Goverance Units
					var ScriptParam = runtime.getCurrentScript();
					log.debug('Total Goverance Unite '
							+ ScriptParam.getRemainingUsage());

					var request = context.request;
					var response = context.response;
					//Here Create Form And Field
					var form = serverWidget.createForm({
						title : 'Load SO Information',
						id : 'custpage_load_so_info'
					});

					if (request.method === 'GET') { //Get Method
						log.debug('in Get Method', 'in Get Method');
						var internalId = '';
						var docId = '';
						var Status = '';
						var Amount = '';
						var customerID = request.parameters.customerID;
						/* var docId = request.parameters.docId;
						 var Status = request.parameters.Status;
						 var Amount = request.parameters.Amount;
						var searchResultCount = request.parameters.searchResultCount;*/
						log.debug('Get - customerID:', customerID);

						var idField = form.addField({
							id : 'custpage_internal_id',
							type : serverWidget.FieldType.SELECT,
							label : 'Customer  internal Id',
							source : 'CUSTOMER'
						});
						if (customerID) {
							idField.defaultValue = customerID;

						}

						var btn1 = form.addSubmitButton({
							label : "Load",
						});

						// Here  Create Sublist  in Form
						var sublist1 = form.addSublist({
							id : 'custpage_so_info',
							type : serverWidget.SublistType.INLINEEDITOR,
							label : 'Sales Order Information',
						});
						// Here  Create  Sublist Field in Form
						sublist1.addField({
							id : 'custpage_internal_id',
							type : serverWidget.FieldType.TEXT,
							label : 'ITEM'
						});
						sublist1.addField({
							id : 'custpage_document_number',
							type : serverWidget.FieldType.TEXT,
							label : 'Document Number'
						});
						sublist1.addField({
							id : 'custpage_status',
							type : serverWidget.FieldType.TEXT,
							label : 'Status'
						});
						sublist1.addField({
							id : 'custpage_amount',
							type : serverWidget.FieldType.TEXT,
							label : 'Amount'
						});

						if (customerID) {
							var salesorderSearchObj = search
									.create({
										type : "salesorder",
										filters : [ [ "type", "anyof", "SalesOrd" ], "AND",[ "mainline", "is", "T" ], "AND", [ "name", "anyof", customerID ] ],
										columns : [
										            search.createColumn({ name : "internalid", label : "Internal ID"}), 
										            search.createColumn({name : "tranid",label : "Document Number"}), 
										            search.createColumn({name : "statusref",label : "Status"}),
										            search.createColumn({name : "entity",label : "Name"})
										           ]
									});
							var internalId = '';
							var docId = '';
							var Status = '';
							var Amount = '';
							var Counter = 0;
							var searchResultCount = salesorderSearchObj
									.runPaged().count;
							log.debug("salesorderSearchObj result count",
									searchResultCount);
							salesorderSearchObj.run().each(function(result) {

								internalId = result.getValue('internalid');
								docId = result.getValue('tranid');
								Status = result.getValue('statusref');
								Amount = result.getValue('entity');

								// Here Set Value In Sublist Field
								if (internalId) {

									sublist1.setSublistValue({
										id : 'custpage_internal_id',
										line : Counter,
										value : internalId
									});

									sublist1.setSublistValue({
										id : 'custpage_document_number',
										line : Counter,
										value : docId
									});

									sublist1.setSublistValue({
										id : 'custpage_status',
										line : Counter,
										value : Status
									});

									sublist1.setSublistValue({
										id : 'custpage_amount',
										line : Counter,
										value : Amount
									});

								}
								Counter++

								// .run().each has a limit of 4,000 results
								return true;
							});
							log.debug('Counter', Counter++);
							log.debug('internalId', internalId);
							log.debug('docId', docId);
							log.debug('Status', Status);
							log.debug('Amount', Amount);

						}

						// form.clientScriptModulePath = './CS_Customer_info_Load_JA.js';  

						context.response.writePage(form);

					} else {
						var customerID = request.parameters.custpage_internal_id;
						// Here Create Save Search For Customer Name

						// Here Redirect To Same Suitelet Page 
						redirect.toSuitelet({
							scriptId : 'customscript_sl_load_so_on_ui_ja',
							deploymentId : 'customdeploy_sl_load_so_on_ui_ja',
							parameters : {
								'customerID' : customerID,

							}
						});
					}
					//here Calculate Remaing Goverance Units
					log.debug('Remaining Goverance Units '
							+ ScriptParam.getRemainingUsage());

				} catch (e) {
					log.error('Error in Suitelet ', e);
				}

			}

			return {
				onRequest : onRequest
			};

		});
