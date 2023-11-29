import { gql, useSubscription } from '@apollo/client';

const COLOR_MUTATED = gql`
subscription ColorMutated {
  colorMutated {
    color
    colorCode
    mutation
  }
}
`;

export function ColorMutated(){
    const {loading,error,data}  = useSubscription(COLOR_MUTATED);
    if(loading){
      return;
    };
    if(error){
      console.log(error.message);
      return;
    };
    return(
      <div>
        <p>{data?.colorMutated?.color && `color: ${data?.colorMutated?.color}`}</p>
        <p>{data?.colorMutated?.color &&`colorCode: ${data?.colorMutated?.colorCode[0]},${data?.colorMutated?.colorCode[1]},${data?.colorMutated?.colorCode[2]}`}</p>
        <p>{data?.colorMutated?.color && `mutation:${data?.colorMutated?.mutation}` }</p>
      </div>
    )
}