import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { UserProvider } from "./contexts/userContext";
import All from "./views/All";
import Footer from "./views/Footer";
import Header from "./views/Header";
import Login from "./views/Login";
import Main from "./views/Main";
import Register from "./views/Register";

function App() {
  return (
    <div className="App">
      

      <UserProvider>
        <Router>
          <Header />

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/all">
              <All />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>

          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
