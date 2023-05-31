import { Link } from '@kobalte/core';
import { useNavigate } from '@solidjs/router';
import style_space_parser, { style_border_parser, style_box_parser, style_color_parser, style_font_parser, style_layout_parser, style_position_parser } from './StyleParser';

const LinkComponents = (props: any) => {
  const nav = useNavigate();
  const handleNav = () => {
    nav(props.path, { replace: true });
  };
  let s = style_space_parser(props) + style_box_parser(props) + style_border_parser(props) + style_color_parser(props) + style_font_parser(props) + style_layout_parser(props) + style_position_parser(props)

  return (

    <Link.Root class="link" style={s} onclick={handleNav}>
      {props.children}
    </Link.Root>
  );
};

export default LinkComponents