import React, { Component, PropTypes } from "react";
import { viewOnce } from "../actions/AppAction";

class AppDownloadAd extends Component {
  constructor(props) {
    super(props);
    this.closeDownloadAd = this.closeDownloadAd.bind(this);
    this.key = "app-download-ad";
  }

  closeDownloadAd() {
    const { dispatch } = this.props;
    dispatch(viewOnce(this.key));
  }

  render() {
    const { app } = this.props;
    let viewed = app.get("componentViewOnce")[this.key];
    let appDownloadInfo = app.get("appDownloadInfo");
    return viewed ? null : (
      <div className="download-app">
        <i onClick={this.closeDownloadAd} className="close" />
        {/* <a target='_blank' href={appDownloadInfo.url}><img src={appDownloadInfo.pic} alt=""/></a> */}
      </div>
    );
  }
}

AppDownloadAd.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired
};

export default AppDownloadAd;
