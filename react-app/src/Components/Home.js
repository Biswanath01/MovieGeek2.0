import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import axios from "axios";
import './Home.css';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import logo from './logo.png';
import HashLoader from "react-spinners/HashLoader";
import { Avatar } from "@mui/material";

export const Home = ()=> {    
  const [tabName, setTabName] = useState('upcoming');
  const [moviesData, setMoviesData] = useState();
  const [queryResults, setQueryResults] = useState([]);
  const [baseUrl, setBaseUrl] = useState('https://api.themoviedb.org/3/');
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currPage, setCurrPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(itemsPerPage);
  const [userDetails, setUserDetails] = useState();
  const [userProfilePic, setUserProfilePic] = useState();
  const [userProfileName, setUserProfileName] = useState();
  const [userProfileTag, setUserProfileTag] = useState();

  const API_KEY = "db75be3f6da59e6c54d0b9f568d19d16";
  const navigate = useNavigate();
  const params = useParams();

  const handleChange = (event, newValue) => {
    setTabName(newValue);
  };  

  const handlePageChange = (event, page) =>{
    console.log(page);
    setCurrPage(page);
    setFirstIndex((page - 1) * itemsPerPage);
    setSecondIndex(page * itemsPerPage);
  }

  const getData = (tab) => {
    axios.get(`${baseUrl}movie/${tab}?api_key=${API_KEY}&page=1`)
      .then((res) => {
          // console.log(res.data);
          setMoviesData(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  // const getGenreNames = async (id) => {
    // axios.get(`${baseUrl}/movie/${id}?api_key=${API_KEY}`)
    //   .then((res) => {
    //     console.log(res.data.genres);
    //     setGenre(res.data.genres);
    //   })
    //   .catch((err)=>{
    //     console.log(err);
    //   });
  // }

  const handleLogout = () => {
    localStorage.removeItem('mgeek-app');
    navigate("/");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("mgeek-app"));
      if(user){
          setUserDetails(user);
      } else {
          navigate("/");
      }
      axios.post(`/api/get-profile-data/`, {
        userId: params.userId
      })
      .then((res)=>{
        console.log(res.data);
        setUserProfilePic(res.data.profile.dp);
        setUserProfileName(res.data.profile.publicName);
        setUserProfileTag(res.data.profile.tag);
      })
      .catch((err)=>{
        console.log(err);
      })
    
  }, []);

  useEffect(() => {
    getData(tabName);
  }, [tabName]);

  useEffect(() => {
    if(query.length === 0){
      setTyping(prev => false);
      return;
    };
    
    axios.get(`${baseUrl}search/movie?api_key=${API_KEY}&query=${query}`)
    .then((res) => {
        console.log(res);
        res.data.results.length > 0 && setQueryResults(res.data.results);
    })
    .catch((err) => console.log(err));
    // console.log(query);
    
  }, [query]);

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");


  return (
    <div style={{ minWidth: "447px"}}>
        {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button> */}
        <AppBar position="static" sx={{ height: `12.5vh` }}>
          <Toolbar>
            <img className="logo" src={logo} onClick={()=>{
              navigate("/");
            }}/>
            <div>

              <h1 className="movie-geek" onClick={()=>{
                navigate("/");
              }}>MovieGeek</h1>
              <div>
                <Button variant="contained" color="success" sx={{background:"#003a75",marginTop:"3px", marginRight:"5px"}} onClick={(event)=>{
                  navigate(`/${params.userId}/favourites`);
                }}>Favourites</Button>
                <Button variant="contained" color="success" sx={{background:"#003a75",marginTop:"3px"}} onClick={(event)=>{
                  navigate(`/${params.userId}/watchlist`);
                }}>WatchList</Button>
              </div>
            </div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <TextField 
                label="" 
                color="secondary" 
                placeholder="Search..." 
                sx={{margin: 5, marginLeft: "2vw",backgroundColor: "rgba(0, 0, 0, 0.5)", width: "50%"}} 
                onChange={(e)=>{
                  setTyping(prev => true);
                  setQuery(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                  style: {
                    color: "white"
                  }
                }} 
              />    
            </Typography>
              <Avatar className="avatar-hide" src={userProfilePic && userProfilePic} sx={{border: "5px solid #FFDE00", borderRadius: "60%", margin: "1%"}}/> 
              <p className="avatar-hide" style={{margin:"2%", marginLeft: "0%"}}>{userProfileName} #{userProfileTag}</p>

            <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>    
        <Box sx={{ width: '100%'}}>
          <div style={{backgroundColor: "rgba(0, 30, 60, 0.85)", margin: "0 5% 0 5%"}}>
            <Tabs
              value={tabName}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              variant="contained"
              aria-label="secondary tabs example"
              centered                
            >
              <Tab value="upcoming" label="Upcoming Movies" sx={{color: "white"}}/>
              <Tab value="popular" label="Popular Movies" sx={{color: "white"}}/>
              <Tab value="top_rated" label="Top-rated Movies" sx={{color: "white"}}/>
            </Tabs>
          </div>
          
          <div className="home-body">
            {
              moviesData ? typing === false && moviesData.slice(firstIndex, secondIndex).map((movie, index) => {
                return(
                  <Card onClick={(event) => navigate(`/movie-detail/${movie.id}/${params.userId}`)}
                    className="movie-body" 
                    sx={{ 
                      width: "90%", 
                      cursor: "pointer", 
                      border:"5px solid magenta", 
                      borderRadius: "2.5%", 
                      margin: "5%", 
                      marginLeft: "6%", 
                      marginRight: "1.5%", 
                      color:"white", 
                      backgroundColor: "#7b1fa2", 
                      maxWidth: window.innerWidth/0.5,
                      
                      boxShadow: "rgba(255, 255, 255, 0.07) 0px 1px 2px, rgba(255, 255, 255, 0.07) 0px 2px 4px, rgba(255, 255, 255, 0.07) 0px 4px 8px, rgba(255, 255, 255, 0.07) 0px 8px 16px, rgba(255, 255, 255, 0.07) 0px 16px 32px, rgba(255, 255, 255, 0.07) 0px 32px 64px"
                    }} 
                    key={index}
                  >
                    <CardMedia
                      component="img"
                      height="65%"
                      image={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                      alt="movie-backdrop"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {movie.title}
                      </Typography>
                      <Typography variant="body" sx={{color:"white"}}>
                        {movie.overview.slice(0, 60)}...
                      </Typography>
                    </CardContent>
                  </Card>
                )
              }) : <HashLoader
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    style={{color:"white"}}
                  />
            }
            {
              typing ?  
              <Pagination 
                sx = {{ position: "fixed", bottom: "0", left: "43%" , background:"white" }}
                count={queryResults && Math.ceil(queryResults.length/itemsPerPage)} 
                variant="outlined" 
                color="primary" 
                onChange={handlePageChange}
              /> 
                : 
              <Pagination count={moviesData && Math.ceil(moviesData.length/itemsPerPage)} 
                sx = {{ position: "fixed", bottom: "0", left: "43%" , background:"white" }}
                variant="outlined" 
                color="secondary" 
                onChange={handlePageChange}
              />
            }
            {
              typing === true && queryResults.length === 0 ? <h2 
                style={{display: "flex", textAlign:"center", alignItems:"center", justifyContent:"center", margin:"20%", color: "white"}}
              >
                No Such Movie!
              </h2>
              :(typing && queryResults && queryResults.length > 0 && queryResults.slice(firstIndex, secondIndex).map((result, index) => {
                return(
                  <Card 
                    onClick={(event) => navigate(`/movie-detail/${result.id}/${params.userId}`)}
                    className="movie-body" 
                    sx={{ 
                      width: "90%", 
                      cursor: "pointer", 
                      border:"5px solid magenta", 
                      borderRadius: "2.5%", 
                      margin: "5%", 
                      marginLeft: "6%", 
                      marginRight: "1.5%", 
                      color:"white", 
                      backgroundColor: "#7b1fa2", 
                      maxHeight: "350px",
                      boxShadow: "rgba(255, 255, 255, 0.07) 0px 1px 2px, rgba(255, 255, 255, 0.07) 0px 2px 4px, rgba(255, 255, 255, 0.07) 0px 4px 8px, rgba(255, 255, 255, 0.07) 0px 8px 16px, rgba(255, 255, 255, 0.07) 0px 16px 32px, rgba(255, 255, 255, 0.07) 0px 32px 64px"
                    }} 
                      key={index}
                  >
                    <CardMedia
                      component="img"
                      height="65%"
                      image={result.backdrop_path===null ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : `https://image.tmdb.org/t/p/w500/${result.backdrop_path}`}
                      alt="No Image Found"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {result.title}
                      </Typography>
                      <Typography variant="body" color="text.secondary" sx={{color:"white"}}>
                        {result.overview.slice(0, 60)}...
                      </Typography>
                    </CardContent>
                  </Card>
                );
              }))
            }
          </div>
        </Box>
    </div>
  );
};