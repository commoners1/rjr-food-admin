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
  return (
    <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
        </p>
        <div className="flex space-x-2">
            <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
            onClick={() => onPageChange(meta.page + 1)}
            >
            Next
            </Button>
        </div>
    </div>
  )
}

export default Pagination;