function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
class Game {
    constructor(config, containerSelector) {
        this.biggestContainer = document.getElementById("game-container")
        this.rowOpen = document.getElementById("row-open")
        this.pieceOpen = document.getElementById("piece-open")
        this.lastAnswerContainer = document.getElementById("last-answer")

        this.container = document.getElementById(containerSelector)
        this.question = document.getElementById("question")
        this.questionNumber = document.getElementById("question-number")
        this.questionContainer = document.getElementById("question-container")
        this.answerBtn = document.getElementById("answer-btn")
        this.answerBtn.addEventListener("click", (event) => this.showAnswer(event))
        this.lastResultShow = false
        this.maxLength = 0
        const _config = config.map(row => {
            const answer = row.answer.replace(/ /g, '').toUpperCase()
            if (answer.length > this.maxLength) this.maxLength = answer.length
            return {
                ...row,
                answer,
                length: answer.length
            }
        });
        // this.config = shuffle(_config) //no longer shuffle
        this.config = _config
        this.calcRow()
        this.calcSize()
        this.container.style.height = `${this.crosswordSize * this.config.length}px`
        this.drawMaxLengthRow()
        this.drawRows()
        this.drawLastAnswer()
    }
    drawMaxLengthRow() {
        this.maxLengthRowLeft = (this.maxLeft - this.config[this.maxLengthIndex].key) * this.crosswordSize
        const row = this.createRow(this.config[this.maxLengthIndex], `${this.maxLengthIndex * this.crosswordSize + this.maxLengthIndex}px`, `${this.maxLengthRowLeft}px`, this.maxLengthIndex)
        this.createSerial(this.maxLengthIndex)
        this.container.appendChild(row)
    }
    drawRows() {
        this.config.forEach((row, index) => {
            if (index !== this.maxLengthIndex) {
                this.createSerial(index)
                const left = (this.maxLeft - row.key) * this.crosswordSize
                const rowEl = this.createRow(row, `${this.crosswordSize * index + index}px`, `${left}px`, index)
                this.container.appendChild(rowEl)
            }
        });
    }
    calcSize() {
        const sortAz = this.config.map((x, xIndex) => ({
            length: x.answer.length,
            index: xIndex,
            key: x.key
        })).sort((a, b) => b.length - a.length)

        this.maxLeft = sortAz[0].key + 1
        this.maxRight = sortAz[0].length - sortAz[0].key - 1
        for (let index = 1; index < sortAz.length; index++) {
            let maybeMaxLeft = sortAz[index].key + 1,
                maybeMaxRight = sortAz[index].length - sortAz[index].key - 1
            if (maybeMaxLeft > this.maxLeft) this.maxLeft = maybeMaxLeft
            if (maybeMaxRight > this.maxRight) this.maxRight = maybeMaxRight
        }
        this.maxCrosswordLength = this.maxLeft + this.maxRight + 1
        this.crosswordSize = Math.floor(parseInt(window.getComputedStyle(this.container).width.replace("px", "")) / this.maxCrosswordLength)
    }
    calcRow() {
        this.config.forEach((row, rowIndex) => {
            // const keyIndex = []
            // row.answer.split("").forEach((character, index) => character === row.keyCharacter && keyIndex.push(index))
            // const randomKey = this.getRandomIndex(row.answer, keyIndex) //no longer random key character
            const randomKey = row.answer.split("").findIndex(character => character === row.keyCharacter)
            if (row.answer.length === this.maxLength) {
                this.maxLengthIndex = rowIndex
            }
            this.config[rowIndex].key = randomKey
        });
    }
    createRow(row, top, left, rowIndex) {
        const rowContainer = document.createElement("div")
        rowContainer.dataset.rowIndex = rowIndex
        rowContainer.style.top = top
        rowContainer.style.left = left
        rowContainer.style.width = `${row.length * this.crosswordSize}px`
        rowContainer.style.fontSize = `${this.crosswordSize}px`
        rowContainer.classList.add("row-container")
        for (let index = 0; index < row.answer.length; index++) {
            let keyCharacter = false
            if (index === row.key) keyCharacter = true
            const crossword = this.createCrossword(row.answer[index], rowIndex, index, keyCharacter, false, index === (row.answer.length - 1))
            crossword.classList.add("anim")
            setTimeout(() => crossword.classList.remove("anim"), 1000)
            rowContainer.appendChild(crossword)
        }
        return rowContainer
    }
    createSerial(order) {
        const crossword = this.createCrossword(`${order + 1}`, order, null, false, true)
        crossword.style.top = `${this.crosswordSize * order + order}px`
        crossword.style.left = 0
        this.container.appendChild(crossword)
    }
    getRandomIndex(mainArr, indexArr) {
        let index = Math.floor(Math.random() * indexArr.length)
        if (mainArr[indexArr[index]]) return indexArr[index]
        else return this.getRandomIndex(mainArr, indexArr)
    }
    createCrossword(character, rowIndex = null, characterIndex = null, isKey = false, isSerial = false, isLast = false) {
        const crossword = document.createElement("div")
        const size = `${this.crosswordSize}px`
        crossword.style.width = size
        crossword.style.height = size
        const span = document.createElement("span")
        span.innerText = character
        crossword.appendChild(span)
        if (isSerial) {
            crossword.classList.add("serial")
            crossword.style.fontSize = `${this.crosswordSize}px`
            crossword.addEventListener("click", () => this.showQuestion(rowIndex))
        } else {
            // span.style.display = "none"
            crossword.classList.add("crossword")
            crossword.addEventListener("click", () => this.suggest(rowIndex, characterIndex))
            if (isKey) {
                crossword.classList.add("key");
                crossword.dataset.keyIndex = this.config[rowIndex].keyIndex
                crossword.style.zIndex = 7
            }
            if (isLast) crossword.classList.add("last")
        }
        return crossword
    }
    suggest(questionIndex, characterIndex) {
        const span = document.querySelectorAll(`[data-row-index='${questionIndex}'] .crossword span`)[characterIndex]
        if (span.style.display === "none" || span.style.display === "") {
            this.pieceOpen.currentTime = 0
            this.pieceOpen.play()
            span.style.display = "inline"
        } else {
            span.style.display = "none"
        }
    }
    showAnswer(event) {
        const spans = document.querySelectorAll(`[data-row-index='${event.target.dataset.rowIndex}'] .crossword span`)
        for (let index = 0; index < spans.length; index++) {
            spans[index].parentNode.classList.add("flip")
            setTimeout(() => {
                spans[index].parentNode.classList.remove("flip")
            }, 1000)
            setTimeout(() => {
                spans[index].parentNode.classList.add("opened")
            }, 500)
        }
        this.rowOpen.play()
    }
    showQuestion(questionIndex) {
        console.log("show question")
        this.questionContainer.style.display = "flex"
        this.questionNumber.innerText = `Câu hỏi số ${questionIndex +  1}`
        this.question.innerText = this.config[questionIndex].question
        this.answerBtn.dataset.rowIndex = questionIndex
    }

    drawLastAnswer() {
        const correctAnswer = this.config.sort((a, b) => a.keyIndex - b.keyIndex)
        const row = document.createElement("div")
        row.classList.add("answer-row")
        correctAnswer.forEach(element => {
            const piece = document.createElement("div")
            piece.classList.add("answer-character")
            piece.dataset.positionId = element.keyIndex
            piece.style.margin = "0 2px"
            piece.style.width = this.crosswordSize + "px"
            piece.style.height = this.crosswordSize + "px"
            if (element.spaceAfter) piece.style.marginRight = "20px"
            row.appendChild(piece)
        });
        this.lastAnswerContainer.appendChild(row)
    }

    answerScript() {
        if (this.lastResultShow) {
            return
        }
        this.container.style.left = "-30vh"
        this.lastAnswerContainer.style.right = "0px"
        const movements = {}
        setTimeout(() => {
            const crosswords = document.querySelectorAll(".crossword.key[data-key-index]")
            crosswords.forEach(crw => {
                const { top, left } = crw.getBoundingClientRect()
                const clone = crw.cloneNode(true)
                clone.style.width = this.crosswordSize - 2 + "px"
                clone.style.position = "absolute"
                clone.style.top = top + "px"
                clone.style.left = left - 1 + "px"
                clone.style.fontSize = this.crosswordSize + "px"
                movements[crw.dataset.keyIndex] = clone
                this.biggestContainer.appendChild(clone)
            });
        }, 750)
        setTimeout(() => {
            const answers = document.querySelectorAll(".answer-character[data-position-id")
            answers.forEach(asw => {
                const { top, left } = asw.getBoundingClientRect()
                movements[asw.dataset.positionId].style.inset = `${top}px 0 0 ${left}px`
            })
            setTimeout(() => {
                answers.forEach(asw => {
                    movements[asw.dataset.positionId].style.position = "static"
                    movements[asw.dataset.positionId].style.width = `${this.crosswordSize}px`
                    movements[asw.dataset.positionId].style.height = `${this.crosswordSize}px`
                    movements[asw.dataset.positionId].style.margin = "0"
                    asw.appendChild(movements[asw.dataset.positionId])
                    asw.style.border = "none"
                })
                this.lastAnswerContainer.style.zIndex = 8
            }, 1000)
            setTimeout(() => {
                this.lastAnswerContainer.style.width = "100%"
            }, 1100)
        }, 1000)
    }
}