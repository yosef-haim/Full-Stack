import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/component/UIElements/Avatar";
import Card from "../../shared/component/UIElements/Card";

import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__content">
            <div className="user-item__image">
              <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
            </div>
            <div className="user-item__info">
              <h2>{props.name}</h2>
              <h3>
                {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
              </h3>
            </div>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
