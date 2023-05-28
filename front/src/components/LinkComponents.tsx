import { Link } from '@kobalte/core';
import { useNavigate } from '@solidjs/router';

const LinkComponents = (props: any) => {
  const nav = useNavigate();
  const handleNav = () => {
    nav(props.path, { replace: true });
  };

  return (
    <Link.Root class="link" onclick={handleNav}>
      {props.children}
    </Link.Root>
  );
};

export default LinkComponents