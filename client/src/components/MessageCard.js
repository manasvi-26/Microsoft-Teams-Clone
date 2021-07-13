import styled from "styled-components";

import * as Mui from '../collections';

{/**

    Message div displayed in conversation page.
    Contains Message content, userName, time and date sent

*/}


const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;



const Message = (props) => {
    
    //gets props data from parent component( conversation page )
    const {message, userId} = props;
    
    //css for my message and others message is different
    if(message.userId == userId){
        return(
            <div>
                <MyRow>
                <div 
                    style={{ padding : '7px', borderRadius:10, 
                            width:'400px',backgroundColor :'#d5b9f0',
                            marginBottom:'35px'
                    }}
                >
                    <Mui.Typography variant='h10' >
                        {message.userName} ~
                    </Mui.Typography>
                    <Mui.Typography variant='h10' style={{float:'right'}}>
                        {new Date(message.timeStamp).toLocaleDateString()}
                    </Mui.Typography>

                    <Mui.Paper 
                        elevation={3} 
                        style={{padding:'5px',wordWrap: "break-word",
                                marginTop:'10px',marginBottom:'10px'
                        }} 
                    >
                        {message.content}
                    </Mui.Paper>
                    <Mui.Typography variant='h10' style={{float:'right'}}>
                        {new Date(message.timeStamp).toLocaleTimeString()}
                    </Mui.Typography>
                </div>
                </MyRow>
            </div>
        )
    }
    //other users message
    return(
        <div>
            <PartnerRow>
                <div 
                    style={{ padding : '7px', borderRadius:10,
                             width:'400px', backgroundColor :'#95ded7',
                             marginBottom:'35px'
                    }}
                >
                    <Mui.Typography variant='h10' >
                        {message.userName} ~
                    </Mui.Typography>
                    <Mui.Typography variant='h10' style={{float:'right'}}>
                        {new Date(message.timeStamp).toLocaleDateString()}
                    </Mui.Typography>

                    <Mui.Paper 
                        elevation={3} 
                        style={{padding:'5px',wordWrap: "break-word",
                                marginTop:'10px',marginBottom:'10px'
                        }} 
                    >
                        {message.content}
                    </Mui.Paper>
                    <Mui.Typography variant='h10' style={{float:'right'}}>
                        {new Date(message.timeStamp).toLocaleTimeString()}
                    </Mui.Typography>
                </div>
            </PartnerRow>
        </div>
    )
}

export default Message;