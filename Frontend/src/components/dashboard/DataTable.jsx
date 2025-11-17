import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable({
  data,
  columns,
  onCreate,
  searchable = true,
  canCreate = true,
  title,
  pagination,
}) {
  const [search, setSearch] = useState('');

  // Defensive: coerce `data` into an array in case API returned an object wrapper
  const rows = Array.isArray(data)
    ? data
    : (data && Array.isArray(data.data) ? data.data : []);

  const filteredData = search
    ? rows.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return String(value).toLowerCase().includes(search.toLowerCase());
        })
      )
    : rows;

  const hasPagination = Boolean(pagination);
  const pageLimit = pagination?.limit ?? filteredData.length;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalRecords = pagination?.totalRecords ?? filteredData.length;

  const startItem =
    totalRecords === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const endItem = totalRecords === 0 ? 0 : Math.min(currentPage * pageLimit, totalRecords);

  const handlePageChange = (nextPage) => {
    if (!pagination?.onPageChange) return;
    const clamped = Math.max(1, Math.min(nextPage, totalPages || 1));
    if (clamped !== currentPage) {
      pagination.onPageChange(clamped);
    }
  };

  const getPageNumbers = () => {
    if (!hasPagination) return [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }
    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('start-ellipsis');

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) pages.push('end-ellipsis');

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
      <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">Manage and view all {title.toLowerCase()}</p>
        </div>
        {canCreate && onCreate && (
          <Button 
            onClick={onCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New {title.slice(0, -1)}
          </Button>
        )}
      </div>      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden backdrop-blur-sm bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="font-semibold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center text-muted-foreground py-8"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {hasPagination && (
        <div className="flex flex-col gap-3 sm:items-center sm:justify-between py-4 sm:text-center">
          <p className="text-sm text-muted-foreground">
            {totalRecords > 0
              ? `Showing ${startItem}-${endItem} of ${totalRecords}`
              : 'No records'}
          </p>
          <div className="flex items-center justify-center gap-2 md:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((page, idx) =>
              page === 'start-ellipsis' || page === 'end-ellipsis' ? (
                <span
                  key={`${page}-${idx}`}
                  className="px-2 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10 px-0"
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}