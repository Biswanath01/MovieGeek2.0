import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './Home.css';
import Pagination from '@mui/material/Pagination';
import logo from './logo.png';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Button from "@mui/material/Button";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { _ } from "lodash";

export default function MovieDetail(){
  const params = useParams();
  const movieId = params.movieId;
  const [reviewsData, setReviewsData] = useState();
  const [movieData, setMovieData] = useState();
  const [similarMoviesData, setSimilarMoviesData] = useState();
  const [baseUrl, setBaseUrl] = useState('https://api.themoviedb.org/3/');
  const [sliceIndex, setSliceIndex] = useState(5);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currPage, setCurrPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(itemsPerPage);
  const [typing, setTyping] = useState(false);
  const [queryResults, setQueryResults] = useState();
  const [query, setQuery] = useState("");
  const [addedToFav, setAddedToFav] = useState();
  const [favs, setFavs] = useState();
  const [addedToWatch, setAddedToWatch] = useState();
  const [watch, setWatch] = useState();
  const [displayReview, setDisplayReview] = useState(300);
  const API_KEY = "db75be3f6da59e6c54d0b9f568d19d16";
  const navigate = useNavigate();
  const handlePageChange = (event, page) =>{
    console.log(page);
    setFirstIndex((page-1)*itemsPerPage);
    setSecondIndex(page*itemsPerPage);
  }

  const handleAddtoFav=(event, movie)=>{
    axios.post(`/api/add-to-favourites/`, {
      userId: params.userId,
      movie: movie
    })
    .then((res)=>{
      console.log(res.data);
      if(res.data.message && res.data.message === "Added movie to favourites"){
        toast.success(`Successfully ${res.data.message}`);
        setAddedToFav(prev => !prev);
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  
  useEffect(() => {
    const getFavs = async () => {
      axios.post(`/api/get-favourites/`, {
        userId: params.userId
      }) 
        .then((res) => {
          console.log(res);
          let arr = [];
          res.data.data.favourites.map((obj, i) => {
            arr.push(obj.id);
          })
  
          setFavs(arr);
        })
        .catch((err) => console.log(err));
    }

    getFavs();
  }, [addedToFav]);

  const handleAddtoWatch=(event, movie)=>{
    axios.post(`/api/add-to-watchlist/`, {
      userId: params.userId,
      movie: movie
    })
    .then((res)=>{
      console.log(res.data);
      if(res.data.message === "Added movie to watchlist"){
        toast.success(`Successfully ${res.data.message}`);
        setAddedToWatch(prev => !prev);
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  const handleRemovefromWatchList=(event, movie) => {
    axios.post(`/api/remove-from-watchlist/`, {
      userId: params.userId,
      movie: movie
    })
      .then((res) => {
        console.log(res.data);
        if(res.data.message === "Successfully removed from watchlist"){
          setAddedToWatch(prev => !prev);
          toast.success(`${res.data.message}`);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveFromFav = (event, movie) => {
    axios.post(`/api/remove-from-favourites/`, {
      userId: params.userId,
      movie: movie
    })
      .then((res) => {
        console.log(res.data);
        if(res.data.message === "Removed movie from favourites"){
          setAddedToFav(prev => !prev);
          toast.success(`Successfully ${res.data.message}`);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const getWatch = () => {
      axios.post(`/api/get-watchlist/`, {
        userId: params.userId
      }) 
        .then((res) => {
          console.log(res);
          let arr = [];
          res.data.data.moviesToWatch.map((obj, i) => {
            arr.push(obj.id);
          })
  
          setWatch(arr);
        })
        .catch((err) => console.log(err));
    }

    getWatch();
  }, [addedToWatch]);

  useEffect(() => {
    axios.get(`${baseUrl}/movie/${movieId}?api_key=${API_KEY}`)
      .then((res) => {
        console.log(res.data);
        setMovieData(res.data);
      })
      .catch((err)=>{
        console.log(err);
      });

    axios.get(`${baseUrl}/movie/${movieId}/reviews?api_key=${API_KEY}`)
      .then((res) => {
        console.log(res);
        setReviewsData(res.data.results);
      })
      .catch((err) => console.log(err));

    axios.get(`${baseUrl}/movie/${movieId}/similar?api_key=${API_KEY}`)
      .then((res)=>{
        console.log(res);
        setSimilarMoviesData(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [movieId]);

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
  }, [query]);

  return(
    <div>
      <AppBar position="static" sx={{ height: `12.5vh` }}>
        <Toolbar>
              <img className="logo" src={logo} onClick={()=>{
                navigate("/");
              }}/>
              <h1 className="movie-geek" onClick={()=>{
                navigate("/");
              }}>MovieGeek</h1>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <TextField 
                  label="" 
                  color="secondary" 
                  placeholder="Search..." 
                  sx={{margin: 5, backgroundColor: "rgba(0, 0, 0, 0.5)"}} 
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
            </Toolbar>
      </AppBar>
      <Button variant="contained" onClick={(event)=>{
        navigate(`/discussion/${movieData.id}/${params.userId}`)
      }} sx={{margin:"1%"}}>Discussion Forum</Button>
      {typing === false && movieData && <div>
          <div style={{display: "flex"}}>
              <img className="movie-details-image" src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} style={{width:"25%",  margin: "20px", padding: "10px"}}/>
              
            
            <div className="movie-details-body"  style={{ margin: "20px", padding: "10px", textAlign: "left", color:"white"}}>
              <h1>{movieData.original_title}</h1>
              {movieData.homepage ? <div style={{ display: "flex" }}>
                <a 
                  href={movieData.homepage}
                  style={{textDecoration: "none", margin: "5% 5% 5% 0%"}}
                >
                    Official Website
                </a>
                <OpenInNewIcon sx={{marginTop: "5%"}}/>
              </div> : null}
              <p style={{marginBottom: "15%"}}>{movieData.genres.map((genre, index) => {
                  return <span key={index}>{genre.name}{index !== movieData.genres.length - 1 ? ', ' : ''}</span>
              })}</p>
              <p style={{marginBottom: "15%"}}>{movieData.original_language.toUpperCase()}</p>
              <p style={{marginBottom: "15%"}}>{movieData.popularity}</p>
              <p style={{marginBottom: "15%"}}>Release Date: {movieData.release_date}</p>
              <p style={{marginBottom: "15%"}}>{movieData.production_countries && movieData.production_countries[0].name}</p>
              <p style={{marginBottom: "15%"}}>Budget: {movieData.budget}</p>
              <p style={{marginBottom: "15%"}}>Revenue: {movieData.revenue}</p>
              <p style={{marginBottom: "15%"}}>Vote Count: {movieData.vote_count}</p>
              <p style={{marginBottom: "15%"}}>Vote Average: {movieData.vote_average}</p>
            </div>
          </div>
          <div className="addfavwatch" style={{marginLeft: "4%"}}>
            {console.log(favs)}
            {/* Adding to Favourites */}
            {favs && favs.includes(movieData.id) ? 
              <Button variant="contained" sx={{margin: "5px"}} onClick={(event) => handleRemoveFromFav(event, movieData)}>Remove from favourites</Button> : 
              <Button variant="contained" sx={{margin: "5px"}} onClick={(event)=>{
                handleAddtoFav(event, movieData);
              }}>
                Add to Favourites <FavoriteIcon/>
            </Button>}
            {/* Add to WatchList */}
            {console.log(watch)}
            {watch && watch.includes(movieData.id) ? 
              <Button variant="contained" sx={{margin: "5px"}} onClick={(event)=>{
                handleRemovefromWatchList(event, movieData);
              }}>Remove from WatchList</Button> : 
              <Button variant="contained" sx={{margin: "5px"}} onClick={(event)=>{
                handleAddtoWatch(event, movieData);
              }}>
                Add to WatchList <AddIcon/>
            </Button>
            }
          </div>
          <h2 style={{textAlign: "left", margin: "20px", padding: "10px", color:"white"}}>{movieData.tagline}</h2>
          <h3 style={{textAlign: "left", margin: "20px", padding: "10px", color:"white"}}>{movieData.overview}</h3>
          <h2 style={{color:"white"}}>Reviews: </h2>
          {reviewsData && reviewsData.length > 0 ? reviewsData.slice(0,sliceIndex).map((review, i) => {
            let time = new Date(review.created_at).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
            return(
              <Card sx={{ maxWidth: "100vw", textAlign: "left", margin: "2%", backgroundColor:"blanchedalmond" }} key={i}>
                <CardHeader
                  avatar={
                    <Avatar 
                      sx={{ border: "5px solid black" }} 
                      aria-label="avatar" 
                      src = 
                        {review.author_details.avatar_path && review.author_details.avatar_path.includes('https') ? 
                          review.author_details.avatar_path.slice(1) : 
                          `https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}`}
                    />
                  }
                  title={review.author}
                  subheader={review.author_details.rating ? `${review.author_details.rating} ⭐ || ${time}` : time}
                  titleTypographyProps = {{
                    fontSize: "17px"
                  }}
                  subheaderTypographyProps = {{
                    fontSize: "17px"
                  }}
                />
                <CardContent>
                  <a style={{textDecoration: "none", color:"black"}} href={review.url}>{review.content.slice(0, displayReview)}{displayReview < review.content.length ? "..." : null} </a>
                  {displayReview < review.content.length && <Button variant="contained" onClick={(event) => setDisplayReview(prev => prev + 300)}>Read More</Button>}
                </CardContent>
              </Card>
            )
          }) : <p style={{color:"white", margin: "0.5%"}}>No Reviews Found</p>}
        </div>}

        {typing === false && reviewsData && reviewsData.slice(sliceIndex).length > 1 ? 
          <Button 
            sx={{cursor: "pointer", margin: "2%"}} 
            onClick={(event)=>{
              setSliceIndex(prev=> prev + 5);
            }}
            variant="contained"
            color="secondary"
          >
            Show more Reviews
          </Button>
          : null
        }

        {typing === false && <h2 style={{color:"white", margin: "3%"}}>Similar Movies</h2>}
        <div className="similar-movie-grid">
            {typing === false && similarMoviesData && similarMoviesData.slice(firstIndex, secondIndex).map((movie, i)=>{
              return(
                <Card onClick={(event) => {
                  navigate(`/movie-detail/${movie.id}/${params.userId}`);
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
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
                key={i}
                >
                  <CardMedia
                    component="img"
                    height="65%"
                    image={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                    alt="movie-backdrop"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {movie.original_title}
                    </Typography>
                    <Typography variant="body" sx={{color:"white"}}>
                      {movie.overview.slice(0,60)}...
                    </Typography>
                  </CardContent>
                </Card>
              )
            })}
            {typing === false && <Pagination 
              count={similarMoviesData && Math.ceil(similarMoviesData.length/itemsPerPage)} 
              variant="outlined" 
              color="secondary" 
              onChange={handlePageChange}
              sx = {{ position: "fixed", bottom: "0", left: "43%", background:"white" }}
            />}
        </div>
        {
          typing === true && queryResults && queryResults.length === 0 ? <h2 
            style={{display: "flex", textAlign:"center", alignItems:"center", justifyContent:"center", margin:"20%", color: "white"}}
          >
            No Such Movie!
          </h2>
          :(typing && queryResults && queryResults.length > 0 && queryResults.slice(firstIndex, secondIndex).map((result, index) => {
            return(
              <Card 
                onClick={(event) => navigate(`/movie-detail/${result.id}/${params.userId}`)}
                className="search-movie-grid similar-movie-body" 
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
                  maxWidth: "350px",
                  
                  display: "flex",
                  flexDirection: "column",
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
        {
          typing && <Pagination 
            sx = {{ position: "fixed", bottom: "0", left: "43%", background:"white" }}
            count={queryResults && Math.ceil(queryResults.length/itemsPerPage)} 
            variant="outlined" 
            color="primary" 
            onChange={handlePageChange}
          />
        }
        <ToastContainer />
    </div>
  );
};