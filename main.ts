function servo_ctrl (servo_L: number, servo_R: number) {
    if (servo_mode == 0) {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P1, 0)
    } else {
        if (servo_R == spd_stop) {
            servos.P0.setPulse(servo_R)
        } else {
            servos.P0.setPulse(servo_R)
        }
        if (servo_L == spd_stop) {
            servos.P1.setPulse(servo_L)
        } else {
            servos.P1.setPulse(servo_L)
        }
    }
}
input.onButtonPressed(Button.A, function () {
    if (servo_mode == 0) {
        servo_mode = 1
    } else {
        servo_mode = 0
    }
})
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
let servo_mode = 0
let mode = 0
let spd_stop = 0
spd_stop = 1500
let R_spd_H = 1500 - 50
let R_spd_L = 1500 - 10
let L_spd_H = 1500 + 50
let L_spd_L = 1500 + 10
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
            servo_ctrl(L_spd_H, R_spd_H)
            sensor_old = sencer
        } else if (sencer < 390) {
            servo_ctrl(L_spd_H, R_spd_L)
            sensor_old = sencer
        } else if (sencer < 646) {
            servo_ctrl(L_spd_L, R_spd_H)
            sensor_old = sencer
        } else if (sensor_old < 390) {
            servo_ctrl(L_spd_H, spd_stop)
        } else if (sensor_old < 646) {
            servo_ctrl(spd_stop, R_spd_H)
        } else {
            servo_ctrl(L_spd_H, R_spd_H)
        }
    } else {
        sound_template()
        if (servo_mode == 0) {
            pins.digitalWritePin(DigitalPin.P0, 0)
            pins.digitalWritePin(DigitalPin.P1, 0)
        } else {
            y_speed = y_bar - 499
            servos.P0.setPulse(1500 - y_speed + (x_bar - 480) / 2)
            servos.P1.setPulse(1500 + y_speed + (x_bar - 480) / 2)
        }
    }
})
