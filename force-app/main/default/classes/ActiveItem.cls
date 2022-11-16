public with sharing class ActiveItem {
    @Auraenabled(cacheable=true)
    public static list<contact> customerContact()
    {
        List<contact> contactName = new list<contact>( [SELECT Id, Name FROM Contact]);
        
        system.debug(contactName);
        return contactName;
    }
    @Auraenabled(cacheable=true)
    public static Integer activeItemCount(String searchKey)
    {
        set<Item__c> itemset = new set<Item__c>();
        list<Item__c> i1 = [SELECT Name , UnitPrice__c,IsActive__c,Description__c,Quantity__c
                            FROM Item__c 
                            WHERE IsActive__c= true];
        for(Item__c i : i1)
        {
            if(i.Name.containsIgnoreCase(searchKey)|| i.Description__c.containsIgnoreCase(searchKey))
            {
                itemset.add(i);
            }
        }
        system.debug(itemset.size());
        return itemset.size();
        
        //String key = '%' + searchKey + '%';
        //   system.debug([select COUNT() from Item__c where Name LIKE :key AND IsActive__c= true]);
        //   return([Select COUNT() From Item__c where Name LIKE :key AND IsActive__c= true]);
        
    }
    @Auraenabled(cacheable=true)
    public static list<Item__c> activeItemSelect(String searchKey,Integer offset, Integer l)
    {
        set<Item__c> itemset = new set<Item__c>();
        list<Item__c> i1 = [SELECT Name , UnitPrice__c,IsActive__c,Description__c,Quantity__c
                            FROM Item__c 
                            WHERE IsActive__c= true ];
        for(Item__c i : i1)
        {
            if(i.Name.containsIgnoreCase(searchKey)|| i.Description__c.containsIgnoreCase(searchKey))
            {
                itemset.add(i);
            }
        }
        list<Item__c> l2 =[SELECT  Name , UnitPrice__c,IsActive__c,Description__c,Quantity__c
                           FROM Item__c 
                           WHERE Id IN : itemset 
                           LIMIT :l  
                           OFFSET :offset];
        return l2;
    }
    @AuraEnabled
    public static Order__c orderItemRecMethod(Object orderRec , String CustomerId){
        
        Order__c newOrder = new Order__c();
        newOrder.Customer__c = CustomerId;
        system.debug(date.today());
        newOrder.Order_Date__c=date.today();
        insert newOrder;
        list<Wrapper> orderItemData=(list<Wrapper>)JSON.deserialize(JSON.serialize(orderRec),list<Wrapper>.class);
        
        system.debug(orderItemData);
        List<OrderItems__c> orderItemList =new List<OrderItems__c>();
        for(Wrapper item:orderItemData)
        {
            OrderItems__c ord=new  OrderItems__c();
            ord.Order__c=newOrder.Id;
            ord.Item__c= item.id;
            ord.Name=item.name;
            ord.Quantity__c=item.quantity;
            OrderItemList.add(ord);
        }
        insert orderItemList;
        return newOrder;
    }
    public class Wrapper{
        @AuraEnabled public String id;
        @AuraEnabled public String name ;
        @AuraEnabled public Integer quantity;
        @AuraEnabled public Integer unitPrice;
    }
}