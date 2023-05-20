import { Button } from "@kobalte/core"
import style_parser from "../StyleParser"
import './scss/buttonCustom.css'

const ButtonCustom = (props: any) => {
    let s = ""+style_parser(props)
    return <Button.Root class="button" style={s} type={props.type} value={props.value}>
        {props.text}
    </Button.Root>
}

export default ButtonCustom