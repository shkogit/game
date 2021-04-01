// define
const PLAYER = 'player';
const GROUND = 'ground';
const BLOCK_BRICK = 'block_brick';
const BLOCK_ITEM = 'block_item';
const BLOCK_FLOWER = 'block_flower';
const ITEM_COIN = 'item_coin';
const ITEM_STAR = 'item_star';
const ITEM_MUSHROOM = 'item_mushroom';
const ITEM_FLOWER = 'item_flower';

// object data
const objectData = {
    [PLAYER]: {
        x: 2,
        y: 1.5,
        w: .95,
        h: 1.5,
        color: '#f44',
        weight: 2.8,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0,
        state: 'walk',
    },
    [GROUND]: {
        x: 0,
        y: 0,
        w: 500,
        h: 1.2,
        color: '#e28e41',
    },
    [BLOCK_BRICK]: {
        w: 1,
        h: 1,
        color: '#1f1f1f',
    },
    [BLOCK_ITEM]: {
        w: 1,
        h: 1,
        color: '#f6c91f',
        velocityY: 0,
    },
    [BLOCK_FLOWER]: {
        w: 1,
        h: 1,
        color: '#679936',
        velocityY: 0,
    },
    [ITEM_COIN]: {
        w: 1,
        h: 1,
        color: '#3efa83',
    },
    [ITEM_STAR]: {
        w: 1,
        h: 1,
        color: '#00ffe1',
    },
    [ITEM_MUSHROOM]: {
        w: 1,
        h: 1,
        color: '#f68a40',
    },
    [ITEM_FLOWER]: {
        w: 1,
        h: 1,
        color: '#ff2cfb',
    },
};

const createObject = (type) => {
    const o = clone(objectData[type]);
    o.type = type;
    return o;
};

// input
const input = {
    ArrowRight: false,
    ArrowLeft: false,
    Space: false,
    KeyZ: false,
};

window.addEventListener('keydown', e => {
    if (input.hasOwnProperty(e.code)) input[e.code] = true;
});
window.addEventListener('keyup', e => {
    if (input.hasOwnProperty(e.code)) input[e.code] = false;
});

// game
const Game = class {
    /**
     * Init
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // objects
        this.ground = createObject(GROUND);
        this.player = createObject(PLAYER);
        this.blocks = [];
        this.items = [];

        [
            {x: 8, y: 4, type: BLOCK_ITEM},
            {x: 11, y: 4, type: BLOCK_BRICK},
            {x: 12, y: 4, type: BLOCK_ITEM},
            {x: 13, y: 4, type: BLOCK_BRICK},
            {x: 14, y: 4, type: BLOCK_ITEM},
            {x: 15, y: 4, type: BLOCK_BRICK},
            {x: 13, y: 8, type: BLOCK_FLOWER}
        ].forEach(blockData => {
            const block = createObject(blockData.type);
            block.x = blockData.x;
            block.y = blockData.y;
            block.yy = blockData.y;
            block.weight = 3;
            this.blocks.push(block);
        });

        // jump height
        this.jumpStartHeight = 0;
        this.jumpEndHeight = 0;

        // meter to pixel
        this.meterDefault = 40;
        this.meter = 40;

        this.startFrame();
    }

    /**
     * Interaction
     */
    toCoordinate({x, y, w, h}) {
        /*
                        (x2, y2)
            +----------+
            |          |
            |          |
            |          |
            |          |
            +----------+
    (x1, y1)
         */

        return {
            x1: x,
            x2: x + w,
            y1: y,
            y2: y + h,
        }
    }

    update(dt) {
        const {option, screen} = store;
        const {player, ground, blocks} = this;

        this.meter = this.meterDefault * screen.rate;

        /*
            Z 키
         */
        option.acceleration.x2 = input.KeyZ;

        /*
            충돌 요소 감지
         */
        const arr = [ground, ...blocks];
        const {x1: px1, y1: py1, x2: px2, y2: py2} = this.toCoordinate(player);

        const collision = arr.filter(obj => {
            const {x1: ox1, y1: oy1, x2: ox2, y2: oy2} = this.toCoordinate(obj);

            return !(
                ox2 < px1 ||
                px2 < ox1 ||
                oy2 < py1 ||
                py2 < oy1
            );
        }).sort((a, b) => {
            const {x1: ax1, x2: ax2} = this.toCoordinate(a);
            const {x1: bx1, x2: bx2} = this.toCoordinate(b);

            let aValue = 0;
            let bValue = 0;

            if (ax1 <= px1 && px1 <= ax2) aValue = ax2 - px1;
            if (ax1 <= px2 && px2 <= ax2) aValue = px2 - ax1;

            if (bx1 <= px1 && px1 <= bx2) bValue = bx2 - px1;
            if (bx1 <= px2 && px2 <= bx2) bValue = px2 - bx1;

            return bValue - aValue;
        })[0];


        /*
            현재 플레이어 상태
            jump - 점프하여 공중에 있음
            walk - 요소 위에 올라서 있는 상태
         */

        player.state = 'jump';

        let cDepth = 0;
        let cDirection = null;

        if (collision) {
            const cArr = new Array(4).fill(Number.MAX_SAFE_INTEGER);
            const {x1: cx1, y1: cy1, x2: cx2, y2: cy2} = this.toCoordinate(collision);

            cArr[0] = px2 - cx1; // left
            cArr[1] = cx2 - px1; // right
            cArr[2] = py2 - cy1; // bottom
            cArr[3] = cy2 - py1; // top

            /*
                충돌 방향
             */
            cDepth = Math.min(...cArr);
            cDirection = ['left', 'right', 'bottom', 'top'][cArr.indexOf(cDepth)];

            if (cDirection === 'left') {
                player.x -= cArr[0];
            }
            if (cDirection === 'right') {
                player.x += cArr[1];
            }
            if (cDirection === 'bottom') {
                player.y -= cArr[2];
                player.velocityY *= -1;

                if (collision.type === BLOCK_BRICK) {
                    const temp = collision.y;
                    collision.y = -collision.h;
                    setTimeout(() => {
                        collision.y = temp;
                    }, 5000);
                }

                if (collision.type === BLOCK_ITEM || collision.type === BLOCK_FLOWER) {
                    let item = createObject(ITEM_FLOWER);

                    if (collision.type === BLOCK_ITEM) {
                        item = createObject([ITEM_COIN, ITEM_STAR, ITEM_MUSHROOM][Math.floor(Math.random() * 3)]);
                    }

                    item.x = collision.x;
                    item.y = collision.y + 1;
                    this.items.push(item);
                    setTimeout(() => {
                        const idx = this.items.findIndex(i => i === item);
                        this.items.splice(idx, 1);
                    }, 1000);
                    if (option.blockElasticity.on)
                        collision.velocityY = player.velocityY * -1 * option.blockElasticity.value * .5;
                }

            }
            if (cDirection === 'top') {
                player.y += cArr[3];
                player.state = 'walk';
            }
        }

        /*
            Y 이동 & 중력
         */
        if (player.state === 'jump') {
            if (option.gravity.on)
                player.velocityY = player.velocityY - player.weight * option.gravity.acceleration * dt;
        } else {
            if (option.playerElasticity.on) {
                player.velocityY *= option.playerElasticity.value * -1;

                if (Math.abs(player.velocityY) < 1) player.velocityY = 0;

            } else {
                player.velocityY = 0;
            }
        }


        /*
            X 이동
         */
        // if (player.state === 'walk') {
        if (option.acceleration.on) {
            let a = 0;
            if (input.ArrowLeft) {
                a = -option.acceleration.value;
            }
            if (input.ArrowRight) {
                a = option.acceleration.value;
            }

            if (option.acceleration.x2) {
                a *= 1.5;
            }

            player.velocityX = player.velocityX + a * dt;

            if (player.velocityX > option.velocityX.value) player.velocityX = option.velocityX.value;
            if (player.velocityX < -option.velocityX.value) player.velocityX = -option.velocityX.value;

            if (option.groundFriction.on && player.state === 'walk') {
                if (
                    a === 0 ||
                    a < 0 && player.velocityX > 0 ||
                    a > 0 && player.velocityX < 0
                ) {
                    player.velocityX *= option.groundFriction.value;
                    if (Math.abs(player.velocityX) < 1) player.velocityX = 0;
                }
            }

            if (option.airResistance.on && player.state === 'jump') {
                if (
                    a === 0 ||
                    a < 0 && player.velocityX > 0 ||
                    a > 0 && player.velocityX < 0
                ) {
                    player.velocityX *= option.airResistance.value;
                    if (Math.abs(player.velocityX) < 1) player.velocityX = 0;
                }
            }

        } else {
            player.velocityX = 0;
            if (input.ArrowLeft && cDirection !== 'right') {
                player.velocityX = -option.velocityX.value;
            }
            if (input.ArrowRight && cDirection !== 'left') {
                player.velocityX = option.velocityX.value;
            }
        }
        // }

        /*
            점프
         */
        if (player.state === 'walk') {
            if (input.Space) {
                player.velocityY = option.velocityY.value;
                this.jumpStartHeight = player.y;
            }
        }
        if (this.jumpStartHeight)
            this.jumpEndHeight = player.y;

        if (player.state === 'jump') {
            const height = this.jumpEndHeight -this.jumpStartHeight;
            if (store.info.jumpMaxHeight < height)
                store.info.jumpMaxHeight = height;
        }

        /*
            플레이어 이동
         */
        const temp = {
            x1: player.x,
            y1: player.y,
        };

        player.x = player.x + player.velocityX * dt;
        player.y = player.y + player.velocityY * dt;

        store.info.velocityX = player.velocityX;

        const max = this.canvas.width / this.meter;
        if (player.x < 0) player.x = 0;
        if (player.x > max - player.w) player.x = max - player.w;

        temp.x2 = player.x;
        temp.y2 = player.y;

        store.info.frameDistance = Math.sqrt((temp.x1 - temp.x2) ** 2 + (temp.y1 - temp.y2) ** 2) * this.meter;

        /*
            물음표 블럭 움직임
         */
        blocks.forEach(b => {
            if (!b.hasOwnProperty('velocityY')) return;

            b.y = b.y + b.velocityY * dt;

            if (b.y > b.yy) {
                b.velocityY = b.velocityY - option.gravity.acceleration * b.weight * dt;
            }

            if (b.y < b.yy) {
                b.velocityY = b.velocityY + option.gravity.acceleration * b.weight * dt;
            }

            if (Math.abs(b.velocityY) < 1) {
                b.velocityY = 0;
                b.y = b.yy;
            }

        });

    }

    /**
     * Rendering
     */
    render(dt) {
        this.clearRect();
        this.drawRect(this.ground);
        this.items.forEach(item => this.drawRect(item));
        this.blocks.forEach(block => {
            this.drawRect(block)
        });
        this.drawRect(this.player);
    }

    clearRect() {
        const {width, height} = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
    }

    drawRect({x, y, w, h, color = 'black'}) {
        this.ctx.fillStyle = color;

        x = x * this.meter;
        y = this.canvas.height - (y + h) * this.meter;
        w = w * this.meter;
        h = h * this.meter;

        this.ctx.fillRect(x, y, w, h);
    }

    /**
     * Frame
     */
    startFrame() {
        const {option} = store;

        let currDate = Date.now();
        let lastDate = currDate;
        let frameTime = 0;
        let i = -1;

        const frame = () => {
            requestAnimationFrame(frame);

            i++;
            i %= 60;

            currDate = Date.now();
            frameTime = (currDate - lastDate) / 1000;
            lastDate = currDate;

            if (option.fps.on) {
                if (option.fps.value === 30) {
                    if (i % 2 !== 0) return;
                }
                if (option.fps.value === 15) {
                    if (i % 4 !== 0) return;
                }
            }

            this.update(frameTime);

            if (!option.fps.on) {
                if (option.fps.value === 30) {
                    if (i % 2 !== 0) return;
                }
                if (option.fps.value === 15) {
                    if (i % 4 !== 0) return;
                }
            }

            this.render(frameTime);
        };

        frame();
    }
}