import React from 'react'
import Navbar  from './navbar';
import Slider from './slider';
import Sliderproducts from './products/sliderProducts'
import ProductsLattop  from './products/productsLattop';
import Footer from './footer'

const home = () => {
  return (
    <div>
        <Navbar />
        <Slider />
        <Sliderproducts />
        <ProductsLattop />
       <Footer/>  
    </div>
  )
}

export default home