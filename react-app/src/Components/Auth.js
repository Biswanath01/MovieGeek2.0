import React, { useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from "@mui/material";

export default function Auth() {
    const [signInStatus, setSignInStatus] = useState(false);
    const [height, setHeight] = useState(signInStatus === "true" ? "300px" : "450px");
    const [userEmail, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [pwd, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPasswd, setShowPasswd] = useState(false);

    useEffect(() => {
        console.log("Stuff");
        const checkPrevLogin = localStorage.getItem("mgeek-app");

        if (checkPrevLogin) {
            const user = JSON.parse(checkPrevLogin);
            setSignInStatus(true);
            navigate(`/${user.userId}`);
        }
    }, []);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleShowPassword = (event) => {
        setShowPasswd(prev => !prev);
    }

    const handleLogin = (event) => {
        event.preventDefault();
        const data = {
            userName: username,
            password: pwd
        }
        console.log(data);

        fetch(`/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res);
                localStorage.setItem("mgeek-app", JSON.stringify(res.data));
                navigate(`/${res.data.userId}`);
            })
            .catch((err) => console.log(err));
    };

    const handleRegister = (event) => {
        event.preventDefault();
        const data = {
            userName: username,
            email: userEmail,
            password: pwd
        }

        fetch(`/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res);
                localStorage.setItem("mgeek-app", JSON.stringify(res.data));
                navigate(`/create-profile/${res.data.userId}`);
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
                marginTop: '10%' 
            }}
        >
            <Container
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    backgroundColor: "#001e3c",
                    borderRadius: "20px",
                    height: signInStatus ? "350px": "450px",
                    width: "500px"
                }}
            >
                {
                    signInStatus ?
                        <form style={{ display: "flex", flexDirection: "column", marginTop: "4%" }}>
                            <h3 style={{ marginBottom: "20px", color: "white", textAlign: "center" }} >Login to MGeek</h3>
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Username" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setUserName(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            {/* <TextField 
                                required 
                                id="outlined-basic" 
                                label="Password" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setPassword(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            /> */}
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPasswd ? 'text' : 'password'}
                                value={pwd}
                                onChange={(event) => setPassword(event.target.value)}
                                sx={{backgroundColor:"white"}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPasswd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                placeholder="Password"
                            />

                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={handleLogin} 
                                disabled = { username.length > 0 && pwd.length > 0 ? false : true }
                            >
                                Login
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={(event) => setSignInStatus(false)} 
                                sx={{ marginTop: "20px" }}
                            >
                                Register
                            </Button>
                        </form> :
                        <form style={{ display: "flex", flexDirection: "column", marginTop: "4%" }}>
                            <h3 style={{ marginBottom: "20px", color: "white", textAlign: "center" }} >Sign Up</h3>
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Email" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setEmail(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            <TextField 
                                required 
                                id="outlined-basic" 
                                label="Username" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setUserName(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            />
                            {/* <TextField 
                                required 
                                id="outlined-basic" 
                                label="Password" 
                                variant="outlined" 
                                sx={{ marginBottom: "30px" }} 
                                onChange={(event) => setPassword(event.target.value)} 
                                InputProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                            /> */}
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPasswd ? 'text' : 'password'}
                                value={pwd}
                                onChange={(event) => setPassword(event.target.value)}
                                sx={{backgroundColor:"white"}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPasswd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                
                                placeholder="Password"
                            />


                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={handleRegister} 
                                disabled = { userEmail.length > 0 && username.length > 0 && pwd.length > 0 ? false : true } 
                            >
                                Register For MGeek
                            </Button>
                            <Button 
                                variant="contained" 
                                startIcon={<LoginIcon />} 
                                onClick={(event) => setSignInStatus(true)} sx={{ marginTop: "20px" }}
                            >
                                Already Registered? Login
                            </Button>
                        </form>
                }
            </Container>
        </div>
    );
};

