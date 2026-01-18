radio.onReceivedString(function (receivedString) {
    serial.writeString(receivedString)
    led.toggle(0, 0)
})
let res = ""
radio.setGroup(1)
serial.redirect(
SerialPin.P8,
SerialPin.P12,
BaudRate.BaudRate4800
)
serial.setTxBufferSize(1000)
serial.setRxBufferSize(1000)
images.createImage(`
    . . . . .
    . # # # .
    # . . . #
    # . . . #
    . # # # .
    `).showImage(0)
basic.forever(function () {
    res = serial.readString()
    if (res.isEmpty()) {
    	
    } else {
        radio.sendString(res)
        led.toggle(4, 0)
    }
})
