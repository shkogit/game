const PanelInfo = {
    // language=HTML
    template: `
        <div id="info">
            <dl>
                <dt>X축 속도</dt>
                <dd>{{info.velocityX.toFixed(2)}} m/s</dd>
                <dt>점프 시 최대 높이</dt>
                <dd>{{info.jumpMaxHeight.toFixed(2)}} m</dd>
                <dt>한 프레임간 이동거리</dt>
                <dd>{{info.frameDistance.toFixed(2)}} m</dd>
            </dl>
        </div>
    `,
    data() {
        return {
            info: store.info,
        };
    }
};