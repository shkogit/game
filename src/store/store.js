const store = {
    option: {
        velocityX: {
            id:1,
            title: 'X 방향 속도 (오른쪽 +)',
            min: 10,
            max: 30,
            value: 10,
        },
        acceleration: {
            id:2,
            title: 'X 방향 가속도',
            on: false,
            min: 5,
            max: 20,
            value: 5,
            x2: false,
        },
        velocityY: {
            id:3,
            title: 'Y 방향 속도 (위방향 -)',
            min: 10,
            max: 20,
            value: 15,
        },
        gravity: {
            id:4,
            title: '중력 가속도',
            on: true,
            types: [{name:'지구', value:1},{name:'달', value: 1/6}],
            gravityValue: 9.8,
            value: 1,
            get acceleration() {
                return this.value * this.gravityValue;
            }
        },
        groundFriction: {
            id:5,
            title: '대지와의 마찰력',
            on: false,
            value: 0.9
        },
        airResistance: {
            id:6,
            title: '공기 저항 (점프시)',
            on: false,
            value: 0.95
        },
        playerElasticity: {
            id:7,
            title: '마리오의 탄성',
            on: false,
            value: 0.3
        },
        blockElasticity: {
            id:8,
            title: '물음표 블록의 탄성',
            on: false,
            value: 0.5
        },
        fps: {
            id:9,
            title: 'FPS 의존',
            on: false,
            types: [{name: '15', value: 15},{name: '30', value: 30},{name: '60', value: 60}],
            value: 60,
        }
    },
    screen: {
        rate: 1,
        width: null,
        height: null,
    },
    info: {
        velocityX: 0,
        jumpMaxHeight: 0,
        frameDistance: 0,
    }
};