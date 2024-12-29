import React, { Component, MouseEvent } from "react";
import {
  getHostGuests,
  getGuestRange,
  getTotalFamily,
  Guest,
  parseGuest,
} from "./guest";
import { isRecord } from "./record";

type GuestListProps = {
  onLoadClick: (name: string) => void;
  onAddGuestClick: () => void;
};

type GuestListState = {
  /** the list of guests */
  guests: Guest[] | undefined;
};

/** UI for Guest List page */
export class GuestList extends Component<GuestListProps, GuestListState> {
  constructor(props: GuestListProps) {
    super(props);
    this.state = { guests: undefined };
  }

  componentDidMount = (): void => {
    this.doRefreshFetch();
  };

  render = (): JSX.Element => {
    if (this.state.guests === undefined) {
      return <p>Loading guest list...</p>;
    } else {
      return (
        <div>
          <h1>Guest List</h1>
          <div>{this.renderGuests()}</div>
          <h2>Summary:</h2>
          <div>
            <div>
              {getGuestRange(getHostGuests("Molly", this.state.guests))}{" "}
              guest(s) of Molly (
              {getTotalFamily(getHostGuests("Molly", this.state.guests))}{" "}
              family)
            </div>
            <div>
              {getGuestRange(getHostGuests("James", this.state.guests))}{" "}
              guest(s) of James (
              {getTotalFamily(getHostGuests("James", this.state.guests))}{" "}
              family)
            </div>
            <button type="button" onClick={this.doAddGuestClick}>
              Add Guest
            </button>
          </div>
        </div>
      );
    }
  };

  renderGuests = (): JSX.Element => {
    if (this.state.guests === undefined) {
      return <p>Loading guest list...</p>;
    } else {
      const guests: JSX.Element[] = [];
      for (const guest of this.state.guests) {
        guests.push(
          <div>
            <li key={guest.name}>
              <a href="#" onClick={(evt) => this.doLoadClick(evt, guest.name)}>
                {guest.name}
              </a>{" "}
              Guest of {guest.guestOf} {"  +" + guest.p1}
            </li>
          </div>
        );
      }
      return <ul>{guests}</ul>;
    }
  };

  // Called when user clicks on a saved guest
  doLoadClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onLoadClick(name);
  };

  // Called when user clicks the Add Guest button
  doAddGuestClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onAddGuestClick();
  };

  // Called when page loads for the first time, fetches the list of guests from the server
  doRefreshFetch = (): void => {
    fetch("/api/list")
      .then(this.doListResp)
      .catch(() => this.doListError("failed to connect to server"));
  };

  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp
        .json()
        .then(this.doListJson)
        .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp
        .text()
        .then(this.doListError)
        .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    if (!Array.isArray(data.guests)) {
      console.error("bad data from /api/list: guests is not an array", data);
      return;
    }

    const guests: Guest[] = [];
    for (const val of data.guests) {
      const guest = parseGuest(val);
      if (guest === undefined) return;
      guests.push(guest);
    }
    this.setState({ guests });
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };
}
