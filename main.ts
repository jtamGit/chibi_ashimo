radio.onReceivedString(function (receivedString) {
    serial.writeString(receivedString)
    led.toggle(0, 0)
})
radio.onReceivedValue(function (name, value) {
    if (name == "x") {
        x_bar = value
        led.toggle(1, 0)
    }
    if (name == "y") {
        y_bar = value
        led.toggle(2, 0)
    }
    if (name == "button") {
        button = value
        led.toggle(3, 0)
    }
})
let y_speed = 0
let res = ""
let button = 0
let y_bar = 0
let x_bar = 0
radio.setGroup(1)
radio.setTransmitPower(7)
serial.setTxBufferSize(1000)
serial.setRxBufferSize(1000)
serial.redirect(
SerialPin.P8,
SerialPin.P12,
BaudRate.BaudRate4800
)
images.createImage(`
    . . . . .
    . # # # .
    # . . . #
    # . . . #
    . # # # .
    `).showImage(0)
servos.P0.setPulse(1500)
servos.P1.setPulse(1500)
basic.forever(function () {
    res = serial.readString()
    if (res.isEmpty()) {
    	
    } else {
        radio.sendString(res)
        led.toggle(4, 0)
    }
    y_speed = y_bar - 499
    servos.P0.setPulse(1500 - y_speed + (x_bar - 480))
    servos.P1.setPulse(1500 + y_speed + (x_bar - 480))
    if (button < 258) {
        serial.writeLine("konnnichiwa")
        basic.pause(200)
    } else if (button < 600) {
        serial.writeLine("yukkurishiteittene")
        basic.pause(200)
    } else if (button < 725) {
        serial.writeLine("soretteanatanokannsoudesuyone?")
        basic.pause(200)
    } else if (button < 809) {
        serial.writeLine("bunnbunnharo-yu-chu-bu")
        basic.pause(200)
    } else if (button < 834) {
        serial.writeLine("gomennnasai yokuwakarimasenn")
        basic.pause(200)
    } else if (button < 918) {
        serial.writeLine("?")
        basic.pause(200)
    }
})
