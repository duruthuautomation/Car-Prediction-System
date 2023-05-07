import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'lightblue',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export default function BasicModal(props) {

  const { showPrice, setShowPrice, data } = props;

  return (
    <div>
      <Modal
        open={showPrice}
        onClose={() => setShowPrice(false)}
      >
        {Number.isInteger(data) ?
          <Box sx={style}>
            <Typography id="price-title" variant="h4" component="h2" color="darkcyan" fontWeight="bold">
              Predicted Price
            </Typography>
            <Typography id="price-value" variant="h5" sx={{ mt: 2 }} color="darkslategray" fontWeight="bold">
              {"Rs " + parseInt(data).toLocaleString()}
            </Typography>
          </Box> :
          <Box sx={style}>
            <Typography id="price-error" variant="h5" color="darkslategray" fontWeight="bold">
              {data}
            </Typography>
          </Box>
        }
      </Modal>
    </div>
  );
}