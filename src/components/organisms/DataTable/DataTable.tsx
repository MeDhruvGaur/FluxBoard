import React, { useState, useMemo, useRef, UIEvent } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string | number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationConfig {
  pageSize?: number;
  showSizeChanger?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  pagination?: PaginationConfig;
  loading?: boolean;
  rowHeight?: number;
  containerHeight?: number;
  virtualize?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  pagination = { pageSize: 10, showSizeChanger: true },
  loading = false,
  rowHeight = 52,
  containerHeight = 420,
  virtualize = true
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Virtualization calculations on current page or whole dataset
  const displayItems = paginatedData;
  const totalItemsCount = displayItems.length;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (virtualize) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };

  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const startIndex = virtualize ? Math.max(0, Math.floor(scrollTop / rowHeight) - 2) : 0;
  const endIndex = virtualize
    ? Math.min(totalItemsCount, startIndex + visibleCount + 4)
    : totalItemsCount;

  const visibleRows = displayItems.slice(startIndex, endIndex);
  const offsetY = virtualize ? startIndex * rowHeight : 0;
  const totalHeight = virtualize ? totalItemsCount * rowHeight : 'auto';

  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable === false) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Table Header / Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '0.85rem 1.25rem',
          fontSize: '0.775rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)'
        }}
      >
        {columns.map((col) => {
          const colKey = String(col.key);
          const isSorted = sortKey === colKey;
          return (
            <div
              key={colKey}
              onClick={() => handleSort(colKey, col.sortable)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: col.sortable !== false ? 'pointer' : 'default',
                userSelect: 'none'
              }}
            >
              <span>{col.header}</span>
              {col.sortable !== false && (
                <span style={{ color: isSorted ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {isSorted ? (
                    sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                  ) : (
                    <ArrowUpDown size={12} />
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Virtualized Rows Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: `${containerHeight}px`,
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {loading ? (
          <div style={{ padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '42px', width: '100%' }} />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div
            style={{
              padding: '4rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}
          >
            No records found
          </div>
        ) : (
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${offsetY}px)`
              }}
            >
              {visibleRows.map((row, idx) => {
                const actualIndex = startIndex + idx;
                return (
                  <div
                    key={row.id || actualIndex}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
                      height: `${rowHeight}px`,
                      alignItems: 'center',
                      padding: '0 1.25rem',
                      fontSize: '0.825rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: actualIndex % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        actualIndex % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)';
                    }}
                  >
                    {columns.map((col) => {
                      const colKey = String(col.key);
                      const cellValue = row[colKey];
                      return (
                        <div key={colKey} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {col.render ? col.render(cellValue, row, actualIndex) : String(cellValue ?? '')}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-elevated)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>
            Showing {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          {pagination.showSizeChanger && (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.4rem',
                outline: 'none'
              }}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.3rem 0.5rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: '0.3rem 0.5rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
