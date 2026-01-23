radio.onReceivedString(function (receivedString) {
    serial.writeString(receivedString)
    led.toggle(0, 0)
})
function sound_template () {
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
}
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
let sensor_old = 0
let res = ""
let y_bar = 0
let x_bar = 0
let button = 0
let mode = 0
let spd_stop = 1500
let R_spd_H = 1500 - 50
let R_spd_L = 1500 - 0
let L_spd_H = 1500 + 50
let L_spd_L = 1500 + 0
servos.P0.stop()
servos.P1.stop()
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
if (input.buttonIsPressed(Button.A)) {
    mode = 1
} else {
    mode = 0
}
basic.forever(function () {
    let sencer: number;
res = serial.readString()
    if (res.isEmpty()) {
    	
    } else {
        radio.sendString(res)
        led.toggle(4, 0)
    }
    if (mode == 0) {
        sencer = pins.analogReadPin(AnalogReadWritePin.P2)
        if (sencer < 134) {
            // 左:ON  右:ON
            servos.P0.setPulse(R_spd_H)
            servos.P1.setPulse(L_spd_H)
            sensor_old = sencer
        } else if (sencer < 390) {
            // 左:OFF  右:ON
            servos.P0.setPulse(R_spd_L)
            servos.P1.setPulse(L_spd_H)
            sensor_old = sencer
        } else if (sencer < 646) {
            // 左:ON  右:OFF
            servos.P0.setPulse(R_spd_H)
            servos.P1.setPulse(L_spd_L)
            sensor_old = sencer
        } else if (sensor_old < 390) {
            servos.P0.stop()
            servos.P1.setPulse(L_spd_L)
        } else if (sensor_old < 646) {
            servos.P0.setPulse(R_spd_L)
            servos.P1.stop()
        } else {
            servos.P0.stop()
            servos.P1.stop()
        }
    } else {
        sound_template()
        y_speed = y_bar - 499
        servos.P0.setPulse(1500 - y_speed + (x_bar - 480) / 2)
        servos.P1.setPulse(1500 + y_speed + (x_bar - 480) / 2)
    }
})
