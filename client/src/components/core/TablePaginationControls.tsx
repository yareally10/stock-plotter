import React from 'react';
import Button from './buttons/Button';

interface TablePaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const TablePaginationControls: React.FC<TablePaginationControlsProps> = ({ page, totalPages, onPageChange }) => (
  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
    <Button
      onClick={() => onPageChange(page - 1)}
      disabled={page <= 1}
    >
      Previous
    </Button>
    <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Page {page} of {totalPages}</span>
    <Button
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages}
    >
      Next
    </Button>
  </div>
);

export default TablePaginationControls; 