const OptionRadio = {
    // language=HTML
    template: `
        <div class="option-item">
            <label v-for="type in types" :key="type.value">
                <span>{{type.name}}</span>
                <input type="radio" v-model="currentValue" :value="type.value" :name="optionName" @focus="$event.target.blur()">
            </label>
        </div>
    `,
    props: {
        types: {
            type:Array,
            required:true,
        },
        value: {
            type:Number,
            required:true,
        },
        name: {
            type:String,
            required:true,
        }
    },
    data() {
        return {
            currentValue: this.value,
        }
    },
    computed: {
        optionName() {
            return 'option-' + this.name;
        }
    },
    watch: {
        currentValue(value) {
            this.$emit('input', value);
        }
    },
};