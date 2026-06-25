import { LightningElement } from 'lwc';

const LABELS = {
    header: 'Nothing to see here',
    body: 'There\'s nothing in your list yet. Try adding a new record.'
}

export default class RelatedListBodyEmptyData extends LightningElement {
    labels = LABELS;
}