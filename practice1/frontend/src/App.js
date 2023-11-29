// Import everything needed to use the `useQuery` hook
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from "react";
import { ColorMutated } from './Subscription';

const GET_COLORS  = gql`
  query Colors {
    colors {
      color
      colorCode
    }
  }
`;

const CREATE_COLOR  = gql`
mutation CreateColor($input: CreateColorInput!) {
  createColor(input: $input)
}
`;

const UPDATE_COLOR  = gql`
mutation UpdateColor($input: UpdateColorInput!) {
  updateColor(input: $input)
}
`;

const DELETE_COLOR  = gql`
mutation DeleteColor($input: DeleteColorInput!) {
  deleteColor(input: $input)
}
`;


export default function App() {
  const { loading:query_loading, error:query_error, data:query_data, refetch } = useQuery(GET_COLORS);
  const [createColor] = useMutation(CREATE_COLOR);
  const [updateColor] = useMutation(UPDATE_COLOR);
  const [deleteColor] = useMutation(DELETE_COLOR);
  
  const [color, setColor] = useState("");
  const [colorCode, setColorCode] = useState("");
  
  const formSubmit = ({ color, colorCode }) => {
    setColor("");
    setColorCode("");
    if(colorCode===""){
      deleteColor({
        variables: {
          input: {
            color: color
          }
        }
      });
      return;
    }
    
    colorCode = colorCode.split(',').map((str)=>parseInt(str));
    createColor({
      variables: {
        input: {
          color: color,
          colorCode: colorCode
        }
      }
    }).then((e)=>{
      if(!e.data.createColor){
        updateColor({
          variables: {
            input: {
              color:color,
              colorCode: colorCode
            }
          }
        })
      }
    });
  }

  function Query() {
    refetch()
    if (query_loading) {
      console.log("loading");
      return;
    }
    if (query_error) {
      console.log(`Error: ${query_error.message}`);
      return;
    }
    console.log(query_data.colors);
    return;
}



  return (
    <div>
      <h2>Query</h2>
      <button onClick={Query}>Fetch</button>

      <h2>Mutation</h2>
      <form onSubmit={(e) => {
      e.preventDefault();
      formSubmit({ color, colorCode });
    }}>
      <p>color</p>
      <input
        id="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <p>colorCode</p>
      <input
        id="colorCode"
        value={colorCode}
        onChange={(e) => setColorCode(e.target.value)}
      />
      <button type="submit">提交</button>
      </form>
      <h2>Subscription</h2>
      <ColorMutated />
    </div>
  );
}