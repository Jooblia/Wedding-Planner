import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { AddGuest } from "./AddGuest";
import { GuestDetails } from "./GuestDetails";

/** Describes set of possible app page views */
type Page = "list" | "add" | { kind: "details"; name: string };

type WeddingAppState = {
  page: Page; // Stores state for the current page of the app to show
};

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {
  constructor(props: {}) {
    super(props);
    this.state = { page: "list" };
  }

  // Display the UI described by the current state.
  render = (): JSX.Element => {
    if (this.state.page === "list") {
      return (
        <GuestList
          onLoadClick={this.doLoadClick}
          onAddGuestClick={this.doAddGuestClick}
        />
      );
    } else if (this.state.page === "add") {
      return <AddGuest onBackClick={this.doBackClick} />;
    } else {
      return (
        <GuestDetails
          name={this.state.page.name}
          onBackClick={this.doBackClick}
        />
      );
    }
  };

  // Called when user clicks on a saved guest
  doLoadClick = (name: string): void => {
    this.setState({ page: { kind: "details", name } });
  };

  // Called when user clicks the Add Guest button
  doAddGuestClick = (): void => {
    this.setState({ page: "add" });
  };

  // Called when user clicks the back button
  doBackClick = (): void => {
    this.setState({ page: "list" });
  };
}
