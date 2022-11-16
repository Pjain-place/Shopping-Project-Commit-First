import { LightningElement, api } from 'lwc';

export default class DatatablePicklist extends LightningElement {
    @api label;
    @api placeholder;
    @api options=[];
    @api value;
    @api  recordId;;

    handleChange(event) {
        this.value=Number(event.detail.value);
         this.dispatchEvent(new CustomEvent('picklistchanged', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                recordId:this.recordId,
                value: event.detail.value ,
             }
         }));
    
}
}