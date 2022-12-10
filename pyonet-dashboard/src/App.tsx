import { useState } from "react";
import { Grid, Card, Button, Typography } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  const handleIncreaseCount = () => {
    setCount(count + 1);
  };

  const getMonthByCount = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[count % 12];
  };

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              padding: 2,
              width: "100%",
              minHeight: "200px",
              mt: 4,
              ml: 4,
            }}
          >
            <Button variant="contained" fullWidth sx={{ mb: 1 }}>
              Hello Primary
            </Button>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mb: 1 }}
            >
              Hello Secondary
            </Button>

            <Button variant="contained" color="error" fullWidth>
              Hello Error
            </Button>

            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{ padding: 2, width: "100%", minHeight: "200px", mt: 4, ml: 4 }}
          >
            <Button variant="contained" fullWidth sx={{ mb: 1 }}>
              Hello Primary
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mb: 1 }}
            >
              Hello Secondary
            </Button>
            <Button variant="contained" color="error" fullWidth>
              Hello Error
            </Button>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ padding: 2, width: "100%", mt: 4, ml: 4 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
              onClick={handleIncreaseCount}
            >
              Increase Count
            </Button>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              {count}
              <br />
              Month: {getMonthByCount()}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
