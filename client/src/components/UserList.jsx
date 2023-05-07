import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import image from '../images/bg2.jpg';

const columns = [
    { id: 'fname', label: 'First Name', minWidth: 170 },
    { id: 'lname', label: 'Last Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
];

function createData(fname, lname, email) {
    return { fname, lname, email };
}

const rows = [
    createData('Gayashan', 'Tharaka', 'gayashantrox@gmail.com'),
    createData('Niran', 'Udugama', 'niranu78@gmail.com'),
    createData('Ashen', 'Renon', 'ashenrenon@gmail.com'),
    createData('Eshara', 'Hasheli', 'esharahasheli@gmail.com'),
    createData('Dinuka', 'Madushan', 'dinukamadushan@gmail.com'),
];

export default function UserTable() {

    return (
        <Table stickyHeader aria-label="sticky table" sx={{ tableLayout: "fixed" }}>
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, fontWeight: "bold", backgroundColor: "cornflowerblue", color: "white", border: "1px lightblue solid" }}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows
                    .map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell width="max-content" key={column.id} align={column.align}
                                            style={{ minWidth: "auto", backgroundColor: "lightblue", color: "darkslategray", fontWeight: "bold", border: " 1px white solid" }}>
                                            {value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
}
