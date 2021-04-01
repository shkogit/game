const PanelDisplay = {
    // language=HTML
    template: `
        <div id="display">
            <canvas :width="canvasWidth" :height="canvasHeight" ref="canvas"></canvas>
        </div>
    `,
    data() {
        return {
            size: {
                width: 800,
                height: 600
            },
            screen: store.screen,
        };
    },
    computed: {
        canvasWidth() {
            return this.size.width * this.screen.rate;
        },
        canvasHeight() {
            return this.size.height * this.screen.rate;
        }
    },
    methods: {
        setWindowSize() {
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

            const minRate = Math.min(this.screen.width / this.size.width, this.screen.height / this.size.height);
            this.screen.rate = minRate < 0.5 ? 0.5 : minRate > 1 ? 1 : minRate;
        }
    },
    mounted() {
        this.setWindowSize();
        window.addEventListener('resize', () => {
            this.setWindowSize()
        });

        const game = new Game(this.$refs.canvas);
    }
};