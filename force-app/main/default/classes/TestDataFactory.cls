@isTest
public class TestDataFactory {
    public static List<Item__c> createItem(Integer numItem, Boolean doActive) {
        List<Item__c> itemList = new List<Item__c>();
        for(Integer i=0;i<numItem;i++) {
            Item__c itemCreate = new  Item__c(Name='Item'+i ,
                                              Quantity__c =10,
                                              IsActive__c=doActive,
                                              Description__c='This is an Product'+i,
                                              UnitPrice__c=100*+i);                                  
            itemList.add(itemCreate);
        }
        
        insert itemList;
        return  itemList;
        
    }
    public static list<Contact> createContact(Integer numCon) {
        list<Contact> conList = new list<Contact>();
        for(Integer i=0;i<numCon;i++) {
            Contact con = new Contact(lastname='contact'+i);
            conList.add(con);
        }
        insert conList;
        return conList;
    }
}