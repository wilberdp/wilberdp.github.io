import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class AnonymousTaskFormUserEmail extends LitElement {
    static properties = {
        tasksJson : { type: String },
        email : { type: String }
    };

    static getMetaConfig() {
        return {
            controlName: 'AnonymousTaskFormUserEmail',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                tasksJson: {
                    title: 'Tasks JSON',
                    type: 'string'
                },
                email: {
                    title: 'User Email',
                    type: 'string',
                    isValueField: true
                }
            },
            events: ['ntx-value-change']
        };
    }
  
    constructor() {
        super();
    }

    render() {
        this.render2();  

        return html`<p>AnonymousTaskFormUserEmail</p>`;
    }

    async render2() {
        try {
            if (!window || !window.data || this.tasksJson == null || this.tasksJson == '') {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                /*
                var d = await fetch('https://us.nintex.io/workflows/v2/tasks?status=active', { headers: { 'Accept': ', application/problem+json', 'Authorization': 'Bearer ' + (await window.data.getAccessTokenAsync()).access_token }});
                console.log(d);
                var dd = await d.text();
                console.log(dd);
                var ddd = JSON.parse(dd);
                console.log(ddd);
                var task = ddd.tasks.filter((itt) => { return (itt.taskAssignments.filter((itt2) => { return itt2.id == window.data.id.split('_')[1]; }).length > 0) });
                console.log(task);
                var email = task[0].taskAssignments.filter((itt) => { return itt.id == window.data.id.split('_')[1] })[0].assignee;
                console.log(email);
                */

                var ddd = JSON.parse(this.tasksJson);
                console.log(ddd);
                var task = ddd.tasks.filter((itt) => { return (itt.taskAssignments.filter((itt2) => { return itt2.id == window.data.id.split('_')[1]; }).length > 0) });
                console.log(task);
                var email = task[0].taskAssignments.filter((itt) => { return itt.id == window.data.id.split('_')[1] })[0].assignee;
                console.log(email);
                this.email = email;
                this.onChange(this.email);
            }
        }
        catch(exc) { 
            console.log(exc);
        }
    }

    onChange(value) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: value
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }
}

const elementName = 'anonymous-task-form-user-email';
customElements.define(elementName, AnonymousTaskFormUserEmail);