import { Card } from '@mantine/core';
import { useId } from 'react';

import { TableSkeleton } from './TableSkeleton';
import { Metadata } from '@/types/navigation';
import Pagination from '../pagination/Pagination';


interface Props<T> {
  title?: string;
  toolbar?: React.ReactNode;
  header: (string | boolean)[];
  items: T[] | undefined;
  renderItem: (item: T, index: number) => React.ReactNode;
  metadata?: Metadata;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export const Table = <T,>(props: Props<T>) => {
  const { items, renderItem, header, loading, metadata, onPageChange } = props;
  const id = useId();

  return (
    <Card p={0} shadow="sm">
      <Card.Section p="md" pb={0}>
        <div className="flex items-center justify-between py-4 px-5">
          <div className="font-semibold text-base">
            <h2 className="text-gray-800">{props.title ?? 'Table'} </h2>
          </div>

          <div className="flex items-center space-x-2">{props.toolbar}</div>
        </div>
      </Card.Section>

      <Card.Section px="md" pb="md">
        <div className="text-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-gray-50">
          <table className="table-auto w-full">
            <thead className="border-t border-b-[1.5px] w-full border-gray-300 bg-gray-100 text-gray-600 mx-4">
              <tr>
                {header.map((item, i) => (
                  <th
                    key={`${id}_head_${i}`}
                    scope="col"
                    className="py-3 px-5 text-left w-max text-xs uppercase whitespace-nowrap"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-300 [&_td]:whitespace-nowrap [&_td]:px-5 [&_td]:py-3">
              {loading || !items ? (
                <TableSkeleton col={header.length} row={5} />
              ) : items.length > 0 ? (
                items.map((item, index) => renderItem(item, index))
              ) : (
                <tr>
                  <td colSpan={header.length} className="text-center !py-12">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && !!items && items.length > 0 && !!metadata && (
          <Pagination 
            metadata={metadata}
            onPageChange={(page) => {
              if (onPageChange) {
                onPageChange(page);
              }
            }}
          />
        )}
      </Card.Section>
    </Card>
  );
};
