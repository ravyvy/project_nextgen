import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Slider from './slider';
import Sliderproducts from './products/sliderProducts';
import ProductsLattop from './products/productsLattop';
import Footer from './footer';
import Swal from "sweetalert2";
import axios from 'axios';

const Home = () => {
  const [alerthome, setalerthome] = useState(null);

  useEffect(() => {
    const fetchalert = async () => {
      try {
        const res = await axios.get("http://localhost:9000/alerthome");
        
        // ដោយសារក្នុងរូបភាព console ឃើញវាជា Array ដូច្នេះយើងយក index ទី 0
        const alertData = res.data.data[0]; 
        setalerthome(alertData);

        const hasSeenAlert = localStorage.getItem('hasSeenHomeAlert');

        // ហៅ alert លុះត្រាតែមាន data និងមិនទាន់ធ្លាប់បង្ហាញ
        if (!hasSeenAlert && alertData) {
          openalert(alertData);
        }
      } catch (e) {
        console.log("Error fetching data:", e.message);
      }
    };

    fetchalert();
  }, []);

  const openalert = (data) => {
    Swal.fire({
      title: data.title || "Wellcome to Website Nextgem", // ប្រើ data ដែលបោះមកពី useEffect
      text: data.description || "រីករាយការទស្សនាគេហទំព័ររបស់យើង",
      imageWidth: 400,
      imageHeight: 220,
      imageAlt: "Promotion Laptop",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept all 👌",
      cancelButtonText: "Cancel !❌",
      allowOutsideClick: false,
      draggable: true
    }).then((result) => {
      if (result.isConfirmed) {
        // កត់ត្រាចូល localStorage នៅពេល user ចុច Accept
        localStorage.setItem('hasSeenHomeAlert', 'true');
        Swal.fire({
          title: "Welcome to view!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = "https://www.google.com";
      }
    });
  };

  return (
    <div>
      <Navbar />
      <Slider />
      <Sliderproducts />
      <ProductsLattop />
      <Footer />
    </div>
  );
};

export default Home;