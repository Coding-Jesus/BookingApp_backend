import React, { useContext, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { FaRegTimesCircle } from 'react-icons/fa';
import { HiOutlineArrowCircleRight, HiOutlineArrowCircleLeft } from 'react-icons/hi';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer'
import './hotel.css';
import useFetch from '../../hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';

const Hotels = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [slideNum, setSlideNum] = useState(0);
    const [open, setOpen] = useState(false);

    const { data, loading, error } = useFetch(`/hotels/find/${id}`);

    const { dates, options } = useContext(SearchContext);

    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    function dayDifference(date1, date2) {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
        return diffDays;
    }

    const days = dayDifference(dates[0].endDate, dates[0].startDate)

    const handleOpen = (i) => {
        setSlideNum(i);
        setOpen(true);
    };

    const handleMove = (direction) => {
        let newSlideNum;

        if (direction === "l") {
            newSlideNum = slideNum === 0 ? 5 : slideNum - 1
        } else {
            newSlideNum = slideNum === 5 ? 0 : slideNum + 1
        }
        setSlideNum(newSlideNum)
    }

    return (
        <div>
            <Navbar />
            <Header type="list" />
            {loading ? ("loading"
            ) : (
                <div className="hotelContainer">
                    {open && <div className="slider">
                        <FaRegTimesCircle className='close' onClick={() => setOpen(false)} />
                        <HiOutlineArrowCircleLeft className='arrow' onClick={() => handleMove("l")} />
                        <div className="slideWrapper">
                            <img src={data.photos[slideNum]} alt="Slider" className="sliderImg" />
                        </div>
                        <HiOutlineArrowCircleRight className='arrow' onClick={() => handleMove("r")} />

                    </div>}
                    <div className="hotelWrapper">
                        <div className="hotelTitle">{data.name}</div>
                        <div className="hotelAddress">
                            <MdLocationOn />
                            <span>{data.address}</span>
                        </div>
                        <span className='hotelDistance'>
                            Excellent location - {data.distance}m from the center
                        </span>
                        <span className="hotelPriceHighlight">
                            Book a stay over ${data.cheapestPrice} at this property and get a free airport taxi
                        </span>
                        <div className="hotelImages">
                            {data.photos?.map((photos, i) => (
                                <div className="hotelImgWrapper">
                                    <img onClick={() => handleOpen(i)} src={photos} alt="hotelImage" className="hotelImg" />
                                </div>
                            ))}
                        </div>
                        <div className="hotelDetails">
                            <div className="hotelDetailsText">
                                <h1 className="hotelTitle">{data.title}</h1>
                                <p className="hotelDesc">
                                    {data.desc}
                                </p>
                            </div>
                            <div className="hotelDetailsPrice">
                                <h1>Perfect for a {days}-night stay!</h1>
                                <span>
                                    Located in the real heart of Krakow, this property has an
                                    excellent location score of 9.8!
                                </span>
                                <h2>
                                    <b>${days * data.cheapestPrice * options.room}</b> ({days} nights)
                                </h2>
                                <button>Reserve or Book Now!</button>
                            </div>
                        </div>
                    </div>
                    <MailList />
                    <Footer />
                </div>)}
        </div>
    )
}

export default Hotels