import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Pagination from '@mui/material/Pagination';
import './WatchFav.css';

export default function Favourites() {
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currPage, setCurrPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [secondIndex, setSecondIndex] = useState(itemsPerPage);

    const [favourites, setFavourites] = useState();
    const params = useParams();
    const navigate = useNavigate();
    const handlePageChange = (event, page) =>{
      console.log(page);
      setFirstIndex((page-1)*itemsPerPage);
      setSecondIndex(page*itemsPerPage);
    }
    useEffect(() => {
      axios.post(`/api/get-favourites/`, {
        userId: params.userId
      })
      .then((res)=>{
        console.log(res.data);
        setFavourites(res.data.data.favourites);
      })
      .catch((err)=>{
        console.log(err);
      })
    }, [])
    
    return (
        <div style={{height: window.innerHeight}}>
            <h1 style={{color:"white"}}>Favourites</h1>
              <div className="favourite-movie-grid">
                {favourites && favourites.slice(firstIndex, secondIndex).map((movie, i)=>{
                return(
                    <Card onClick={(event) => {
                      navigate(`/movie-detail/${movie.id}/${params.userId}`);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })
                    }}
                    className="favourite-movie-body" 
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
                {
                <Pagination 
                    count={favourites && Math.ceil(favourites.length/itemsPerPage)} 
                    variant="outlined" 
                    color="secondary" 
                    onChange={handlePageChange}
                    // sx={{backgroundColor:"white"}}
                    sx = {{ position: "fixed", bottom: "0", left: "43%", background:"white" }}
                />}
            </div>
          </div>
        )
}
