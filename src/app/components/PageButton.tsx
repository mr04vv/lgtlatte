type Props = {
  page: number;
  children: React.ReactNode;
};
export const PageButton = (props: Props) => {
  return (
    <a
      href={`/pages/${props.page}`}
      className="rounded-md bg-[#59370F] text-[#FCF0DE] text-xl w-12 h-12 flex items-center justify-center transition-opacity duration-300 ease-in-out hover:opacity-70"
    >
      {props.children}
    </a>
  );
};
