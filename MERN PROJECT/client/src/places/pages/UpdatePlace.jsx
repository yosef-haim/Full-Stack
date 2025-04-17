import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/component/UIElements/Card";
import Input from "../../shared/component/FormElements/Input";
import BUTTON from "../../shared/component/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext  } from "../../shared/context/auth-context";
import "./PlaceForm.css";


const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, placeId, setFormData]);
  
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        { "Content-Type": "application/json",
          Authorization: 'Bearer ' + auth.token
         }
      );
      history.push(`/` + `places/` + auth.userId );
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    <div className="center">
      <Card>
        <h2>Could not find place!</h2>
      </Card>
    </div>;
  } else {
    
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="title"
            validators={[VALIDATOR_REQUIRE()]}
            placeholder={loadedPlace.title}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            placeholder={loadedPlace.description}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <BUTTON type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </BUTTON>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
