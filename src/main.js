import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ['#2d57f2', '#436d99'],
    mastercard: ["#df6f29", "#c69347"],
    default: ['black', 'gray']
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      maxLength: 2,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
      maxLength: 2,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    let cardtype = "default"

    for (const card of dynamicMasked.compiledMasks) {
      if (number.match(card.regex)) {
        cardtype = card.cardtype
        break
      }
    }

    setCardType(cardtype)
    return dynamicMasked.compiledMasks.find((m) => m.cardtype === cardtype)
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (event) => {
  event.preventDefault()
  const card = {
    number: cardNumberMasked.value,
    expirationDate: expirationDateMasked.value,
    securityCode: securityCodeMasked.value,
  }

  alert('Card added!')
  console.log(card)
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", (event) => {
  const cardHolderName = document.querySelector(".cc-holder .value")

  cardHolderName.textContent = event.target.value.length === 0 ? "FULANO DA SILVA" : event.target.value
})

securityCodeMasked.on("accept", () => {
  updateSecutiryCode(securityCodeMasked.value)
})


function updateSecutiryCode(code) {
  const ccSecutiry = document.querySelector(".cc-security .value")

  ccSecutiry.textContent = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.textContent = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")

  ccExpiration.textContent = date.length === 0 ? "12/22" : date
}