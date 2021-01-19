class SpinningWheel {
    constructor(config, container) {
        this.container = document.getElementById(container)
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
        const max = 5400
        const deg = spinDeg + Math.floor(Math.random() * (max - min)) + max
        this.container.dataset.spinDeg = deg
        this.container.style.transform = `rotate(${deg}deg)`
    }
    calcPieceSize(config) {
        const quantity = config.length
        this.pieceDegree = 360 / quantity
        const angDegree = (180 - this.pieceDegree) / 2
        const x = this.radius / Math.sin(angDegree)
        this.pieceHeight = (Math.sin(this.pieceDegree / 2) * x) * 2
    }
    drawPieces() {
        this.config.forEach((pieceConfig, pieceIndex) => {
            console.log(pieceConfig)
            const piece = this.drawPiece(pieceConfig, pieceIndex)
            this.container.appendChild(piece)
        });
    }
    drawPiece(pieceConfig, pieceIndex) {
        const piece = document.createElement("div")
        piece.classList.add("piece")
        piece.style.height = `${this.pieceHeight}px`
        piece.style.width = `${this.radius * 2}px`
        piece.style.transform = `translateY(-50%) rotate(${pieceIndex * this.pieceDegree}deg)`
        piece.style.clipPath = "polygon(0 0, 0 100%, 50% 50%)"
        piece.style.backgroundColor = pieceConfig.color
        const span = document.createElement("span")
        span.innerText = pieceConfig.title
        piece.appendChild(span)
        return piece
    }
}