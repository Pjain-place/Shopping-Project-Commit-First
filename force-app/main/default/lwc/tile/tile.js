import { LightningElement, api } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class Tile extends LightningElement {
  @api item
  @api value = ''
  @api Totalprice = 0
  get Qtyptions () {
    return [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ]
  }
  handleChange (event) {
    if (event.detail.value) {
      this.value = Number(event.detail.value)

      this.TotalPrice = this.value* this.item.UnitPrice__c
    }
  }
  childhandleAdd (event) {
    if (this.template.querySelector('lightning-combobox').value == null) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message: 'Please select atlease one Quantity',
          variant: 'error'
        })
      )
      // this.showAdd = true;
      // this.showDelete = false;
      // this.Buttontrue = false;
    } else {
      this.AddToParent()
    }
  }

  AddToParent () {
    const childEvent = new CustomEvent('quantitychange', {
      detail: {
        ItemId: this.item.Id,
        UnitPrice: this.item.UnitPrice__c,
        quantityFromChild: this.value,
        TotalPriceFromChild: this.TotalPrice,
        ItemName: this.item.Name,
        showadd: this.item.showAddButton,
        showDelete: this.item.showDeleteButton
      }
    })
    this.dispatchEvent(childEvent)
  }

  childhandleRemove (event) {
    console.log('del' + this.item.quantity);
    this.template.querySelector('lightning-combobox').value = null
    // this.value-=this.value;
    // this.TotalPrice-=this.TotalPrice;
    // this.AddToParent();
    console.log('pagintionval..',this.value);
    const deleteval = new CustomEvent('deleteclick', {
      // detail contains only primitives
      detail: {
        Delval:  this.item.quantity,
        Totalpricedelte: this.TotalPrice,
        QtyId: event.currentTarget.dataset.id,
        ItemId: this.item.Id
      }
    })
    // Fire the event from c-tile
    this.dispatchEvent(deleteval)

    //     // this.AddToParent();
  }
}