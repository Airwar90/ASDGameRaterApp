import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function BasicRating({value, onChange, readOnly = false}) {
  const handleClick = (newVal) => {
    if(!readOnly) onChange(newVal);
  }
  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      
      <Rating
        name={readOnly ? 'read-only' : 'simple-controlled'}
        value={value} 
        readOnly={readOnly}
        onChange={(event, newValue) => {
            
            handleClick(newValue);
        }}
      />

    </Box>
  );
}

//source: https://mui.com/material-ui/react-rating/#basic-rating