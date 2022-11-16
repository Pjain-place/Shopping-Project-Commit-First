@isTest
private class TestActiveItem {
    
    @testSetup static void setup() {
        TestDataFactory.createContact(2);
        TestDataFactory.createItem(8,true);
        TestDataFactory.createItem(2,false);
    }
    @isTest static void testcustomerContact()
    {
        Test.startTest();
        list<contact> conList = ActiveItem.customerContact();
        Test.stopTest();
        system.assertEquals(2,conList.size());
    }
    @isTest static void testActiveItemCount()
    {
        
        // Perform test
        Test.startTest();
        Integer count1= ActiveItem.activeItemCount('');
        Integer count2= ActiveItem.activeItemCount('Item1');
        Integer count3= ActiveItem.activeItemCount('Product1');
        Integer count4= ActiveItem.activeItemCount('Item');
        
        Test.stopTest();
        System.assertEquals(8,count1);
        system.assertEquals(1,count2);
        system.assertEquals(1,count3);
        system.assertEquals(8,count4);
        
    }
    @isTest static void testActiveItemSelect()
    {
        
        // Perform test
        Test.startTest();
        list<Item__c> itemList1 = ActiveItem.activeItemSelect('',0,6);
        list<Item__c> itemList2 = ActiveItem.activeItemSelect('Item',0,6);
        list<Item__c> itemList3 = ActiveItem.activeItemSelect('Item1',0,6);
        list<Item__c> itemList4 = ActiveItem.activeItemSelect('This is',0,6);
        list<Item__c> itemList5 = ActiveItem.activeItemSelect('Product1',6,6);
        list<Item__c> itemList6 = ActiveItem.activeItemSelect('Item1',6,6);
        Test.stopTest();
        system.assertEquals(6,itemList1.size());
        system.assertEquals(6,itemList2.size());
        system.assertEquals(1,itemList3.size());
        system.assertEquals(6,itemList4.size());
        system.assertEquals(0,itemList5.size());
        system.assertEquals(0,itemList6.size());
        
    }
    @isTest static void testorderItemRecMethod()
    {
        
        Contact con = [SELECT Id 
                       FROM Contact
                       WHERE lastname='contact1' 
                       LIMIT 1];
        
        list<Item__c> items = [SELECT id ,Name , Quantity__c ,UnitPrice__c,Description__c
                               FROM Item__c 
                               WHERE IsActive__c =true];
        
        list<ActiveItem.Wrapper> wrapperObjTrue = new  list<ActiveItem.Wrapper>();
        for(Item__c itemList : items)
        {
            ActiveItem.Wrapper wrapperObj = new ActiveItem.Wrapper();
            wrapperObj.id=itemList.Id;
            wrapperObj.name=itemList.Name;
            wrapperObj.quantity=Integer.valueOf(itemList.Quantity__c);
            wrapperObj.unitPrice=Integer.valueOf(itemList.UnitPrice__c);
            wrapperObjTrue.add(wrapperObj);
        }
        test.startTest();
        Order__c orderList = ActiveItem.orderItemRecMethod(wrapperObjTrue,con.Id);
        test.stopTest();
        
        list<Order__c> orderLists =[SELECT Id FROM Order__c];
        list<OrderItems__c> orderItemList= [SELECT Id ,Quantity__c FROM OrderItems__c];
        system.assertEquals(con.Id,orderList.Customer__c);
        system.assertEquals(1,orderLists.size());
        system.assertEquals(10,orderItemList[0].Quantity__c);
        system.assertEquals(8,orderItemList.size());
        
    }
    
}