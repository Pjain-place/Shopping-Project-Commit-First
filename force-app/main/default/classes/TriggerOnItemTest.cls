@isTest
public class TriggerOnItemTest {
    @testSetup 
    public static void setup() {
        list<contact> con =  TestDataFactory.createContact(2);
        list<Item__c > itemList= TestDataFactory.createItem(2,true);
        list<Order__c> newOrderList = new  list<Order__c>();
        for(Contact conLopp : con )
        {
            Order__c newOrder = new Order__c();
            newOrder.Customer__c= conLopp.Id ; 
            newOrder.Order_Date__c=date.today();
            newOrderList.add(newOrder);
        }
        insert newOrderList;
        
        
        
        
    }
    @isTest static void testItemQuantity()
    {
        Item__c activeItem =[SELECT ID,Quantity__c FROM Item__c 
                             WHERE Name = 'Item1'  
                             AND SoldItemsCount__c = 0 LIMIT 1] ;
        system.assertEquals(10,activeItem.Quantity__c) ;
        
        list<Order__c> OrderList = [SELECT ID FROM Order__c] ;
        list<OrderItems__c> newOrderItemList = new  list<OrderItems__c>();
        for(Order__c orderLopp :OrderList)
        {
            OrderItems__c orderItem = new OrderItems__c();
            orderItem.Item__c=activeItem.Id;
            orderItem.Order__c=orderLopp.Id;
            orderItem.Quantity__c=3;
            newOrderItemList.add(orderItem);
            
        }
        insert newOrderItemList ; 
        list<OrderItems__c> orderItemList= [SELECT Id FROM OrderItems__c];
        Item__c item = [SELECT Id,Quantity__c FROM Item__c
                        WHERE Name ='Item1' 
                        AND SoldItemsCount__c = 6 Limit 1];
        system.assertEquals(2,orderItemList.size());
        system.assertEquals(4,item.Quantity__c) ;
    }
}