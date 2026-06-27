import { LightningElement, api } from 'lwc';
import skeletonCell from './skeletonCell';

export default class SkeletonCellType extends LightningElement {
    @api
    getDataTypes() {
        return {
            skeleton: {
                template: skeletonCell,
                standardCellLayout: false
            }
        }
    }
}