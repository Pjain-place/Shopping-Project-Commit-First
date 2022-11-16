public class UpdateItemQuantity implements
    Database.Batchable<sObject> {
    // instance member to retain state across transactions
    
        public Integer InventNumber=10;
        public UpdateItemQuantity(Integer i)
        {
            if(i!=0)
            {
              this.InventNumber=i;  
            }
            
        }
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT ID, Name, Quantity__c FROM Item__c'
        );
    }
        public void execute(Database.BatchableContext bc, List<Item__c> scope){
        // process each batch of records
       
        for (Item__c item : scope) {
             system.debug(item.Quantity__c);
            item.Quantity__c=item.Quantity__c+this.InventNumber;   
             system.debug(item.Quantity__c);
            }
            
        
        update scope;
        }
        public void finish(Database.BatchableContext bc){
      
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors,
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];
        // call some utility to send email
      
        
    }
    }