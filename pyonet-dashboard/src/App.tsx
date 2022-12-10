import "./App.css";
import { Card, Button } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Card sx={{ padding: 2, width: "200px", height: "200px", mt: 4, ml: 4 }}>
        <Button variant="contained" fullWidth sx={{ mb: 1 }}>
          Hello World
        </Button>

        <Button variant="contained" color="secondary" fullWidth>
          Hello Secondary
        </Button>
      </Card>
    </div>
  );
}

export default App;
