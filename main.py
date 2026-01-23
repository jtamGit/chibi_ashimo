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
mode = 0
spd_stop = 1500
R_spd_H = 1500 - 50
R_spd_L = 1500 - 0
L_spd_H = 1500 + 50
L_spd_L = 1500 + 0
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
            # 左:ON  右:ON
            servos.P0.set_pulse(R_spd_H)
            servos.P1.set_pulse(L_spd_H)
            sensor_old = sencer
        elif sencer < 390:
            # 左:OFF  右:ON
            servos.P0.set_pulse(R_spd_L)
            servos.P1.set_pulse(L_spd_H)
            sensor_old = sencer
        elif sencer < 646:
            # 左:ON  右:OFF
            servos.P0.set_pulse(R_spd_H)
            servos.P1.set_pulse(L_spd_L)
            sensor_old = sencer
        elif sensor_old < 390:
            servos.P0.stop()
            servos.P1.set_pulse(L_spd_L)
        elif sensor_old < 646:
            servos.P0.set_pulse(R_spd_L)
            servos.P1.stop()
        else:
            servos.P0.stop()
            servos.P1.stop()
    else:
        sound_template()
        y_speed = y_bar - 499
        servos.P0.set_pulse(1500 - y_speed + (x_bar - 480) / 2)
        servos.P1.set_pulse(1500 + y_speed + (x_bar - 480) / 2)
basic.forever(on_forever)
