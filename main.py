def on_received_string(receivedString):
    serial.write_string(receivedString)
    led.toggle(0, 0)
radio.on_received_string(on_received_string)

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
res = ""
button = 0
y_bar = 0
x_bar = 0
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
servos.P0.set_pulse(1500)
servos.P1.set_pulse(1500)

def on_forever():
    global res, y_speed
    res = serial.read_string()
    if res.is_empty():
        pass
    else:
        radio.send_string(res)
        led.toggle(4, 0)
    y_speed = y_bar - 499
    servos.P0.set_pulse(1500 - y_speed + (x_bar - 480))
    servos.P1.set_pulse(1500 + y_speed + (x_bar - 480))
    if button < 258:
        serial.write_line("konnnichiwa")
    elif button < 600:
        serial.write_line("yukkurishiteittene")
    elif button < 725:
        serial.write_line("soretteanatanokannsoudesuyone?")
    elif button < 809:
        serial.write_line("bunnbunnharo-yu-chu-bu")
    elif button < 834:
        serial.write_line("gomennnasai yokuwakarimasenn")
    elif button < 918:
        serial.write_line("?")
basic.forever(on_forever)
