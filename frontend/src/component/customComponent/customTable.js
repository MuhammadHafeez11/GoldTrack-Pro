import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import './customTable.css';

const CustomTable = ({ columns, data, isPrinting }) => {
  // console.log(isPrinting);
  
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalPages = table.getPageCount();

  return (
    <div className="custom-table-container">
      <div className={isPrinting ? "" : "custom-table-wrapper"}>
      <table className="custom-table"> 
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <span> 🔼</span>}
                      {header.column.getIsSorted() === 'desc' && <span> 🔽</span>}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
          <tbody>
            {(isPrinting
              ? table.getPrePaginationRowModel().rows // Show all rows when printing
              : table.getRowModel().rows // Show paginated rows
            ).map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
          
      </table>
        </div>
  
      {!isPrinting && ( // Hide pagination during printing
        <div className="pagination-controls">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            {'<<'}
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {'<'}
          </button>
          <span>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {totalPages}
            </strong>
          </span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>
          <button onClick={() => table.setPageIndex(totalPages - 1)} disabled={!table.getCanNextPage()}>
            {'>>'}
          </button>
          {/* <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              min={1}
              max={totalPages}
              onChange={(e) => {
                const page = Math.max(0, Math.min(totalPages - 1, Number(e.target.value) - 1 || 0));
                table.setPageIndex(page);
              }}
              style={{ width: '50px' }}
            />
          </span> */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );  
};

export default CustomTable;