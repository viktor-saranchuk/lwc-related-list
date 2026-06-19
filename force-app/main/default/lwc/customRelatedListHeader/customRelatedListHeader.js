import { LightningElement, api } from 'lwc';

export default class CustomRelatedListHeader extends LightningElement {
    @api iconName;
    @api title;
    @api numberOfItems;
    @api totlaNumberOfItems;
}