import { LightningElement, api } from 'lwc';

export default class RadioGroup extends LightningElement {
    _value;
    _options
    
    instanceId = crypto.randomUUID();

    @api
    name;

    @api
    get value() {
        return this._value;
    }
    set value(selected) {
        this._value = selected;
    }

    @api
    get options() {
        const value = this.value
        return (this._options ?? []).map(option => ({
            ...option,
            checked: option.value === value
        }));
    }
    set options(value) {
        if (Array.isArray(value)) {
            this._options = value;
        }
    }

    handleChange(event) {
        this.value = event.target.value;
        this.dispatchEvent(new CustomEvent('change', {detail: { value: event.target.value }}));
    }
}