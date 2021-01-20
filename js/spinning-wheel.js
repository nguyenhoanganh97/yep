class SpinningWheel {
    constructor(config, container) {
        this.penContainer = document.getElementById("penalty-container")
        this.spinningSound = document.getElementById("spinning-sound")
        config.forEach(element => {
            this.penContainer.appendChild(this.drawPenalty(element))
        });
        config = [...config, ...config]
        this.container = document.getElementById(container)
            //container size
        const size = window.innerHeight * 0.8 + "px"
        this.container.style.height = size
        this.container.style.width = size

        this.spinBtn = document.getElementById("spin-btn")
        this.spinBtn.addEventListener("click", () => this.spin())
        this.radius = Math.floor(this.container.clientWidth / 2)
        this.calcPieceSize(config)
        this.config = config
        this.drawPieces()
    }
    spin() {
        const spinDeg = parseInt(this.container.dataset.spinDeg) || 0
        const min = 1800
        const max = 3600
        const duration = Math.floor(Math.random() * (5 - 14)) + 14
        this.container.style.transitionDuration = `${duration}s`
        const deg = spinDeg + Math.floor(Math.random() * (max - min)) + max
        this.container.dataset.spinDeg = deg
        this.spinningSound.currentTime = 0
        this.spinningSound.play()
        this.container.style.transform = `rotate(${deg}deg)`
        setTimeout(() => this.spinningSound.pause(), duration * 1000)
    }
    calcPieceSize(config) {
        const quantity = config.length
        this.pieceDegree = 360 / quantity
        const angDegree = ((180 - this.pieceDegree) / 2)
        this.pieceHeight = (this.radius / Math.tan(angDegree * Math.PI / 180)) * 2
    }
    drawPieces() {
        this.config.forEach((pieceConfig, pieceIndex) => {
            const piece = this.drawPiece(pieceConfig, pieceIndex)
            this.container.appendChild(piece)
        });
    }
    drawPiece(pieceConfig, pieceIndex) {
        const piece = document.createElement("div")
        piece.classList.add("piece")
        const height = this.pieceHeight
        const width = this.radius * 2
        const deg = pieceIndex * this.pieceDegree
        console.log({ deg, width, height })
        piece.style.height = `${height}px`
        piece.style.width = `${width}px`
        piece.style.transform = `translateY(-50%) rotate(${deg}deg)`
        piece.style.clipPath = "polygon(0 0, 0 100%, 50% 50%)"
        piece.style.backgroundColor = pieceConfig.color
        const span = document.createElement("span")
            // span.innerText = pieceConfig.title
        span.innerText = pieceConfig.order
        piece.appendChild(span)
        return piece
    }
    drawPenalty(pieceConfig) {
        const penWrapper = document.createElement("div")
        penWrapper.classList.add("pen-wrapper")
        const numb = document.createElement("span")
        numb.classList.add("numb")
        numb.innerText = pieceConfig.order
        const pen = document.createElement("span")
        pen.classList.add("pen")
        pen.innerText = pieceConfig.title
        penWrapper.appendChild(numb)
        penWrapper.appendChild(pen)
        return penWrapper
    }
}