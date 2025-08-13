import React, { useState, useContext, useEffect, Suspense } from "react";
import RatingStars from "../../shared/component/UIElements/RatingStars";

import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/FormElements/Button";
import Modal from "../../shared/component/UIElements/Modal";
import Map from "../../shared/component/UIElements/Map";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Weather from "../../shared/component/UIElements/WeatherComponent";
import RestaurantList from "../component/Restaurant";
import RestaurantCard from "../../shared/component/UIElements/RestaurantCard";
import Hotels from "../../shared/component/UIElements/Hotels";
import Survey from "../../shared/component/UIElements/Survey";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModel, setShowConfirmModel] = useState(false);
  const [showRestaurant, setShowRestaurant] = useState(false);
  const [restaurantLoaded, setRestaurantLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [openSurvey, sestOpenSurvey] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const openRestHandler = () => {
    setShowRestaurant(true);
  };

  const openHotelsHandler = () => {
    setShowHotels(true);
  };

  const closeHotelsHandler = () => {
    setShowHotels(false);
  };

  const closeRestHandler = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowRestaurant(false); // רק אחרי שהאנימציה הסתיימה
      setIsClosing(false);
    }, 300); // חשוב שזמן זה יתאים לאורך האנימציה ב־CSS
  };

  const openSurveyHandler = () => {
    sestOpenSurvey(true);
  };

  const closeSurveyHandler = () => {
    sestOpenSurvey(false);
  }
  const showDeleteWarningHandler = () => {
    setShowConfirmModel(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModel(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModel(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const handleRating = async (ratingValue) => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            _id: props.creatorId,
            rating: ratingValue,
          }),
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  const mapLoading = (mapIsReady) => {
    setRestaurantLoaded(mapIsReady);
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/places/${props.id}/rating`,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not fetch rating");
        }

        const data = await response.json();
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      } catch (err) {
        console.error("Failed to fetch rating:", err);
      }
    };

    fetchRating();
  }, [props.id, auth.token]);

  
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <RestaurantCard
        className={`modal-bubble ${
          isClosing ? "modal-bubble-exit" : "modal-bubble-enter"
        }`}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          backgroundColor: "#fffaf0", // שמנת בהיר
          borderRadius: "4px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto", // מאפשר גלילה אנכית
          overflowX: "hidden", // לא מאפשר גלילה אופקית
          display: "flex",
          width: "80%",
          height: "80%",
          flexDirection: "column",
          transition: "transform 0.2s",
          zIndex: 9999,
        }}
        show={showRestaurant}
        onCancel={closeRestHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeRestHandler}>CLOSE</Button>}
      >
        <div>
          {/* {!restaurantLoaded && <LoadingSpinner />} */}
          <RestaurantList
            lat={props.coordinates.lat}
            lng={props.coordinates.lng}
          />
        </div>
      </RestaurantCard>
      <Modal
        show={showHotels}
        onCancel={closeHotelsHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeHotelsHandler}>CLOSE</Button>}
      >
        <Hotels lat={props.coordinates.lat} lng={props.coordinates.lng} />
      </Modal>
      <Modal
        show={openSurvey}
        onCancel={closeSurveyHandler}>
        <Survey userId={auth.userId} token={auth.token}  placeId={props.id}/>  
        </Modal>
      <Modal
        show={showConfirmModel}
        onCancel={cancelDeleteHandler}
        header="are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onCLick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete? Please note that it cannot be
          undone
        </p>
      </Modal>
      <li className="place-item">
        <Card>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                fontSize: "24px",
                color: "gold",
                opacity: 0.9,
              }}
            >
              ★
              <div
                style={{
                  fontSize: "10px",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginTop: "-2px",
                }}
              >
                {averageRating || "0.0"}
                <Weather id={props.id} />
              </div>
            </div>

            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <div className="place-item">
              {/* פרטים קיימים של המקום */}

              {/* ⭐ דירוג כוכבים */}
              <div className="my-2">
                <p>Rate Me</p>
                <RatingStars onRate={handleRating} />
              </div>
            </div>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            <Button inverse onClick={openRestHandler}>
              RESTAURANT
            </Button>
            <Button inverse onClick={openHotelsHandler}>
              HOTELS
            </Button>
            {auth.userId && <Button inverse onClick={openSurveyHandler}>
              SURVEY
            </Button>}
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
