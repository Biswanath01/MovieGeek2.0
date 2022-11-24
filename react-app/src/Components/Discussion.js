import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { Button, TextField } from "@mui/material";

export default function Discussion(){
    const [message, setMessage] = useState();
    const params = useParams();
    const [commentData, setCommentData] = useState();
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        axios.post(`/api/get-comments/`, {
            movieId: params.movieId
        })
            .then((res)=>{
                console.log(res.data);
                setCommentData(res.data.comments);
            })
            .catch((err) => console.log(err));
    }, [changed]);

    const handleAddComment = (event) => {
        event.preventDefault();
        axios.post(`/api/add-comment/`, {
            userId: params.userId,
            movieId: params.movieId,
            message: message
        })
            .then((res) => {
                console.log(res);
                setChanged(prev => !prev);
            })
            .catch((err) => console.log(err));
    }
    return(
        <div style={{height: window.innerHeight, width: "100%"}}>
            <h1 style={{color:"white", marginBottom: "20px"}}>Discussion forum</h1>
            <form onSubmit={handleAddComment}>
                <TextField 
                    required 
                    id="outlined-basic" 
                    label="Add Comment" 
                    variant="outlined" 
                    sx={{ marginBottom: "30px", marginRight: "5%" }} 
                    onChange={(event) => setMessage(event.target.value)} 
                    InputProps={{
                        style: {
                            backgroundColor: "white",
                            height: "40px",
                            width: "100%",
                            marginTop: "3.5%",
                            
                        }
                    }}
                />
                <Button variant='contained' type="submit" sx={{marginTop: "1%"}}>Add Comment</Button>
            </form>
            {commentData && commentData.map((comment, index)=>{
                let time = new Date(comment.comment.creationDate).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
                return(
                  <Card sx={{ maxWidth: "100vw", textAlign: "left", margin: "2%", backgroundColor:"blanchedalmond" }} key={index}>
                    <CardHeader
                      avatar={
                        <Avatar 
                          sx={{ border: "5px solid black" }} 
                          aria-label="avatar" 
                          src = {comment.dp}
                        />
                      }
                      title={comment.comment.authorName}
                      subheader={time}
                      titleTypographyProps = {{
                        fontSize: "17px"
                      }}
                      subheaderTypographyProps = {{
                        fontSize: "17px"
                      }}
                    />
                    <CardContent>
                        <Typography>
                            {comment.comment.message}
                        </Typography>
                    </CardContent>
                  </Card>
                )
            })}
        </div>

    );
};