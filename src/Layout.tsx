import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./views/NotFound"
import Home from "./views/Home"
import Login from "./views/Login"
import Navbar from "./components/Navbar"


function Layout() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Layout
