import { LightningElement, wire, api, track } from 'lwc'
import activeItemSelect from '@salesforce/apex/ActiveItem.activeItemSelect'
import HideLightningHeader from '@salesforce/resourceUrl/NoLwcHeader'
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import activeItemCount from '@salesforce/apex/ActiveItem.activeItemCount'
import { publish, subscribe, MessageContext } from 'lightning/messageService'
import HEADER_COMP_CHANNEL from '@salesforce/messageChannel/Header_Comp__c'
export default class List extends LightningElement {
  @track page = 1
  @track totalRecordCount = 0
  @track totalPrice = 0
  @track ItemList = []
  @track ItemListUpdated = []
  @api value = ''
  Buttontrue = false
  disabledButton = false
  isLoading = false
  showPage = true
  subscription = null
  offset = 0
  limit = 6
  totalPage = 0
  visibleRecord
  startRec = 1
  endRec = 0
  totalRecord
  items
  isPagination
  additem = 0
  QtyrecordId = ''
  searchKey = ''
  wiredActivities = []
  wirecount
  @wire(MessageContext)
  messageContext

  connectedCallback () {
    this.subscribeToMessageChannel()
    loadStyle(this, HideLightningHeader)
    // this.endRec=this.visibleRecord;
  }
  subscribeToMessageChannel () {
    this.subscription = subscribe(
      this.messageContext,
      HEADER_COMP_CHANNEL,
      message => this.handleMessage(message)
    )
  }
  handleMessage (message) {
    if (message.contactId) {
      this.value = message.contactId
    }
    if (message.search) {
      this.searchKey = message.search
      this.offset = 0
      this.page = 1
      this.isLoading = true
    } else if (message.search === undefined || message.search === '') {
      this.searchKey = ''
      this.offset = 0
      this.page = 1
    }
  }
  @wire(activeItemCount, { searchKey: '$searchKey' }) wiredcount (value) {
    this.wirecount = value
    const { data, error } = value
    if (data > 0) {
      this.isPagination = true

      this.totalRecordCount = data

      this.totalPage = Math.ceil(this.totalRecordCount / this.limit)
    } else if (error) {
      console.error(error)
      // handle your error.
    } else this.isPagination = false
  }

  @wire(activeItemSelect, {
    searchKey: '$searchKey',
    offset: '$offset',
    l: '$limit'
  })
  wiredobj (value) {
    this.wiredActivities = value
    // Destructure the provisioned value
    const { data, error } = value
    this.isLoading = true
    if (data) {
      this.visibleRecord = data.length
      if (this.page == 1) {
        this.startRec = 1
        this.endRec = this.visibleRecord
      }

      this.processRecords(data)
    } else if (error) {
      console.error(JSON.stringify(error))
      // handle your error.
    }
  }

  //diffrentiate all child component value when we doing loop on Items
  processRecords (result) {
    this.isLoading = false
    //console.log(result);
    this.totalRecord = result.length
    const nonproxyResult = JSON.parse(JSON.stringify(result))
    nonproxyResult.forEach(entry => {
      entry = Object.assign(entry, {
        quantity: null,
        showAddButton: true,
        showDeleteButton: false,
        Buttontrue: false,
        NoAvail: false
      })
      if (entry.Quantity__c == 0) {
        entry = Object.assign(entry, {
          quantity: null,
          showAddButton: false,
          showDeleteButton: false,
          Buttontrue: true,
          NoAvail: true
        })
      }
    })
    this.items = [...nonproxyResult]

    this.updateItemPage()
    // this.paginationHandler();
  }

  get disablePrev () {
    return this.page <= 1
  }
  get disableNext () {
    return this.page >= this.totalPage
  }
  previousHandler () {
    if (this.page > 1) {
      this.page = this.page - 1
      // this.Prevoffset = this.offset
      this.offset = this.offset - this.limit
      if (this.page < this.totalPage && this.page !== 1) {
        this.startRec = this.startRec - this.limit
        this.endRec = this.endRec - this.visibleRecord
      }
    }
  }

  nextHandler () {
    if (this.page < this.totalPage && this.page !== this.totalPage) {
      this.isLoading = true
      // this.updateItemPage();
      this.page = this.page + 1 //increase page by 1
      //this.Prevoffset = this.offset
      this.offset = this.offset + this.limit
      if (this.page < this.totalPage && this.page !== 1) {
        this.startRec = this.startRec + this.limit
        this.endRec = this.endRec + this.limit
      } else if (this.page == this.totalPage) {
        this.startRec = this.startRec + this.limit
        this.endRec = this.endRec + (this.totalRecordCount - this.endRec)
      }
    }
  }

  //for pagination dispatch event
  updateItemPage () {
    let copydata = JSON.parse(JSON.stringify(this.items))

    copydata.forEach(items => {
      this.ItemList.forEach(itrate => {
        if (items.Id === itrate.Item__c) {
          ;(items.quantity = JSON.stringify(itrate.Quantity__c)),
            (items.showAddButton = false),
            (items.showDeleteButton = true),
            (items.Buttontrue = true)
        }
      })
    })
    this.items = [...copydata]
  }
  handleChildChange (childEvent) {
    const UnitPrice = childEvent.detail.TotalPriceFromChild
    this.totalPrice = this.totalPrice + UnitPrice
    this.additem = this.additem + childEvent.detail.quantityFromChild
    let copydata = JSON.parse(JSON.stringify(this.items))
    //let copydata=[...this.visibleItems];
    copydata.forEach(items => {
      if (items.Id === childEvent.detail.ItemId) {
        items.showAddButton = false
        items.showDeleteButton = true
        items.Buttontrue = true
      }
    })
    this.items = [...copydata]
    if (childEvent.detail.quantityFromChild > 0) {
      let ItemVar = { sobjectType: 'OrderItems__c' }
      ItemVar.Item__c = childEvent.detail.ItemId
      //console.log(childEvent.detail.ItemId);
      ItemVar.Name = childEvent.detail.ItemName
      ItemVar.Quantity__c = childEvent.detail.quantityFromChild
      ItemVar.UnitPrice__c = childEvent.detail.UnitPrice
      ItemVar.totalPrice = childEvent.detail.TotalPriceFromChild
      this.ItemList.push(ItemVar)
    }
  }

  //for delete button click dispatch method
  handleRemove (event) {
    let copydata = JSON.parse(JSON.stringify(this.items))
    this.ItemList.forEach(itrate => {
      if (itrate.Item__c === event.detail.QtyId) {
        this.additem = this.additem - itrate.Quantity__c
        this.totalPrice = this.totalPrice - itrate.totalPrice
      }
    })
    ////////////
    copydata.forEach(items => {
      if (items.Id === event.detail.QtyId) {
        items.showAddButton = true
        items.showDeleteButton = false
        items.Buttontrue = false
      }
    })
    this.items = [...copydata]

    this.ItemList = this.ItemList.filter(function (arrItem) {
      return arrItem.Item__c !== event.detail.QtyId
    })
  }
  //for GO TO Cart button click handle method
  goToNextPage () {
    if (this.totalPrice == 0) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message: 'Please Add atleast one Item ',
          variant: 'error'
        })
      )
    }
    if (this.value == '' || !this.value) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message: 'Please Select a contact',
          variant: 'error'
        })
      )
    }
    if (!(this.value == '') && this.totalPrice != 0) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'Successfully added to cart',
          variant: 'Success'
        })
      )
      this.showPage = false
      if (this.showPage == false) {
        const payload = {
          showPage: this.showPage,
          contactId: this.value
        }
        publish(this.messageContext, HEADER_COMP_CHANNEL, payload)
      }
    }
  }
}
