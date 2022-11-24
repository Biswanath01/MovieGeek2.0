import React, {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const getStyles = (name, personName, theme) => {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
}

export default function CreateProfile(){
    const theme = useTheme();
    const params = useParams();
    const userId = params.userId;
    const [profileStep, setProfileStep] = useState(1);
    const [profileName, setProfileName] = useState("");
    const [profileAge, setProfileAge] = useState();
    const [profileGenres, setProfileGenres] = useState([]);
    const [profilePic, setProfilePic] = useState();
    const [picUploaded, setPicUploaded] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const navigate = useNavigate();
    const [types, setTypes] = useState(["Comedy", "Science Fiction", "Adventure", "Romance", "Horror", "Thriller"]);

    useEffect(() => {
        if(profilePic){
            setImageUrl(prev => URL.createObjectURL(profilePic));
        } else return;
    }, [profilePic]);

    const handleUploadImage = (event) => {
        setProfilePic(event.target.files[0]);
        setPicUploaded(true);
    }

    const handleCharChange = (event) => {
        const {
            target: { value },
        } = event;
        setProfileGenres(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleCreateProfile = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("image", profilePic, profilePic.name);
        formData.append("name", profileName);
        formData.append("age", profileAge);
        formData.append("likedGenres", JSON.stringify(profileGenres));
        console.log(formData);

        axios.post(`/api/create-profile/${userId}/`, formData)
            .then((res) => {
                if(res.error){
                    console.log("Error");
                } else {
                    navigate(`/${res.data.data.userId}`);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div 
            style={{ 
                maxHeight: window.innerHeight, 
                background: "white", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                marginTop: '1.8%' 
            }}
        >

            <Container
                display="flex"
                justifyContent="center"
                alignItems="center"
                maxWidth="xs"
                sx={{
                    backgroundColor: "#001e3c",
                    marginTop: "170px",
                    borderRadius: "20px",
                    height: profileStep === 1 ? "450px" : "470px"
                }}
            >
                {profileStep === 1 ? <form style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{marginTop: "20px", color: "white", textAlign: "center" }} >Create Your Profile</h3>
                    <h4>Step {profileStep} of 2</h4>
                    <TextField 
                        required 
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined" 
                        sx={{ marginBottom: "30px" }} 
                        onChange={(event) => setProfileName(event.target.value)} 
                        InputProps={{
                            style: {
                                backgroundColor: "white"
                            }
                        }}
                    />
                    <TextField 
                        required 
                        id="outlined-basic" 
                        label="Age" 
                        variant="outlined" 
                        sx={{ marginBottom: "30px" }} 
                        onChange={(event) => setProfileAge(event.target.value)} 
                        InputProps={{
                            style: {
                                backgroundColor: "white"
                            }
                        }}
                    />
                    <Button variant="contained" onClick={(event) => setProfileStep(prev => prev + 1)} disabled = { profileName.length > 0 && profileAge > 0 ? false : true } >
                        Next Step
                    </Button>
                </form> : <form style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{marginTop: "30px", color: "white", textAlign: "center" }} >Create Your Profile</h3>
                    <h4 style={{color:"white"}}>Step {profileStep} of 2</h4>
                    <InputLabel id="multiple-checkbox-label" sx={{color:"white"}}>Liked Genres</InputLabel>
                    <Select
                        required
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        multiple
                        value={profileGenres}
                        onChange={handleCharChange}
                        input={<OutlinedInput label="Liked Genres"/>}
                        //renderValue={(selected) => selected.join(', ')}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} sx={{backgroundColor:"#003a75", color:"white"}}/>
                                ))}
                            </Box>
                        )}
                        sx={{
                            backgroundColor: "white"
                        }}
                    >
                        {types.map((type, index) => (
                            <MenuItem key={index} value={type}
                                style={getStyles(type, profileGenres, theme)}
                            >
                                <Checkbox checked={profileGenres.indexOf(type) > -1} />
                                <ListItemText primary={type} />
                            </MenuItem>
                        ))}
                    </Select>
                    {picUploaded ? <div style={{display: "flex", flexDirection: "column"}}>
                        <h4 style={{color:"white", marginTop:"5%"}}>Your DP</h4>
                        <div style = {{display:"flex", marginBottom: "30px", alignItems: "center"}}>
                            <img 
                                src={imageUrl}
                                style={{width: "50px", height: "50px", borderRadius: "50%", marginRight: "30px"}}
                            />
                            <Button 
                                variant='contained'
                                onClick={(event) => setPicUploaded(false)}
                            >
                                Change
                            </Button>
                        </div>
                    </div>:
                    <input
                        type='file' 
                        accept='image/*'
                        onChange={handleUploadImage}
                        style={{marginTop: "30px", marginBottom: "30px", width: "40%", height:"40%"}}
                    />}
                    <Button variant='contained' sx={{marginBottom: "10px"}} onClick={(event) => {
                        event.preventDefault();
                        setProfileStep(1);
                    }}>Previous Step</Button>
                    <Button variant='contained' onClick={handleCreateProfile}
                        disabled = {profileName && profileAge && profileGenres && profilePic ? false : true}
                    >Submit</Button>
                </form>}
            </Container>
        </div>
    );
};