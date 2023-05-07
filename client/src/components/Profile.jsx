import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useAuthContext } from '../hooks/useAuthContext';

const _ = require('lodash');

const theme = createTheme();

export default function Profile(props) {

    const { user } = useAuthContext();

    const [fname, setFname] = React.useState(_.capitalize(props.userDetails.fname));
    const [lname, setLname] = React.useState(_.capitalize(props.userDetails.lname));
    const [email, setEmail] = React.useState(props.userDetails.email);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [fnameDisabled, setFNameDisabled] = React.useState(true);
    const [lnameDisabled, setLNameDisabled] = React.useState(true);
    const [emailDisabled, setEmailDisabled] = React.useState(true);
    const [passwordDisabled, setPassswordDisabled] = React.useState(true);

    const [error, setError] = React.useState('')

    var updateUser = null;

    if (!emailDisabled) {
        if (password.trim() !== '') {
            updateUser = { fname, lname, email, password, confirmPassword };
        } else {
            updateUser = { fname, lname, email };
        }
    } else {
        if (password.trim() !== '') {
            updateUser = { fname, lname, password, confirmPassword };
        } else {
            updateUser = { fname, lname };
        }
    }

    const handleSubmit = async function (event) {
        event.preventDefault();
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateUser)
        };
        const response = await fetch('http://localhost:4000/api/user/' + user.id, requestOptions);
        const data = await response.json();   
        if(response.ok){    
            window.location.reload(false);
        }else{
            setError(data.error);
        }
    };

    function handleClick(event) {
        const textFieldName = event.currentTarget.parentNode.parentNode.querySelector('input').getAttribute('name');

        switch (textFieldName) {
            case "firstName":
                setFNameDisabled(false);
                break;
            case "lastName":
                setLNameDisabled(false);
                break;
            case "email":
                setEmailDisabled(false);
                break;
            default:
                setPassswordDisabled(false);
        }
    }

    return (
        <ThemeProvider theme={theme} >
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h4" color="grey">
                        {_.upperFirst(props.userDetails.fname + " " + props.userDetails.lname)}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={fnameDisabled}
                                    label="First Name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={fname}
                                    onChange={(e) => { setFname(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={lnameDisabled}
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={lname}
                                    onChange={(e) => { setLname(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    disabled={emailDisabled}
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    disabled={passwordDisabled}
                                    fullWidth
                                    name="password"
                                    label="Change Password"
                                    type="password"
                                    id="password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    disabled={passwordDisabled}
                                    fullWidth
                                    name="confirm-password"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Save
                        </Button>
                        {error && <div className="error">{error}</div>}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}