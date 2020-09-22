class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
        this.prev = []
        this.equalsButtonPressed = false
        this.operationArray = []
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
        this.operationCounter = 0
    }

    secondaryClear() {
        this.clear()
        this.previousOperandTextElement.innerText = ''
        this.equalsButtonPressed = false
        this.prev = []
        this.current = []
        this.operationArray = []
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        if (this.equalsButtonPressed === true) {
            this.secondaryClear()
        }
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (operation == '/') operation = '÷'
        if (this.equalsButtonPressed == true) {
            this.previousOperand = this.currentOperandTextElement.innerText
            this.keepTotal = true
            this.equalsButtonPressed = false
        }
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
        this.operationCounter++
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        let current
        if (this.currentOperand != '') {
            current = parseFloat(this.currentOperand)
        }
        if (isNaN(prev) || (isNaN(current) && this.operationCounter < 2)) {
            return
        }
        switch (true) {
            case (isNaN(current) == true):
                computation = prev
                break
            case (this.operation == '+'):
                computation = prev + current
                break
            case (this.operation == '-'):
                computation = prev - current
                break
            case (this.operation == '*'):
                computation = prev * current
                break
            case (this.operation == '÷'):
                computation = prev / current
                break
            default:
                return
        }
        this.currentOperand = computation
        this.operationArray.push(this.operation)
        this.operation = undefined
        this.previousOperand = ''
        
        // This only adds the both top and bottom fields to the total operations array if the top field doesn't have the temporary total yet.
        if (this.operationCounter < 2) {
            this.prev.push(prev, current)
        } else {
            this.prev.push(current) 
        }
        // Gets rid of any accidental "undefined" properties
        this.prev = this.prev.filter(function (el) {
            return el != null
        })
        console.log('testtupewi', this.prev)
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
}

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
        } else if (this.previousOperandTextElement.innerText == '') {
            return
        } else {
            let totalArray = []
            for (let i = 0; i < this.prev.length; i++) {
                totalArray.push(this.prev[i])
                totalArray.push(this.operationArray[i])
            }
            // // Removes any NaNs or undefined entries before joining array
            totalArray = totalArray.filter(function (el) {
                return el != null
            })
            let lastElement = totalArray[totalArray.length - 1]
            if (this.operationArray.includes(lastElement)) {
                totalArray.splice(-1, 1)
            }
            // // Removes any NaNs or undefined entries after removing last element
            totalArray = totalArray.filter(function (el) {
                return el != null
            })
            this.previousOperandTextElement.innerText = totalArray.join(' ') + ' ='
        }
    }

    // This method adds keyboard functionality
    keyboardAppend(e) {
        this.keyPress = e.key
        console.log(this.keyPress)
        switch (true) {
            case (this.keyPress == 'Escape'):
                this.clear()
                this.updateDisplay()
                this.secondaryClear()
                break
            case (this.keyPress == 'Backspace'):
                calculator.delete()
                calculator.updateDisplay()
                break
            case (isNaN(parseInt(this.keyPress)) == false):
                console.log(this.keyPress)
                this.keyPress = parseInt(this.keyPress)
                this.appendNumber(this.keyPress)
                this.updateDisplay()
                break
            
            case (this.keyPress == '.'):
                this.appendNumber(this.keyPress)
                this.updateDisplay()
                break
            
            case (this.keyPress == '+'):
            case (this.keyPress == '-'):
            case (this.keyPress == '*'):
            case (this.keyPress == '/'):
                this.chooseOperation(this.keyPress)
                this.updateDisplay()
                break
            
            case (this.keyPress == '='):
                if ((this.operationCounter > 0 && this.currentOperand != '') || this.operationCounter > 2) {
                    this.equalsButtonPressed = true
                }
                this.compute()
                this.updateDisplay()
                break
            
            case (this.keyPress == 'backspace'):
                calculator.delete()
                calculator.updateDisplay()
                break
            
            default:
                return
                break
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const calculatorKeyboard = document.querySelector('calculator-grid')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)


numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.equalsButtonPressed = true
    calculator.compute()
    calculator.updateDisplay()
    
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
    calculator.secondaryClear()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

// This is the keyboard listener that accepts keyboard input
window.addEventListener('keydown', e => {
    calculator.keyboardAppend(e)
})