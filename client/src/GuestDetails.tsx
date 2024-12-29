import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Guest, parseGuest } from "./guest";
import { isRecord } from "./record";

type GuestDetailsProps = {
  name: string;
  onBackClick: () => void;
};

type GuestDetailsState = {
  guest: Guest | undefined; // Name of the guest
  guestOf: string; // Who this guest was invited by/belongs to (James or Molly)
  isFamily: string; // Whether or not this guest is family (empty string is false)
  restriction: string; // Dietary restrictions of guest
  p1: string; // Whether or not this guest has a plus one
  p1Name: string; // Name of the plus one
  p1Restriction: string; // Dietary restrictions of the plus one
  error: string; // text to be displayed as an error
};

/** UI for Guest Details page */
export class GuestDetails extends Component<
  GuestDetailsProps,
  GuestDetailsState
> {
  constructor(props: GuestDetailsProps) {
    super(props);
    this.state = {
      guest: undefined,
      guestOf: "",
      isFamily: "",
      restriction: "",
      p1: "",
      p1Name: "",
      p1Restriction: "",
      error: "",
    };
  }

  componentDidMount = (): void => {
    this.doRefreshFetch();
  };

  render = (): JSX.Element => {
    if (this.state.guest === undefined) {
      return <p>Loading details for guest "{this.props.name}"...</p>;
    } else {
      if (this.state.p1 === "1?" || this.state.p1 === "0") {
        return this.renderHasNoP1();
      } else {
        return this.renderHasP1();
      }
    }
  };

  renderHasP1 = (): JSX.Element => {
    return (
      <div>
        <h1>Guest Details</h1>
        <div>
          {this.props.name}, guest of {this.state.guest?.guestOf}
          {this.state.isFamily}
        </div>
        <label htmlFor="restriction">
          Dietary Restrictions: (Specify "none" if none)
        </label>
        <div>
          <input
            id="restriction"
            type="text"
            value={this.state.restriction}
            onChange={this.doRestrictionChange}
          ></input>
        </div>
        <div>
          <label htmlFor="p1">Additional Guest?</label>
          <select
            name="p1"
            id="p1"
            onChange={this.doP1Change}
            style={{ marginLeft: "10px" }}
            value={this.state.p1}
          >
            <option value="1?">unknown</option>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
        <div>
          <label htmlFor="p1Name">Guest Name:</label>
          <input
            id="p1Name"
            type="text"
            value={this.state.p1Name}
            onChange={this.doP1NameChange}
          ></input>
        </div>
        <label htmlFor="p1Restriction">
          Guest Dietary Restrictions: (Specify "none" if none)
        </label>
        <div>
          <input
            id="p1Restriction"
            type="text"
            value={this.state.p1Restriction}
            onChange={this.doP1RestrictionChange}
          ></input>
        </div>
        <div>
          <button type="button" onClick={this.doSaveClick}>
            Save
          </button>
          <button type="button" onClick={this.doBackClick}>
            Back
          </button>
        </div>
        {this.renderError()}
      </div>
    );
  };

  renderHasNoP1 = (): JSX.Element => {
    return (
      <div>
        <h1>Guest Details</h1>
        <div>
          {this.props.name}, guest of {this.state.guest?.guestOf}
          {this.state.isFamily}
        </div>
        <label htmlFor="restriction">
          Dietary Restrictions: (Specify "none" if none)
        </label>
        <div>
          <input
            id="restriction"
            type="text"
            value={this.state.restriction}
            onChange={this.doRestrictionChange}
          ></input>
        </div>
        <div>
          <label htmlFor="p1">Additional Guest?</label>
          <select
            name="p1"
            id="p1"
            onChange={this.doP1Change}
            style={{ marginLeft: "10px" }}
            value={this.state.p1}
          >
            <option value="1?">unknown</option>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
        <div>
          <button type="button" onClick={this.doSaveClick}>
            Save
          </button>
          <button type="button" onClick={this.doBackClick}>
            Back
          </button>
        </div>
        {this.renderError()}
      </div>
    );
  };

  // Called when there is an error to render
  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {
        width: "300px",
        backgroundColor: "rgb(246,194,192)",
        border: "1px solid rgb(137,66,61)",
        borderRadius: "5px",
        padding: "5px",
      };
      return (
        <div style={{ marginTop: "15px" }}>
          <span style={style}>
            <b>Error</b>: {this.state.error}
          </span>
        </div>
      );
    }
  };

  // Called when the guest's dietary restrictions are changed
  doRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ restriction: evt.target.value, error: "" });
  };

  // Called when the back button is clicked
  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();
  };

  // Called when the save button is clicked
  doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
    // Verify that the user entered all required information.
    if (this.state.restriction.trim().length === 0) {
      this.setState({
        error: "Must specify any dietary restrictions or 'none'.",
      });
      return;
    }

    if (this.state.p1 === "1") {
      if (this.state.p1Name.trim().length === 0) {
        this.setState({ error: "Must specify name of additional guest." });
        return;
      } else if (this.state.p1Restriction.trim().length === 0) {
        this.setState({
          error: "Must specify any dietary restrictions or 'none'.",
        });
        return;
      }
    }

    const args = {
      name: this.props.name,
      guestOf: this.state.guestOf,
      isFamily: this.state.isFamily,
      restriction: this.state.restriction,
      p1: this.state.p1,
      p1Name: this.state.p1Name,
      p1Restriction: this.state.p1Restriction,
    };
    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
    })
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
  };

  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res
        .json()
        .then(this.doSaveJson)
        .catch(() => this.doSaveError("200 response is not JSON"));
    } else if (res.status === 400) {
      res
        .text()
        .then(this.doSaveError)
        .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code from /api/save: ${res.status}`);
    }
  };

  doSaveJson = (data: unknown): void => {
    if (this.state.guest === undefined) throw new Error("impossible");
    if (!isRecord(data)) {
      console.error("bad data from /api/save: nor a record", data);
    }
    this.props.onBackClick();
  };

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/bid: ${msg}`);
  };

  // Called when the Additional Guest (p1) field is changed
  doP1Change = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if (evt.target.value === "1") {
      this.setState({ p1: "1" });
    } else if (evt.target.value === "0") {
      this.setState({ p1: "0" });
    } else {
      this.setState({ p1: "1?" });
    }
  };

  // Called when the name of the p1 is changed
  doP1NameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ p1Name: evt.target.value, error: "" });
  };

  // Called when the dietary restrictions of the p1 is changed
  doP1RestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ p1Restriction: evt.target.value, error: "" });
  };

  // Fetches the details of the given name from the server
  doRefreshFetch = (): void => {
    fetch("/api/get?name=" + encodeURIComponent(this.props.name))
      .then(this.doGetResp)
      .catch(() => this.doGetError("failed to connect to server"));
  };

  doGetResp = (res: Response): void => {
    if (res.status === 200) {
      res
        .json()
        .then(this.doGetJson)
        .catch(() => this.doGetError("200 res is not JSON"));
    } else if (res.status === 400) {
      res
        .text()
        .then(this.doGetError)
        .catch(() => this.doGetError("400 response is not text"));
    } else {
      this.doGetError(`bad status code from /api/get: ${res.status}`);
    }
  };

  doGetJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/get: not a record", data);
      return;
    }

    this.doGuestChange(data);
  };

  doGuestChange = (data: { guest?: unknown }): void => {
    const guest = parseGuest(data.guest);
    if (guest !== undefined) {
      this.setState({
        guest,
        guestOf: guest.guestOf,
        restriction: guest.restriction,
        isFamily: guest.isFamily,
        p1: guest.p1,
        p1Name: guest.p1Name,
        p1Restriction: guest.p1Restriction,
      });
    }
  };

  doGetError = (msg: string): void => {
    console.error(`Error fetching /api/get: ${msg}`);
  };
}
