// Style
import './App.css'
// error
import Notfound from './page/components/error/notfound'
// page
import Home from './page/components/home';
import Accessoris from './page/components/products/accessori';
import Asus from './page/components/products/asus';
import Msi from './page/components/products/msi';
import Apple from './page/components/products/apple';
import Rog from './page/components/products/rog';
import Monitor from './page/components/products/monitor';
import Cpu from './page/components/products/cpu';
import Chair from './page/components/products/chair';
import CustomePcbuild from './page/components/products/customePcbuild';
import Pcset from './page/components/products/pcSet';

// cart
import Cart from "./page/components/cart/Cart"
// create acc
import Register from './page/components/form/register';
import Login from "./page/components/form/login"

// detail products ac
import ProductsAc from "./page/components/accessories/productsAc"
// Details
import Details from './page/components/Details'
// team
import Team from "./page/components/team/team"
// Search
import SearchResults from './page/components/SearchResults';
// Dashboaods
import MianDb from './page/dashboard/mainDb';
import CategoryDb from './page/dashboard/categoryDb';
import CustomersDb from './page/dashboard/customersDb';
import ProductsDb from './page/dashboard/productsDb';
import SaleDb from './page/dashboard/saleDb';
import SettingDb from './page/dashboard/settingDb';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home routes */}
        <Route path="" element={<Home/>} />
        <Route path="/categories/Accessoris" element={<Accessoris />} />
        <Route path="/categories/Asus" element={<Asus />} />
        <Route path="/categories/Msi" element={<Msi />} />
        <Route path="/categories/Apple" element={<Apple />} />
        <Route path="/categories/Rog" element={<Rog />} />
        <Route path="/categories/Monitor" element={<Monitor />} />
        <Route path="/categories/Cpu" element={<Cpu />} />
        <Route path="/categories/Chair" element={<Chair />} />
        <Route path="/categories/CustomePcbuild" element={<CustomePcbuild />} />
        <Route path="/categories/Pcset" element={<Pcset />} />
        {/* regoster and login */}
        <Route path="/account/register" element={<Register />} />
        <Route path="/account/login" element={<Login />} />
        {/* Search */}
        <Route path="/search" element={<SearchResults />} />
        {/* accessories products*/}
        <Route path="/categories/Accessoris/:name" element={<ProductsAc />} />
       
        {/* Detaols */}
        <Route path="/categories/details/:id" element={<Details />} />
        {/* cart */}
        <Route path="/cart" element={<Cart />} />
        {/* team */}
        <Route path="/team" element={<Team />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboards" element={<MianDb />} />
        <Route path="/dashboards/category" element={<CategoryDb />} />
        <Route path="/dashboards/customers" element={<CustomersDb />} />
        <Route path="/dashboards/products" element={<ProductsDb />} /> 
        <Route path="/dashboards/sales" element={<SaleDb />} />
        <Route path="/dashboards/setting" element={<SettingDb />} /> 

        {/* Catch-all 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
