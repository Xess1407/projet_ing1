import { Button } from "@kobalte/core"
import style_parser from "../StyleParser"

const ButtonCustom = (props: any) => {
    let s = style_parser(props)
    return <Button.Root style={s}>
        {props.text}
    </Button.Root>
}

export default ButtonCustom