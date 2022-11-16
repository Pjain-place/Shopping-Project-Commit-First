import { LightningElement,api,track } from 'lwc';

export default class Pagination extends LightningElement {
    totalRecord = 0;
    @track  recordSize=6;
    @track totalRecordCount=0;
    @track page=1;
    @track startingRecord = 1;
    @track endingRecord = 0; 
    totalPage = 0;
   isPageChanged = false;
   @api selectValueArray = [];
   get records()
   {
     return this.visibleRecords
   }
    @api
    set records(result)
    {
        if(result)
        {
            this.totalRecord = result;
            console.log('resilts...',result);
            console.log('totalrecord...',this.totalRecord);
            this.totalRecordCount = result.length; 
            this.totalPage = Math.ceil(this.totalRecordCount / this.recordSize); 
            console.log('totalpage',this.totalPage);
            this.page=1;
            this.updateRecord();
        }
    }
    updateRecord()
    {
    
        this.startingRecord = ((this.page -1) * this.recordSize) ;
        console.log('stpage',this.startingRecord);
        this.endingRecord = (this.recordSize * this.page);
        console.log('endrecord',this.endingRecord);
        this.visibleRecords=this.totalRecord.slice(this.startingRecord,this.endingRecord)
       
        this.dispatchEvent(new CustomEvent('update',{
            detail:{
                records:this.visibleRecords
            }
        }))
    }
    previousHandler() {
       
         this.isPageChanged = true;
        if(this.page>1){
            this.page = this.page - 1; //decrease page by 1
            this.updateRecord();            
        }
     }
    nextHandler() {
        

     //   console.log(this.selectValueArray);
            this.isPageChanged = true;
            if((this.page<this.totalPage) && this.page !== this.totalPage){
                this.page = this.page + 1; //increase page by 1
                this.updateRecord();            
            }
          
         }

}