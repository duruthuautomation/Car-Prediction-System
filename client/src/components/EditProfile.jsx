import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import image from '../images/bg2.jpg';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function EditProfile(props) {

  const { children, openPopup, setOpenPopup } = props;

  return (
    <div>
      <Dialog
        open={openPopup}
        PaperProps={{
          style: {
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
          },
        }}
        TransitionComponent={Transition}
        transitionDuration={1000}

      >
        <IconButton
          aria-label="close"
          onClick={() => setOpenPopup(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          {children}
        </DialogContent>

      </Dialog>
    </div>
  );
}