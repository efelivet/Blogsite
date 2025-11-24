 import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Link} from 'react-router-dom';

const options = ['News', 'Tech','Sport','Video'];

export default function ControllableStates() {
  const [value, setValue] = React.useState(options[0]);
  

  return (
    <div>
     
     
      <br />
      <Autocomplete
       
        id="controllable-states-demo"
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params}  />}

        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
     
      />
      {value && (<Link to={value} style={{display:'inline-block',
        marginTop:'10px',color:'#1976d2',
        textDecoration:'none',fontWeight:'bold',}}>
        {value}
        </Link>)}
    </div>
    
  );
}