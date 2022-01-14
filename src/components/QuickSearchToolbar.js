import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';

const QuickSearchToolbar = ({ placeholder, onChange  }) => {
  return (
    <TextField
      variant="outlined"
      size='small'
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: <SearchIcon fontSize="small" />,
      }}
      sx={{width: '50%'}}
    />
  );
}

export default QuickSearchToolbar;
