import { Button } from "./button"

type PaginationMeta = {
  total: number;
  limit: number;
  page: number;
};
type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(meta.total / meta.limit);
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
            Page {meta.page} of {totalPages}
        </p>
        <div className="flex space-x-2 w-full sm:w-auto">
            <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
            className="flex-1 sm:flex-initial"
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= totalPages}
            onClick={() => onPageChange(meta.page + 1)}
            className="flex-1 sm:flex-initial"
            >
            Next
            </Button>
        </div>
    </div>
  )
}

export default Pagination;