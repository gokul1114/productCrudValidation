import './App.css';
import { Link, Route, Switch, useHistory, useParams} from "react-router-dom";
import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as yup from "yup"


const URL = 'https://6191a91141928b00176900f1.mockapi.io/product/';
function App() {
  return (
   <div>
   <ul>
     <li>
       <Link to = "/">Home</Link>
     </li>
     <li>
       <Link to = "/add">Add Prduct</Link>
     </li>
   </ul>

   <Switch>
        <Route exact path = "/">
          <Display />
        </Route>
        <Route path = "/add">
          <AddProduct />
        </Route>
        <Route path = "/edit/:id">
          <EditProduct />
        </Route>
   </Switch>
   </div>
  );
}

function Display() {

const[apiResult, setApiResult] = useState([]);
const history = useHistory();

useEffect(() => {
  console.log("inside Display useEffect")
  fetch(URL)
  .then(data => data.json())
  .then(result => {
    setApiResult(result);
  console.log(result)
})
}, [])

const deleteData = (id) => {
  fetch(URL+id,
  {
    method : 'DELETE'
  })
  .then(result => result.json())
  .then(data => {
    console.log(data)
    getApi()
  })
}

const getApi = () => {
  fetch(URL)
  .then(data => data.json())
  .then(result => {
    setApiResult(result);
  console.log(result)
})
}
 return(
  <div>
    <table>
      <thead>
      <tr>
        <th>id</th>
        <th>Name</th>
        <th>Price</th>
        <th>Rating</th>
      </tr>
      </thead>
      <tbody>
        {apiResult.map((e,index) => {
          return <tr key = {index}>
                    <td>{e.id}</td>
                    <td>{e.name}</td>
                    <td>{e.price}</td>
                    <td>{e.rating}</td>
                    <td>
                      <Button variant="contained" color="success" onClick = {() => history.push("/edit/"+e.id)}>edit</Button>
                      <Button variant="outlined" color="error" onClick = {() => {deleteData(e.id)}}>delete</Button>
                    </td>
                 </tr>
        })}
      </tbody>
    </table>
  </div>
 );  
}

function AddProduct() {
  const history = useHistory();
  
  // let data = { name,price,rating }
 const addData = ({name, price, rating}) =>{
  let data = { name,price,rating }
  fetch(URL,
  {
   method : 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data)
   })
  .then(data => data.json())
  .then(result => 
   {
     console.log("update result" + JSON.stringify(result))
     history.push("/")
     
   })
 }
 const productValidationSchema = yup.object({
  name : yup
  .string()
  .required(),
  rating : yup
  .number()
  .min(1)
  .max(5),
  price : yup
  .number()
  .required()
  .min(1)

})
const {handleSubmit, handleChange, handleBlur, values, errors, touched} = useFormik({
 initialValues : {
   id : '',
   name : '',
   price : '',
   rating : ''
 },
 validationSchema : productValidationSchema,
 onSubmit : (values) => {
  addData(values)
 }
})
return(
 <div>
   <form onSubmit = {handleSubmit}>
   <TextField id = "name" name = "name"  label="name" 
   value = {values.name} type = "text" 
   onChange = {handleChange} onBlur = {handleBlur}
   error = {errors.name && touched.name}
   helperText = {errors.name} />
   <TextField id = "price" name = "price" label="price" 
   value = {values.price} type = "text"
    onChange = {handleChange} onBlur = {handleBlur}
    error = {errors.price && touched.price}
    helperText = {errors.price} />
   <TextField id = "rating" name = "rating" label="rating" 
   value = {values.rating} type = "text" 
   onChange = {handleChange} onBlur = {handleBlur}
   error = {errors.rating && touched.rating}
   helperText = {errors.rating} />
   <Button variant="contained" type = "submit" >Done</Button>
   </form>
 </div>
);   
}

function EditProduct() {
  
  const history = useHistory();
    
  let {id} = useParams()
  
 const[apiResult, setApiResult] = useState(null);
 
 useEffect(()=>{
  console.log(id);
  if(id !== '') {
  fetch(URL+id)
  .then(data => data.json())
  .then(result => setApiResult(result));
  }
 },[])
 
//  useEffect(() => {
  
//   setName(apiResult.name);
//   setPrice(apiResult.price);
//   setRating(apiResult.rating);
//  },[apiResult])
 //const [id_, setId] = useState(apiResult.id);

return apiResult ? <EditProductForm apiResult = {apiResult} />: "";
}

function EditProductForm({apiResult}) {
  

//  const data = {apiResult.id, apiResult.name, price, rating}
 //console.log(data)
 const history = useHistory();
 const update = ({id,name, price, rating}) => {
   const data = {name, price, rating};
   fetch(URL+id,
   {
    method : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
    })
   .then(data => data.json())
   .then(result => 
    {
      console.log("update result" + JSON.stringify(result))
      history.push("/")
    })
 }
 const productValidationSchema = yup.object({
   name : yup
   .string()
   .required(),
   rating : yup
   .number()
   .min(1)
   .max(5),
   price : yup
   .number()
   .required()
   .min(1)

 })
 const {handleSubmit, handleChange, handleBlur, values, errors, touched} = useFormik({
  initialValues : {
    id : apiResult.id,
    name : apiResult.name,
    price : apiResult.price,
    rating : apiResult.rating
  },
  validationSchema : productValidationSchema,
  onSubmit : (values) => {
    update(values)
  }
})
 return(
  <div>
    <form onSubmit = {handleSubmit}>
    <TextField id = "name" name = "name"  label="name" 
    value = {values.name} type = "text" 
    onChange = {handleChange} onBlur = {handleBlur}
    error = {errors.name && touched.name}
    helperText = {errors.name} />
    <TextField id = "price" name = "price" label="price" 
    value = {values.price} type = "text"
     onChange = {handleChange} onBlur = {handleBlur}
     error = {errors.price && touched.price}
     helperText = {errors.price} />
    <TextField id = "rating" name = "rating" label="rating" 
    value = {values.rating} type = "text" 
    onChange = {handleChange} onBlur = {handleBlur}
    error = {errors.rating && touched.rating}
    helperText = {errors.rating} />
    <Button variant="contained" type = "submit" >Done</Button>
    </form>
  </div>
 ); 
}




export default App;
