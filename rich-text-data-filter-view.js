import {css, html, LitElement, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class RichTextDataFilterView extends LitElement {
    static properties = {
        data: { type: String },
        filterColumn: { type: String },
        filterValues: { type: String },
        output: { type: String },
        customViewMarkup: { type: String },
        customCSS: { type: String },
        customJavascript: { type: String }
    };

    sortDirection;
    groupBy;
    groupByIdx;
    pageSize;
    listViewNumber;

    static getMetaConfig() {
        // plugin contract information
        return {
            controlName: 'rich-text-data-filter-view',
            fallbackDisableSubmit: false,
            description: 'Rich Text Data Filter View',
            version: '1.0',
            properties: { 
                data: {
                    type: 'string',
                    title: 'Data to filter',
                    maxLength: 10000
                },
                filterColumn: {
                    type: 'string',
                    title: 'Filter Column',
                    maxLength: 10000
                },
                filterValues: {
                    type: 'string',
                    title: 'Filter Values',
                    maxLength: 10000
                },
                output: {
                    type: 'string',
                    title: 'Output',
                    maxLength: 10000,
                    isValueField: true
                },
                customViewMarkup: {
                    type: 'string',
                    title: 'Custom View Markup',
                    description: 'Custom markup template used to generate markup per item.  ${{internal name}} is used to reference a column.',
                    maxLength: 10000
                },
                customCSS: {
                    type: 'string',
                    title: 'Optional Custom CSS',
                    maxLength: 10000
                },
                customJavascript: {
                    type: 'string',
                    title: 'Optional Custom javascript',
                    maxLength: 10000
                }
            }
        };
    }

    onChange(e) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: e.target.values
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }

    render() {
        console.log(this.data);
    }

    async render2(id) {
        try {
            
        }
        catch (e) {
            console.log(e);
        }

        return '<div>An error has occurred</div>';
    }

    $$$(selector, rootNode = document.body) {
        const arr = []
        
        const traverser = node => {
            // 1. decline all nodes that are not elements
            if(node.nodeType !== Node.ELEMENT_NODE) {
                return
            }
            
            // 2. add the node to the array, if it matches the selector
            if(node.matches(selector)) {
                arr.push(node)
            }
            
            // 3. loop through the children
            const children = node.children
            if (children.length) {
                for(const child of children) {
                    traverser(child)
                }
            }
            
            // 4. check for shadow DOM, and loop through it's children
            const shadowRoot = node.shadowRoot
            if (shadowRoot) {
                const shadowChildren = shadowRoot.children
                for(const shadowChild of shadowChildren) {
                    traverser(shadowChild)
                }
            }
        }
        
        traverser(rootNode)
        
        return arr
    }
}

const elementName = 'rich-text-data-filter-view';
customElements.define(elementName, RichTextDataFilterView);