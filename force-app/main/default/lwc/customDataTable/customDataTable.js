import LightningDatatable from 'lightning/datatable';
//import the template so that it can be reused
import DatatablePicklistTemplate from './picklist-template.html';
export default class CustomDataTable extends LightningDatatable {
//  @api selectedoption;

    static customTypes = {
        picklist: {
            template: DatatablePicklistTemplate,
            typeAttributes: ['label', 'placeholder', 'options', 'value','recordId']
        }

    };
}