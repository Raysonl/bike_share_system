import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { RESTManager } from '../../../utils/request/rest';
import { useSnackbar } from "notistack";
function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

let resultName;
const request = "popularRequest";

function getDateTime() {
    let dateTime = new Date()
    const year = format(dateTime.getFullYear())
    const month = format(dateTime.getMonth() + 1)
    const day = format(dateTime.getDate())
    function format(para) {
        if (para < 10) {
            return "0" + para;
        } else {
            return para;
        }
    }
    const time = day + '-' + month + '-' + year;
    return time
}

export default function Popular() {
    const { enqueueSnackbar } = useSnackbar();
    const date = getDateTime()

    async function handleCost() {
       
        const res: any = await RESTManager.api.user.login.post<any>({
        });
        if (res.data) {
            enqueueSnackbar("Submit successfully!", {
                variant: "success",
                autoHideDuration: 2000,
            });
            // await setToken(res.token);
            setTimeout(function () {
                resultName = res.data;
            }, 2000);
        }
    };
    //handleCost()
    resultName = "Byres";//fake data
  return (
    <React.Fragment>
      <Title>Most Popular Station</Title>
        
      <Typography color="text.secondary" component="p" variant="h4">
              {resultName} 
      </Typography>
       <Typography color="text.secondary" sx={{ flex: 1 }}>

              on {date}
      </Typography>
      
    </React.Fragment>
  );
}
