# PATRONES DE TIPEO FRONT-END

Este proyecto pertenece a la quinta semana de Redes Neuronales

## Running

Para ejecutar el proyecto, puedes iniciarlo dando clic en la siguiente línea:

### `npm start`

Para abrir la ruta donde se ejecuta se encuentra disponible en
[http://localhost:3000](http://localhost:3000), puede revisarlo en su ordenador preferido.

La página se volverá a cargar cuando realice cambios.\
También puede ver los errores en la consola.

### Importación de librerías 
```jsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
```
### **Metodos usados:**

Devuelve la fecha eb formato _**YYYY-MM-DD**_
```jsx
new Date().toISOString().split("T")[0]
```
Ordena de mayor o menor o viceversa un objeto de acuerdo a la variable que se le designe
```jsx
data.sort((a, b) => b.code - a.code);
```
Actualiza la página 
```jsx
window.location.reload();
```
Dar formato a numero casteado de un String
```jsx
<td>{parseFloat(t.t2).toFixed(2)}</td>
```