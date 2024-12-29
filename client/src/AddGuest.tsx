import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from "./record";

type AddGuestProps = {
  onBackClick: () => void;
};

type AddGuestState = {
  name: string; // Name of the guest
  guestOf: string; // Who this guest was invited by/belongs to (James or Molly)
  isFamily: string; // Whether or not this guest is family (empty string is false)
  error: string; // text to be displayed as an error
};

/** UI for Add Guest page */
export class AddGuest extends Component<AddGuestProps, AddGuestState> {
  constructor(props: AddGuestProps) {
    super(props);
    this.state = { name: "", guestOf: "Molly", isFamily: "", error: "" };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h1>Add Guest</h1>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={this.state.name}
            onChange={this.doNameChange}
          ></input>
        </div>
        <div>
          <p>Guest of:</p>
          <div>
            <input
              type="radio"
              id="Molly"
              name="guestOf"
              value="Molly"
              onChange={this.doGuestOfChange}
              defaultChecked
            />
            <label htmlFor="Molly">Molly</label>
          </div>
          <div>
            <input
              type="radio"
              id="James"
              name="guestOf"
              value="James"
              onChange={this.doGuestOfChange}
            />
            <label htmlFor="James">James</label>
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            id="family"
            name="family"
            onChange={this.doIsFamilyChange}
          />
          <label htmlFor="family">Family?</label>
        </div>
        <button type="button" onClick={this.doAddClick}>
          Add
        </button>
        <button type="button" onClick={this.doBackClick}>
          Back
        </button>
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

  // Called when the Family field (isFamily) is changed
  doIsFamilyChange = (_: ChangeEvent<HTMLInputElement>): void => {
    if (this.state.isFamily === "") {
      this.setState({ isFamily: ", family" });
    } else {
      this.setState({ isFamily: "" });
    }
  };

  // Called when the Guest of field is changed
  doGuestOfChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ guestOf: evt.target.value });
  };

  // Called when the name is changed
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ name: evt.target.value, error: "" });
  };

  // Called when the Add button is clicked
  doAddClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.name.trim().length === 0) {
      this.setState({ error: "Must specify a name." });
      return;
    }

    const args = {
      name: this.state.name,
      guestOf: this.state.guestOf,
      isFamily: this.state.isFamily,
      restriction: "",
      p1: "1?",
      p1Name: "",
      p1Restriction: "",
    };
    fetch("/api/add", {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
    })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  };

  doAddResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp
        .json()
        .then(this.doAddJson)
        .catch(() => this.doAddError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp
        .text()
        .then(this.doAddError)
        .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code from /api/add: ${resp.status}`);
    }
  };

  doAddJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/add: not a record", data);
      return;
    }

    this.props.onBackClick();
  };

  doAddError = (msg: string): void => {
    this.setState({ error: msg });
  };

  // Called when the Back button is clicked
  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();
  };
}
