export default function style_space_parser(props: any): string {
    let s: string = "";

    /* Margin */
    if (props.m !== "undefined")
        s += "margin:" + props.m + ";"
    if (props.mt !== "undefined")
        s += "margin-top:" + props.mt + ";"
    if (props.ms !== "undefined")
        s += "margin-inline-start:" + props.ms + ";"
    if (props.mr !== "undefined")
        s += "margin-right:" + props.mr + ";"
    if (props.ml !== "undefined")
        s += "margin-left:" + props.ml + ";"
    if (props.mb !== "undefined")
        s += "margin-bottom:" + props.mb + ";"
    if (props.me !== "undefined")
        s += "margin-inline-end:" + props.me + ";"

    /* Padding */ 
    if (props.p !== "undefined")
        s += "padding:" + props.p + ";"
    if (props.pt !== "undefined")
        s += "padding-top:" + props.pt + ";"
    if (props.pb !== "undefined")
        s += "padding-bottom:" + props.pb + ";"
    if (props.pr !== "undefined")
        s += "padding-right:" + props.pr + ";"
    if (props.pl !== "undefined")
        s += "padding-left:" + props.pl + ";"
    if (props.ps !== "undefined")
        s += "padding-inline-start:" + props.ps + ";"
    if (props.pe !== "undefined")
        s += "padding-inline-end:" + props.pe + ";"

    /* Size */
    if (props.w !== "undefined")
        s += "width:" + props.w + ";"
    if (props.h !== "undefined")
        s += "height:" + props.h + ";"
    if (props.minW !== "undefined")
        s += "min-width:" + props.minW + ";"
    if (props.minH !== "undefined")
        s += "min-height:" + props.minH + ";"
    if (props.maxW !== "undefined")
        s += "max-width:" + props.maxW + ";"
    if (props.maxH !== "undefined")
        s += "max-height:" + props.maxH + ";"
    if (props.bxSz !== "undefined")
        s += "box-sizing:" + props.bxSz + ";"

    /* Flex */
    if (props.fw !== "undefined")
        s += "flex-wrap:" + props.fw + ";"

    return s
}

export function style_box_parser(props: any):string {
    let s: string = "";

    if (props.ai !== "undefined")
        s += "align-items:" + props.ai + ";"
    if (props.ac !== "undefined")
        s += "align-content:" + props.ac + ";"
    if (props.ji !== "undefined")
        s += "justify-items:" + props.ji + ";"
    if (props.jc !== "undefined")
        s += "justify-content:" + props.jc + ";"
    
    return s
}

export function style_border_parser(props: any):string {
    let s: string = "";

    if (props.b !== "undefined")
        s += "border:" + props.b + ";"
    if (props.bs !== "undefined")
        s += "border-style:" + props.bs + ";"
    if (props.bw !== "undefined")
        s += "border-width:" + props.bw + ";"
    if (props.bc !== "undefined")
        s += "border-color:" + props.bc + ";"
    if (props.br !== "undefined")
        s += "border-radius:" + props.br + ";"
    
    return s
}

export function style_color_parser(props: any):string {
    let s: string = "";

    /* Color */
    if (props.c !== "undefined")
        s += "color:" + props.c + ";"
    if (props.bg !== "undefined")
        s += "background:" + props.bg + ";"
    if (props.bgc !== "undefined")
        s += "background-color:" + props.bgc + ";"
    if (props.opt !== "undefined")
        s += "opacity:" + props.opt + ";"

    return s
}

export function style_font_parser(props: any):string {
    let s: string = "";

    /* Color */
    if (props.ff !== "undefined")
        s += "font-family:" + props.ff + ";"
    if (props.fsz !== "undefined")
        s += "font-size:" + props.fsz + ";"
    if (props.fw !== "undefined")
        s += "font-weight:" + props.fw + ";"
    if (props.lh !== "undefined")
        s += "line-height:" + props.lh + ";"
    if (props.ls !== "undefined")
        s += "letter-spacing:" + props.ls + ";"
    if (props.ta !== "undefined")
        s += "text-align:" + props.ta + ";"
    if (props.fst !== "undefined")
        s += "font-style:" + props.fst + ";"
    if (props.tt !== "undefined")
        s += "text-transform:" + props.tt + ";"
    if (props.td !== "undefined")
        s += "text-decoration:" + props.td + ";"

    return s
}

export function style_layout_parser(props: any):string {
    let s: string = "";

    /* Color */
    if (props.d !== "undefined")
        s += "display:" + props.d + ";"
    if (props.va !== "undefined")
        s += "vertical-align:" + props.va + ";"
    if (props.ov !== "undefined")
        s += "overflow:" + props.ov + ";"
    if (props.ovx !== "undefined")
        s += "overflow-x:" + props.ovx + ";"
    if (props.ovy !== "undefined")
        s += "overflow-y:" + props.ovy + ";"

    return s
}

export function style_position_parser(props: any):string {
    let s: string = "";

    /* Color */
    if (props.pos !== "undefined")
        s += "position:" + props.pos + ";"
    if (props.zi !== "undefined")
        s += "z-index:" + props.zi + ";"
    if (props.tp !== "undefined")
        s += "top:" + props.tp + ";"
    if (props.rt !== "undefined")
        s += "right:" + props.rt + ";"
    if (props.bm !== "undefined")
        s += "bottom:" + props.bm + ";"
    if (props.lt !== "undefined")
        s += "left:" + props.lt + ";"

    return s
}

