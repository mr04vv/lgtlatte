type PropTypes = {
  src: string;
  width: number;
};

export const imageLoader = (props: PropTypes) => {
  const { src, width } = props;
  const MAX_WIDTH = 720;
  const resizeWidth = width > MAX_WIDTH ? MAX_WIDTH : width;

  return `${src}?w=${resizeWidth}&q=80&fm=webp`;
};

export default imageLoader;
