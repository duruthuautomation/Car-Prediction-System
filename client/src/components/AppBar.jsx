import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import EditProfile from './EditProfile';
import Profile from './Profile';
import UserTable from './UserList';
import TablePopup from './TablePopup';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from "react";

const _ = require('lodash');

export default function ResponsiveAppBar(props) {

    const { logout } = useLogout();

    const { user } = useAuthContext()

    const [openPopup, setOpenPopup] = React.useState(false);
    const [openTable, setOpenTable] = React.useState(false);

    const [userDetails, setUserDetails] = useState('');

    useEffect(() => {

        axios.get('http://localhost:4000/api/user/' + user.id)
            .then(response => setUserDetails(response.data.user))
            .catch(error => console.error(error));

    }, [])

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <DirectionsCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 0.5 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'default'
                        }}
                    >
                        AUTOPOINT
                    </Typography>

                    <IconButton onClick={props.changeTheme} aria-label="dark" color="inherit" >
                        <DarkModeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', mr: 0 } }}>

                        <Button
                            onClick={() => setOpenPopup(true)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Profile
                        </Button>
                        <Button
                            onClick={() => setOpenTable(true)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Dashboard
                        </Button>

                    </Box>

                    {user &&
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                cursor: 'default'
                            }}
                        >
                            {_.toUpper(userDetails.fname)}
                        </Typography>
                    }

                    <Box sx={{ flexGrow: 0 }}>
                        <Link to={'/'}>
                            <Button sx={{ fontWeight: "bold" }} variant="contained" startIcon={<LogoutIcon />} onClick={() => logout()}>
                                Log Out
                            </Button>
                        </Link>

                    </Box>

                </Toolbar>
            </Container>

            <EditProfile openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <Profile userDetails={userDetails} />
            </EditProfile>

            <TablePopup openPopup={openTable} setOpenPopup={setOpenTable}>
                <UserTable />
            </TablePopup>

        </AppBar>

    );
}
