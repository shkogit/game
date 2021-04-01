const vm = new Vue({
    el: '#app',
    // language=HTML
    template: `
        <game-app>
            <panel-display></panel-display>
            <div class="layer" :style="optionScale">
                <panel-option></panel-option>
                <panel-info></panel-info>
            </div>
        </game-app>
    `,
    data() {
        return {
            option:store.option,
            screen:store.screen,
        };
    },
    computed: {
        optionScale() {
            return {
                'transform': `scale(${this.screen.rate})`,
                'transform-origin': '0 0',
            };
        }
    },
    components: {
        'game-app' : GameApp,
        'panel-option' : PanelOption,
        'panel-display' : PanelDisplay,
        'panel-info' : PanelInfo,
    },
});