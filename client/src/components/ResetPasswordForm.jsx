import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function ResetPasswordForm() {

  const resetPasswordToken = useParams();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      try {
        const response = await axios.post('http://localhost:4000/api/user/reset/' + resetPasswordToken.token, { newPassword });
        console.log(response.data); 
      } catch (error) {
        console.log(error.response.data);
      }
      navigate('/', { replace: true });
    }

  };

  const [newPassword, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 10 }} >
      <Typography component="h1" variant="h5" color="grey" marginBottom={2}>
        Reset Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Reset Password
      </Button>
      {errorMessage && <div style={{ width: 200 }} className="error">{errorMessage}</div>}
    </Box>
  );
}

export default ResetPasswordForm;
