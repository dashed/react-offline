// 3rd-party imports

import React, { Component } from "react";

import PropTypes from "prop-types";

// component

const hasWindow = () => {
  return typeof window !== "undefined";
};

export default class Offline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOffline: hasWindow() ? !window.navigator.onLine : false,
      isOnline: hasWindow() ? window.navigator.onLine : true
    };
  }

  componentDidMount() {
    if (!hasWindow()) {
      return;
    }

    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  componentWillUnmount() {
    if (!hasWindow()) {
      return;
    }

    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  }

  handleOnline = () => {
    this.handleEvent(false);
  };

  handleOffline = () => {
    this.handleEvent(true);
  };

  handleEvent = (isOffline = true) => {
    const isOnline = !isOffline;

    this.props.onChange({ isOffline, isOnline });
    this.setState({ isOffline, isOnline });
  };

  render() {
    const { children, render } = this.props;

    if (render) {
      return render(this.state);
    }

    if (children) {
      if (typeof children === "function") {
        return children(this.state);
      }

      return React.Children.only(children)(this.state);
    }

    return null;
  }
}

Offline.propTypes = {
  onChange: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.func
  ])
};

Offline.defaultProps = {
  render: null,
  onChange: () => {}
};
