import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({

    gridContainer: {
      paddingLeft: "40px",
      paddingRight: "40px"
    },
    card: {
      width: '300px',
      height: '270px',
    },
  
    actionArea: {
      borderRadius: 16,
      width: '300px',
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
      image: {
        height: '200px'
      },
      
    },
  
    teamName : {
      textAlign: 'center',
      letterSpacing: '2px',
      marginTop: '20px'
    }
    
});