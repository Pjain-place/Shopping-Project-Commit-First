trigger ItemQuantityUpdateTrigger on Item__c (before update) {
    
    switch on Trigger.OperationType {
        when before_update
        {
           ItemQuantityUpdateHandler.updateQuantity(trigger.new, trigger.oldMap);
        }
       
       
        
    
    
}


}