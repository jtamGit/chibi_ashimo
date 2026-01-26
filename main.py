def servo_ctrl(servo_L: number, servo_R: number):
    if servo_mode == 0:
        pins.digital_write_pin(DigitalPin.P0, 0)
        pins.digital_write_pin(DigitalPin.P1, 0)
    else:
        if servo_R == spd_stop:
            servos.P0.set_pulse(servo_R)
        else:
            servos.P0.set_pulse(servo_R)
        if servo_L == spd_stop:
            servos.P1.set_pulse(servo_L)
        else:
            servos.P1.set_pulse(servo_L)

def on_button_pressed_a():
    global servo_mode
    if servo_mode == 0:
        servo_mode = 1
    else:
        servo_mode = 0
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_received_string(receivedString):
    serial.write_string(receivedString)
    led.toggle(0, 0)
radio.on_received_string(on_received_string)

def sound_template():
    if button < 258:
        serial.write_line("konnnichiwa")
        basic.pause(200)
    elif button < 600:
        serial.write_line("yukkurishiteittene")
        basic.pause(200)
    elif button < 725:
        serial.write_line("soretteanatanokannsoudesuyone?")
        basic.pause(200)
    elif button < 809:
        serial.write_line("bunnbunnharo-yu-chu-bu")
        basic.pause(200)
    elif button < 834:
        serial.write_line("gomennnasai yokuwakarimasenn")
        basic.pause(200)
    elif button < 918:
        serial.write_line("?")
        basic.pause(200)

def on_received_value(name, value):
    global x_bar, y_bar, button
    if name == "x":
        x_bar = value
        led.toggle(1, 0)
    if name == "y":
        y_bar = value
        led.toggle(2, 0)
    if name == "button":
        button = value
        led.toggle(3, 0)
radio.on_received_value(on_received_value)

y_speed = 0
sensor_old = 0
res = ""
y_bar = 0
x_bar = 0
button = 0
servo_mode = 0
mode = 0
spd_stop = 0
spd_stop = 1500
R_spd_H = 1500 - 50
R_spd_L = 1500 - 10
L_spd_H = 1500 + 50
L_spd_L = 1500 + 10
servos.P0.stop()
servos.P1.stop()
radio.set_group(1)
radio.set_transmit_power(7)
serial.set_tx_buffer_size(1000)
serial.set_rx_buffer_size(1000)
serial.redirect(SerialPin.P8, SerialPin.P12, BaudRate.BAUD_RATE4800)
images.create_image("""
    . . . . .
    . # # # .
    # . . . #
    # . . . #
    . # # # .
    """).show_image(0)
if input.button_is_pressed(Button.A):
    mode = 1
else:
    mode = 0

def on_forever():
    global res, sensor_old, y_speed
    res = serial.read_string()
    if res.is_empty():
        pass
    else:
        radio.send_string(res)
        led.toggle(4, 0)
    if mode == 0:
        sencer = pins.analog_read_pin(AnalogReadWritePin.P2)
        if sencer < 134:
            servo_ctrl(L_spd_H, R_spd_H)
            sensor_old = sencer
        elif sencer < 390:
            servo_ctrl(L_spd_H, R_spd_L)
            sensor_old = sencer
        elif sencer < 646:
            servo_ctrl(L_spd_L, R_spd_H)
            sensor_old = sencer
        elif sensor_old < 390:
            servo_ctrl(L_spd_H, spd_stop)
        elif sensor_old < 646:
            servo_ctrl(spd_stop, R_spd_H)
        else:
            servo_ctrl(L_spd_H, R_spd_H)
    else:
        sound_template()
        if servo_mode == 0:
            pins.digital_write_pin(DigitalPin.P0, 0)
            pins.digital_write_pin(DigitalPin.P1, 0)
        else:
            y_speed = y_bar - 499
            servos.P0.set_pulse(1500 - y_speed + (x_bar - 480) / 2)
            servos.P1.set_pulse(1500 + y_speed + (x_bar - 480) / 2)
basic.forever(on_forever)
