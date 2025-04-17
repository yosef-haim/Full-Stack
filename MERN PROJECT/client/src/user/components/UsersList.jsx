import React from "react";

import Card from '../../shared/component/UIElements/Card';
import UserItem from "./UserItem";

import "./UsersList.css";

const UserList = props => {
  console.log(props.items)
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
        <h2>No users found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
