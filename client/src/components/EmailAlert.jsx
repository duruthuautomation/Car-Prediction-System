import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
  
  const { openAlert,setOpenAlert } = props;

  return (
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal:'center' }}>
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: '100%' }}>
          Email has been sent!
        </Alert>
      </Snackbar>
  );
}