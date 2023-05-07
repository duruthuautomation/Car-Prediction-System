import React from "react";
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import ResponsiveAppBar from "./AppBar";
import Copyright from './Copyright';
import BasicModal from "./Prediction";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Paper, Typography } from "@mui/material";
import axios from 'axios';
import { useEffect } from 'react';
import Header from "./Header";


export default function Home({ socket }) {

    const [darkMode, setDarkMode] = React.useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light"
        }
    })

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [trims, setTrims] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [years, setYears] = useState([]);
    const [capacities, setCapacities] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedTrim, setSelectedTrim] = useState('');
    const [selectedFuelType, setSelectedFuelType] = useState('');
    const [selectedTransmissionType, setSelectedTransmissionType] = useState('');
    const [selectedBodyType, setSelectedBodyType] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedEngine, setSelectedEngine] = useState('');
    const [mileage, setMileage] = useState('');

    const [messages, setMessages] = useState([]);
    const [data, setData] = useState("");

    //const [refresh, setRefresh] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        //setRefresh(!refresh);

        socket.emit("data", { selectedBrand, selectedModel, selectedTrim, selectedYear, selectedTransmissionType, selectedBodyType, selectedFuelType, selectedEngine, mileage });

        // try {
        //     const response = await fetch("/http-call", {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });
        //     const responseData = await response.json();
        //     setData(responseData.data);
        //     console.log(responseData.data);

        // } catch (error) {
        //     console.log(error);
        // }
        // setTimeout(() => {
        //     setShowPrice(true)
        // }, 10000);
        //setShowPrice(true);
        // setTimeout(() => {
        //     window.location.reload();
        // }, 15000);

    }

    useEffect(() => {


        socket.on("data", (data) => {
            setMessages([...messages, data.data.selectedBrand, data.data.selectedModel, data.data.selectedTrim, data.data.selectedYear, data.data.selectedTransmissionType, data.data.selectedBodyType, data.data.selectedFuelType, data.data.selectedEngine, data.data.mileage]);
            console.log(data);
        });
        return () => {
            socket.off("data", () => {
                console.log("data event was removed");
            });
        };
    }, [socket, messages]);

    const [x, setX] = React.useState(1);

    const handleReset = () => {
        setX(x + 1);
    };

    const [showPrice, setShowPrice] = React.useState(false);

    useEffect(() => {
        // Fetch the list of brands from the backend API endpoint
        axios.get('http://localhost:4000/api/car/brands')
            .then(response => setBrands(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.innerHTML);
        // Update the selected brand and fetch the list of models
        axios.get('http://localhost:4000/api/car/models/' + event.target.innerHTML)
            .then(response => setModels(response.data))
            .catch(error => console.error(error));
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.innerHTML);
        // Update the selected brand and fetch the list of models
        axios.get('http://localhost:4000/api/car/trims/' + event.target.innerHTML)
            .then(response => setTrims(response.data))
            .catch(error => console.error(error));

        //Fetch fuel types for model
        axios.get('http://localhost:4000/api/car/fuel-types/' + event.target.innerHTML)
            .then(response => setFuelTypes(response.data))
            .catch(error => console.error(error));

        //Fetch transmission for model
        axios.get('http://localhost:4000/api/car/transmission/' + event.target.innerHTML)
            .then(response => setTransmissionTypes(response.data))
            .catch(error => console.error(error));

        //Fetch body types for model
        axios.get('http://localhost:4000/api/car/body-types/' + event.target.innerHTML)
            .then(response => setBodyTypes(response.data))
            .catch(error => console.error(error));

        //Fetch years for model
        axios.get('http://localhost:4000/api/car/years/' + event.target.innerHTML)
            .then(response => setYears(response.data))
            .catch(error => console.error(error));

        //Fetch capacities for model
        axios.get('http://localhost:4000/api/car/capacities/' + event.target.innerHTML)
            .then(response => setCapacities(response.data))
            .catch(error => console.error(error));

    };

    return <ThemeProvider theme={theme}>
        <Paper style={{ height: '100vh' }}>
            <div>
                <ResponsiveAppBar changeTheme={() => setDarkMode(!darkMode)} />
                <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
                    <Typography component="h1" variant="h4" color="grey" margin={5}>
                        Vehicle Details
                    </Typography>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="brand"
                                    options={brands}
                                    sx={{ width: 300 }}
                                    onChange={handleBrandChange}
                                    renderInput={(params) => <TextField required {...params} label="Brand" value={selectedBrand} />}
                                />
                            </div>
                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="model"
                                    options={models}
                                    sx={{ width: 300 }}
                                    onChange={handleModelChange}
                                    renderInput={(params) => <TextField required {...params} label="Model" value={selectedModel} />}
                                />
                            </div>
                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="trim"
                                    options={trims}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedTrim(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Trim/Edition" value={selectedTrim} />}
                                />
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="fuel-type"
                                    options={fuelTypes}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedFuelType(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Fuel Type" value={selectedFuelType} />}
                                />
                            </div>

                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="transmission"
                                    options={transmissionTypes}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedTransmissionType(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Transmission" value={selectedTransmissionType} />}
                                />
                            </div>

                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="body-type"
                                    options={bodyTypes}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedBodyType(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Body Type" value={selectedBodyType} />}
                                />
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="year"
                                    options={years}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedYear(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Year of Manufacture" value={selectedYear} />}
                                />
                            </div>

                            <div className="col-lg-4">
                                <Autocomplete
                                    key={x}
                                    id="engine"
                                    options={capacities}
                                    sx={{ width: 300 }}
                                    onChange={(e) => setSelectedEngine(e.target.innerHTML)}
                                    renderInput={(params) => <TextField disabled required {...params} label="Engine Capacity (cc)" value={selectedEngine} />}
                                />
                            </div>

                            <div className="col-lg-4">
                                <TextField key={x} value={mileage} onChange={(e) => setMileage(e.target.value)} required type="number" id="mileage" label="Mileage (km)" variant="outlined" sx={{ width: 300, marginRight: 200 }} />
                            </div>

                        </div>

                        <div>
                            <Button type="submit" variant="contained" size="large" sx={{ mr: 2 }} endIcon={<BatchPredictionIcon />} >
                                Predict Price
                            </Button>

                            <div>
                                <Header />
                            </div>

                            <Button type="reset" onClick={handleReset} variant="contained" size="large" sx={{ ml: 2 }} endIcon={<RestartAltIcon />}>
                                Reset
                            </Button>
                        </div>
                    </div>

                </Box>

                <Copyright sx={{ mt: 7 }} />
                <BasicModal data={data} showPrice={showPrice} setShowPrice={setShowPrice} />
            </div>
        </Paper>
    </ThemeProvider>
}


