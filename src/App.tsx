import './styles/globals.scss'
import { NavBar } from './components/navbar';
import { Login } from './pages/login'
import { Home } from './pages/student/home'

const App = () => {
  return (
      <div>
        {/* <NavBar></NavBar> */}
        <Home></Home>
      </div>
  );
}

export default App;
