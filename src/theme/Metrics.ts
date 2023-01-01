const DESIGN_WIDTH = 428
const DESIGN_HEIGHT = 926

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

const scaleWidth = (value: number) => {
    return vw / DESIGN_WIDTH * value;
}

const scaleHeight = (value: number) => {
    return vh / DESIGN_HEIGHT * value;
}

export {scaleWidth, scaleHeight}