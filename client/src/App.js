import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Home from "./components/Home/Home.jsx";
import VideoGameCreate from "./components/VideoGameCreate/VideoGameCreate.jsx";
import Detail from "./components/Detail/Detail.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/home" component={Home} />
          <Route exact path='/videogames/:id'  render={({ match }) => < Detail id={match.params.id} />} />
          <Route path="/create" component={VideoGameCreate} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
