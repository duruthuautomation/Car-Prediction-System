import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TablePopup(props) {

  const { children, openPopup, setOpenPopup } = props;

  return (
    <div>
      <Dialog
        open={openPopup}
        TransitionComponent={Transition}
        transitionDuration={1000}
        onClose={() => setOpenPopup(false)}
      >
        <DialogContent style={{padding: 0}}>
          {children}
        </DialogContent>

      </Dialog>
    </div>
  );
}