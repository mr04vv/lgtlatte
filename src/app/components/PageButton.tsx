type Props = {
  page: number;
  isActived: boolean;
  children: React.ReactNode;
};
export const PageButton = (props: Props) => {
  return (
    <a
      href={props.isActived ? `/pages/${props.page}` : undefined}
      className={`rounded-md text-[#FCF0DE] text-xl w-12 h-12 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        props.isActived ? "hover:opacity-70 bg-[#59370F]" : "bg-[#51381f4d]"
      }`}
    >
      {props.children}
    </a>
  );
};
