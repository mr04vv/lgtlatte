import { PageButton } from "./PageButton";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  basePath = "/pages",
}: Props) => {
  if (totalPages <= 1) return null;

  const getPageHref = (page: number) => {
    if (basePath === "/newest/pages") {
      if (page === 1) return "/newest";
      return `${basePath}/${page}`;
    }
    if (page === 1) return "/";
    return `${basePath}/${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let calculatedStartPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const calculatedEndPage = Math.min(
      totalPages,
      calculatedStartPage + maxVisiblePages - 1
    );

    if (calculatedEndPage - calculatedStartPage + 1 < maxVisiblePages) {
      calculatedStartPage = Math.max(
        1,
        calculatedEndPage - maxVisiblePages + 1
      );
    }

    const startPage = calculatedStartPage;
    const endPage = calculatedEndPage;

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <a
          key={i}
          href={getPageHref(i)}
          className={`rounded-md text-[#FCF0DE] text-xl w-12 h-12 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
            i === currentPage
              ? "bg-[#59370F] opacity-100"
              : "hover:opacity-70 bg-[#51381f4d]"
          }`}
        >
          {i}
        </a>
      );
    }

    return pages;
  };

  return (
    <div className="absolute bottom-0 flex justify-center items-center gap-2 w-screen px-4">
      <PageButton
        isActive={currentPage > 1}
        page={currentPage === 2 ? 1 : currentPage - 1}
      >
        ←
      </PageButton>

      <PageButton isActive={currentPage > 1} page={1}>
        ≪
      </PageButton>

      <div className="flex gap-2 max-md:hidden">{renderPageNumbers()}</div>

      <div className="md:hidden text-[#FCF0DE] text-xl">
        {currentPage} / {totalPages}
      </div>

      <PageButton isActive={currentPage < totalPages} page={totalPages}>
        ≫
      </PageButton>

      <PageButton isActive={currentPage < totalPages} page={currentPage + 1}>
        →
      </PageButton>
    </div>
  );
};
