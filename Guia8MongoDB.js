Para ver las reglas de validacion: db.getCollectionInfos("<collection>")

db.createCollection("employees", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "name", "age" ],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 3,
                    description: "full name of the employee and is required"
                },
                age: {
                    bsonType: "int",
                    minimum: 16,
                    description: "age of the employee and is required"
                },
                category: {
                    enum: [ "Full-time","Part-time", "Temporary" ],
                    description: "can only be one of the enum values if the field exists"
                }
            }
        }
    }
} )


db.runCommand( {
   collMod: "contacts",
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "phone", "name" ],
      properties: {
         phone: {
            bsonType: "string",
            description: "phone must be a string and is required"
         },
         name: {
            bsonType: "string",
            description: "name must be a string and is required"
         }
      }
   } },
   validationLevel: "moderate",
   validationAction: "error"
} )

1-- Especificar en la colección users las siguientes reglas de validación: El campo name
(requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe
ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" ,
password (requerido) debe ser un string con al menos 50 caracteres.

db.runCommand({
	collMod: "users",
	validator: { $jsonSchema:{
		bsonType: "object",
		required: ["name","email","password"],
		properties: {
			name: {
				bsonType: "string",
				maxLength:30,
				description: "nombre es requerido."
			},
			email: {
				bsonType: "string",
				pattern: "^(.*)@(.*)\\.(.{2,4})$", 
				description: "email requerido y debe matchear con la expresion regular."
			},
			password: {
				bsonType: "string",
				minLength: 50,
				description: "password requerido con long min de 50."
			}
		}
	}},
	validationLevel: "moderate",
	validationAction: "error"	
})


2--Obtener metadata de la colección users que garantice que las reglas de validación
fueron correctamente aplicadas.


3--Especificar en la colección theaters las siguientes reglas de validación: El campo
theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:

a. un campo address (requerido) que sea un object con campos street1, city, state
y zipcode todos de tipo string y requeridos

b. un campo geo (no requerido) que sea un object con un campo type, con valores
posibles “Point” o null y coordinates que debe ser una lista de 2 doubles.

Por último, estas reglas de validación no deben prohibir la inserción o actualización de
documentos que no las cumplan sino que solamente deben advertir.

db.runCommand({
	collMod: "theaters",
	validator: { $jsonSchema:
	{
		bsonType: "object",
		required: ["theaterId", "location"],
		properties: {
			theaterId: {
				bsonType: "integer"
			},
			location: {
				bsonType: "object",
				properties: {
					address: "object",
						properties: {
							street1: "string",
							city: "string",
							state: "string",
							zipcode: "string",
							
						},
						required: ["street1", "city", "state", "zipcode"],
						
					geo: "object",
						properties:{
							type: bsonType:{ ["Point", "null"]},
							coordinates:{ bsonType: ["double", "double"]}
						}
				},
				
			}
		
		}
	}
	
	
	},
	validationLevel: "moderate",
	validationAction:"error"
})

4--Especificar en la colección movies las siguientes reglas de validación: El campo title
(requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000,
y que tanto cast, directors, countries, como genres sean arrays de strings sin
duplicados.
a. Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora
de insertar documentos. Recordar que mongo shell es un intérprete javascript y
en javascript los literales numéricos son de tipo Number (double).

db.runCommand({
	collMod: "movies",
	validator: { $jsonSchema: {
					bsonType: "object",
					required: ["title","year"],
					properties: {
						title: {
							bsonType: "string", 
							description: "Titulo es un string y es requerido."
						},
						year: {
							bsonType: "int",
							minimum: 1900,
							maximum: 3000,
							description: "year es requerido y va entre 1900-3000"
						},
						cast: {
							bsonType: "array"
						}, 
						directors: {
							bsonType: "array"
						},
						countries: {
							bsonType: "array"
						},
						genres: {
							bsonType: "array"
						}
					}
					
				}},
	validationLevel: "moderate",
	validationAction: "error"
})


--5 Crear una colección userProfiles con las siguientes reglas de validación: Tenga un
campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno
de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo
favorite_genres (no requerido) que sea un array de strings sin duplicados.

db.createCollection("userProfiles", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["user_id", "language"],
			properties:{
				user_id: {
					bsonType: "objectId",
					description: "user_id es required."
				},
				language: {
					enum: ["English", "Spanish", "Portuguese"],
					description: "can only be one of the enum values if the field exists."
				},
				favorite_genres: {
					bsonType: "array"
				}
			}
		}
	}, 
	validationLevel: "moderate", 
	validationAction: "error" 
})




db.createCollection("employees", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "name", "age" ],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 3,
                    description: "full name of the employee and is required"
                },
                age: {
                    bsonType: "int",
                    minimum: 16,
                    description: "age of the employee and is required"
                },
                category: {
                    enum: [ "Full-time","Part-time", "Temporary" ],
                    description: "can only be one of the enum values if the field exists"
                }
            }
        }
    }
} )


























"theaterId" : 1000,
	"location" : {
		"address" : {
			"street1" : "340 W Market",
			"city" : "Bloomington",
			"state" : "MN",
			"zipcode" : "55425"
		},
		"geo" : {
			"type" : "Point",
			"coordinates" : [
				-93.24565,
				44.85466
			]
		}
	}
}






{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [ "length", "width", "height" ]
    }
  },
  "required": [ "productId", "productName", "price" ]
}













