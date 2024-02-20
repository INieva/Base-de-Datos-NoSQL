USE ESTO: https://www.mongodb.com/docs/manual/reference/sql-comparison/

Para ver todos los documentos de la coleccion:
db.comments.find({})


GUIA 1:

2--Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor
rating (“imdb.rating”) de la década del 90. ¿Cuál es el valor del rating de la película que
tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

db.movies.find({year:/99/}, {title:1, year:1, cast: 1, directors:1, "imdb.rating":1}).sort({"imdb.rating":-1}).limit(10)

¿Cuál es el valor del rating de la película que tiene mayor rating? 
db.movies.find({"imdb.rating":{$type: "double"}}, {title:1, year:1, cast: 1, directors:1, "imdb.rating":1}).sort({"imdb.rating":-1}).limit(1)

3--Listar el nombre, email, texto y fecha de los comentarios que la película con id
(movie_id) ObjectId("573a1399f29313caabcee886") recibió entre los años 2014 y 2016
inclusive. Listar ordenados por fecha. Escribir una nueva consulta (modificando la
anterior) para responder ¿Cuántos comentarios recibió?

db.comments.find({date: {$gte: ISODate("2014-00-00"), $lte:ISODate("2016-12-31")}, movie_id:ObjectId("573a1399f29313caabcee886")}, {name:1, email:1, text:1, date:1}).count()
db.comments.find({movie_id:ObjectId("573a1399f29313caabcee886")}, {name:1, email:1, text:1, date:1}).count()


4--Listar el nombre, id de la película, texto y fecha de los 3 comentarios más recientes
realizados por el usuario con email patricia_good@fakegmail.com.

NOTA: pretty() es uan funcion que me acomoda la visualizacion de los datos.
db.comments.find({email:"patricia_good@fakegmail.com"},{name:1, movie_id:1, text:1, date:1}).limit(3).sort({date:-1}).pretty()

5--Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) y número
de votos (“imdb.votes”) de las películas de géneros Drama y Action (la película puede
tener otros géneros adicionales), que solo están disponibles en un único idioma y por
último tengan un rating (“imdb.rating”) mayor a 9 o bien tengan una duración (runtime)
de al menos 180 minutos. Listar ordenados por fecha de lanzamiento y número de
votos.

db.movies.find({$and:[{genres: "Action"}, {genres: "Drama"}], $or:[{"imdb.rating":{$gt:9}}, {runtime:{$gte:180}}], languages:{$size:1} }, {title:1, languages: 1, genres:1, released:1, "imdb.votes":1}).sort({date:1}, {"imdb.votes":1}).pretty()

6--Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad
(“location.address.city”), y coordenadas (“location.geo.coordinates”) de los teatros que
se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades
comienza con una ‘F’. Listar ordenados por estado y ciudad.

db.theaters.find({$or:[{"location.address.state":"CA"},{"location.address.state":"TX"},{"location.address.state":"NY"}], "location.address.city":/^F/},{theaterId:1,"location.address.state":1, "location.address.city":1, "location.geo.coordinates":1}).sort({"location.address.state":1}, {"location.address.cty":1}).pretty()


7--Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es
ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual
respectivamente.
El documento tenia:
{
	"_id" : ObjectId("5b72236520a3277c015b3b73"),
	"name" : "foobar",
	"email" : "foobar@baz.com",
	"movie_id" : ObjectId("573a13eff29313caabdd82f3"),
	"text" : "nope",
	"date" : ISODate("2018-08-13T20:33:41.869Z")
}

Luego de la actualizacion via:
db.comments.updateOne({_id:ObjectId("5b72236520a3277c015b3b73")},{$set:{text:"mi mejor comentario"}, $currentDate:{date:true}})

queda:
{
	"_id" : ObjectId("5b72236520a3277c015b3b73"),
	"name" : "foobar",
	"email" : "foobar@baz.com",
	"movie_id" : ObjectId("573a13eff29313caabdd82f3"),
	"text" : "mi mejor comentario",
	"date" : ISODate("2022-10-31T14:54:09.889Z")
}


8--Actualizar el valor de la contraseña del usuario cuyo email es
joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder
insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos
veces. ¿Qué operación se realiza en cada caso? (Hint: usar upserts).

const query ={email: "joel.macdonel@fakegmail.com"};
const update = {$set:{email: "some password"}}
const options = {upsert: true};
db.users.updateOne(query, update, options);

En la primera ejecucion crea un nuevo usuario pues, no existe un usuario con email: "joel.macdonel@fakegmail.com"
db.users.updateOne({email: "joel.macdonel@fakegmail.com"},{$set:{email: "joel.macdonel@fakegmail.com", password: "some password"}},{upsert:true})

En la segunda como el usuario ya existe, cambia la contrasenia.
db.users.updateOne({email: "joel.macdonel@fakegmail.com"},{$set:{email: "joel.macdonel@fakegmail.com", password: "some password 2"}},{upsert:true})

9--Remover todos los comentarios realizados
victor_patel@fakegmail.com durante el año 1980.

db.comments.deleteMany({email: "victor_patel@fakegmail.com", date:{$gte: ISODate("1980-00-00"), $lte:ISODate("1980-12-31")}})



PARTE: 2
10--Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde
al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, y
que tenga una puntuación (score) mayor a 70 y menor o igual a 90.

db.restaurants.find({$and :[{"grades.date": {$gte: ISODate("2014-01-01"), $lte:ISODate("2015-01-31")}} ,{"grades.score":{$gt:70, $lte:90}}] },{restaurant_id:1, grades:1} ).pretty()

db.restaurants.find({ "grades.date": {$gte: ISODate("2014-01-01"), $lte:ISODate("2015-01-31")} , "grades.score":{"$gt":70, "$lte":90} },{restaurant_id:1, grades:1} ).pretty()



db.restaurants.find(
    {
        grades: {
            $elemMatch: {
                date: {"$gte": ISODate("2014-01-01"), "$lte": ISODate("2015-01-31") }, 
                score: {"$gt": 70, "$lte": 90}
            } 
        }
    },
    {restaurant_id:1, grades: 1}
)


PRACTICO 8

1--db.theaters.aggregate([{$group: {_id: {estado: "$location.address.state"} , cantidad: { $count: { } } } } ])

2--Cantidad de estados con al menos dos cines (theaters) registrados.

db.theaters.aggregate([{$group: {_id: {estado: "$location.address.state"}, c:{$count:{}}   }}])


db.theaters.aggregate([{$group: {_id: {estado: "$location.address.state"}, c:{$count:{}}}])


3--Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin pipeline de
agregación, realizar ambas queries.

sin pipeline: db.movies.find({directors:"Louis Lumière"},{}).count()
con pipeline: db.movies.aggregate([{$match:{directors:"Louis Lumière"}},{$count:"Num of movies"}])

4--Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959). Se puede
responder sin pipeline de agregación, realizar ambas queries.

db.movies.find({year:{$gte:1950, $lte:1959}},{}).count()

db.movies.aggregate([{$match:{"year":{$gte:1950, $lte:1959}}}, {$count:"Num of movies 50's"}])

5-- Listar los 10 géneros con mayor cantidad de películas (tener en cuenta que las películas
pueden tener más de un género). Devolver el género y la cantidad de películas. Hint:
unwind puede ser de utilidad.

db.movies.aggregate([{$unwind: "$genres"},{$group:{_id: {genero:"$genres"}, cantidad:{$count:{}}}},{$sort:{"cantidad":-1}},{$limit:10} ])

6--Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y
Cantidad de Comentarios.

db.comments.aggregate([{$group: {_id: {nombre: "$name", mail:"$email"}, comentarios:{$count:{}}}}, {$sort:{"comentarios":-1}}, {$limit:10}])

7--Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en
los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del
año.

db.movies.aggregate([{$match:{"year":{$gte:1980, $lt:1990}}},{ $group:{_id:{year: "$year"}, promedio:{$avg:"$imdb.rating"}, minimo:{$min:"$imdb.rating"}, maximo:{$max:"$imdb.rating"}}}, {$sort:{"promedio":-1}}])

REVISAR: tipo de datos que sea double.

8--Título, año y cantidad de comentarios de las 10 películas con más comentarios.
db.comments.

db.movies.aggregate([
  {
    $lookup:{
      from: "comments", 
      localField: "_id", 
      foreignField:"movie_id", 
      as: "moviesAndComm"
    }
  },
  {$project: {  
    title:1,	  	
    comentarios: {$size:"$moviesAndComm"}	
   }
  }, 
  {$sort:{"comentarios":-1}},
  {$limit:10} 
])



11--Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento de
la película comentada, mostrando Nombre, Email, fecha del comentario, título de la
película, fecha de lanzamiento. HINT: usar $lookup con multiple condiciones





12--Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y
total. Se puede asumir que el restaurant_id es único.
a. Resolver con $group y accumulators.
b. Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
c. Resolver como en el punto b) pero usar $reduce para calcular la puntuación
total.
d. Resolver con find.

a)
db.restaurants.aggregate([
	{
		$unwind:"$grades"
	},
	{
		$group:{_id:{res_id: "$restaurant_id", name: "$name"},minimo: {$min:"$grades.score"}, maximo:{$max: "$grades.score"}, total:{$sum:"$grades.score"}}
	}
])


b)
db.restaurants.aggregate([
  {
    $project:{
      _id:0, restaurant_id:1, name:1, min_score: {$min: "$grades.score"}, max_score: {$max: "$grades.score"}, total_score: {$sum: "$grades.score"}  
    }
  }
])

IVAN R:
db.restaurants.aggregate([
  {
    $project: {
      restaurant_id: 1,
      name: 1,
      max_score: { $max: "$grades.score" },
      min_score: { $min: "$grades.score" },
      total_score: { $sum: "$grades.score" }
    }
  }
])

c)
db.restaurants.aggregate([
  {
    $project:{
      _id:0, restaurant_id:1, name:1, min_score: {$min: "$grades.score"}, max_score: {$max: "$grades.score"}, 
      total_score: {
        $reduce: {input:"$grades.score", initialValue:{sum:0}, in:{sum:{$add:["$$value.sum", "$$this"]}}
        } 
      }  
    }
  }
])


d)
db.restaurants.find(
	{},
	{
		"restaurant_id":1,
		"name":1, 
	 	minimo: {$min:"$grades.score"},
	 	maximo:{$max:"$grades.score"}, 
		total:{$sum:"$grades.score"}
	}
)







--------------------------------
db.comments.aggregate([ 
  { 
    $lookup: { 
      from: 'movies', 
      localField: 'movie_id', 
      foreignField: '_id', 
      let: { comment_date: "$date" }, 
      pipeline: [ 
        { $match: {'released': {$exists: true}}}, 
        { $match: { $expr: { $eq: [{ $month: "$$comment_date" }, { $month: "$released" }]}}}, 
        { $project: { _id: 1, released: 1, title: 1 } } 
        ], 
      as: "moviedata" 
    } 
  }, 
  { 
    $unwind: '$moviedata' 
  }, 
  { 
    $project: {name: 1, email:1, date:1, movie_date: '$moviedata.released', movie_title: '$moviedata.title', _id: 0} 
  } 
])


{ 
$lookup: { 
from: <joined collection>,         
let: { <var1>: <expression>, … , <varN>: <expression> },
pipeline: [ <pipeline to run joined collection> ], 
as : <output array field>
} 
}















