public class ItemQuantityUpdateHandler {
    public static void updateQuantity(list<Item__c> newitemList, Map<Id,Item__c> oldMap )
    {
        system.debug(newitemList);
      //  list<Item__c> newUpdateList = new list<Item__c> ();
        for(Item__c items : newitemList)
        {
            if(oldMap.get(items.id).SoldItemsCount__c!=items.SoldItemsCount__c)
               {
                   items.Quantity__c = Integer.valueOf(items.Quantity__c - (items.SoldItemsCount__c - oldMap.get(items.id)?.SoldItemsCount__c));
               }
            
            
         }
        
        
    }

}