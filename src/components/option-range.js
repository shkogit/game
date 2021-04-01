const OptionRange = {
    // language=HTML
    template: `
        <div class="option-item">
            <input type="range" :min="min" :max="max" v-model.number="currentValue" :step="step" @input="onInput" @focus="$event.target.blur()">
        </div>
    `,
    props: {
        min: {
            type:Number,
            required:true,
        },
        max: {
            type:Number,
            required:true,
        },
        value: {
            type:Number,
            required:true,
        },
        step: {
            type:Number,
            required:true,
        }
    },
    data() {
        return {
            currentValue: this.value,
        }
    },
    methods: {
        onInput() {
            this.$emit('input', this.currentValue);
        }
    }
};