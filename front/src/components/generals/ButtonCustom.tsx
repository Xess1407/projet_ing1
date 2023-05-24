import { Button } from "@kobalte/core"
import style_space_parser, {style_box_parser, style_border_parser, style_color_parser, style_font_parser, style_layout_parser, style_position_parser } from "../StyleParser"

import './scss/buttonCustom.css'

const ButtonCustom = (props: any) => {
    let s = style_space_parser(props) + style_box_parser(props) + style_border_parser(props) + style_color_parser(props) + style_font_parser(props) + style_layout_parser(props) + style_position_parser(props)
    return <Button.Root class="button" style={s} type={props.type} value={props.value}>
        {props.text}
    </Button.Root>
}

export default ButtonCustom