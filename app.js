const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
module.exports = app;
app.listen(3000);
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeAndConnectDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeAndConnectDb();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const returnName = (object) => {
  return { movieName: object.movie_name };
};
const returnDirector = (object) => {
  return {
    directorId: object.director_id,
    directorName: object.director_name,
  };
};
const returnMovieName = (object) => {
  return {
    movieName: object.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovies = `
        select
            *
        from
           movie
        order by 
           movie_id
        `;
  const movies = await db.all(getMovies);
  response.send(movies.map((each) => returnName(each)));
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
     INSERT  INTO
        movie (director_id,movie_name,lead_actor)
     VALUES
     ('${directorId}',
        '${movieName}',
        '${leadActor}');
     `;
  await db.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    select
     *
     from
     movie
     where
     movie_id=${movieId}
    `;
  const movieDetails = await db.get(getMovieQuery);
  response.send(convertDbObjectToResponseObject(movieDetails));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const putMovieQuery = `
    update
        movie
    set
        director_id='${directorId}',
        movie_name='${movieName}',
        lead_actor='${leadActor}'
    where
        movie_id='${movieId}';
    `;
  await db.run(putMovieQuery);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
    DELETE FROM
        movie
    WHERE 
        movie_id='${movieId}';
    `;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});
app.get("/directors/", async (request, response) => {
  const getDirectors = `
        select
            *
        from
           director
        order by 
           director_id
        `;
  const directorNames = await db.all(getDirectors);
  response.send(directorNames.map((each) => returnDirector(each)));
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieNames = `
    SELECT 
        *
    FROM
        movie
    WHERE   
        director_id='${directorId}';
    `;
  const movieName = await db.all(getMovieNames);
  response.send(movieName.map((each) => returnMovieName(each)));
});
