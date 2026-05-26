import React from 'react';
import { Pagination, Box } from '@mui/material';

interface SurveyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SurveyPagination: React.FC<SurveyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%' }}>
      <Pagination 
        showFirstButton
        showLastButton
        count={totalPages} 
        page={currentPage} 
        onChange={(_, page) => onPageChange(page)} 
        color="primary"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
          }
        }}
      />
    </Box>
  );
};

export default SurveyPagination;