from xml.etree.ElementTree import Element, SubElement, tostring

from matplotlib.colors import to_hex

xml_declaration = '<?xml version="1.0" encoding="utf-8"?>'

def svg_for_matrix(matrix, low=0.0, high=1.0, low_color='ffffff', high_color='0000ff'):
    total_size = 512
    box_size = total_size / len(matrix)

    # box_size was coerced into an integer, so make the total size smaller
    # if appropriate
    total_size = box_size * len(matrix)

    svg = Element('svg')
    svg.set('xmlns:svg', 'http://www.w3.org/2000/svg')
    svg.set('xmlns', 'http://www.w3.org/2000/svg')
    svg.set('width', str(total_size))
    svg.set('height', str(total_size))
    svg.set('version', '1.0')

    y_position = 0
    for row in matrix:
        x_position = 0
        for item in row:
            color = interpolate_color(item, low, high, low_color, high_color)

            box = SubElement(svg, 'rect')
            box.set('style', f'fill: {format(color)}')
            # make the boxes 2px larger than necessary to prevent borders from
            # showing up when the image is scaled
            box.set('width', str(box_size + 2))
            box.set('height', str(box_size + 2))
            box.set('x', str(x_position))
            box.set('y', str(y_position))

            x_position += box_size
        y_position += box_size

    # return xml_declaration + str(tostring(svg))[2:-1]
    return str(tostring(svg))[2:-1]


def interpolate_color(value, low, high, low_color, high_color):
    low_color = list_for_hex_color(low_color)
    high_color = list_for_hex_color(high_color)

    return hex_color_for_list([((high_color[i] - low_color[i])/(high - low)) * (value - low) + low_color[i] for i in range(3)])


def list_for_hex_color(string):
    return [int(string[i:i+2], 16) for i in range(0, 6, 2)]


def hex_color_for_list(color):
    return to_hex([rgb_value / 255 for rgb_value in color])