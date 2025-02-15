/* eslint-disable react/prop-types */
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationRounded({ count = 10, page, onChange, theme = 'light' }) {
  const handlePageChange = (event, value) => {
    if (onChange) {
      onChange(event, value);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="mt-9 flex justify-center">
      <Stack spacing={2}>
        <Pagination
          count={count}
          page={page} // تأكد من تمرير الصفحة الحالية
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
          size="large"
          sx={{
            '.MuiPaginationItem-root': {
              color: isDark ? '#FFFFFF' : '#555555',
            },
            '.MuiPaginationItem-outlined': {
              borderColor: isDark ? '#AAAAAA' : '#000650',
              backgroundColor: isDark ? '#1591b7' : '#FFFFFF',
              '&:hover': {
                backgroundColor: isDark ? '#1bb5e4' : '#1CBEEF',
                color: '#FFFFFF',
              },
            },
            '.MuiPaginationItem-page.Mui-selected': {
              backgroundColor: isDark ? '#FFFFFF' : '#000650',
              color: isDark ? '#000000' : '#FFFFFF',
              borderColor: isDark ? '#FFFFFF' : '',
              '&:hover': {
                backgroundColor: isDark ? '#e6e6e6' : '#2490c2',
              },
            },
          }}
        />
      </Stack>
    </div>
  );
}
