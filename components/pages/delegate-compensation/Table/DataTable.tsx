import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { DelegateCompensationStats } from 'types';
import { BreakdownModal } from './BreakdownModal';

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  refreshFn: () => Promise<void>;
};

export const DataTable = <Data extends object>({
  data,
  columns,
  refreshFn,
}: DataTableProps<Data>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDelegate, setSelectedDelegate] =
    useState<DelegateCompensationStats | null>(null);

  const openBreakdownModal = (delegate: DelegateCompensationStats) => {
    setSelectedDelegate(delegate);
    onOpen();
  };

  return (
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const { meta } = header.column.columnDef;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={(meta as any)?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <Tr
              key={row.id}
              onClick={() => {
                openBreakdownModal(row.original as DelegateCompensationStats);
              }}
              cursor="pointer"
              _hover={{
                opacity: 0.8,
              }}
            >
              {row.getVisibleCells().map(cell => {
                const { meta } = cell.column.columnDef;
                return (
                  <Td key={cell.id} isNumeric={(meta as any)?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedDelegate && (
        <BreakdownModal
          delegate={selectedDelegate}
          isOpen={isOpen}
          onClose={onClose}
          refreshFn={refreshFn}
        />
      )}
    </>
  );
};
