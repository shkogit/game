const PanelOption = {
    // language=HTML
    template: `
        <div id="option">
            <div class="option-table">
                
                <div class="option-group" v-for="(item, key) in option" :key="item.id">
                    <b>{{item.title}}</b>

                    <template v-if="item.hasOwnProperty('on')">
                        <option-toggle
                                v-model="item.on"></option-toggle>
                    </template>
                    
                    <template v-if="item.hasOwnProperty('min') && item.hasOwnProperty('max')">
                        <option-range
                                v-model="item.value"
                                :min="item.min"
                                :max="item.max"
                                :step="1">
                        </option-range>
                    </template>
                    
                    <template v-if="item.hasOwnProperty('types')">
                        <option-radio
                                v-model="item.value"
                                :name="key"
                                :types="item.types"></option-radio>
                    </template>
                    
                    <template v-if="!item.hasOwnProperty('types') && item.hasOwnProperty('value')">
                        <strong>{{item.value}}</strong>
                        <template v-if="item.hasOwnProperty('x2') && item.x2">
                            <span style="position: absolute; right: 10px;">(1.5x)</span>
                        </template>
                    </template>
                    
                </div>
                
            </div>
        </div>
    `,
    data() {
        return {
            option:store.option,
        };
    },
    components: {
        'option-toggle': OptionToggle,
        'option-range': OptionRange,
        'option-radio': OptionRadio,
    },
};