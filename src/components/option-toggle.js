const OptionToggle = {
    // language=HTML
    template: `
        <div class="option-item">
            <button class="btn" :class="buttonClass" @click="onClickButton" @focus="$event.target.blur()">{{buttonText}}</button>
        </div>
    `,
    props: {
        'value': {
            type: Boolean,
            required: true,
        }
    },
    data() {
        return {
            on: this.value,
        };
    },
    computed: {
        buttonText() {
            return this.on ? 'ON' : 'OFF';
        },
        buttonClass() {
            return this.on ? 'btn-on' : 'btn-off';
        }
    },
    methods: {
        onClickButton() {
            this.on = !this.on;
            this.$emit('input', this.on);
        }
    }
};